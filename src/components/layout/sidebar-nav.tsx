'use client';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ClipboardList, type LucideIcon } from 'lucide-react';

type NavItem = {
    id: string;
    icon: LucideIcon;
};

type SidebarNavProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  navItems: NavItem[];
  sectionTitles: { [key: string]: string };
  className?: string;
};

export function SidebarNav({ activeSection, setActiveSection, navItems, sectionTitles, className }: SidebarNavProps) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ClipboardList className="h-6 w-6 text-primary" />
          <span className="">HealthSight</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start gap-1 px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'secondary' : 'ghost'}
              className="justify-start gap-3"
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {sectionTitles[item.id]}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
