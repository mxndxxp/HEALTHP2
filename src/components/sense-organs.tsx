'use client';
import React, { useState } from 'react';
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
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';


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
    sideSpecific: true,
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
    sideSpecific: true,
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
    sideSpecific: true,
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


const PhotoAndNotes = ({ section, t }: { section: string, t: any }) => (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
        <h4 className="font-semibold text-muted-foreground text-sm">{t.title.replace('{section}', section)}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`notes-${section}`}>{t.problemDetails}</Label>
                <Textarea id={`notes-${section}`} placeholder={t.problemPlaceholder} rows={3}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`photo-${section}`}>{t.photoLabel}</Label>
                <Input id={`photo-${section}`} type="file" />
            </div>
        </div>
    </div>
);

const SideSelector = ({side, setSide}: {side: string, setSide: (s:string) => void}) => {
    return (
        <RadioGroup value={side} onValueChange={setSide} className="flex items-center gap-2 rounded-lg bg-muted p-1">
            <RadioGroupItem value="left" id={`side-left-${side}`} className="sr-only" />
            <Label htmlFor={`side-left-${side}`} className={cn("px-3 py-1 text-sm rounded-md cursor-pointer", side === 'left' && 'bg-background shadow-sm')}>Left</Label>
            
            <RadioGroupItem value="right" id={`side-right-${side}`} className="sr-only" />
            <Label htmlFor={`side-right-${side}`} className={cn("px-3 py-1 text-sm rounded-md cursor-pointer", side === 'right' && 'bg-background shadow-sm')}>Right</Label>

            <RadioGroupItem value="both" id={`side-both-${side}`} className="sr-only" />
            <Label htmlFor={`side-both-${side}`} className={cn("px-3 py-1 text-sm rounded-md cursor-pointer", side === 'both' && 'bg-background shadow-sm')}>Both</Label>
        </RadioGroup>
    )
}

const SystemAccordionContent = ({ system }: { system: (typeof organSystems)[0] }) => {
    const [side, setSide] = useState('both');
    
    return (
        <div className="p-4 space-y-6">
            {system.sideSpecific && (
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Label className="font-semibold">Which side is affected?</Label>
                    <SideSelector side={side} setSide={setSide}/>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            <PhotoAndNotes section={system.name} t={{title: 'Details for {section}', problemDetails: 'Problem Details', problemPlaceholder: 'Describe the problem...', photoLabel: 'Upload Photo'}}/>
        </div>
    )
}

type SenseOrgansProps = {
  t: any;
};

export function SenseOrgans({ t }: SenseOrgansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dental">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dental">{t.tabs.dental}</TabsTrigger>
            <TabsTrigger value="other-systems">{t.tabs['other-systems']}</TabsTrigger>
          </TabsList>

          <TabsContent value="dental" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.dental.title}</CardTitle>
                <CardDescription>{t.dental.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 flex justify-center">
                  <InteractiveDentalChart />
                </div>
                <div className="space-y-4">
                  <Label className="font-semibold">{t.dental.conditionsLabel}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {dentalConditions.map((condition) => (
                      <div key={condition} className="flex items-center gap-2">
                        <Checkbox id={`dental-${condition}`} />
                        <Label htmlFor={`dental-${condition}`} className="font-normal">{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                 <PhotoAndNotes section={t.tabs.dental} t={t.photoAndNotes}/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="other-systems" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.otherSystems.title}</CardTitle>
                <CardDescription>{t.otherSystems.description}</CardDescription>
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
                        <SystemAccordionContent system={system} />
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
