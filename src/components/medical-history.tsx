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
};

export function MedicalHistory({ data, setData }: MedicalHistoryProps) {
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
        <CardTitle>Medical History</CardTitle>
        <CardDescription>
          Comprehensive medical background collection with detailed tracking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="family-history">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="family-history">Family History</TabsTrigger>
            <TabsTrigger value="past-history">Past History</TabsTrigger>
            <TabsTrigger value="current-situation">Current Situation</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="family-history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Family History</CardTitle>
                <CardDescription>
                  Select any conditions that run in the patient's family.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Search conditions..." />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {familyHistoryConditions.map((condition) => (
                    <div key={condition} className="flex items-center gap-2">
                      <Checkbox id={`fh-${condition}`} />
                      <Label htmlFor={`fh-${condition}`}>{condition}</Label>
                    </div>
                  ))}
                </div>
                <Input placeholder="Other (please specify)" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past-history" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Past Medical History</CardTitle>
                  <CardDescription>
                    A list of past conditions, surgeries, and treatments.
                  </CardDescription>
                </div>
                <Button onClick={handleAddCondition}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Condition
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalData.pastHistory.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <Input placeholder="Condition Name" value={item.condition} onChange={(e) => handleItemChange('pastHistory', index, 'condition', e.target.value)} />
                        <Input type="date" value={item.date} onChange={(e) => handleItemChange('pastHistory', index, 'date', e.target.value)} />
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Checkbox id={`cured-${item.id}`} checked={item.cured} onCheckedChange={(checked) => handleItemChange('pastHistory', index, 'cured', checked)} />
                                <Label htmlFor={`cured-${item.id}`}>Resolved</Label>
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
                <CardTitle>Current Medical Situation</CardTitle>
                <CardDescription>
                  Track ongoing health issues and complications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe current symptoms..."
                    value={medicalData.currentSituation.symptoms}
                    onChange={(e) => handleNestedStateChange('currentSituation', 'symptoms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Severity (1-10)</Label>
                  <Slider 
                    value={[medicalData.currentSituation.severity]} 
                    onValueChange={(value) => handleNestedStateChange('currentSituation', 'severity', value[0])}
                    max={10} step={1} 
                  />
                   <div className="text-center text-sm text-muted-foreground">{medicalData.currentSituation.severity}</div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact on Daily Life</Label>
                  <Textarea
                    id="impact"
                    placeholder="How do these symptoms affect daily activities?"
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
                  <CardTitle>Current Medications</CardTitle>
                  <CardDescription>
                    Comprehensive medication management and tracking.
                  </CardDescription>
                </div>
                <Button onClick={handleAddMedication}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {medicalData.medications.map((med, index) => (
                  <Card key={med.id}>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Medication Name" value={med.name} onChange={(e) => handleItemChange('medications', index, 'name', e.target.value)}/>
                      <Input placeholder="Dosage (e.g., 10mg, once daily)" value={med.dosage} onChange={(e) => handleItemChange('medications', index, 'dosage', e.target.value)}/>
                      <Textarea placeholder="Description / Reason" className="md:col-span-2" value={med.description} onChange={(e) => handleItemChange('medications', index, 'description', e.target.value)}/>
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
                <CardTitle>Document Management</CardTitle>
                <CardDescription>
                  Centralized medical document storage and organization.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">Medical Reports</p>
                  <p className="text-xs text-muted-foreground">
                    {medicalData.documents.reports ? medicalData.documents.reports.name : 'PDF up to 10MB'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Label htmlFor="reports-upload">Upload</Label>
                  </Button>
                  <Input id="reports-upload" type="file" className="hidden" onChange={(e) => handleFileUpload('reports', e)} accept="application/pdf" />
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">Prescriptions</p>
                   <p className="text-xs text-muted-foreground">
                    {medicalData.documents.prescriptions ? medicalData.documents.prescriptions.name : 'PDF/Image'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Label htmlFor="prescriptions-upload">Upload</Label>
                  </Button>
                   <Input id="prescriptions-upload" type="file" className="hidden" onChange={(e) => handleFileUpload('prescriptions', e)} accept="application/pdf,image/*" />
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">Problem Photos</p>
                  <p className="text-xs text-muted-foreground">
                    {medicalData.documents.photos ? medicalData.documents.photos.name : 'JPEG/PNG'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Label htmlFor="photos-upload">Upload</Label>
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
