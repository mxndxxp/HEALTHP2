'use client';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { HealthData } from '@/lib/types';
import { User, FileDown, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { HeartIcon } from '@/components/icons/heart-icon';
import { ThyroidIcon } from '@/components/icons/thyroid-icon';
import { LungsIcon } from '@/components/icons/lungs-icon';
import { LiverIcon } from '@/components/icons/liver-icon';
import { KidneyIcon } from '@/components/icons/kidney-icon';
import { BloodDropIcon } from '@/components/icons/blood-drop-icon';
import { StomachIcon } from '@/components/icons/stomach-icon';
import { TestTubeIcon } from '@/components/icons/test-tube-icon';
import { DropletsIcon } from '@/components/icons/droplets-icon';

type HealthReportProps = {
  data: HealthData;
  t: any;
};

const HealthParameterCard = ({
    icon,
    title,
    status,
    details,
    statusColor,
}: {
    icon: React.ReactNode;
    title: string;
    status: string;
    details: string;
    statusColor: 'text-green-600' | 'text-red-600' | 'text-gray-600';
}) => (
    <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-semibold">{title}</h4>
            <p className={`text-sm font-bold ${statusColor}`}>{status}</p>
            <p className="text-xs text-muted-foreground">{details}</p>
        </div>
    </div>
);


export function HealthReport({ data, t }: HealthReportProps) {
  const { patientInfo, medicalHistory, lifestyleAssessment } = data;
  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
      content: () => reportRef.current,
      documentTitle: `Health-Report-${patientInfo.name.replace(' ', '-')}`,
  });

  // Placeholder logic to determine health status for the new UI
  // In a real app, this would be complex logic based on the full healthData
  const healthStatus = {
      thyroid: { status: 'Needs Attention', details: 'TSH-ULTRASENSITIVE is out of range.', color: 'text-red-600' },
      lungs: { status: 'Test Not Taken', details: '', color: 'text-gray-600' },
      liver: { status: 'Looks Good', details: 'All parameters are within range.', color: 'text-green-600' },
      anemia: { status: 'Needs Attention', details: 'UNSAT IRON-BINDING CAPACITY (UIBC) is out of range.', color: 'text-red-600' },
      vitamin: { status: 'Needs Attention', details: '25-OH VITAMIN D (TOTAL) is out of range.', color: 'text-red-600' },
      heart: { status: 'Needs Attention', details: 'LDL/HDL RATIO and 1 more parameters are out of range.', color: 'text-red-600' },
      bloodCount: { status: 'Needs Attention', details: 'HEMOGLOBIN and 7 more parameters are out of range.', color: 'text-red-600' },
      kidney: { status: 'Needs Attention', details: 'CREATININE - SERUM is out of range.', color: 'text-red-600' },
      urinalysis: { status: 'Looks Good', details: 'All parameters are within range.', color: 'text-green-600' },
      diabetes: { status: 'Needs Attention', details: 'AVERAGE BLOOD GLUCOSE (ABG) is out of range.', color: 'text-red-600' },
      electrolytes: { status: 'Test Not Taken', details: '', color: 'text-gray-600' },
  };


  return (
    <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
            </div>
            <Button onClick={handlePrint}>
                <FileDown className="mr-2" />
                {t.downloadButton}
            </Button>
        </CardHeader>
        <CardContent>
            <div ref={reportRef} className="p-4 md:p-8 border rounded-lg bg-white text-black">
                {/* Report Header */}
                <header className="flex items-start justify-between pb-4 border-b">
                    <div>
                        {/* You can replace this with a logo component if you have one */}
                        <h2 className="text-2xl font-bold text-blue-600">HealthSight Labs</h2>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={patientInfo.avatar} />
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold">{patientInfo.name}, {patientInfo.gender === 'female' ? 'F' : 'M'}, {patientInfo.age} years</p>
                                <p className="text-sm text-gray-600">Date of Test: {new Date(patientInfo.dateOfVisit).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                         <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-blue-100 p-1 text-blue-700">
                           <ShieldCheck className="h-5 w-5" />
                           <span className="text-xs font-semibold">NABL CERTIFIED</span>
                         </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="py-6">
                    <h3 className="text-xl font-bold">{t.summary.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t.summary.thankYou}</p>
                    <p className="text-sm text-gray-600">{t.summary.stayHealthy}</p>

                    <div className="mt-6">
                        <h4 className="font-semibold">{t.atAGlance.title}</h4>
                        <p className="text-xs text-gray-500">{t.atAGlance.description}</p>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            {/* Left Column */}
                            <div className="space-y-8">
                                <HealthParameterCard icon={<ThyroidIcon className="h-6 w-6 text-red-500"/>} title="Thyroid Function" {...healthStatus.thyroid} />
                                <HealthParameterCard icon={<LungsIcon className="h-6 w-6 text-gray-500"/>} title="Lungs Function" {...healthStatus.lungs} />
                                <HealthParameterCard icon={<LiverIcon className="h-6 w-6 text-green-500"/>} title="Liver Function" {...healthStatus.liver} />
                                <HealthParameterCard icon={<StomachIcon className="h-6 w-6 text-red-500"/>} title="Anemia Studies" {...healthStatus.anemia} />
                                <HealthParameterCard icon={<BloodDropIcon className="h-6 w-6 text-red-500"/>} title="Vitamin" {...healthStatus.vitamin} />
                            </div>

                            {/* Center Image */}
                            <div className="flex justify-center">
                                <Image src="https://placehold.co/400x600.png" alt="Human Body Diagram" width={300} height={525} data-ai-hint="human anatomy diagram"/>
                            </div>

                             {/* Right Column */}
                             <div className="space-y-8">
                                <HealthParameterCard icon={<HeartIcon className="h-6 w-6 text-red-500"/>} title="Heart Function" {...healthStatus.heart} />
                                <HealthParameterCard icon={<BloodDropIcon className="h-6 w-6 text-red-500"/>} title="Blood Count" {...healthStatus.bloodCount} />
                                <HealthParameterCard icon={<KidneyIcon className="h-6 w-6 text-red-500"/>} title="Kidney Function" {...healthStatus.kidney} />
                                <HealthParameterCard icon={<TestTubeIcon className="h-6 w-6 text-green-500"/>} title="Urinalysis" {...healthStatus.urinalysis} />
                                <HealthParameterCard icon={<BloodDropIcon className="h-6 w-6 text-red-500"/>} title="Diabetes Monitoring" {...healthStatus.diabetes} />
                                <HealthParameterCard icon={<DropletsIcon className="h-6 w-6 text-gray-500"/>} title="Electrolytes and Minerals" {...healthStatus.electrolytes} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </CardContent>
    </Card>
  );
}
