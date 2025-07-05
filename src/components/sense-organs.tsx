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
import { InteractiveDentalChart } from './interactive-dental-chart';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Eye,
  Ear,
  Wind,
  Mic,
  Heart,
  BrainCircuit,
  Bone,
  Shield,
  Fingerprint,
} from 'lucide-react';

const dentalConditions = [
  'Tooth Decay',
  'Gum Disease',
  'Tooth Sensitivity',
  'Tooth Abscess',
  'Orthodontic Issues',
  'Teeth Grinding',
  'Tooth Fracture',
  'Missing Teeth',
];

const organSystems = [
  {
    name: 'Eyes',
    icon: Eye,
    conditions: [
      'Myopia',
      'Hyperopia',
      'Astigmatism',
      'Cataract',
      'Glaucoma',
      'Dry Eyes',
    ],
  },
  {
    name: 'Nose/Sinuses',
    icon: Wind,
    conditions: [
      'Sinusitis',
      'Allergic Rhinitis',
      'Deviated Septum',
      'Nasal Polyps',
      'Loss of Smell',
    ],
  },
  {
    name: 'Throat',
    icon: Mic,
    conditions: ['Sore throat', 'Laryngitis', 'Tonsillitis'],
  },
  {
    name: 'Skin',
    icon: Fingerprint,
    conditions: ['Acne', 'Eczema', 'Psoriasis', 'Dermatitis'],
  },
  {
    name: 'Cardiovascular',
    icon: Heart,
    conditions: ['Chest Pain', 'Palpitations', 'Shortness of Breath'],
  },
  {
    name: 'Neurological',
    icon: BrainCircuit,
    conditions: ['Headaches', 'Dizziness', 'Numbness', 'Memory Issues'],
  },
  {
    name: 'Musculoskeletal',
    icon: Bone,
    conditions: ['Joint Pain', 'Back Pain', 'Muscle Weakness'],
  },
  {
    name: 'Endocrine',
    icon: Shield,
    conditions: ['Thyroid Issues', 'Fatigue', 'Weight Changes'],
  },
];

export function SenseOrgans() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sense Organ & System Assessment</CardTitle>
        <CardDescription>
          Comprehensive sensory system evaluation with interactive tools.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dental">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dental">Dental</TabsTrigger>
            <TabsTrigger value="other-systems">Other Systems</TabsTrigger>
          </TabsList>

          <TabsContent value="dental" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Dental Diagram</CardTitle>
                <CardDescription>
                  Select teeth and specify conditions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <InteractiveDentalChart />
                </div>
                <div>
                  <Label>Dental Conditions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {dentalConditions.map((condition) => (
                      <div key={condition} className="flex items-center gap-2">
                        <Checkbox id={`dental-${condition}`} />
                        <Label htmlFor={`dental-${condition}`}>{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other-systems" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Organ & System Review</CardTitle>
                <CardDescription>
                  Note any issues with the following systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {organSystems.map((system) => (
                    <AccordionItem value={system.name} key={system.name}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <system.icon className="h-5 w-5" />
                          {system.name}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                          {system.conditions.map((condition) => (
                            <div
                              key={condition}
                              className="flex items-center gap-2"
                            >
                              <Checkbox id={`${system.name}-${condition}`} />
                              <Label htmlFor={`${system.name}-${condition}`}>
                                {condition}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
