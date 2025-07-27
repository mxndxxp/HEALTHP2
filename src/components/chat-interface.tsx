
'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send, User, Stethoscope, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { type Message, subscribeToChat } from '@/lib/chat-service';


type ChatInterfaceProps = {
  chatId: string;
  currentUser: string; // Now accepts any string, e.g., 'patient', 'doctor', 'Dr. Reed'
};

export function ChatInterface({ chatId, currentUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!chatId) return;

    setIsLoading(true);
    const unsubscribe = subscribeToChat(chatId, (newMessages) => {
        setMessages(newMessages);
        setIsLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [chatId]);

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
    if (!input.trim() || !chatId) return;

    const messageText = input;
    setInput('');

    try {
        const response = await fetch(`/api/chat/${chatId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: messageText, sender: currentUser }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to send message: ${errorData}`);
        }

    } catch (error) {
        console.error("Error sending message:", error);
        toast({
            title: "Error",
            description: (error as Error).message || "Message could not be sent. Please try again.",
            variant: 'destructive',
        });
        // Optionally, re-set the input so the user can retry
        setInput(messageText);
    }
  };

  const getAvatar = (sender: string) => {
      // Simple logic to differentiate patient/doctor avatars
      if (sender.toLowerCase().startsWith('dr.') || sender === 'doctor') {
          return <AvatarFallback><Stethoscope /></AvatarFallback>;
      }
      return <AvatarFallback><User /></AvatarFallback>;
  }
  
  const getSenderInitial = (sender: string) => {
    const parts = sender.split(' ');
    if (parts.length > 1) {
        return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    }
    return sender.charAt(0).toUpperCase();
  }
  
  const isGroupChat = chatId === 'doctors_discussion_room';


  return (
    <div className="flex flex-1 flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full py-10">
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
                    <AvatarFallback>{getSenderInitial(message.sender)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-1">
                    {isGroupChat && message.sender !== currentUser && (
                        <span className="text-xs text-muted-foreground ml-2">{message.sender}</span>
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
                </div>
                 {message.sender === currentUser && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback>{getSenderInitial(message.sender)}</AvatarFallback>
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
