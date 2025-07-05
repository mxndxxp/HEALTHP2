
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

const PhotoAndNotes = ({ section }: { section: string }) => (
    <div className="mt-6 space-y-4 rounded-lg border bg-muted/20 p-4">
        <h4 className="font-semibold text-muted-foreground">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor={`notes-${section}`}>Notes</Label>
                <Textarea id={`notes-${section}`} placeholder={`Any additional notes for ${section.toLowerCase()}...`} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`photo-${section}`}>Upload Related Photo</Label>
                <Input id={`photo-${section}`} type="file" />
            </div>
        </div>
    </div>
);


export function LifestyleAssessment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lifestyle Assessment</CardTitle>
        <CardDescription>
          Comprehensive lifestyle evaluation across 7 key areas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sleep" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="stress">Stress</TabsTrigger>
            <TabsTrigger value="substance">Substance</TabsTrigger>
            <TabsTrigger value="stool">Stool</TabsTrigger>
            <TabsTrigger value="urine">Urine</TabsTrigger>
          </TabsList>

          <TabsContent value="sleep" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sleep Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sleep-time">Bedtime</Label>
                        <Input id="sleep-time" type="time" defaultValue="22:30"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="wake-time">Wake-up Time</Label>
                        <Input id="wake-time" type="time" defaultValue="06:30"/>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Sleep Quality</Label>
                     <Select defaultValue="good">
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Sleep Issues (select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Insomnia', 'Sleep apnea', 'Snoring', 'Restless legs', 'Nightmares', 'Frequent awakening'].map(issue => (
                            <div key={issue} className="flex items-center gap-2">
                                <Checkbox id={`sleep-issue-${issue}`} />
                                <Label htmlFor={`sleep-issue-${issue}`}>{issue}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Dreams</Label>
                    <Select defaultValue="sometimes">
                        <SelectTrigger><SelectValue placeholder="Select dream frequency" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="never">Never / Rarely</SelectItem>
                            <SelectItem value="sometimes">Sometimes</SelectItem>
                            <SelectItem value="often">Often</SelectItem>
                            <SelectItem value="vivid">Vivid / Memorable</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <PhotoAndNotes section="Sleep" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="mt-4">
             <Card>
                <CardHeader><CardTitle>Dietary Habits</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Diet Type</Label>
                        <Select defaultValue="omnivore">
                            <SelectTrigger><SelectValue placeholder="Select diet type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="omnivore">Omnivore</SelectItem>
                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                                <SelectItem value="pescatarian">Pescatarian</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Daily Water Intake (Liters)</Label>
                        <Slider defaultValue={[2.5]} max={5} step={0.5} />
                        <div className="text-center text-sm text-muted-foreground">2.5 L</div>
                    </div>
                     <div className="space-y-2">
                        <Label>Food Allergies/Intolerances</Label>
                        <Input placeholder="e.g., Lactose, Gluten, Nuts"/>
                    </div>
                    <PhotoAndNotes section="Diet" />
                </CardContent>
             </Card>
          </TabsContent>

            <TabsContent value="activity" className="mt-4">
             <Card>
                <CardHeader><CardTitle>Physical Activity</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Activity Level</Label>
                        <Select defaultValue="moderately">
                            <SelectTrigger><SelectValue placeholder="Select activity level" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">Sedentary (&lt;30 mins/week)</SelectItem>
                                <SelectItem value="lightly">Lightly Active (30-90 mins/week)</SelectItem>
                                <SelectItem value="moderately">Moderately Active (90-270 mins/week)</SelectItem>
                                <SelectItem value="very">Very Active (&gt;270 mins/week)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section="Activity" />
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="stress" className="mt-4">
             <Card>
                <CardHeader><CardTitle>Stress & Caffeine</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Stress Level</Label>
                        <Select defaultValue="moderate">
                            <SelectTrigger><SelectValue placeholder="Select stress level" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">😌 Low</SelectItem>
                                <SelectItem value="moderate">😐 Moderate</SelectItem>
                                <SelectItem value="high">😰 High</SelectItem>
                                <SelectItem value="very-high">😱 Very High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Caffeine Intake</Label>
                         <Select defaultValue="low">
                            <SelectTrigger><SelectValue placeholder="Select caffeine intake" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None (0mg)</SelectItem>
                                <SelectItem value="low">Low (1-100mg)</SelectItem>
                                <SelectItem value="moderate">Moderate (100-300mg)</SelectItem>
                                <SelectItem value="high">High (300-500mg)</SelectItem>
                                <SelectItem value="excessive">Excessive (&gt;500mg)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section="Stress and Caffeine" />
                </CardContent>
             </Card>
          </TabsContent>
          
           <TabsContent value="substance" className="mt-4">
             <Card>
                <CardHeader><CardTitle>Smoking & Alcohol</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Smoking Status</Label>
                        <Select defaultValue="never">
                            <SelectTrigger><SelectValue placeholder="Select smoking status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="never">Never smoked</SelectItem>
                                <SelectItem value="former">Former smoker</SelectItem>
                                <SelectItem value="occasional">Occasional smoker</SelectItem>
                                <SelectItem value="regular">Regular smoker</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Alcohol Consumption</Label>
                        <Select defaultValue="occasionally">
                            <SelectTrigger><SelectValue placeholder="Select alcohol consumption" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="never">Never</SelectItem>
                                <SelectItem value="rarely">Rarely</SelectItem>
                                <SelectItem value="occasionally">Occasionally</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <PhotoAndNotes section="Substance Use" />
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="stool" className="mt-4">
             <Card>
                <CardHeader><CardTitle>Stool Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Stool Color</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {stoolColors.map(c => (
                                <div key={c.name} className="flex flex-col items-center gap-2">
                                    <button className="w-12 h-12 rounded-full border-2 border-transparent focus:border-primary" style={{backgroundColor: c.color}}></button>
                                    <span className="text-xs">{c.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Stool Type (Bristol Stool Chart)</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select stool type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Type 1: Separate hard lumps (hard to pass)</SelectItem>
                                <SelectItem value="2">Type 2: Sausage-shaped, but lumpy</SelectItem>
                                <SelectItem value="3">Type 3: Like a sausage but with cracks on surface</SelectItem>
                                <SelectItem value="4">Type 4: Like a sausage or snake, smooth and soft</SelectItem>
                                <SelectItem value="5">Type 5: Soft blobs with clear-cut edges</SelectItem>
                                <SelectItem value="6">Type 6: Fluffy pieces with ragged edges, mushy</SelectItem>
                                <SelectItem value="7">Type 7: Watery, no solid pieces, liquid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Stool Problems (select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Constipation', 'Diarrhea', 'Painful Movements', 'Blood in Stool', 'Mucus in Stool', 'Undigested Food'].map(issue => (
                                <div key={issue} className="flex items-center gap-2">
                                    <Checkbox id={`stool-issue-${issue}`} />
                                    <Label htmlFor={`stool-issue-${issue}`} className="font-normal">{issue}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <PhotoAndNotes section="Stool" />
                </CardContent>
             </Card>
          </TabsContent>

           <TabsContent value="urine" className="mt-4">
             <Card>
                <CardHeader><CardTitle>Urine Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Urine Color</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {urineColors.map(c => (
                                <div key={c.name} className="flex flex-col items-center gap-2">
                                    <button className="w-12 h-12 rounded-full border-2 border-transparent focus:border-primary" style={{backgroundColor: c.color}}></button>
                                    <span className="text-xs">{c.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select urination frequency" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal (4-7 times/day)</SelectItem>
                                <SelectItem value="frequent">Frequent (>7 times/day)</SelectItem>
                                <SelectItem value="infrequent">Infrequent (&lt;4 times/day)</SelectItem>
                                <SelectItem value="nocturia">Waking up at night to urinate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Urine Problems (select all that apply)</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Pain or Burning', 'Difficulty Starting', 'Weak Stream', 'Urgency', 'Incontinence / Leakage', 'Cloudy Urine', 'Strong Odor'].map(issue => (
                                <div key={issue} className="flex items-center gap-2">
                                    <Checkbox id={`urine-issue-${issue}`} />
                                    <Label htmlFor={`urine-issue-${issue}`} className="font-normal">{issue}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <PhotoAndNotes section="Urine" />
                </CardContent>
             </Card>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
}
