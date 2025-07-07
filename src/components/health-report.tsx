'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import type { HealthData } from '@/lib/types';
import { User, File as FileIcon } from 'lucide-react';

type HealthReportProps = {
  data: HealthData;
  t: any;
};

const ReportItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm col-span-2">{value || 'N/A'}</dd>
    </div>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);


export function HealthReport({ data, t }: HealthReportProps) {
  const { patientInfo, medicalHistory } = data;
  const { patientInfo: tPatient, medicalHistory: tMedical } = t;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">{t.title}</CardTitle>
        <CardDescription>{t.generatedOn} {new Date().toLocaleDateString()}</CardDescription>
        <Separator className="my-4"/>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Patient Information */}
        <Section title={tPatient.title}>
            <div className="flex items-start gap-8">
                <Avatar className="h-32 w-32 border">
                    <AvatarImage src={patientInfo.avatar} alt={patientInfo.name} />
                    <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                </Avatar>
                <dl className="space-y-3 flex-1">
                    <ReportItem label={tPatient.name} value={patientInfo.name} />
                    <ReportItem label={tPatient.uniqueId} value={<span className="font-mono">{patientInfo.uniqueId}</span>} />
                    <ReportItem label={tPatient.age} value={patientInfo.age} />
                    <ReportItem label={tPatient.gender} value={patientInfo.gender} />
                    <ReportItem label={tPatient.email} value={patientInfo.email} />
                    <ReportItem label={tPatient.phone} value={patientInfo.phone} />
                    <ReportItem label={tPatient.height} value={`${patientInfo.height} cm`} />
                    <ReportItem label={tPatient.weight} value={`${patientInfo.weight} kg`} />
                    <ReportItem label={tPatient.address} value={`${patientInfo.address.line1}, ${patientInfo.address.line2}, ${patientInfo.address.city}, ${patientInfo.address.district}, ${patientInfo.address.state}, ${patientInfo.address.postalCode}`} />
                </dl>
            </div>
        </Section>
        
        <Separator />

        {/* Medical History */}
        <Section title={tMedical.title}>
            <h4 className="font-medium">{tMedical.pastConditions}</h4>
            {medicalHistory.pastHistory.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    {medicalHistory.pastHistory.map(item => (
                        <li key={item.id}>{item.condition} ({tMedical.diagnosed}: {item.date}) - {item.cured ? tMedical.resolved : tMedical.ongoing}</li>
                    ))}
                </ul>
            ) : <p className="text-sm text-muted-foreground">{tMedical.noPastConditions}</p>}

            <h4 className="font-medium pt-2">{tMedical.currentMedications}</h4>
            {medicalHistory.medications.length > 0 ? (
                 <ul className="list-disc pl-5 space-y-1 text-sm">
                    {medicalHistory.medications.map(item => (
                        <li key={item.id}>{item.name} ({item.dosage}) - {item.description}</li>
                    ))}
                </ul>
            ) : <p className="text-sm text-muted-foreground">{tMedical.noCurrentMedications}</p>}
            
            <h4 className="font-medium pt-2">{tMedical.uploadedDocuments}</h4>
            <div className="flex flex-wrap gap-4">
                {medicalHistory.documents.reports && <div className="flex items-center gap-2 text-sm"><FileIcon className="h-4 w-4" /> {tMedical.report}: {medicalHistory.documents.reports.name}</div>}
                {medicalHistory.documents.prescriptions && <div className="flex items-center gap-2 text-sm"><FileIcon className="h-4 w-4" /> {tMedical.prescription}: {medicalHistory.documents.prescriptions.name}</div>}
                {medicalHistory.documents.photos && <div className="flex items-center gap-2 text-sm"><FileIcon className="h-4 w-4" /> {tMedical.photo}: {medicalHistory.documents.photos.name}</div>}
                {!medicalHistory.documents.reports && !medicalHistory.documents.prescriptions && !medicalHistory.documents.photos && (
                    <p className="text-sm text-muted-foreground">{tMedical.noDocuments}</p>
                )}
            </div>
        </Section>
        
        {/* Placeholder for other sections */}
        <Separator />
         <div className="text-center text-muted-foreground text-sm">
            <p>{t.placeholder}</p>
        </div>

      </CardContent>
    </Card>
  );
}
