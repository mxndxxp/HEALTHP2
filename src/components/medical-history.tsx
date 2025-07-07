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
import type { ChangeEvent } from 'react';
import type { HealthData, MedicalHistoryInfo, PastCondition, CurrentMedication } from '@/lib/types';

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

  const handleStateChange = (field: keyof MedicalHistoryInfo, value: any) => {
    const newData = { ...data };
    (newData.medicalHistory as any)[field] = value;
    setData(newData);
  };
  
  const handleNestedStateChange = (section: keyof MedicalHistoryInfo, field: string, value: any) => {
    const newData = { ...data };
    (newData.medicalHistory as any)[section][field] = value;
    setData(newData);
  };
  
  const handleItemChange = (list: keyof MedicalHistoryInfo, index: number, field: string, value: any) => {
    const newData = { ...data };
    (newData.medicalHistory[list] as any[])[index][field] = value;
    setData(newData);
  };

  const handleAddItem = (list: keyof MedicalHistoryInfo, newItem: PastCondition | CurrentMedication) => {
    const newData = { ...data };
    (newData.medicalHistory[list] as any[]).push(newItem);
    setData(newData);
  };

  const handleRemoveItem = (list: keyof MedicalHistoryInfo, index: number) => {
    const newData = { ...data };
    (newData.medicalHistory[list] as any[]).splice(index, 1);
    setData(newData);
  };
  
  const handleAddCondition = () => {
      const newCondition: PastCondition = { id: Date.now(), condition: '', date: '', cured: false };
      handleAddItem('pastHistory', newCondition);
  };

  const handleAddMedication = () => {
      const newMedication: CurrentMedication = { id: Date.now(), name: '', dosage: '', description: '' };
      handleAddItem('medications', newMedication);
  }

  const handleFileUpload = (field: keyof MedicalHistoryInfo['documents'], event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const newData = { ...data };
        newData.medicalHistory.documents[field] = file;
        setData(newData);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="family-history">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.keys(t.tabs).map(key => <TabsTrigger key={key} value={key}>{t.tabs[key]}</TabsTrigger>)}
          </TabsList>
          <TabsContent value="family-history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.familyHistory.title}</CardTitle>
                <CardDescription>{t.familyHistory.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder={t.familyHistory.searchPlaceholder} />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {familyHistoryConditions.map((condition) => (
                    <div key={condition} className="flex items-center gap-2">
                      <Checkbox id={`fh-${condition}`} />
                      <Label htmlFor={`fh-${condition}`}>{condition}</Label>
                    </div>
                  ))}
                </div>
                <Input placeholder={t.familyHistory.otherPlaceholder} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past-history" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.pastHistory.title}</CardTitle>
                  <CardDescription>{t.pastHistory.description}</CardDescription>
                </div>
                <Button onClick={handleAddCondition}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {t.pastHistory.addButton}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalData.pastHistory.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <Input placeholder={t.pastHistory.conditionPlaceholder} value={item.condition} onChange={(e) => handleItemChange('pastHistory', index, 'condition', e.target.value)} />
                        <Input type="date" value={item.date} onChange={(e) => handleItemChange('pastHistory', index, 'date', e.target.value)} />
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Checkbox id={`cured-${item.id}`} checked={item.cured} onCheckedChange={(checked) => handleItemChange('pastHistory', index, 'cured', checked)} />
                                <Label htmlFor={`cured-${item.id}`}>{t.pastHistory.resolved}</Label>
                             </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('pastHistory', index)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="current-situation" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.currentSituation.title}</CardTitle>
                <CardDescription>{t.currentSituation.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">{t.currentSituation.symptomsLabel}</Label>
                  <Textarea
                    id="symptoms"
                    placeholder={t.currentSituation.symptomsPlaceholder}
                    value={medicalData.currentSituation.symptoms}
                    onChange={(e) => handleNestedStateChange('currentSituation', 'symptoms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.currentSituation.severityLabel}</Label>
                  <Slider 
                    value={[medicalData.currentSituation.severity]} 
                    onValueChange={(value) => handleNestedStateChange('currentSituation', 'severity', value[0])}
                    max={10} step={1} 
                  />
                   <div className="text-center text-sm text-muted-foreground">{medicalData.currentSituation.severity}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">{t.currentSituation.impactLabel}</Label>
                  <Textarea
                    id="impact"
                    placeholder={t.currentSituation.impactPlaceholder}
                    value={medicalData.currentSituation.impact}
                    onChange={(e) => handleNestedStateChange('currentSituation', 'impact', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="medications" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t.medications.title}</CardTitle>
                  <CardDescription>{t.medications.description}</CardDescription>
                </div>
                <Button onClick={handleAddMedication}>
                  <PlusCircle className="mr-2 h-4 w-4" /> {t.medications.addButton}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalData.medications.map((med, index) => (
                  <Card key={med.id}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder={t.medications.namePlaceholder} value={med.name} onChange={(e) => handleItemChange('medications', index, 'name', e.target.value)}/>
                      <Input placeholder={t.medications.dosagePlaceholder} value={med.dosage} onChange={(e) => handleItemChange('medications', index, 'dosage', e.target.value)}/>
                      <Textarea placeholder={t.medications.descriptionPlaceholder} className="md:col-span-2" value={med.description} onChange={(e) => handleItemChange('medications', index, 'description', e.target.value)}/>
                      <div className="md:col-span-2 flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem('medications', index)}>
                            <Trash2 className="h-4 w-4 text-destructive"/>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
