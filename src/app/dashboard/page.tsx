
'use client';
import { useState, useEffect, useCallback } from 'react';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { PatientInformation } from '@/components/patient-information';
import { MedicalHistory } from '@/components/medical-history';
import { LifestyleAssessment } from '@/components/lifestyle-assessment';
import { SenseOrgans } from '@/components/sense-organs';
import { Dashboard } from '@/components/dashboard';
import { AiAnalysis } from '@/components/ai-analysis';
import { ChatBot } from '@/components/chat-bot';
import { PatientImprovementReview } from '@/components/patient-improvement-review';
import { Consultation } from '@/components/consultation';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HealthData } from '@/lib/types';
import { initialUiText } from '@/lib/ui-text';
import { SectionNavigator } from '@/components/layout/section-navigator';
import PatientChatPage from '@/app/patient/chat/[doctorId]/page';
import { CaseHistory } from '@/components/case-history';
import { PatientReports } from '@/components/patient-reports';
import { DeviceConnectivity } from '@/components/device-connectivity';
import { HealthReport } from '@/components/health-report';
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
  BookMarked,
  FileHeart,
  Bluetooth,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPatientData, savePatientData } from '@/lib/patient-data-service';

// Helper component for consistent info display
function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}


const sectionComponents: { [key: string]: React.ComponentType<any> } = {
  dashboard: Dashboard,
  patientInfo: PatientInformation,
  medicalHistory: MedicalHistory,
  lifestyle: LifestyleAssessment,
  senses: SenseOrgans,
  patientReports: PatientReports,
  healthReport: HealthReport,
  caseHistory: CaseHistory,
  deviceConnectivity: DeviceConnectivity,
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
  { id: 'patientReports', icon: FileHeart },
  { id: 'healthReport', icon: FileText },
  { id: 'caseHistory', icon: BookMarked },
  { id: 'deviceConnectivity', icon: Bluetooth },
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [dataSource, setDataSource] = useState<'server' | 'cache' | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // For this prototype, we'll assume the patient ID is '1'.
  // In a real app, this would come from an authentication context.
  const patientId = '1'; 

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchPatientData = useCallback(async () => {
    if (!patientId) {
      setIsLoading(false);
      setError("Application not properly initialized: No Patient ID found.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getPatientData(patientId, isOnline);
      setHealthData(data.data);
      setDataSource(data.source);
      if (data.source === 'cache') {
          toast({
              title: "Offline Mode",
              description: 'Displaying cached data. Some features may be limited.',
          });
      }
    } catch (err: any) {
        console.error('Data fetch error:', err);
        setError(err.message || 'Failed to load patient data');
        if (!healthData) setHealthData(null);
    } finally {
        setIsLoading(false);
    }
  }, [patientId, isOnline, toast, healthData]);

  useEffect(() => {
    fetchPatientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, isOnline]);
  
  // Auto-retry with exponential backoff
  useEffect(() => {
    if (!error || !isOnline) return;

    const isRetriableError = error.includes("Could not connect") || error.includes("unavailable");
    if (!isRetriableError) return;

    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    const retryDelay = Math.min(1000 * 2 ** newRetryCount, 30000); // Max 30s delay
    
    const retryTimer = setTimeout(() => {
      console.log(`Retrying connection... (Attempt ${newRetryCount})`);
      fetchPatientData();
    }, retryDelay);
    
    return () => clearTimeout(retryTimer);
  }, [error, fetchPatientData, isOnline, retryCount]);


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
        await savePatientData(patientId, healthData);
        toast({
            title: 'Progress Saved!',
            description: 'Your changes have been saved to the database.',
            caseHistory: {
              type: 'Data Saved',
              description: 'Patient data manually saved.'
            }
        });
    } catch(error) {
         toast({
            title: 'Error Saving Data',
            description: 'Could not save patient data. Please check your connection and try again.',
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

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading patient data...</p>
            {!isOnline && (
                <p className="text-amber-600 mt-2">
                    Offline mode: Attempting to use cached data...
                </p>
            )}
        </div>
      </div>
    );
  }

  if (error && !healthData) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
         <Card className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <CardHeader className="text-center">
                <div className="mx-auto bg-red-100 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-800 mb-2">Failed to Load Data</CardTitle>
                <CardDescription className="text-gray-600 mb-4">{error}</CardDescription>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                    <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                        <strong>Troubleshooting tips:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Check your internet connection</li>
                            <li>Verify Firebase configuration</li>
                            <li>Ensure patient ID is correct</li>
                            <li>Check Firestore security rules</li>
                        </ul>
                        </p>
                    </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button 
                    onClick={() => {
                        setRetryCount(prev => prev + 1);
                        fetchPatientData();
                    }}
                    className={`px-5 py-2 rounded-lg font-medium ${
                        isOnline 
                        ? ""
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isOnline}
                    >
                    {retryCount > 0 ? `Retry (${retryCount})` : 'Retry Now'}
                    </Button>
                    
                    <Button 
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                        window.location.reload();
                        }
                    }}
                    variant="outline"
                    >
                    Reload Page
                    </Button>
                </div>
                
                {!isOnline && (
                    <div className="mt-6 p-3 bg-gray-100 rounded-lg text-center">
                    <p className="text-gray-600">
                        You appear to be offline. Please check your network connection.
                    </p>
                    </div>
                )}
            </CardHeader>
         </Card>
       </div>
    );
  }

  if (!healthData) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>No health data found for this patient.</p>
        </div>
    );
  }

  const componentProps = {
    data: healthData,
    setData: setHealthData, // Pass the whole setter down
    onDataChange: handleDataChange,
    t: componentStrings,
    patientId
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
            {error && healthData && (
                 <div className="bg-amber-100 border-b border-amber-200 text-amber-800 text-sm p-2 text-center flex justify-center items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <p>{error}</p>
                 </div>
            )}
            <ScrollArea className={cn("h-[calc(100vh-65px)]", error && healthData && "h-[calc(100vh-65px-36px)]")}>
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
      <ChatBot t={uiText.components.chatbot} patientId={patientId} />
    </div>
  );
}

    

    

    