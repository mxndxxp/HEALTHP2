'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from './ui/sheet';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { intelligentChatbot } from '@/ai/flows/intelligent-chatbot';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

type ChatBotProps = {
  t: any;
  patientId: string;
};

export function ChatBot({ t, patientId }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t.initialMessage,
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        // Fetch the latest patient data to provide context to the chatbot
        const response = await fetch(`/api/patient-data?patientId=${patientId}`);
        if (!response.ok) {
            throw new Error('Could not fetch patient context.');
        }
        const patientData = await response.json();
        
        const botResponse = await intelligentChatbot({
            message: input,
            patientData: JSON.stringify(patientData, null, 2)
        });

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponse.response,
            sender: 'bot'
        };
        setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessageText = (error instanceof Error && error.message) || t.errorMessage;
        const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: errorMessageText,
            sender: 'bot'
        };
        setMessages((prev) => [...prev, errorMessage]);
        toast({
          title: "Chatbot Error",
          description: errorMessageText,
          variant: "destructive"
        })
    } finally {
        setIsLoading(false);
    }

  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full w-16 h-16 shadow-lg">
              <Bot className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Bot /> {t.title}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 p-4 -mx-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex items-end gap-2',
                      message.sender === 'user' && 'justify-end'
                    )}
                  >
                    {message.sender === 'bot' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback>
                            <Bot />
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-3 py-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
            <SheetFooter>
              <div className="flex w-full items-center gap-2">
                <Input
                  placeholder={t.inputPlaceholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <Button onClick={handleSend} disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
