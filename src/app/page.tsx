'use client';
import { useState } from 'react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { PatientInformation } from '@/components/patient-information';
import { MedicalHistory } from '@/components/medical-history';
import { LifestyleAssessment } from '@/components/lifestyle-assessment';
import { SenseOrgans } from '@/components/sense-organs';
import { Dashboard } from '@/components/dashboard';
import { AiInsights } from '@/components/ai-insights';
import { ChatBot } from '@/components/chat-bot';
import { ScrollArea } from '@/components/ui/scroll-area';

const sectionComponents: { [key: string]: React.ComponentType } = {
  dashboard: Dashboard,
  patientInfo: PatientInformation,
  medicalHistory: MedicalHistory,
  lifestyle: LifestyleAssessment,
  senses: SenseOrgans,
  aiInsights: AiInsights,
};

const sectionTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    patientInfo: 'Patient Information',
    medicalHistory: 'Medical History',
    lifestyle: 'Lifestyle Assessment',
    senses: 'Sense Organ Assessment',
    aiInsights: 'AI Health Insights',
}

export default function Home() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const ActiveComponent = sectionComponents[activeSection];
  const activeTitle = sectionTitles[activeSection];

  const sidebar = <SidebarNav activeSection={activeSection} setActiveSection={setActiveSection} />;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        {sidebar}
      </div>
      <div className="flex flex-col">
        <Header title={activeTitle} sidebar={sidebar} />
        <main className="flex-1 overflow-auto bg-muted/40">
            <ScrollArea className="h-[calc(100vh-65px)]">
                 <div className="p-4 sm:p-6">
                    {ActiveComponent && <ActiveComponent />}
                 </div>
            </ScrollArea>
        </main>
      </div>
      <ChatBot />
    </div>
  );
}
