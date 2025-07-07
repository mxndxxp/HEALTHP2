'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { PlusCircle, Trash2, Upload } from 'lucide-react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { ChangeEvent } from 'react';
import type { HealthData, MedicalHistoryInfo, PastCondition, CurrentMedication, ChiefComplaint } from '@/lib/types';


const familyHistoryConditions = [
  'Diabetes Type 1/2',
  'Hypertension',
  'Heart Disease',
  'Cancer',
  'Neurological conditions',
  'Autoimmune diseases',
  'Mental health conditions',
];

type MedicalHistoryProps = {
  data: HealthData;
  setData: (data: HealthData) => void;
  t: any;
};

export function MedicalHistory({ data, setData, t }: MedicalHistoryProps) {
  const medicalData = data.medicalHistory;

  const handleUpdate = (path: (string | number)[], value: any) => {
    const newData = { ...data };
    let current: any = newData.medicalHistory;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setData(newData);
  };

  // Helper functions for dynamic lists
  const handleAddItem = (listPath: (string | number)[], newItem: any) => {
    const list = getNestedValue(medicalData, listPath);
    handleUpdate(listPath, [...list, newItem]);
  };
  
  const handleRemoveItem = (listPath: (string | number)[], index: number) => {
    const list = getNestedValue(medicalData, listPath);
    handleUpdate(listPath, list.filter((_: any, i: number) => i !== index));
  };
  
  const handleItemChange = (listPath: (string | number)[], index: number, field: string, value: any) => {
    const item = getNestedValue(medicalData, [...listPath, index]);
    handleUpdate([...listPath, index], { ...item, [field]: value });
  };
  
  const getNestedValue = (obj: any, path: (string | number)[]) => {
    return path.reduce((acc, part) => acc && acc[part], obj);
  };
  
  // Specific handlers
  const handleAddChiefComplaint = () => {
    const newComplaint: ChiefComplaint = { id: Date.now(), complaint: '', duration: '', order: '' };
    handleAddItem(['chiefComplaints'], newComplaint);
  };
  
  const handleAddPastCondition = () => {
      const newCondition: PastCondition = { id: Date.now(), condition: '', date: '', cured: false };
      handleAddItem(['pastHistory', 'conditions'], newCondition);
  };

  const handleAddMedication = () => {
      const newMedication: CurrentMedication = { id: Date.now(), name: '', dosage: '', description: '' };
      handleAddItem(['medications', 'prescribed'], newMedication);
  }

  const handleFamilyConditionToggle = (condition: string, checked: boolean) => {
    const currentConditions = medicalData.familyHistory.conditions;
    const newConditions = checked
      ? [...currentConditions, condition]
      : currentConditions.filter(c => c !== condition);
    handleUpdate(['familyHistory', 'conditions'], newConditions);
  };

  const handleFileUpload = (field: keyof MedicalHistoryInfo['documents'], event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        handleUpdate(['documents', field], file);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chief-complaints">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.keys(t.tabs).map(key => <TabsTrigger key={key} value={key}>{t.tabs[key]}</TabsTrigger>)}
          </TabsList>
          
          <TabsContent value="chief-complaints" className="mt-4">
             <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.chiefComplaints.title}</CardTitle>
                  <CardDescription>{t.chiefComplaints.description}</CardDescription>
                </div>
                <Button onClick={handleAddChiefComplaint}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {t.chiefComplaints.addButton}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalData.chiefComplaints.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <Input placeholder={t.chiefComplaints.complaintPlaceholder} value={item.complaint} onChange={(e) => handleItemChange(['chiefComplaints'], index, 'complaint', e.target.value)} />
                        <Input placeholder={t.chiefComplaints.durationPlaceholder} value={item.duration} onChange={(e) => handleItemChange(['chiefComplaints'], index, 'duration', e.target.value)} />
                        <div className="flex items-center justify-between">
                            <Input placeholder={t.chiefComplaints.orderPlaceholder} value={item.order} onChange={(e) => handleItemChange(['chiefComplaints'], index, 'order', e.target.value)} />
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(['chiefComplaints'], index)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="present-illness" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.presentIllness.title}</CardTitle>
                <CardDescription>{t.presentIllness.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">{t.presentIllness.symptomsLabel}</Label>
                  <Textarea id="symptoms" placeholder={t.presentIllness.symptomsPlaceholder} value={medicalData.historyOfPresentIllness.symptoms} onChange={(e) => handleUpdate(['historyOfPresentIllness', 'symptoms'], e.target.value)} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>{t.presentIllness.onset.label}</Label>
                        <Select value={medicalData.historyOfPresentIllness.onset} onValueChange={value => handleUpdate(['historyOfPresentIllness', 'onset'], value)}><SelectTrigger><SelectValue placeholder={t.presentIllness.onset.placeholder} /></SelectTrigger><SelectContent><SelectItem value="sudden">{t.presentIllness.onset.sudden}</SelectItem><SelectItem value="gradual">{t.presentIllness.onset.gradual}</SelectItem></SelectContent></Select>
                    </div>
                     <div className="space-y-2">
                        <Label>{t.presentIllness.duration.label}</Label>
                        <Select value={medicalData.historyOfPresentIllness.duration} onValueChange={value => handleUpdate(['historyOfPresentIllness', 'duration'], value)}><SelectTrigger><SelectValue placeholder={t.presentIllness.duration.placeholder} /></SelectTrigger><SelectContent><SelectItem value="continuous">{t.presentIllness.duration.continuous}</SelectItem><SelectItem value="intermittent">{t.presentIllness.duration.intermittent}</SelectItem></SelectContent></Select>
                    </div>
                     <div className="space-y-2">
                        <Label>{t.presentIllness.progression.label}</Label>
                        <Select value={medicalData.historyOfPresentIllness.progression} onValueChange={value => handleUpdate(['historyOfPresentIllness', 'progression'], value)}><SelectTrigger><SelectValue placeholder={t.presentIllness.progression.placeholder} /></SelectTrigger><SelectContent><SelectItem value="improving">{t.presentIllness.progression.improving}</SelectItem><SelectItem value="worsening">{t.presentIllness.progression.worsening}</SelectItem><SelectItem value="static">{t.presentIllness.progression.static}</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.presentIllness.severityLabel}</Label>
                        <Slider value={[medicalData.historyOfPresentIllness.severity]} onValueChange={(value) => handleUpdate(['historyOfPresentIllness', 'severity'], value[0])} max={10} step={1} />
                        <div className="text-center text-sm text-muted-foreground">{medicalData.historyOfPresentIllness.severity}</div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label htmlFor="frequency">{t.presentIllness.frequencyTiming}</Label><Input id="frequency" placeholder={t.presentIllness.frequencyTimingPlaceholder} value={medicalData.historyOfPresentIllness.frequencyTiming} onChange={e => handleUpdate(['historyOfPresentIllness', 'frequencyTiming'], e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="location">{t.presentIllness.location}</Label><Input id="location" placeholder={t.presentIllness.locationPlaceholder} value={medicalData.historyOfPresentIllness.location} onChange={e => handleUpdate(['historyOfPresentIllness', 'location'], e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="radiation">{t.presentIllness.radiation}</Label><Input id="radiation" placeholder={t.presentIllness.radiationPlaceholder} value={medicalData.historyOfPresentIllness.radiation} onChange={e => handleUpdate(['historyOfPresentIllness', 'radiation'], e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="character">{t.presentIllness.character}</Label><Textarea id="character" placeholder={t.presentIllness.characterPlaceholder} value={medicalData.historyOfPresentIllness.character} onChange={e => handleUpdate(['historyOfPresentIllness', 'character'], e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="associated-symptoms">{t.presentIllness.associatedSymptoms}</Label><Textarea id="associated-symptoms" placeholder={t.presentIllness.associatedSymptomsPlaceholder} value={medicalData.historyOfPresentIllness.associatedSymptoms} onChange={e => handleUpdate(['historyOfPresentIllness', 'associatedSymptoms'], e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="aggravating-factors">{t.presentIllness.aggravatingFactors}</Label><Textarea id="aggravating-factors" placeholder={t.presentIllness.aggravatingFactorsPlaceholder} value={medicalData.historyOfPresentIllness.aggravatingFactors} onChange={e => handleUpdate(['historyOfPresentIllness', 'aggravatingFactors'], e.target.value)} /></div>
                    <div className="space-y-2"><Label htmlFor="relieving-factors">{t.presentIllness.relievingFactors}</Label><Textarea id="relieving-factors" placeholder={t.presentIllness.relievingFactorsPlaceholder} value={medicalData.historyOfPresentIllness.relievingFactors} onChange={e => handleUpdate(['historyOfPresentIllness', 'relievingFactors'], e.target.value)} /></div>
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="previous-episodes">{t.presentIllness.previousEpisodes}</Label><Textarea id="previous-episodes" placeholder={t.presentIllness.previousEpisodesPlaceholder} value={medicalData.historyOfPresentIllness.previousEpisodes} onChange={e => handleUpdate(['historyOfPresentIllness', 'previousEpisodes'], e.target.value)} /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="past-history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.pastHistory.title}</CardTitle>
                <CardDescription>{t.pastHistory.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">{t.pastHistory.hospitalizations.title}</Label>
                    <Button onClick={handleAddPastCondition}><PlusCircle className="mr-2 h-4 w-4" /> {t.pastHistory.hospitalizations.addButton}</Button>
                  </div>
                  <div className="space-y-4">
                    {medicalData.pastHistory.conditions.map((item, index) => (
                      <Card key={item.id}><CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <Input placeholder={t.pastHistory.hospitalizations.conditionPlaceholder} value={item.condition} onChange={(e) => handleItemChange(['pastHistory', 'conditions'], index, 'condition', e.target.value)} />
                          <Input type="date" value={item.date} onChange={(e) => handleItemChange(['pastHistory', 'conditions'], index, 'date', e.target.value)} />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Checkbox id={`cured-${item.id}`} checked={item.cured} onCheckedChange={(checked) => handleItemChange(['pastHistory', 'conditions'], index, 'cured', !!checked)} /><Label htmlFor={`cured-${item.id}`}>{t.pastHistory.hospitalizations.resolved}</Label></div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(['pastHistory', 'conditions'], index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                          </div>
                      </CardContent></Card>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div className="space-y-2"><Label htmlFor="trauma">{t.pastHistory.trauma}</Label><Textarea id="trauma" placeholder={t.pastHistory.traumaPlaceholder} value={medicalData.pastHistory.trauma} onChange={e => handleUpdate(['pastHistory', 'trauma'], e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="transfusions">{t.pastHistory.bloodTransfusions}</Label><Textarea id="transfusions" placeholder={t.pastHistory.bloodTransfusionsPlaceholder} value={medicalData.pastHistory.bloodTransfusions} onChange={e => handleUpdate(['pastHistory', 'bloodTransfusions'], e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="allergies">{t.pastHistory.allergies}</Label><Textarea id="allergies" placeholder={t.pastHistory.allergiesPlaceholder} value={medicalData.pastHistory.allergies} onChange={e => handleUpdate(['pastHistory', 'allergies'], e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="immunizations">{t.pastHistory.immunizations}</Label><Textarea id="immunizations" placeholder={t.pastHistory.immunizationsPlaceholder} value={medicalData.pastHistory.immunizations} onChange={e => handleUpdate(['pastHistory', 'immunizations'], e.target.value)} /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="mt-4">
            <Card>
              <CardHeader>
                 <CardTitle>{t.medications.title}</CardTitle>
                 <CardDescription>{t.medications.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">{t.medications.prescribed.title}</Label>
                    <Button onClick={handleAddMedication}><PlusCircle className="mr-2 h-4 w-4" /> {t.medications.prescribed.addButton}</Button>
                  </div>
                  <div className="space-y-4">
                    {medicalData.medications.prescribed.map((med, index) => (
                      <Card key={med.id}><CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input placeholder={t.medications.prescribed.namePlaceholder} value={med.name} onChange={(e) => handleItemChange(['medications', 'prescribed'], index, 'name', e.target.value)}/>
                          <Input placeholder={t.medications.prescribed.dosagePlaceholder} value={med.dosage} onChange={(e) => handleItemChange(['medications', 'prescribed'], index, 'dosage', e.target.value)}/>
                          <Textarea placeholder={t.medications.prescribed.descriptionPlaceholder} className="md:col-span-2" value={med.description} onChange={(e) => handleItemChange(['medications', 'prescribed'], index, 'description', e.target.value)}/>
                          <div className="md:col-span-2 flex justify-end">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(['medications', 'prescribed'], index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                          </div>
                      </CardContent></Card>
                    ))}
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-2 md:col-span-2"><Label htmlFor="supplements">{t.medications.supplements}</Label><Textarea id="supplements" placeholder={t.medications.supplementsPlaceholder} value={medicalData.medications.supplements} onChange={e => handleUpdate(['medications', 'supplements'], e.target.value)} /></div>
                    <div className="space-y-2"><Label>{t.medications.compliance.label}</Label><Select value={medicalData.medications.compliance} onValueChange={value => handleUpdate(['medications', 'compliance'], value)}><SelectTrigger><SelectValue placeholder={t.medications.compliance.placeholder} /></SelectTrigger><SelectContent><SelectItem value="good">{t.medications.compliance.good}</SelectItem><SelectItem value="fair">{t.medications.compliance.fair}</SelectItem><SelectItem value="poor">{t.medications.compliance.poor}</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label htmlFor="med-changes">{t.medications.recentChanges}</Label><Textarea id="med-changes" placeholder={t.medications.recentChangesPlaceholder} value={medicalData.medications.recentChanges} onChange={e => handleUpdate(['medications', 'recentChanges'], e.target.value)} /></div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
          
           <TabsContent value="family-history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.familyHistory.title}</CardTitle>
                <CardDescription>{t.familyHistory.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                    <Label className="font-semibold">{t.familyHistory.conditions.title}</Label>
                    <div className="mt-2 p-4 border rounded-md grid grid-cols-1 gap-4 md:grid-cols-2">
                      {familyHistoryConditions.map((condition) => (
                        <div key={condition} className="flex items-center gap-2">
                          <Checkbox id={`fh-${condition}`} checked={medicalData.familyHistory.conditions.includes(condition)} onCheckedChange={(checked) => handleFamilyConditionToggle(condition, !!checked)} />
                          <Label htmlFor={`fh-${condition}`} className="font-normal">{condition}</Label>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="space-y-2"><Label htmlFor="family-health-status">{t.familyHistory.healthStatus}</Label><Textarea id="family-health-status" placeholder={t.familyHistory.healthStatusPlaceholder} value={medicalData.familyHistory.familyHealthStatus} onChange={e => handleUpdate(['familyHistory', 'familyHealthStatus'], e.target.value)} /></div>
                 <div className="space-y-2"><Label>{t.familyHistory.consanguinity.label}</Label><Select value={medicalData.familyHistory.consanguinity} onValueChange={value => handleUpdate(['familyHistory', 'consanguinity'], value)}><SelectTrigger><SelectValue placeholder={t.familyHistory.consanguinity.placeholder} /></SelectTrigger><SelectContent><SelectItem value="yes">{t.familyHistory.consanguinity.yes}</SelectItem><SelectItem value="no">{t.familyHistory.consanguinity.no}</SelectItem><SelectItem value="unknown">{t.familyHistory.consanguinity.unknown}</SelectItem></SelectContent></Select></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.documents.title}</CardTitle>
                <CardDescription>{t.documents.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">{t.documents.reports}</p>
                  <p className="text-xs text-muted-foreground">
                    {medicalData.documents.reports ? medicalData.documents.reports.name : t.documents.reportsDesc}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Label htmlFor="reports-upload">{t.documents.uploadButton}</Label>
                  </Button>
                  <Input id="reports-upload" type="file" className="hidden" onChange={(e) => handleFileUpload('reports', e)} accept="application/pdf" />
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">{t.documents.prescriptions}</p>
                   <p className="text-xs text-muted-foreground">
                    {medicalData.documents.prescriptions ? medicalData.documents.prescriptions.name : t.documents.prescriptionsDesc}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Label htmlFor="prescriptions-upload">{t.documents.uploadButton}</Label>
                  </Button>
                   <Input id="prescriptions-upload" type="file" className="hidden" onChange={(e) => handleFileUpload('prescriptions', e)} accept="application/pdf,image/*" />
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">{t.documents.photos}</p>
                  <p className="text-xs text-muted-foreground">
                    {medicalData.documents.photos ? medicalData.documents.photos.name : t.documents.photosDesc}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Label htmlFor="photos-upload">{t.documents.uploadButton}</Label>
                  </Button>
                   <Input id="photos-upload" type="file" className="hidden" onChange={(e) => handleFileUpload('photos', e)} accept="image/*"/>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
