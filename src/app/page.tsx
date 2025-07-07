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
import { HealthReport } from '@/components/health-report';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HealthData } from '@/lib/types';
import { translateText } from '@/ai/flows/translator';

const sectionComponents: { [key: string]: React.ComponentType<any> } = {
  dashboard: Dashboard,
  patientInfo: PatientInformation,
  medicalHistory: MedicalHistory,
  lifestyle: LifestyleAssessment,
  senses: SenseOrgans,
  healthReport: HealthReport,
  aiInsights: AiInsights,
};

const initialSectionTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    patientInfo: 'Patient Information',
    medicalHistory: 'Medical History',
    lifestyle: 'Lifestyle Assessment',
    senses: 'Sense Organ Assessment',
    healthReport: 'Health Report',
    aiInsights: 'AI Health Insights',
}

const initialHealthData: HealthData = {
  patientInfo: {
    name: 'John Doe',
    age: '35',
    gender: 'male',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      line1: '123 Health St',
      line2: 'Apt 4B',
      city: 'Medville',
      district: 'Wellness County',
      state: 'State of Health',
      postalCode: '12345',
    },
    height: '180',
    weight: '75',
    uniqueId: `HC-${Date.now()}-A9B8C7`,
    avatar: "https://placehold.co/200x200.png",
    dob: '',
    birthTime: '',
    birthPlace: '',
    deliveryType: 'normal',
    deliveryTime: '',
  },
  medicalHistory: {
    familyHistory: ['Hypertension'],
    pastHistory: [
      { id: 1, condition: 'Appendectomy', date: '2015-06-20', cured: true },
    ],
    currentSituation: {
      symptoms: '',
      severity: 5,
      impact: '',
    },
    medications: [
      { id: 1, name: 'Lisinopril', dosage: '10mg, once daily', description: 'For high blood pressure' },
    ],
    documents: {
      reports: null,
      prescriptions: null,
      photos: null,
    },
  },
  lifestyleAssessment: {
      hungerLevel: 5,
      favoriteFood: '',
  }
};


export default function Home() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [sectionTitles, setSectionTitles] = useState(initialSectionTitles);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = async (language: string) => {
    if (language === 'en') {
      setSectionTitles(initialSectionTitles);
      return;
    }
    setIsTranslating(true);
    try {
      const translationPromises = Object.entries(initialSectionTitles).map(async ([key, title]) => {
        const result = await translateText({ text: title, targetLanguage: language });
        return { [key]: result.translatedText };
      });
      const translatedPairs = await Promise.all(translationPromises);
      const newTitles = Object.assign({}, ...translatedPairs);
      setSectionTitles(newTitles);
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const ActiveComponent = sectionComponents[activeSection];
  const activeTitle = sectionTitles[activeSection];

  const sidebar = <SidebarNav activeSection={activeSection} setActiveSection={setActiveSection} sectionTitles={sectionTitles} />;

  const handleDataChange = (section: keyof HealthData, data: any) => {
    setHealthData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      }
    }));
  };

  const componentProps = {
    data: healthData,
    setData: setHealthData,
    onDataChange: handleDataChange,
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        {sidebar}
      </div>
      <div className="flex flex-col">
        <Header title={activeTitle} sidebar={sidebar} onLanguageChange={handleLanguageChange} isTranslating={isTranslating} />
        <main className="flex-1 overflow-auto bg-muted/40">
            <ScrollArea className="h-[calc(100vh-65px)]">
                 <div className="p-4 sm:p-6">
                    {ActiveComponent && <ActiveComponent {...componentProps} />}
                 </div>
            </ScrollArea>
        </main>
      </div>
      <ChatBot />
    </div>
  );
}
