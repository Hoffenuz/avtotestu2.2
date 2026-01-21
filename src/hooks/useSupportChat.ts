import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  createAnonClient, 
  realtimeClient,
  getSessionToken, 
  setSessionToken, 
  getSessionId, 
  setSessionId,
  clearSession 
} from '@/lib/supabase-anon';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  sender_type: 'user' | 'admin';
  admin_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  session_token: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UseSupportChatReturn {
  session: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  hasSession: boolean;
  startSession: (firstName: string, lastName: string, initialMessage: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  endSession: () => void;
}

export function useSupportChat(): UseSupportChatReturn {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const token = getSessionToken();
      const sessionId = getSessionId();
      
      if (!token || !sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const client = createAnonClient(token);
        
        // Fetch session
        const { data: sessionData, error: sessionError } = await client
          .from('chat_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (sessionError || !sessionData) {
          clearSession();
          setIsLoading(false);
          return;
        }

        setSession(sessionData as ChatSession);

        // Fetch messages
        const { data: messagesData } = await client
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        setMessages((messagesData || []) as ChatMessage[]);
      } catch (err) {
        console.error('Error checking session:', err);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Subscribe to realtime messages
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;

    channelRef.current = realtimeClient
      .channel(`chat-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        realtimeClient.removeChannel(channelRef.current);
      }
    };
  }, [session?.id]);

  const startSession = useCallback(async (firstName: string, lastName: string, initialMessage: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create session without token first
      const client = createAnonClient();
      
      const { data: newSession, error: sessionError } = await client
        .from('chat_sessions')
        .insert({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
        .select()
        .single();

      if (sessionError || !newSession) {
        throw new Error(sessionError?.message || 'Failed to create session');
      }

      // Save token and ID
      const typedSession = newSession as ChatSession;
      setSessionToken(typedSession.session_token);
      setSessionId(typedSession.id);
      setSession(typedSession);

      // Now create client with token for sending message
      const authedClient = createAnonClient(typedSession.session_token);
      
      const { data: messageData, error: messageError } = await authedClient
        .from('chat_messages')
        .insert({
          session_id: typedSession.id,
          content: initialMessage.trim(),
          sender_type: 'user',
        })
        .select()
        .single();

      if (messageError) {
        throw new Error(messageError.message);
      }

      setMessages([messageData as ChatMessage]);
    } catch (err) {
      console.error('Error starting session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start chat');
      clearSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const sessionId = getSessionId();
    const token = getSessionToken();
    
    if (!sessionId || !token || !content.trim()) return;

    try {
      const client = createAnonClient(token);
      
      const { data, error: insertError } = await client
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          content: content.trim(),
          sender_type: 'user',
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Add message immediately (realtime will also catch it, but we dedupe)
      setMessages(prev => {
        if (prev.some(m => m.id === (data as ChatMessage).id)) return prev;
        return [...prev, data as ChatMessage];
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, []);

  const endSession = useCallback(() => {
    clearSession();
    setSession(null);
    setMessages([]);
    if (channelRef.current) {
      realtimeClient.removeChannel(channelRef.current);
    }
  }, []);

  return {
    session,
    messages,
    isLoading,
    error,
    hasSession: !!session,
    startSession,
    sendMessage,
    endSession,
  };
}
