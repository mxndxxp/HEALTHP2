'use client';
import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HealthData } from '@/lib/types';


const stoolColors = [
  { name: 'Brown', color: '#8B4513' },
  { name: 'Light Brown', color: '#D2691E' },
  { name: 'Dark Brown', color: '#654321' },
  { name: 'Yellow', color: '#FFD700' },
  { name: 'Green', color: '#228B22' },
  { name: 'Red', color: '#DC143C' },
  { name: 'Black', color: '#000000' },
  { name: 'Pale/Clay', color: '#F5F5DC' },
];

const urineColors = [
    { name: 'Clear', color: '#F0F8FF' },
    { name: 'Pale Yellow', color: '#FFFFE0' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Dark Yellow', color: '#FFD700' },
    { name: 'Amber', color: '#FFBF00' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Red/Pink', color: '#FF69B4' },
    { name: 'Brown', color: '#8B4513' },
];

const PhotoAndNotes = ({ section, t }: { section: string, t: any }) => (
    <div className="mt-6 space-y-4 rounded-lg border bg-muted/20 p-4">
        <h4 className="font-semibold text-muted-foreground">{t.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`notes-${section}`}>{t.notesLabel}</Label>
                <Textarea id={`notes-${section}`} placeholder={t.notesPlaceholder.replace('{section}', section)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`photo-${section}`}>{t.photoLabel}</Label>
                <Input id={`photo-${section}`} type="file" />
            </div>
        </div>
    </div>
);

const TestTubeIcon = ({ color, name, selected, onClick }: { color: string, name: string, selected: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-2 text-center transition-transform hover:scale-105", selected && "scale-105")}>
        <div className={cn("w-10 h-20 rounded-b-full rounded-t-md border-2 bg-white/50 relative flex items-end justify-center", selected ? "border-primary" : "border-gray-400")}>
            <div className="w-full h-1/2 rounded-b-full" style={{ backgroundColor: color, opacity: 0.8 }}></div>
        </div>
        <span className="text-xs font-medium">{name}</span>
    </button>
)

type LifestyleAssessmentProps = {
  data: HealthData;
  onDataChange: (section: keyof HealthData, data: any) => void;
  t: any;
};


export function LifestyleAssessment({ data, onDataChange, t }: LifestyleAssessmentProps) {
  const [selectedStoolColor, setSelectedStoolColor] = useState<string | null>(null);
  const [selectedUrineColor, setSelectedUrineColor] = useState<string | null>(null);
  const [waterIntake, setWaterIntake] = useState(2.5);

  const handleSliderChange = (value: number[]) => {
    onDataChange('lifestyleAssessment', { hungerLevel: value[0] });
  };
  
  const handleInputChange = (field: string, value: string) => {
    onDataChange('lifestyleAssessment', { [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sleep" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
            {Object.keys(t.tabs).map(key => <TabsTrigger key={key} value={key}>{t.tabs[key]}</TabsTrigger>)}
          </TabsList>

          <TabsContent value="sleep" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.sleep.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sleep-time">{t.sleep.bedtime}</Label>
                        <Input id="sleep-time" type="time" defaultValue="22:30"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="wake-time">{t.sleep.wakeTime}</Label>
                        <Input id="wake-time" type="time" defaultValue="06:30"/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>{t.sleep.quality}</Label>
                     <Select defaultValue="good">
                      <SelectTrigger>
                        <SelectValue placeholder={t.sleep.selectQuality} />
                      </SelectTrigger>
                      <SelectContent>
                        {t.sleep.qualityOptions.map((opt: string, i: number) => <SelectItem key={i} value={opt.toLowerCase()}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>{t.sleep.issues}</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {t.sleep.issueOptions.map((issue: string) => (
                            <div key={issue} className="flex items-center gap-2">
                                <Checkbox id={`sleep-issue-${issue}`} />
                                <Label htmlFor={`sleep-issue-${issue}`}>{issue}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>{t.sleep.dreams}</Label>
                    <Select defaultValue="sometimes">
                        <SelectTrigger><SelectValue placeholder={t.sleep.selectDream} /></SelectTrigger>
                        <SelectContent>
                             {t.sleep.dreamOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.sleep.dreamValues)[i]}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <PhotoAndNotes section={t.tabs.sleep} t={t.photoAndNotes} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.diet.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t.diet.dietType}</Label>
                        <Select defaultValue="omnivore">
                            <SelectTrigger><SelectValue placeholder={t.diet.selectDiet} /></SelectTrigger>
                            <SelectContent>
                                {t.diet.dietOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.diet.dietValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.diet.waterIntake}</Label>
                        <Slider value={[waterIntake]} onValueChange={(value) => setWaterIntake(value[0])} max={5} step={0.5} />
                        <div className="text-center text-sm text-muted-foreground">{waterIntake.toFixed(1)} L</div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.diet.hungerLevel}</Label>
                        <Slider 
                            value={[data.lifestyleAssessment.hungerLevel]} 
                            onValueChange={handleSliderChange} 
                            max={10} 
                            step={1} 
                        />
                         <div className="text-center text-sm text-muted-foreground">{data.lifestyleAssessment.hungerLevel}</div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="favorite-food">{t.diet.favoriteFood}</Label>
                        <Input 
                            id="favorite-food" 
                            placeholder={t.diet.favoriteFoodPlaceholder}
                            value={data.lifestyleAssessment.favoriteFood}
                            onChange={(e) => handleInputChange('favoriteFood', e.target.value)}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>{t.diet.allergies}</Label>
                        <Input placeholder={t.diet.allergiesPlaceholder}/>
                    </div>
                    <PhotoAndNotes section={t.tabs.diet} t={t.photoAndNotes} />
                </CardContent>
             </Card>
          </TabsContent>

            <TabsContent value="activity" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.activity.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{t.activity.level}</Label>
                        <Select defaultValue="moderately">
                            <SelectTrigger><SelectValue placeholder={t.activity.selectLevel} /></SelectTrigger>
                            <SelectContent>
                                {t.activity.levelOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.activity.levelValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section={t.tabs.activity} t={t.photoAndNotes} />
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="stress" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.stress.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{t.stress.level}</Label>
                        <Select defaultValue="moderate">
                            <SelectTrigger><SelectValue placeholder={t.stress.selectLevel} /></SelectTrigger>
                            <SelectContent>
                                {t.stress.levelOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.stress.levelValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.stress.caffeine}</Label>
                         <Select defaultValue="low">
                            <SelectTrigger><SelectValue placeholder={t.stress.selectCaffeine} /></SelectTrigger>
                            <SelectContent>
                                {t.stress.caffeineOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.stress.caffeineValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section={t.tabs.stress} t={t.photoAndNotes} />
                </CardContent>
             </Card>
          </TabsContent>
          
           <TabsContent value="substance" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.substance.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{t.substance.smoking}</Label>
                        <Select defaultValue="never">
                            <SelectTrigger><SelectValue placeholder={t.substance.selectSmoking} /></SelectTrigger>
                            <SelectContent>
                                {t.substance.smokingOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.substance.smokingValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>{t.substance.alcohol}</Label>
                        <Select defaultValue="occasionally">
                            <SelectTrigger><SelectValue placeholder={t.substance.selectAlcohol} /></SelectTrigger>
                            <SelectContent>
                                {t.substance.alcoholOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.substance.alcoholValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section={t.tabs.substance} t={t.photoAndNotes} />
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="stool" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.stool.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t.stool.color}</Label>
                        <div className="p-4 rounded-lg bg-muted/40">
                            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                                {stoolColors.map(c => (
                                    <div key={c.name} className="flex flex-col items-center gap-2">
                                        <button 
                                            className={cn(
                                                "w-12 h-12 rounded-full border-2 transition-all",
                                                selectedStoolColor === c.name ? "border-primary scale-110" : "border-transparent"
                                            )}
                                            style={{backgroundColor: c.color}}
                                            onClick={() => setSelectedStoolColor(c.name)}
                                            title={c.name}
                                        />
                                        <span className="text-xs text-center">{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>{t.stool.type}</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder={t.stool.selectType} /></SelectTrigger>
                            <SelectContent>
                                {t.stool.typeOptions.map((opt: string, i: number) => <SelectItem key={i} value={`${i + 1}`}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.stool.problems}</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {t.stool.problemOptions.map((issue: string) => (
                                <div key={issue} className="flex items-center gap-2">
                                    <Checkbox id={`stool-issue-${issue}`} />
                                    <Label htmlFor={`stool-issue-${issue}`} className="font-normal">{issue}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <PhotoAndNotes section={t.tabs.stool} t={t.photoAndNotes} />
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="urine" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.urine.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{t.urine.color}</Label>
                        <div className="p-4 rounded-lg bg-muted/40 flex justify-center">
                            <div className="grid grid-cols-4 md:grid-cols-8 gap-x-6 gap-y-4">
                                {urineColors.map(c => (
                                    <TestTubeIcon 
                                        key={c.name} 
                                        name={c.name}
                                        color={c.color}
                                        selected={selectedUrineColor === c.name}
                                        onClick={() => setSelectedUrineColor(c.name)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.urine.frequency}</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder={t.urine.selectFrequency} /></SelectTrigger>
                            <SelectContent>
                                {t.urine.frequencyOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.urine.frequencyValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.urine.problems}</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {t.urine.problemOptions.map((issue: string) => (
                                <div key={issue} className="flex items-center gap-2">
                                    <Checkbox id={`urine-issue-${issue}`} />
                                    <Label htmlFor={`urine-issue-${issue}`} className="font-normal">{issue}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <PhotoAndNotes section={t.tabs.urine} t={t.photoAndNotes} />
                </CardContent>
             </Card>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}
