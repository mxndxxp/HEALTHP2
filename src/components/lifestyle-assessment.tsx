'use client';
import { useState } from 'react';
import type { ChangeEvent } from 'react';
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
import { cn } from '@/lib/utils';
import type { HealthData, LifestyleAssessmentInfo } from '@/lib/types';

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

const menstruationBloodColors = [
    { name: 'Bright Red', color: '#FF0000' },
    { name: 'Dark Red', color: '#8B0000' },
    { name: 'Brown', color: '#A52A2A' },
    { name: 'Black', color: '#000000' },
    { name: 'Pink', color: '#FFC0CB' },
    { name: 'Orange', color: '#FFA500' },
];

const PhotoAndNotes = ({
  section,
  t,
  notes,
  onNotesChange,
  onPhotoChange,
}: {
  section: string;
  t: any;
  notes: string;
  onNotesChange: (value: string) => void;
  onPhotoChange: (file: File | null) => void;
}) => (
  <div className="mt-6 space-y-4 rounded-lg border bg-muted/20 p-4">
    <h4 className="font-semibold text-muted-foreground">{t.title.replace('{section}', section)}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor={`notes-${section}`}>{t.notesLabel}</Label>
        <Textarea
          id={`notes-${section}`}
          placeholder={t.notesPlaceholder.replace('{section}', section)}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`photo-${section}`}>{t.photoLabel}</Label>
        <Input
          id={`photo-${section}`}
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onPhotoChange(e.target.files ? e.target.files[0] : null)}
        />
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
  const lifestyleData = data.lifestyleAssessment;
  
  const handleUpdate = (section: keyof LifestyleAssessmentInfo, field: string, value: any) => {
    onDataChange('lifestyleAssessment', {
        ...lifestyleData,
        [section]: {
            ...(lifestyleData[section] as any),
            [field]: value
        }
    });
  };

  const handleCheckboxChange = (section: keyof LifestyleAssessmentInfo, field: string, item: string, checked: boolean) => {
    const currentItems = (lifestyleData[section] as any)[field] as string[];
    const newItems = checked ? [...currentItems, item] : currentItems.filter(i => i !== item);
    handleUpdate(section, field, newItems);
  };
  
  const handleTasteChange = (taste: keyof LifestyleAssessmentInfo['diet']['tastes'], checked: boolean) => {
    const newTastes = { ...lifestyleData.diet.tastes, [taste]: checked };
    handleUpdate('diet', 'tastes', newTastes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sleep" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
            {Object.keys(t.tabs).map(key => {
                if(key === 'menstruation' && data.patientInfo.gender !== 'female') return null;
                return <TabsTrigger key={key} value={key}>{t.tabs[key]}</TabsTrigger>
            })}
          </TabsList>

          <TabsContent value="sleep" className="mt-4">
            <Card>
              <CardHeader><CardTitle>{t.sleep.title}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sleep-time">{t.sleep.bedtime}</Label>
                        <Input id="sleep-time" type="time" value={lifestyleData.sleep.bedtime} onChange={e => handleUpdate('sleep', 'bedtime', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="wake-time">{t.sleep.wakeTime}</Label>
                        <Input id="wake-time" type="time" value={lifestyleData.sleep.wakeTime} onChange={e => handleUpdate('sleep', 'wakeTime', e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>{t.sleep.quality}</Label>
                     <Select value={lifestyleData.sleep.quality} onValueChange={value => handleUpdate('sleep', 'quality', value)}>
                      <SelectTrigger><SelectValue placeholder={t.sleep.selectQuality} /></SelectTrigger>
                      <SelectContent>
                        {t.sleep.qualityOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.sleep.qualityValues)[i]}>{opt}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>{t.sleep.issues}</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {t.sleep.issueOptions.map((issue: string) => (
                            <div key={issue} className="flex items-center gap-2">
                                <Checkbox id={`sleep-issue-${issue}`} checked={lifestyleData.sleep.issues.includes(issue)} onCheckedChange={checked => handleCheckboxChange('sleep', 'issues', issue, !!checked)} />
                                <Label htmlFor={`sleep-issue-${issue}`}>{issue}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>{t.sleep.dreams}</Label>
                    <Select value={lifestyleData.sleep.dreamFrequency} onValueChange={value => handleUpdate('sleep', 'dreamFrequency', value)}>
                        <SelectTrigger><SelectValue placeholder={t.sleep.selectDream} /></SelectTrigger>
                        <SelectContent>
                             {t.sleep.dreamOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.sleep.dreamValues)[i]}>{opt}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <PhotoAndNotes section={t.tabs.sleep} t={t.photoAndNotes} notes={lifestyleData.sleep.notes} onNotesChange={value => handleUpdate('sleep', 'notes', value)} onPhotoChange={file => handleUpdate('sleep', 'photo', file)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.diet.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>{t.diet.dietType}</Label>
                        <Select value={lifestyleData.diet.dietType} onValueChange={value => handleUpdate('diet', 'dietType', value)}>
                            <SelectTrigger><SelectValue placeholder={t.diet.selectDiet} /></SelectTrigger>
                            <SelectContent>
                                {t.diet.dietOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.diet.dietValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.diet.waterIntake}</Label>
                        <Slider value={[lifestyleData.diet.waterIntake]} onValueChange={(value) => handleUpdate('diet', 'waterIntake', value[0])} max={5} step={0.5} />
                        <div className="text-center text-sm text-muted-foreground">{lifestyleData.diet.waterIntake.toFixed(1)} L</div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.diet.hungerLevel}</Label>
                        <Slider value={[lifestyleData.diet.hungerLevel]} onValueChange={value => handleUpdate('diet', 'hungerLevel', value[0])} max={10} step={1} />
                         <div className="text-center text-sm text-muted-foreground">{lifestyleData.diet.hungerLevel}</div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="favorite-food">{t.diet.favoriteFood}</Label>
                        <Input id="favorite-food" placeholder={t.diet.favoriteFoodPlaceholder} value={lifestyleData.diet.favoriteFood} onChange={e => handleUpdate('diet', 'favoriteFood', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>{t.diet.allergies}</Label>
                        <Input placeholder={t.diet.allergiesPlaceholder} value={lifestyleData.diet.foodAllergies} onChange={e => handleUpdate('diet', 'foodAllergies', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>{t.diet.taste.title}</Label>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.keys(t.diet.taste.options).map((key) => (
                                <div key={key} className="flex items-center gap-2">
                                    <Checkbox id={`taste-${key}`} checked={lifestyleData.diet.tastes[key as keyof typeof lifestyleData.diet.tastes]} onCheckedChange={checked => handleTasteChange(key as keyof typeof lifestyleData.diet.tastes, !!checked)} />
                                    <Label htmlFor={`taste-${key}`}>{t.diet.taste.options[key]}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.diet.thirst.title}</Label>
                        <Select value={lifestyleData.diet.thirstLevel} onValueChange={value => handleUpdate('diet', 'thirstLevel', value)}>
                            <SelectTrigger><SelectValue placeholder={t.diet.thirst.select} /></SelectTrigger>
                            <SelectContent>
                                {Object.keys(t.diet.thirst.options).map(key => <SelectItem key={key} value={key}>{t.diet.thirst.options[key]}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section={t.tabs.diet} t={t.photoAndNotes} notes={lifestyleData.diet.notes} onNotesChange={value => handleUpdate('diet', 'notes', value)} onPhotoChange={file => handleUpdate('diet', 'photo', file)} />
                </CardContent>
             </Card>
          </TabsContent>

            <TabsContent value="activity" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.activity.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{t.activity.level}</Label>
                        <Select value={lifestyleData.activity.level} onValueChange={value => handleUpdate('activity', 'level', value)}>
                            <SelectTrigger><SelectValue placeholder={t.activity.selectLevel} /></SelectTrigger>
                            <SelectContent>
                                {t.activity.levelOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.activity.levelValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section={t.tabs.activity} t={t.photoAndNotes} notes={lifestyleData.activity.notes} onNotesChange={value => handleUpdate('activity', 'notes', value)} onPhotoChange={file => handleUpdate('activity', 'photo', file)} />
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="stress" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.stress.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{t.stress.level}</Label>
                        <Select value={lifestyleData.stress.level} onValueChange={value => handleUpdate('stress', 'level', value)}>
                            <SelectTrigger><SelectValue placeholder={t.stress.selectLevel} /></SelectTrigger>
                            <SelectContent>
                                {t.stress.levelOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.stress.levelValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.stress.caffeine}</Label>
                         <Select value={lifestyleData.stress.caffeineIntake} onValueChange={value => handleUpdate('stress', 'caffeineIntake', value)}>
                            <SelectTrigger><SelectValue placeholder={t.stress.selectCaffeine} /></SelectTrigger>
                            <SelectContent>
                                {t.stress.caffeineOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.stress.caffeineValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>{t.stress.emotion.title}</Label>
                        <Select value={lifestyleData.stress.primaryEmotion} onValueChange={value => handleUpdate('stress', 'primaryEmotion', value)}>
                            <SelectTrigger><SelectValue placeholder={t.stress.emotion.select} /></SelectTrigger>
                            <SelectContent>
                                {Object.keys(t.stress.emotion.options).map(key => <SelectItem key={key} value={key}>{t.stress.emotion.options[key]}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     {lifestyleData.stress.primaryEmotion === 'other' && (
                        <div className="space-y-2">
                            <Label htmlFor="emotion-notes">{t.stress.emotion.otherPlaceholder}</Label>
                            <Input id="emotion-notes" value={lifestyleData.stress.emotionNotes} onChange={e => handleUpdate('stress', 'emotionNotes', e.target.value)} placeholder={t.stress.emotion.otherPlaceholder} />
                        </div>
                    )}
                    <PhotoAndNotes section={t.tabs.stress} t={t.photoAndNotes} notes={lifestyleData.stress.notes} onNotesChange={value => handleUpdate('stress', 'notes', value)} onPhotoChange={file => handleUpdate('stress', 'photo', file)}/>
                </CardContent>
             </Card>
          </TabsContent>
          
           <TabsContent value="substance" className="mt-4">
             <Card>
                <CardHeader><CardTitle>{t.substance.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>{t.substance.smoking}</Label>
                        <Select value={lifestyleData.substance.smokingStatus} onValueChange={value => handleUpdate('substance', 'smokingStatus', value)}>
                            <SelectTrigger><SelectValue placeholder={t.substance.selectSmoking} /></SelectTrigger>
                            <SelectContent>
                                {t.substance.smokingOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.substance.smokingValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>{t.substance.alcohol}</Label>
                        <Select value={lifestyleData.substance.alcoholConsumption} onValueChange={value => handleUpdate('substance', 'alcoholConsumption', value)}>
                            <SelectTrigger><SelectValue placeholder={t.substance.selectAlcohol} /></SelectTrigger>
                            <SelectContent>
                                {t.substance.alcoholOptions.map((opt: string, i: number) => <SelectItem key={i} value={Object.keys(t.substance.alcoholValues)[i]}>{opt}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section={t.tabs.substance} t={t.photoAndNotes} notes={lifestyleData.substance.notes} onNotesChange={value => handleUpdate('substance', 'notes', value)} onPhotoChange={file => handleUpdate('substance', 'photo', file)} />
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
                                        <button className={cn("w-12 h-12 rounded-full border-2 transition-all", lifestyleData.stool.color === c.name ? "border-primary scale-110" : "border-transparent")} style={{backgroundColor: c.color}} onClick={() => handleUpdate('stool', 'color', c.name)} title={c.name} />
                                        <span className="text-xs text-center">{c.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>{t.stool.type}</Label>
                        <Select value={lifestyleData.stool.type} onValueChange={value => handleUpdate('stool', 'type', value)}>
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
                                    <Checkbox id={`stool-issue-${issue}`} checked={lifestyleData.stool.problems.includes(issue)} onCheckedChange={checked => handleCheckboxChange('stool', 'problems', issue, !!checked)} />
                                    <Label htmlFor={`stool-issue-${issue}`} className="font-normal">{issue}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <PhotoAndNotes section={t.tabs.stool} t={t.photoAndNotes} notes={lifestyleData.stool.notes} onNotesChange={value => handleUpdate('stool', 'notes', value)} onPhotoChange={file => handleUpdate('stool', 'photo', file)} />
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
                                {urineColors.map(c => <TestTubeIcon key={c.name} name={c.name} color={c.color} selected={lifestyleData.urine.color === c.name} onClick={() => handleUpdate('urine', 'color', c.name)} /> )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t.urine.day_frequency}</Label>
                            <Select value={lifestyleData.urine.dayFrequency} onValueChange={value => handleUpdate('urine', 'dayFrequency', value)}>
                                <SelectTrigger><SelectValue placeholder={t.urine.select_day_frequency} /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(t.urine.dayFrequencyOptions).map(key => <SelectItem key={key} value={key}>{t.urine.dayFrequencyOptions[key]}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t.urine.night_frequency}</Label>
                            <Select value={lifestyleData.urine.nightFrequency} onValueChange={value => handleUpdate('urine', 'nightFrequency', value)}>
                                <SelectTrigger><SelectValue placeholder={t.urine.select_night_frequency} /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(t.urine.nightFrequencyOptions).map(key => <SelectItem key={key} value={key}>{t.urine.nightFrequencyOptions[key]}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.urine.problems}</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {t.urine.problemOptions.map((issue: string) => (
                                <div key={issue} className="flex items-center gap-2">
                                    <Checkbox id={`urine-issue-${issue}`} checked={lifestyleData.urine.problems.includes(issue)} onCheckedChange={checked => handleCheckboxChange('urine', 'problems', issue, !!checked)} />
                                    <Label htmlFor={`urine-issue-${issue}`} className="font-normal">{issue}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <PhotoAndNotes section={t.tabs.urine} t={t.photoAndNotes} notes={lifestyleData.urine.notes} onNotesChange={value => handleUpdate('urine', 'notes', value)} onPhotoChange={file => handleUpdate('urine', 'photo', file)} />
                </CardContent>
             </Card>
          </TabsContent>

          {data.patientInfo.gender === 'female' && (
            <TabsContent value="menstruation" className="mt-4">
                 <Card>
                    <CardHeader><CardTitle>{t.menstruation.title}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="last-period">{t.menstruation.lastPeriod}</Label>
                                <Input id="last-period" type="date" value={lifestyleData.menstruation.lastPeriodDate} onChange={e => handleUpdate('menstruation', 'lastPeriodDate', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="cycle-length">{t.menstruation.cycleLength}</Label>
                                <Input id="cycle-length" type="number" value={lifestyleData.menstruation.cycleLength} onChange={e => handleUpdate('menstruation', 'cycleLength', parseInt(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">{t.menstruation.duration}</Label>
                                <Input id="duration" type="number" value={lifestyleData.menstruation.duration} onChange={e => handleUpdate('menstruation', 'duration', parseInt(e.target.value))} />
                            </div>
                             <div className="space-y-2">
                                <Label>{t.menstruation.regularity.title}</Label>
                                <Select value={lifestyleData.menstruation.isRegular} onValueChange={value => handleUpdate('menstruation', 'isRegular', value)}>
                                    <SelectTrigger><SelectValue placeholder={t.menstruation.regularity.select} /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">{t.menstruation.regularity.yes}</SelectItem>
                                        <SelectItem value="no">{t.menstruation.regularity.no}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label>{t.menstruation.flow.title}</Label>
                                <Select value={lifestyleData.menstruation.flow} onValueChange={value => handleUpdate('menstruation', 'flow', value)}>
                                    <SelectTrigger><SelectValue placeholder={t.menstruation.flow.select} /></SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(t.menstruation.flow.options).map(key => <SelectItem key={key} value={key}>{t.menstruation.flow.options[key]}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t.menstruation.bloodColor.title}</Label>
                             <div className="p-4 rounded-lg bg-muted/40">
                                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                    {menstruationBloodColors.map(c => (
                                        <div key={c.name} className="flex flex-col items-center gap-2">
                                            <button className={cn("w-12 h-12 rounded-lg border-2 transition-all", lifestyleData.menstruation.bloodColor === c.name ? "border-primary scale-110" : "border-transparent")} style={{backgroundColor: c.color}} onClick={() => handleUpdate('menstruation', 'bloodColor', c.name)} title={c.name} />
                                            <span className="text-xs text-center">{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label>{t.menstruation.symptoms.title}</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {t.menstruation.symptoms.options.map((symptom: string) => (
                                    <div key={symptom} className="flex items-center gap-2">
                                        <Checkbox id={`symptom-${symptom}`} checked={lifestyleData.menstruation.symptoms.includes(symptom)} onCheckedChange={checked => handleCheckboxChange('menstruation', 'symptoms', symptom, !!checked)} />
                                        <Label htmlFor={`symptom-${symptom}`} className="font-normal">{symptom}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t.menstruation.painLevel}</Label>
                            <Slider value={[lifestyleData.menstruation.painLevel]} onValueChange={value => handleUpdate('menstruation', 'painLevel', value[0])} max={10} step={1} />
                            <div className="text-center text-sm text-muted-foreground">{lifestyleData.menstruation.painLevel}</div>
                        </div>
                        <PhotoAndNotes section={t.tabs.menstruation} t={t.photoAndNotes} notes={lifestyleData.menstruation.notes} onNotesChange={value => handleUpdate('menstruation', 'notes', value)} onPhotoChange={file => handleUpdate('menstruation', 'photo', file)} />
                    </CardContent>
                 </Card>
            </TabsContent>
          )}

        </Tabs>
      </CardContent>
    </Card>
  );
}
