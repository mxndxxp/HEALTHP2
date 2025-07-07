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


export function HealthReport({ data }: HealthReportProps) {
  const { patientInfo, medicalHistory } = data;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Comprehensive Health Report</CardTitle>
        <CardDescription>Generated on: {new Date().toLocaleDateString()}</CardDescription>
        <Separator className="my-4"/>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Patient Information */}
        <Section title="Patient Information">
            <div className="flex items-start gap-8">
                <Avatar className="h-32 w-32 border">
                    <AvatarImage src={patientInfo.avatar} alt={patientInfo.name} />
                    <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                </Avatar>
                <dl className="space-y-3 flex-1">
                    <ReportItem label="Full Name" value={patientInfo.name} />
                    <ReportItem label="Unique ID" value={<span className="font-mono">{patientInfo.uniqueId}</span>} />
                    <ReportItem label="Age" value={patientInfo.age} />
                    <ReportItem label="Gender" value={patientInfo.gender} />
                    <ReportItem label="Email" value={patientInfo.email} />
                    <ReportItem label="Phone" value={patientInfo.phone} />
                    <ReportItem label="Height" value={`${patientInfo.height} cm`} />
                    <ReportItem label="Weight" value={`${patientInfo.weight} kg`} />
                    <ReportItem label="Address" value={`${patientInfo.address.line1}, ${patientInfo.address.line2}, ${patientInfo.address.city}, ${patientInfo.address.district}, ${patientInfo.address.state}, ${patientInfo.address.postalCode}`} />
                </dl>
            </div>
        </Section>
        
        <Separator />

        {/* Medical History */}
        <Section title="Medical History">
            <h4 className="font-medium">Past Conditions</h4>
            {medicalHistory.pastHistory.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    {medicalHistory.pastHistory.map(item => (
                        <li key={item.id}>{item.condition} (Diagnosed: {item.date}) - {item.cured ? 'Resolved' : 'Ongoing'}</li>
                    ))}
                </ul>
            ) : <p className="text-sm text-muted-foreground">No past conditions reported.</p>}

            <h4 className="font-medium pt-2">Current Medications</h4>
            {medicalHistory.medications.length > 0 ? (
                 <ul className="list-disc pl-5 space-y-1 text-sm">
                    {medicalHistory.medications.map(item => (
                        <li key={item.id}>{item.name} ({item.dosage}) - {item.description}</li>
                    ))}
                </ul>
            ) : <p className="text-sm text-muted-foreground">No current medications reported.</p>}
            
            <h4 className="font-medium pt-2">Uploaded Documents</h4>
            <div className="flex flex-wrap gap-4">
                {medicalHistory.documents.reports && <div className="flex items-center gap-2 text-sm"><FileIcon className="h-4 w-4" /> Report: {medicalHistory.documents.reports.name}</div>}
                {medicalHistory.documents.prescriptions && <div className="flex items-center gap-2 text-sm"><FileIcon className="h-4 w-4" /> Prescription: {medicalHistory.documents.prescriptions.name}</div>}
                {medicalHistory.documents.photos && <div className="flex items-center gap-2 text-sm"><FileIcon className="h-4 w-4" /> Photo: {medicalHistory.documents.photos.name}</div>}
                {!medicalHistory.documents.reports && !medicalHistory.documents.prescriptions && !medicalHistory.documents.photos && (
                    <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                )}
            </div>
        </Section>
        
        {/* Placeholder for other sections */}
        <Separator />
         <div className="text-center text-muted-foreground text-sm">
            <p>Lifestyle Assessment, Sense Organs, and other data will be displayed here.</p>
        </div>

      </CardContent>
    </Card>
  );
}
