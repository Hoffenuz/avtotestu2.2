-- Create chat_sessions table for anonymous users
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enum for message sender type
CREATE TYPE public.message_sender AS ENUM ('user', 'admin');

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_type public.message_sender NOT NULL,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_chat_sessions_token ON public.chat_sessions(session_token);
CREATE INDEX idx_chat_sessions_updated ON public.chat_sessions(updated_at DESC);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions

-- Anonymous users can create sessions (no auth required)
CREATE POLICY "Anyone can create chat sessions"
ON public.chat_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anonymous users can view their own session by token (passed as header)
CREATE POLICY "Users can view own session by token"
ON public.chat_sessions FOR SELECT
TO anon
USING (session_token::text = current_setting('request.headers', true)::json->>'x-session-token');

-- Admins can view all sessions
CREATE POLICY "Admins can view all sessions"
ON public.chat_sessions FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update sessions
CREATE POLICY "Admins can update sessions"
ON public.chat_sessions FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chat_messages

-- Anonymous users can insert messages to their own session
CREATE POLICY "Users can insert messages to own session"
ON public.chat_messages FOR INSERT
TO anon
WITH CHECK (
  sender_type = 'user' AND
  EXISTS (
    SELECT 1 FROM public.chat_sessions
    WHERE id = session_id
    AND session_token::text = current_setting('request.headers', true)::json->>'x-session-token'
  )
);

-- Anonymous users can view messages from their own session
CREATE POLICY "Users can view own session messages"
ON public.chat_messages FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions
    WHERE id = session_id
    AND session_token::text = current_setting('request.headers', true)::json->>'x-session-token'
  )
);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert messages (replies)
CREATE POLICY "Admins can insert messages"
ON public.chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') AND
  sender_type = 'admin'
);

-- Admins can update messages (mark as read)
CREATE POLICY "Admins can update messages"
ON public.chat_messages FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update chat_sessions.updated_at when new message is added
CREATE OR REPLACE FUNCTION public.update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions
  SET updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_new_message_update_session
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_session_timestamp();

-- Enable realtime for chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;