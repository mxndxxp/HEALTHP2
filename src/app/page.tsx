'use client';
import { useState, useEffect } from 'react';
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
import { PatientImprovementReview } from '@/components/patient-improvement-review';
import { Consultation } from '@/components/consultation';
import { Payment } from '@/components/payment';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HealthData } from '@/lib/types';
import { translateText } from '@/ai/flows/translator';
import { initialUiText } from '@/lib/ui-text';
import { useToast } from '@/hooks/use-toast';
import { SectionNavigator } from '@/components/layout/section-navigator';
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
} from 'lucide-react';

const sectionComponents: { [key: string]: React.ComponentType<any> } = {
  dashboard: Dashboard,
  patientInfo: PatientInformation,
  medicalHistory: MedicalHistory,
  lifestyle: LifestyleAssessment,
  senses: SenseOrgans,
  payment: Payment,
  healthReport: HealthReport,
  aiInsights: AiInsights,
  patientImprovementReview: PatientImprovementReview,
  consultation: Consultation,
};

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'patientInfo', icon: User },
  { id: 'medicalHistory', icon: HeartPulse },
  { id: 'lifestyle', icon: Activity },
  { id: 'senses', icon: Smile },
  { id: 'payment', icon: CreditCard },
  { id: 'healthReport', icon: FileText },
  { id: 'aiInsights', icon: BotMessageSquare },
  { id: 'patientImprovementReview', icon: MessageSquarePlus },
  { id: 'consultation', icon: Video },
];

const sectionOrder = navItems.map(item => item.id);

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
    uniqueId: '',
    avatar: "https://placehold.co/200x200.png",
    dob: '',
    birthTime: '',
    birthPlace: '',
    deliveryType: 'normal',
    deliveryTime: '',
    occupation: '',
    maritalStatus: '',
    dateOfVisit: new Date().toISOString().split('T')[0], // Default to today
    referredBy: '',
  },
  medicalHistory: {
    chiefComplaints: [],
    historyOfPresentIllness: {
      symptoms: '',
      onset: '',
      duration: '',
      frequencyTiming: '',
      progression: '',
      location: '',
      radiation: '',
      character: '',
      severity: 5,
      associatedSymptoms: '',
      aggravatingFactors: '',
      relievingFactors: '',
      previousEpisodes: '',
      impact: '',
    },
    pastHistory: {
      conditions: [
        { id: 1, condition: 'Appendectomy', date: '2015-06-20', cured: true },
      ],
      trauma: '',
      bloodTransfusions: '',
      allergies: '',
      immunizations: '',
    },
    medications: {
      prescribed: [
        { id: 1, name: 'Lisinopril', dosage: '10mg, once daily', description: 'For high blood pressure' },
      ],
      supplements: '',
      compliance: 'good',
      recentChanges: '',
    },
    familyHistory: {
      conditions: ['Hypertension'],
      familyHealthStatus: '',
      consanguinity: '',
    },
    documents: {
      reports: null,
      prescriptions: null,
      photos: null,
    },
  },
  lifestyleAssessment: {
    sleep: {
      bedtime: '22:30',
      wakeTime: '06:30',
      quality: 'good',
      issues: [],
      dreamFrequency: 'sometimes',
      notes: '',
      photo: null,
    },
    diet: {
      dietType: 'omnivore',
      waterIntake: 2.5,
      hungerLevel: 5,
      favoriteFood: '',
      foodAllergies: '',
      tastes: {
        sweet: false,
        sour: false,
        salty: false,
        bitter: false,
        pungent: false,
        astringent: false,
      },
      thirstLevel: 'normal',
      notes: '',
      photo: null,
    },
    activity: {
      level: 'moderately',
      notes: '',
      photo: null,
    },
    stress: {
      level: 'moderate',
      caffeineIntake: 'low',
      primaryEmotion: 'calm',
      emotionNotes: '',
      notes: '',
      photo: null,
    },
    substance: {
      smokingStatus: 'never',
      alcoholConsumption: 'occasionally',
      notes: '',
      photo: null,
    },
    stool: {
      color: 'Brown',
      type: '4',
      problems: [],
      notes: '',
      photo: null,
    },
    urine: {
      color: 'Yellow',
      dayFrequency: 'normal',
      nightFrequency: '0-1',
      problems: [],
      notes: '',
      photo: null,
    },
    menstruation: {
      lastPeriodDate: '',
      cycleLength: 28,
      duration: 5,
      isRegular: 'yes',
      flow: 'medium',
      bloodColor: 'Bright Red',
      symptoms: [],
      painLevel: 3,
      notes: '',
      photo: null,
    },
  },
  patientImprovementReview: [],
  consultation: {
    doctors: [
        { id: 1, name: 'Dr. Evelyn Reed', specialization: 'Cardiologist', avatar: 'https://placehold.co/100x100.png' },
        { id: 2, name: 'Dr. Ben Carter', specialization: 'Neurologist', avatar: 'https://placehold.co/100x100.png' },
        { id: 3, name: 'Dr. Olivia Chen', specialization: 'Dermatologist', avatar: 'https://placehold.co/100x100.png' },
    ],
    booking: {
        patientName: 'John Doe',
        problem: '',
        report: null,
        uniqueId: '',
        doctorId: null,
    }
  }
};


export default function Home() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [healthData, setHealthData] = useState<HealthData>(initialHealthData);
  const [uiText, setUiText] = useState(initialUiText);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleLanguageChange = async (language: string) => {
    if (language === 'en') {
      setUiText(initialUiText);
      return;
    }
    setIsTranslating(true);
    try {
      const jsonToTranslate = JSON.stringify(initialUiText);
      const result = await translateText({ text: jsonToTranslate, targetLanguage: language });
      const translatedUi = JSON.parse(result.translatedText);
      setUiText(translatedUi);
    } catch (error) {
      console.error("Translation failed", error);
      toast({
        title: "Translation Failed",
        description: "Could not translate the UI. Please try again or select another language.",
        variant: "destructive",
      });
      setUiText(initialUiText); // Revert to English on failure
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDataChange = (section: keyof HealthData, data: any) => {
    setHealthData(prev => ({
      ...prev,
      [section]: data,
    }));
  };
  
  const ActiveComponent = sectionComponents[activeSection];
  const activeTitle = uiText.sectionTitles[activeSection as keyof typeof uiText.sectionTitles];
  const componentStrings = uiText.components[activeSection as keyof typeof uiText.components];

  const sidebar = <SidebarNav
    activeSection={activeSection}
    setActiveSection={setActiveSection}
    sectionTitles={uiText.sectionTitles}
    navItems={navItems}
  />;

  const componentProps = {
    data: healthData,
    setData: setHealthData,
    onDataChange: handleDataChange,
    t: componentStrings,
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        {sidebar}
      </div>
      <div className="flex flex-col">
        <Header 
          title={activeTitle} 
          sidebar={sidebar} 
          onLanguageChange={handleLanguageChange} 
          isTranslating={isTranslating} 
          t={uiText.components.header} 
        />
        <main className="flex-1 overflow-auto bg-muted/40">
            <ScrollArea className="h-[calc(100vh-65px)]">
                 <div className="p-4 sm:p-6">
                    {ActiveComponent && <ActiveComponent {...componentProps} />}
                    <SectionNavigator
                      activeSection={activeSection}
                      setActiveSection={setActiveSection}
                      sectionOrder={sectionOrder}
                      sectionTitles={uiText.sectionTitles}
                    />
                 </div>
            </ScrollArea>
        </main>
      </div>
      <ChatBot t={uiText.components.chatbot} />
    </div>
  );
}
