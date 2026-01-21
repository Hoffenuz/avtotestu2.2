-- Drop existing insert policy
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.chat_sessions;

-- Create permissive insert policy for anonymous users
CREATE POLICY "Anyone can create chat sessions"
ON public.chat_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Make sure the policy is PERMISSIVE (default) not RESTRICTIVE
-- Also ensure anon role has proper grants
GRANT INSERT ON public.chat_sessions TO anon;
GRANT SELECT ON public.chat_sessions TO anon;
GRANT INSERT ON public.chat_messages TO anon;
GRANT SELECT ON public.chat_messages TO anon;