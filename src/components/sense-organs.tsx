
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
  Upload,
} from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';

const dentalConditions = [
  'Tooth Decay',
  'Gum Disease',
  'Tooth Sensitivity',
  'Tooth Abscess',
  'Orthodontic Issues',
  'Teeth Grinding',
  'Tooth Fracture',
  'Missing Teeth',
  'Jaw Pain (TMJ)',
  'Bad Breath (Halitosis)',
  'Mouth Sores',
  'Discolored Teeth'
];

const organSystems = [
  {
    name: 'Eyes',
    icon: Eye,
    conditions: [
      'Myopia (Nearsighted)',
      'Hyperopia (Farsighted)',
      'Astigmatism',
      'Presbyopia (Age-related)',
      'Cataracts',
      'Glaucoma',
      'Dry Eyes',
      'Watery Eyes',
      'Floaters or Flashes',
      'Redness or Itching',
      'Double Vision',
      'Stye or Chalazion',
    ],
  },
   {
    name: 'Ears',
    icon: Ear,
    conditions: [
        'Hearing Loss',
        'Tinnitus (Ringing)',
        'Earache or Pain',
        'Dizziness or Vertigo',
        'Ear Discharge',
        'Blocked Ears'
    ]
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
      'Nosebleeds',
      'Congestion'
    ],
  },
  {
    name: 'Throat',
    icon: Mic,
    conditions: ['Sore throat', 'Laryngitis', 'Tonsillitis', 'Difficulty Swallowing', 'Hoarseness'],
  },
  {
    name: 'Skin',
    icon: Fingerprint,
    conditions: ['Acne', 'Eczema', 'Psoriasis', 'Dermatitis', 'Rash or Hives', 'Moles or Skin Growths', 'Dryness or Itching'],
  },
  {
    name: 'Cardiovascular',
    icon: Heart,
    conditions: ['Chest Pain', 'Palpitations', 'Shortness of Breath', 'Swelling in Legs', 'High Blood Pressure', 'Dizziness'],
  },
  {
    name: 'Neurological',
    icon: BrainCircuit,
    conditions: ['Headaches/Migraines', 'Dizziness/Vertigo', 'Numbness or Tingling', 'Memory Issues', 'Seizures', 'Tremors'],
  },
  {
    name: 'Musculoskeletal',
    icon: Bone,
    conditions: ['Joint Pain/Stiffness', 'Back Pain', 'Neck Pain', 'Muscle Weakness', 'Sprains or Strains', 'Limited Range of Motion'],
  },
  {
    name: 'Endocrine',
    icon: Shield,
    conditions: ['Thyroid Issues', 'Excessive Fatigue', 'Unexplained Weight Changes', 'Excessive Thirst/Urination', 'Temperature Intolerance'],
  },
];


const PhotoAndNotes = ({ section }: { section: string }) => (
    <div className="mt-4 space-y-4 rounded-lg border bg-muted/20 p-4">
        <h4 className="font-semibold text-muted-foreground text-sm">Additional Details for {section}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`notes-${section}`}>Problem Details</Label>
                <Textarea id={`notes-${section}`} placeholder={`Describe the problem in detail...`} rows={3}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`photo-${section}`}>Upload Related Photo</Label>
                <Input id={`photo-${section}`} type="file" />
            </div>
        </div>
    </div>
);


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
                <div className="rounded-lg border p-4 flex justify-center">
                  <InteractiveDentalChart />
                </div>
                <div>
                  <Label className="font-semibold">Dental Conditions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {dentalConditions.map((condition) => (
                      <div key={condition} className="flex items-center gap-2">
                        <Checkbox id={`dental-${condition}`} />
                        <Label htmlFor={`dental-${condition}`} className="font-normal">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                 <PhotoAndNotes section="Dental" />
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
                              <Label htmlFor={`${system.name}-${condition}`} className="font-normal">
                                {condition}
                              </Label>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 pb-4">
                           <PhotoAndNotes section={system.name} />
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
