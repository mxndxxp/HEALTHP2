'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Send, User, Stethoscope } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  text: string;
  sender: 'patient' | 'doctor';
};

type ChatInterfaceProps = {
  initialMessages: Message[];
  currentUser: 'patient' | 'doctor';
  recipientUser: 'patient' | 'doctor';
};

export function ChatInterface({ initialMessages, currentUser, recipientUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: currentUser,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  const getAvatar = (sender: 'patient' | 'doctor') => {
      if (sender === 'patient') {
          return <AvatarFallback><User /></AvatarFallback>;
      }
      return <AvatarFallback><Stethoscope /></AvatarFallback>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
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
          ))}
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
