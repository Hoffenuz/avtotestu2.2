import { useState, useRef, useEffect } from 'react';
import { useAdminChat, AdminChatMessage, AdminChatSession } from '@/hooks/useAdminChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  User, 
  Headphones,
  RefreshCw,
  Loader2,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';

interface MessageBubbleProps {
  message: AdminChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isAdmin = message.sender_type === 'admin';
  
  return (
    <div className={cn(
      "flex gap-2 mb-3",
      isAdmin ? "justify-end" : "justify-start"
    )}>
      {!isAdmin && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2",
        isAdmin 
          ? "bg-primary text-primary-foreground rounded-br-md" 
          : "bg-muted rounded-bl-md"
      )}>
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p className={cn(
          "text-[10px] mt-1",
          isAdmin ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {new Date(message.created_at).toLocaleTimeString('uz-UZ', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      {isAdmin && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-4 h-4 text-primary" />
        </div>
      )}
    </div>
  );
}

interface SessionListProps {
  sessions: AdminChatSession[];
  selectedId: string | null;
  onSelect: (session: AdminChatSession) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

function SessionList({ sessions, selectedId, onSelect, onRefresh, isLoading }: SessionListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Suhbatlar</h2>
        <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Suhbatlar yo'q</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelect(session)}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-colors",
                  "hover:bg-muted/50",
                  selectedId === session.id && "bg-muted"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {session.first_name} {session.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {session.last_message || 'Xabar yo\'q'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(session.updated_at), { 
                        addSuffix: true,
                        locale: uz 
                      })}
                    </span>
                    {(session.unread_count ?? 0) > 0 && (
                      <Badge variant="default" className="h-5 min-w-5 flex items-center justify-center">
                        {session.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface ChatViewProps {
  session: AdminChatSession;
  messages: AdminChatMessage[];
  onSendReply: (content: string) => void;
  onBack: () => void;
  onMarkAsRead: () => void;
}

function ChatView({ session, messages, onSendReply, onBack, onMarkAsRead }: ChatViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Mark as read when viewing
    onMarkAsRead();
  }, [messages, onMarkAsRead]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendReply(newMessage);
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <p className="font-medium">
            {session.first_name} {session.last_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(session.created_at), { 
              addSuffix: true,
              locale: uz 
            })} boshlangan
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Javob yozing..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Yuborish
          </Button>
        </div>
      </form>
    </div>
  );
}

export function AdminChatPanel() {
  const {
    sessions,
    selectedSession,
    messages,
    isLoading,
    error,
    selectSession,
    sendReply,
    refreshSessions,
    markAsRead,
  } = useAdminChat();

  const [showList, setShowList] = useState(true);

  const handleSelectSession = (session: AdminChatSession) => {
    selectSession(session);
    setShowList(false);
  };

  const handleBack = () => {
    setShowList(true);
  };

  const handleMarkAsRead = () => {
    if (selectedSession) {
      markAsRead(selectedSession.id);
    }
  };

  if (error) {
    return (
      <Card className="h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-destructive">
            <p>{error}</p>
            <Button variant="outline" className="mt-2" onClick={refreshSessions}>
              Qaytadan urinish
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] overflow-hidden">
      <div className="grid lg:grid-cols-[350px_1fr] h-full">
        {/* Session List */}
        <div className={cn(
          "border-r h-full",
          !showList && "hidden lg:block"
        )}>
          <SessionList
            sessions={sessions}
            selectedId={selectedSession?.id || null}
            onSelect={handleSelectSession}
            onRefresh={refreshSessions}
            isLoading={isLoading}
          />
        </div>

        {/* Chat View */}
        <div className={cn(
          "h-full",
          showList && "hidden lg:block"
        )}>
          {selectedSession ? (
            <ChatView
              session={selectedSession}
              messages={messages}
              onSendReply={sendReply}
              onBack={handleBack}
              onMarkAsRead={handleMarkAsRead}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle className="w-12 h-12 mb-4 opacity-30" />
              <p>Suhbatni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
