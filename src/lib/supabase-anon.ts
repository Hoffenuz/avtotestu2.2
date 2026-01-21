import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://lvdndseuobzbgzrarygu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZG5kc2V1b2J6Ymd6cmFyeWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTk4MTYsImV4cCI6MjA4MjA3NTgxNn0.V6Gh1WaWBtjcU_Ia0DiUjbGApigaC2j5mDJjWP7-FFg";

const SESSION_TOKEN_KEY = 'chat_session_token';
const SESSION_ID_KEY = 'chat_session_id';

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function setSessionToken(token: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_ID_KEY);
}

export function setSessionId(id: string): void {
  localStorage.setItem(SESSION_ID_KEY, id);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
}

export function createAnonClient(sessionToken?: string | null) {
  const token = sessionToken || getSessionToken();
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: token ? { 'x-session-token': token } : {}
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

// For realtime subscriptions (doesn't need session token in headers)
export const realtimeClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
