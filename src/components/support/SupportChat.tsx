import { useState, useRef, useEffect } from 'react';
import { useSupportChat, ChatMessage } from '@/hooks/useSupportChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  User, 
  Headphones,
  X,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender_type === 'user';
  
  return (
    <div className={cn(
      "flex gap-2 mb-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-2",
        isUser 
          ? "bg-primary text-primary-foreground rounded-br-md" 
          : "bg-muted rounded-bl-md"
      )}>
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p className={cn(
          "text-[10px] mt-1",
          isUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {new Date(message.created_at).toLocaleTimeString('uz-UZ', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}

interface StartChatFormProps {
  onSubmit: (firstName: string, lastName: string, message: string) => void;
  isLoading: boolean;
}

function StartChatForm({ onSubmit, isLoading }: StartChatFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim() && message.trim()) {
      onSubmit(firstName, lastName, message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">Ism *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ismingiz"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Familiya *</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Familiyangiz"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="initialMessage">Xabar *</Label>
        <Textarea
          id="initialMessage"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Savolingizni yozing..."
          className="min-h-[100px]"
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full gap-2" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Yuborilmoqda...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Suhbatni boshlash
          </>
        )}
      </Button>
    </form>
  );
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onEndSession: () => void;
  sessionName: string;
}

function ChatInterface({ messages, onSendMessage, onEndSession, sessionName }: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Headphones className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Qo'llab-quvvatlash</p>
            <p className="text-xs text-muted-foreground">{sessionName}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onEndSession}
          title="Suhbatni yakunlash"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Xabarlar yo'q</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t bg-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    session,
    messages,
    isLoading,
    error,
    hasSession,
    startSession,
    sendMessage,
    endSession,
  } = useSupportChat();

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "flex items-center justify-center transition-transform",
          isOpen && "rotate-90"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[360px] shadow-xl border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Headphones className="w-5 h-5 text-primary" />
              Qo'llab-quvvatlash
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && !hasSession ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-destructive">
                <p>{error}</p>
                <Button variant="outline" className="mt-2" onClick={endSession}>
                  Qaytadan urinish
                </Button>
              </div>
            ) : hasSession && session ? (
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                onEndSession={endSession}
                sessionName={`${session.first_name} ${session.last_name}`}
              />
            ) : (
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Savolingiz bormi? Biz bilan bog'laning!
                </p>
                <StartChatForm onSubmit={startSession} isLoading={isLoading} />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
