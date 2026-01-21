import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

export interface AdminChatMessage {
  id: string;
  session_id: string;
  content: string;
  sender_type: 'user' | 'admin';
  admin_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminChatSession {
  id: string;
  session_token: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  last_message?: string;
}

interface UseAdminChatReturn {
  sessions: AdminChatSession[];
  selectedSession: AdminChatSession | null;
  messages: AdminChatMessage[];
  isLoading: boolean;
  error: string | null;
  selectSession: (session: AdminChatSession) => void;
  sendReply: (content: string) => Promise<void>;
  refreshSessions: () => Promise<void>;
  markAsRead: (sessionId: string) => Promise<void>;
}

export function useAdminChat(): UseAdminChatReturn {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AdminChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AdminChatSession | null>(null);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      // Fetch all sessions with message info
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Fetch unread counts and last messages for each session
      const enrichedSessions = await Promise.all(
        (sessionsData || []).map(async (session) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id)
            .eq('sender_type', 'user')
            .eq('is_read', false);

          const { data: lastMsg } = await supabase
            .from('chat_messages')
            .select('content')
            .eq('session_id', session.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...session,
            unread_count: count || 0,
            last_message: lastMsg?.content || '',
          } as AdminChatSession;
        })
      );

      setSessions(enrichedSessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      const { data, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;
      setMessages((data || []) as AdminChatMessage[]);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Subscribe to new messages for selected session
  useEffect(() => {
    if (!selectedSession) return;

    channelRef.current = supabase
      .channel(`admin-chat-${selectedSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${selectedSession.id}`
        },
        (payload) => {
          const newMessage = payload.new as AdminChatMessage;
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          // Refresh sessions to update unread counts
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [selectedSession, fetchSessions]);

  // Also subscribe to all new messages for notifications
  useEffect(() => {
    const allMessagesChannel = supabase
      .channel('admin-all-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(allMessagesChannel);
    };
  }, [fetchSessions]);

  const selectSession = useCallback((session: AdminChatSession) => {
    setSelectedSession(session);
    fetchMessages(session.id);
  }, [fetchMessages]);

  const sendReply = useCallback(async (content: string) => {
    if (!selectedSession || !user || !content.trim()) return;

    try {
      const { data, error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: selectedSession.id,
          content: content.trim(),
          sender_type: 'admin',
          admin_id: user.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Add message immediately
      setMessages(prev => {
        if (prev.some(m => m.id === (data as AdminChatMessage).id)) return prev;
        return [...prev, data as AdminChatMessage];
      });
    } catch (err) {
      console.error('Error sending reply:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reply');
    }
  }, [selectedSession, user]);

  const markAsRead = useCallback(async (sessionId: string) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('session_id', sessionId)
        .eq('sender_type', 'user')
        .eq('is_read', false);

      // Refresh sessions
      fetchSessions();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [fetchSessions]);

  return {
    sessions,
    selectedSession,
    messages,
    isLoading,
    error,
    selectSession,
    sendReply,
    refreshSessions: fetchSessions,
    markAsRead,
  };
}
