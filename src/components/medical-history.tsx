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
import { PlusCircle, Upload } from 'lucide-react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';

const familyHistoryConditions = [
  'Diabetes Type 1/2',
  'Hypertension',
  'Heart Disease',
  'Cancer',
  'Neurological conditions',
  'Autoimmune diseases',
  'Mental health conditions',
];

const pastConditions = [
  {
    condition: 'Appendectomy',
    date: '2015-06-20',
    cured: true,
  },
  {
    condition: 'Broken Arm',
    date: '2010-02-14',
    cured: true,
  },
];

const currentMedications = [
  {
    name: 'Lisinopril',
    dosage: '10mg, once daily',
    description: 'For high blood pressure',
  },
  {
    name: 'Metformin',
    dosage: '500mg, twice daily',
    description: 'For type 2 diabetes',
  },
];

export function MedicalHistory() {
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
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Condition
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {pastConditions.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{item.condition}</p>
                        <p className="text-sm text-muted-foreground">
                          Diagnosed: {item.date}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-medium ${
                          item.cured ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {item.cured ? 'Resolved' : 'Ongoing'}
                      </p>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label>Severity (1-10)</Label>
                  <Slider defaultValue={[5]} max={10} step={1} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact on Daily Life</Label>
                  <Textarea
                    id="impact"
                    placeholder="How do these symptoms affect daily activities?"
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
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentMedications.map((med, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="font-semibold">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage}
                      </p>
                      <p className="text-sm mt-1">{med.description}</p>
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
                    PDF up to 10MB
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">Prescriptions</p>
                  <p className="text-xs text-muted-foreground">
                    PDF/Image
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Upload
                  </Button>
                </div>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-semibold">Problem Photos</p>
                  <p className="text-xs text-muted-foreground">
                    JPEG/PNG
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
