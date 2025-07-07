'use client';
import {
  Activity,
  BotMessageSquare,
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Mic,
  Smile,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

type SidebarNavProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  className?: string;
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patientInfo', label: 'Patient Information', icon: User },
  { id: 'medicalHistory', label: 'Medical History', icon: HeartPulse },
  { id: 'lifestyle', label: 'Lifestyle Assessment', icon: Activity },
  { id: 'senses', label: 'Sense Organs', icon: Smile },
  { id: 'healthReport', label: 'Health Report', icon: FileText },
  { id: 'aiInsights', label: 'AI Health Insights', icon: BotMessageSquare },
];

export function SidebarNav({ activeSection, setActiveSection, className }: SidebarNavProps) {
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
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}
