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

const DetailSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mt-8">
        <h4 className="text-lg font-bold text-blue-700 bg-blue-50 p-2 rounded-md">{title}</h4>
        <div className="mt-4 space-y-2">{children}</div>
    </div>
);

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b">
            <p className="font-semibold text-sm col-span-1">{label}</p>
            <div className="text-sm text-gray-700 col-span-2">{value}</div>
        </div>
    );
};


export function HealthReport({ data, t }: HealthReportProps) {
  const { patientInfo, medicalHistory, lifestyleAssessment, patientImprovementReview } = data;
  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
      content: () => reportRef.current,
      documentTitle: `Health-Report-${patientInfo.name.replace(' ', '-')}`,
  });

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

  const tr = t.detailedReport;


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
                            <div className="space-y-8">
                                <HealthParameterCard icon={<ThyroidIcon className="h-6 w-6 text-red-500"/>} title="Thyroid Function" {...healthStatus.thyroid} />
                                <HealthParameterCard icon={<LungsIcon className="h-6 w-6 text-gray-500"/>} title="Lungs Function" {...healthStatus.lungs} />
                                <HealthParameterCard icon={<LiverIcon className="h-6 w-6 text-green-500"/>} title="Liver Function" {...healthStatus.liver} />
                                <HealthParameterCard icon={<StomachIcon className="h-6 w-6 text-red-500"/>} title="Anemia Studies" {...healthStatus.anemia} />
                                <HealthParameterCard icon={<BloodDropIcon className="h-6 w-6 text-red-500"/>} title="Vitamin" {...healthStatus.vitamin} />
                            </div>

                            <div className="flex justify-center">
                                <Image src="https://placehold.co/400x600.png" alt="Human Body Diagram" width={300} height={525} data-ai-hint="3d human anatomy"/>
                            </div>

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
                    
                    <Separator className="my-10" />

                    <div>
                        <h3 className="text-2xl font-bold text-center mb-6">{tr.title}</h3>
                        
                        <DetailSection title={tr.patientInformation}>
                            <DetailRow label={tr.name} value={patientInfo.name} />
                            <DetailRow label={tr.age} value={patientInfo.age} />
                            <DetailRow label={tr.gender} value={patientInfo.gender} />
                            <DetailRow label={tr.email} value={patientInfo.email} />
                            <DetailRow label={tr.phone} value={patientInfo.phone} />
                            <DetailRow label={tr.address} value={`${patientInfo.address.line1}, ${patientInfo.address.line2}, ${patientInfo.address.city}, ${patientInfo.address.district}, ${patientInfo.address.state} - ${patientInfo.address.postalCode}`} />
                            <DetailRow label={tr.height} value={`${patientInfo.height} cm`} />
                            <DetailRow label={tr.weight} value={`${patientInfo.weight} kg`} />
                            <DetailRow label={tr.uniqueId} value={patientInfo.uniqueId} />
                            <DetailRow label={tr.dob} value={patientInfo.dob} />
                            <DetailRow label={tr.birthTime} value={patientInfo.birthTime} />
                            <DetailRow label={tr.birthPlace} value={patientInfo.birthPlace} />
                            <DetailRow label={tr.deliveryType} value={patientInfo.deliveryType} />
                            <DetailRow label={tr.deliveryTime} value={patientInfo.deliveryTime} />
                            <DetailRow label={tr.occupation} value={patientInfo.occupation} />
                            <DetailRow label={tr.maritalStatus} value={patientInfo.maritalStatus} />
                            <DetailRow label={tr.dateOfVisit} value={patientInfo.dateOfVisit} />
                            <DetailRow label={tr.referredBy} value={patientInfo.referredBy} />
                        </DetailSection>

                        <DetailSection title={tr.medicalHistory}>
                            <h5 className="font-semibold text-base mb-2">{tr.chiefComplaints}</h5>
                             {medicalHistory.chiefComplaints.map(c => (
                                <Card key={c.id} className="p-2 mb-2 bg-gray-50">
                                    <DetailRow label={tr.complaint} value={c.complaint} />
                                    <DetailRow label={tr.duration} value={c.duration} />
                                    <DetailRow label={tr.order} value={c.order} />
                                </Card>
                            ))}
                            
                            <h5 className="font-semibold text-base mt-4 mb-2">{tr.presentIllness}</h5>
                            <DetailRow label={tr.symptoms} value={medicalHistory.historyOfPresentIllness.symptoms} />
                            <DetailRow label={tr.onset} value={medicalHistory.historyOfPresentIllness.onset} />
                            <DetailRow label={tr.duration} value={medicalHistory.historyOfPresentIllness.duration} />
                            <DetailRow label={tr.frequencyTiming} value={medicalHistory.historyOfPresentIllness.frequencyTiming} />
                            <DetailRow label={tr.progression} value={medicalHistory.historyOfPresentIllness.progression} />
                            <DetailRow label={tr.location} value={medicalHistory.historyOfPresentIllness.location} />
                            <DetailRow label={tr.radiation} value={medicalHistory.historyOfPresentIllness.radiation} />
                            <DetailRow label={tr.character} value={medicalHistory.historyOfPresentIllness.character} />
                            <DetailRow label={tr.severity} value={`${medicalHistory.historyOfPresentIllness.severity}/10`} />
                            <DetailRow label={tr.associatedSymptoms} value={medicalHistory.historyOfPresentIllness.associatedSymptoms} />
                            <DetailRow label={tr.aggravatingFactors} value={medicalHistory.historyOfPresentIllness.aggravatingFactors} />
                            <DetailRow label={tr.relievingFactors} value={medicalHistory.historyOfPresentIllness.relievingFactors} />
                            <DetailRow label={tr.previousEpisodes} value={medicalHistory.historyOfPresentIllness.previousEpisodes} />
                            <DetailRow label={tr.impact} value={medicalHistory.historyOfPresentIllness.impact} />

                            <h5 className="font-semibold text-base mt-4 mb-2">{tr.pastHistory}</h5>
                             <DetailRow label={tr.pastConditions} value={
                                <ul>{medicalHistory.pastHistory.conditions.map(c => <li key={c.id}>{c.condition} ({c.date}) - Cured: {c.cured ? 'Yes' : 'No'}</li>)}</ul>
                             } />
                             <DetailRow label={tr.trauma} value={medicalHistory.pastHistory.trauma} />
                             <DetailRow label={tr.bloodTransfusions} value={medicalHistory.pastHistory.bloodTransfusions} />
                             <DetailRow label={tr.allergies} value={medicalHistory.pastHistory.allergies} />
                             <DetailRow label={tr.immunizations} value={medicalHistory.pastHistory.immunizations} />

                             <h5 className="font-semibold text-base mt-4 mb-2">{tr.medications}</h5>
                             <DetailRow label={tr.prescribed} value={
                                <ul>{medicalHistory.medications.prescribed.map(m => <li key={m.id}>{m.name} ({m.dosage}): {m.description}</li>)}</ul>
                             } />
                            <DetailRow label={tr.supplements} value={medicalHistory.medications.supplements} />
                            <DetailRow label={tr.compliance} value={medicalHistory.medications.compliance} />
                            <DetailRow label={tr.recentChanges} value={medicalHistory.medications.recentChanges} />

                            <h5 className="font-semibold text-base mt-4 mb-2">{tr.familyHistory}</h5>
                            <DetailRow label={tr.familyConditions} value={medicalHistory.familyHistory.conditions.join(', ')} />
                            <DetailRow label={tr.familyHealthStatus} value={medicalHistory.familyHistory.familyHealthStatus} />
                            <DetailRow label={tr.consanguinity} value={medicalHistory.familyHistory.consanguinity} />
                        </DetailSection>

                        <DetailSection title={tr.lifestyle}>
                             <h5 className="font-semibold text-base mb-2">{tr.sleep}</h5>
                             <DetailRow label="Bedtime" value={lifestyleAssessment.sleep.bedtime} />
                             <DetailRow label="Wake Time" value={lifestyleAssessment.sleep.wakeTime} />
                             <DetailRow label="Quality" value={lifestyleAssessment.sleep.quality} />
                             <DetailRow label="Issues" value={lifestyleAssessment.sleep.issues.join(', ')} />
                             <DetailRow label="Dream Frequency" value={lifestyleAssessment.sleep.dreamFrequency} />
                             <DetailRow label="Notes" value={lifestyleAssessment.sleep.notes} />

                            <h5 className="font-semibold text-base mt-4 mb-2">{tr.diet}</h5>
                            <DetailRow label="Diet Type" value={lifestyleAssessment.diet.dietType} />
                            <DetailRow label="Water Intake" value={`${lifestyleAssessment.diet.waterIntake} L/day`} />
                            <DetailRow label="Hunger Level" value={`${lifestyleAssessment.diet.hungerLevel}/10`} />
                            <DetailRow label="Tastes" value={Object.entries(lifestyleAssessment.diet.tastes).filter(([, v]) => v).map(([k]) => k).join(', ')} />
                            <DetailRow label="Thirst Level" value={lifestyleAssessment.diet.thirstLevel} />

                            <h5 className="font-semibold text-base mt-4 mb-2">{tr.stool}</h5>
                             <DetailRow label="Color" value={lifestyleAssessment.stool.color} />
                             <DetailRow label="Type" value={`Type ${lifestyleAssessment.stool.type}`} />
                             <DetailRow label="Problems" value={lifestyleAssessment.stool.problems.join(', ')} />
                        </DetailSection>

                        <DetailSection title={tr.improvementReview}>
                             {patientImprovementReview.map(r => (
                                <Card key={r.id} className="p-2 mb-2 bg-gray-50">
                                    <DetailRow label={tr.symptom} value={r.symptom} />
                                    <DetailRow label={tr.reviewDate} value={r.date} />
                                    <DetailRow label={tr.doctorName} value={r.doctorName} />
                                    <DetailRow label={tr.review} value={`${r.review}/5 Stars`} />
                                    <DetailRow label={tr.status} value={r.status} />
                                    <DetailRow label={tr.recoveryPercentage} value={`${r.recoveryPercentage}%`} />
                                </Card>
                            ))}
                        </DetailSection>

                    </div>
                </main>
            </div>
        </CardContent>
    </Card>
  );
}
