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
import { User, File as FileIcon, Stethoscope, Briefcase, Users, CalendarDays, Handshake, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';


type HealthReportProps = {
  data: HealthData;
  t: any;
};

const ReportItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4 py-1.5">
        <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
        <dd className="text-sm col-span-2">{value || 'N/A'}</dd>
    </div>
);

const Section = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: React.ElementType }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
        </h3>
        <div className="space-y-3">{children}</div>
    </div>
);


export function HealthReport({ data, t }: HealthReportProps) {
  const { patientInfo, medicalHistory, lifestyleAssessment } = data;
  const { patientInfo: tPatient, medicalHistory: tMedical, lifestyle: tLifestyle } = t;

  const renderDocument = (doc: string | null, label: string) => {
    if (!doc) return null;

    if (doc.startsWith('data:image')) {
      return (
        <div className="flex flex-col items-start gap-2">
          <p className="flex items-center gap-2 font-medium"><ImageIcon className="h-4 w-4" /> {label}:</p>
          <Image src={doc} alt={label} width={200} height={200} className="rounded-md border object-contain" data-ai-hint="medical document" />
        </div>
      );
    }
    
    // Placeholder for other file types like PDF
    return (
       <div className="flex items-center gap-2"><FileIcon className="h-4 w-4" /> {label}: Document uploaded</div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">{t.title}</CardTitle>
        <CardDescription>{t.generatedOn} {new Date().toLocaleDateString()}</CardDescription>
        <Separator className="my-4"/>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <Section title={tPatient.title} icon={User}>
            <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32 border">
                        <AvatarImage src={patientInfo.avatar} alt={patientInfo.name} />
                        <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
                    </Avatar>
                     <p className="text-sm text-muted-foreground text-center">ID: <span className="font-mono">{patientInfo.uniqueId}</span></p>
                </div>
                <dl className="space-y-1 flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <ReportItem label={tPatient.fullName} value={patientInfo.name} />
                    <ReportItem label={tPatient.age} value={patientInfo.age} />
                    <ReportItem label={tPatient.gender} value={patientInfo.gender} />
                    <ReportItem label={tPatient.dob} value={patientInfo.dob} />
                    <ReportItem label={tPatient.email} value={patientInfo.email} />
                    <ReportItem label={tPatient.phone} value={patientInfo.phone} />
                    <ReportItem label={tPatient.height} value={`${patientInfo.height} cm`} />
                    <ReportItem label={tPatient.weight} value={`${patientInfo.weight} kg`} />
                    <ReportItem label={tPatient.occupation} value={patientInfo.occupation} />
                    <ReportItem label={tPatient.maritalStatus.label} value={patientInfo.maritalStatus} />
                    <ReportItem label={tPatient.dateOfVisit} value={patientInfo.dateOfVisit} />
                    <ReportItem label={tPatient.referredBy} value={patientInfo.referredBy} />
                    <div className="md:col-span-2">
                        <ReportItem label={tPatient.address.label} value={`${patientInfo.address.line1}, ${patientInfo.address.line2 || ''}, ${patientInfo.address.city}, ${patientInfo.address.district}, ${patientInfo.address.state}, ${patientInfo.address.postalCode}`} />
                    </div>
                </dl>
            </div>
        </Section>
        
        <Separator />

        <Section title={tMedical.title} icon={Stethoscope}>
            <div className="space-y-6">
                <div>
                    <h4 className="font-medium text-lg">{tMedical.chiefComplaints.title}</h4>
                    {medicalHistory.chiefComplaints.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                            {medicalHistory.chiefComplaints.map(item => (
                                <li key={item.id}><strong>{item.complaint}</strong> ({tMedical.chiefComplaints.duration}: {item.duration}, {tMedical.chiefComplaints.order}: {item.order})</li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground">{tMedical.chiefComplaints.noComplaints}</p>}
                </div>

                <div>
                    <h4 className="font-medium text-lg">{tMedical.presentIllness.title}</h4>
                    <dl className="mt-2 space-y-1 text-sm grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <ReportItem label={tMedical.presentIllness.symptomsLabel} value={medicalHistory.historyOfPresentIllness.symptoms} />
                        <ReportItem label={tMedical.presentIllness.onset.label} value={medicalHistory.historyOfPresentIllness.onset} />
                        <ReportItem label={tMedical.presentIllness.duration.label} value={medicalHistory.historyOfPresentIllness.duration} />
                        <ReportItem label={tMedical.presentIllness.progression.label} value={medicalHistory.historyOfPresentIllness.progression} />
                        <ReportItem label={tMedical.presentIllness.frequencyTiming} value={medicalHistory.historyOfPresentIllness.frequencyTiming} />
                        <ReportItem label={tMedical.presentIllness.location} value={medicalHistory.historyOfPresentIllness.location} />
                        <ReportItem label={tMedical.presentIllness.radiation} value={medicalHistory.historyOfPresentIllness.radiation} />
                        <ReportItem label={tMedical.presentIllness.character} value={medicalHistory.historyOfPresentIllness.character} />
                        <ReportItem label={tMedical.presentIllness.severityLabel} value={medicalHistory.historyOfPresentIllness.severity} />
                        <ReportItem label={tMedical.presentIllness.associatedSymptoms} value={medicalHistory.historyOfPresentIllness.associatedSymptoms} />
                        <ReportItem label={tMedical.presentIllness.aggravatingFactors} value={medicalHistory.historyOfPresentIllness.aggravatingFactors} />
                        <ReportItem label={tMedical.presentIllness.relievingFactors} value={medicalHistory.historyOfPresentIllness.relievingFactors} />
                        <ReportItem label={tMedical.presentIllness.previousEpisodes} value={medicalHistory.historyOfPresentIllness.previousEpisodes} />
                    </dl>
                </div>

                <div>
                    <h4 className="font-medium text-lg">{tMedical.pastHistory.title}</h4>
                    <dl className="mt-2 space-y-1 text-sm">
                        <ReportItem label={tMedical.pastHistory.hospitalizations.title} value={medicalHistory.pastHistory.conditions.map(c => `${c.condition} (${c.date})`).join(', ') || 'N/A'} />
                        <ReportItem label={tMedical.pastHistory.trauma} value={medicalHistory.pastHistory.trauma} />
                        <ReportItem label={tMedical.pastHistory.bloodTransfusions} value={medicalHistory.pastHistory.bloodTransfusions} />
                        <ReportItem label={tMedical.pastHistory.allergies} value={medicalHistory.pastHistory.allergies} />
                        <ReportItem label={tMedical.pastHistory.immunizations} value={medicalHistory.pastHistory.immunizations} />
                    </dl>
                </div>

                 <div>
                    <h4 className="font-medium text-lg">{tMedical.medications.title}</h4>
                    <dl className="mt-2 space-y-1 text-sm">
                        <ReportItem label={tMedical.medications.prescribed.title} value={medicalHistory.medications.prescribed.map(m => `${m.name} - ${m.dosage}`).join(', ') || 'N/A'} />
                        <ReportItem label={tMedical.medications.supplements} value={medicalHistory.medications.supplements} />
                        <ReportItem label={tMedical.medications.compliance.label} value={medicalHistory.medications.compliance} />
                        <ReportItem label={tMedical.medications.recentChanges} value={medicalHistory.medications.recentChanges} />
                    </dl>
                </div>

                 <div>
                    <h4 className="font-medium text-lg">{tMedical.familyHistory.title}</h4>
                     <dl className="mt-2 space-y-1 text-sm">
                        <ReportItem label={tMedical.familyHistory.conditions.title} value={medicalHistory.familyHistory.conditions.join(', ') || 'N/A'} />
                        <ReportItem label={tMedical.familyHistory.healthStatus} value={medicalHistory.familyHistory.familyHealthStatus} />
                        <ReportItem label={tMedical.familyHistory.consanguinity.label} value={medicalHistory.familyHistory.consanguinity} />
                    </dl>
                </div>

                <div>
                    <h4 className="font-medium text-lg">{tMedical.documents.title}</h4>
                    <div className="flex flex-wrap gap-8 text-sm mt-2">
                        {renderDocument(medicalHistory.documents.reports, tMedical.documents.reports)}
                        {renderDocument(medicalHistory.documents.prescriptions, tMedical.documents.prescriptions)}
                        {renderDocument(medicalHistory.documents.photos, tMedical.documents.photos)}
                        
                        {!medicalHistory.documents.reports && !medicalHistory.documents.prescriptions && !medicalHistory.documents.photos && (
                            <p className="text-sm text-muted-foreground">{tMedical.documents.noDocuments}</p>
                        )}
                    </div>
                </div>
            </div>
        </Section>
        
        <Separator />
         <div className="text-center text-muted-foreground text-sm">
            <p>{t.placeholder}</p>
        </div>

      </CardContent>
    </Card>
  );
}
