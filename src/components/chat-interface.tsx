'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, User, Stethoscope, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


type Message = {
  id: string;
  text: string;
  sender: 'patient' | 'doctor';
};

type ChatInterfaceProps = {
  chatId: string;
  currentUser: 'patient' | 'doctor';
};

export function ChatInterface({ chatId, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chat/${chatId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load chat history.",
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId, toast]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div');
        if (scrollableView) {
           scrollableView.scrollTo({ top: scrollableView.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const optimisticMessage: Message = {
        id: 'temp-' + Date.now(),
        text: input,
        sender: currentUser,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setInput('');

    try {
        const response = await fetch(`/api/chat/${chatId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input, sender: currentUser }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const actualMessage = await response.json();
        
        // Replace optimistic message with actual message from server
        setMessages(prev => prev.map(msg => msg.id === optimisticMessage.id ? actualMessage : msg));

    } catch (error) {
        toast({
            title: "Error",
            description: "Message could not be sent.",
            variant: 'destructive',
        });
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
    }
  };

  const getAvatar = (sender: 'patient' | 'doctor') => {
      if (sender === 'patient') {
          return <AvatarFallback><User /></AvatarFallback>;
      }
      return <AvatarFallback><Stethoscope /></AvatarFallback>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
             <div className="text-center text-muted-foreground p-10">
                <p>No messages yet.</p>
                <p>Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2',
                  message.sender === currentUser ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender !== currentUser && (
                  <Avatar className="h-8 w-8">
                    {getAvatar(message.sender)}
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm',
                    message.sender === currentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background'
                  )}
                >
                  {message.text}
                </div>
                 {message.sender === currentUser && (
                  <Avatar className="h-8 w-8">
                    {getAvatar(message.sender)}
                  </Avatar>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
