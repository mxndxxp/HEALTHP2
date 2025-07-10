'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Globe, Loader2, Save } from 'lucide-react';
import type { ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

type HeaderProps = {
  title: string;
  sidebar: ReactNode;
  onLanguageChange: (language: string) => void;
  isTranslating: boolean;
  t: any;
  showSaveButton?: boolean;
};

const indianLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'ur', name: 'Urdu' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'or', name: 'Odia' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'as', name: 'Assamese' },
];

export function Header({ title, sidebar, onLanguageChange, isTranslating, t, showSaveButton = false }: HeaderProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: t.saveProgress.title,
      description: t.saveProgress.description,
    });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t.toggleNav}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            {sidebar}
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        {showSaveButton && (
           <Button variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {t.saveButton}
           </Button>
        )}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {isTranslating ? <Loader2 className="animate-spin" /> : <Globe />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t.selectLanguage}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {indianLanguages.map(lang => (
                    <DropdownMenuItem key={lang.code} onClick={() => onLanguageChange(lang.code)}>
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">{t.toggleUserMenu}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.settings}</DropdownMenuItem>
            <DropdownMenuItem>{t.support}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t.logout}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
