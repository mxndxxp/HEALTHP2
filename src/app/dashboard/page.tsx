'use client';
import { useState, useEffect } from 'react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { PatientInformation } from '@/components/patient-information';
import { MedicalHistory } from '@/components/medical-history';
import { LifestyleAssessment } from '@/components/lifestyle-assessment';
import { SenseOrgans } from '@/components/sense-organs';
import { Dashboard } from '@/components/dashboard';
import { AiAnalysis } from '@/components/ai-analysis';
import { ChatBot } from '@/components/chat-bot';
import { HealthReport } from '@/components/health-report';
import { PatientImprovementReview } from '@/components/patient-improvement-review';
import { Consultation } from '@/components/consultation';
import { Payment } from '@/components/payment';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HealthData } from '@/lib/types';
import { initialUiText } from '@/lib/ui-text';
import { SectionNavigator } from '@/components/layout/section-navigator';
import PatientChatPage from '@/app/patient/chat/[doctorId]/page';
import { cn } from '@/lib/utils';
import {
  Activity,
  BotMessageSquare,
  CreditCard,
  FileText,
  HeartPulse,
  LayoutDashboard,
  MessageSquarePlus,
  Smile,
  User,
  Video,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPatientData, savePatientData } from '@/lib/patient-data-service';

const sectionComponents: { [key: string]: React.ComponentType<any> } = {
  dashboard: Dashboard,
  patientInfo: PatientInformation,
  medicalHistory: MedicalHistory,
  lifestyle: LifestyleAssessment,
  senses: SenseOrgans,
  payment: Payment,
  healthReport: HealthReport,
  aiAnalysis: AiAnalysis,
  patientImprovementReview: PatientImprovementReview,
  consultation: Consultation,
  // We assume the main doctor for the patient has ID '1' for this prototype
  doctorChat: () => <PatientChatPage params={{ doctorId: '1' }} />,
};

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'patientInfo', icon: User },
  { id: 'medicalHistory', icon: HeartPulse },
  { id: 'lifestyle', icon: Activity },
  { id: 'senses', icon: Smile },
  { id: 'payment', icon: CreditCard },
  { id: 'healthReport', icon: FileText },
  { id: 'aiAnalysis', icon: BotMessageSquare },
  { id: 'patientImprovementReview', icon: MessageSquarePlus },
  { id: 'consultation', icon: Video },
  { id: 'doctorChat', icon: MessageSquare },
];

const dataEntrySections = [
    'patientInfo', 
    'medicalHistory', 
    'lifestyle', 
    'senses', 
    'patientImprovementReview',
    'consultation'
];

const sectionOrder = navItems.map(item => item.id);


export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [uiText, setUiText] = useState(initialUiText);
  const { toast } = useToast();
  
  // For this prototype, we'll assume the patient ID is '1'.
  // In a real app, this would come from an authentication context.
  const patientId = '1'; 

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`/api/patient-data?patientId=${patientId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch patient data');
            }
            const data = await response.json();
            setHealthData(data);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Could not load patient data.',
                variant: 'destructive',
            });
        }
    };
    fetchData();
  }, [patientId, toast]);


  const handleDataChange = (section: keyof HealthData, data: any) => {
    setHealthData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            [section]: data,
        }
    });
  };

  const handleSave = async () => {
    if (!healthData) return;
    try {
        const response = await fetch(`/api/patient-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patientId, data: healthData }),
        });
        if (!response.ok) {
            throw new Error('Failed to save data');
        }
        toast({
            title: 'Progress Saved!',
            description: 'Your changes have been saved.',
        });
    } catch(error) {
         toast({
            title: 'Error',
            description: 'Could not save patient data.',
            variant: 'destructive',
        });
    }
  }
  
  const ActiveComponent = sectionComponents[activeSection];
  const activeTitle = uiText.sectionTitles[activeSection as keyof typeof uiText.sectionTitles];
  const componentStrings = uiText.components[activeSection as keyof typeof uiText.components];
  
  const showSaveButton = dataEntrySections.includes(activeSection);
  const isChat = activeSection === 'doctorChat';

  const sidebar = <SidebarNav
    activeSection={activeSection}
    setActiveSection={setActiveSection}
    sectionTitles={uiText.sectionTitles}
    navItems={navItems}
  />;

  if (!healthData) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  const componentProps = {
    data: healthData,
    setData: setHealthData, // Pass the whole setter down
    onDataChange: handleDataChange,
    t: componentStrings,
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sectionTitles={uiText.sectionTitles}
          navItems={navItems}
          className="h-full"
        />
      </div>
      <div className="flex flex-col">
        <Header 
          title={activeTitle} 
          sidebar={sidebar} 
          t={uiText.components.header} 
          showSaveButton={showSaveButton}
          onSave={handleSave}
        />
        <main className="flex-1 overflow-auto bg-muted/40">
            <ScrollArea className="h-[calc(100vh-65px)]">
                 <div className={cn("p-4 sm:p-6", isChat && "p-0 sm:p-0")}>
                    {ActiveComponent && <ActiveComponent {...componentProps} />}
                    {!isChat && <SectionNavigator
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                      sectionOrder={sectionOrder}
                      sectionTitles={uiText.sectionTitles}
                    />}
                 </div>
            </ScrollArea>
        </main>
      </div>
      <ChatBot t={uiText.components.chatbot} />
    </div>
  );
}
