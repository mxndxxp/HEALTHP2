'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { PlusCircle, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HealthData, PatientImprovementReviewItem } from '@/lib/types';

type PatientImprovementReviewProps = {
  data: HealthData;
  onDataChange: (section: keyof HealthData, data: any) => void;
  t: any;
};

const StarRating = ({ rating, setRating }: { rating: number, setRating: (rating: number) => void}) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star className={cn("h-6 w-6", rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
                </button>
            ))}
        </div>
    );
};

export function PatientImprovementReview({ data, onDataChange, t }: PatientImprovementReviewProps) {
  const reviews = data.patientImprovementReview;

  const handleUpdate = (updatedReviews: PatientImprovementReviewItem[]) => {
    onDataChange('patientImprovementReview', updatedReviews);
  };

  const handleAddItem = () => {
    const newItem: PatientImprovementReviewItem = {
      id: Date.now(),
      symptom: '',
      date: new Date().toISOString().split('T')[0],
      doctorName: '',
      review: 0,
      status: '',
      recoveryPercentage: 50,
    };
    handleUpdate([...reviews, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    handleUpdate(reviews.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof PatientImprovementReviewItem, value: any) => {
    handleUpdate(
      reviews.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
        </div>
        <Button onClick={handleAddItem}>
          <PlusCircle className="mr-2" />
          {t.addSymptomButton}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.length === 0 && (
            <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                <p>No symptom reviews added yet.</p>
                <p>Click "{t.addSymptomButton}" to start.</p>
            </div>
        )}
        {reviews.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="bg-muted/40 p-4 flex justify-end">
                 <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor={`symptom-${item.id}`}>{t.symptomPlaceholder}</Label>
                <Textarea
                  id={`symptom-${item.id}`}
                  placeholder={t.symptomPlaceholder}
                  value={item.symptom}
                  onChange={(e) => handleItemChange(item.id, 'symptom', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                 <Label htmlFor={`date-${item.id}`}>{t.dateLabel}</Label>
                 <Input 
                    id={`date-${item.id}`}
                    type="date"
                    value={item.date}
                    onChange={(e) => handleItemChange(item.id, 'date', e.target.value)}
                 />
              </div>

               <div className="space-y-2">
                 <Label htmlFor={`doctor-${item.id}`}>{t.doctorNameLabel}</Label>
                 <Input 
                    id={`doctor-${item.id}`}
                    placeholder={t.doctorNamePlaceholder}
                    value={item.doctorName}
                    onChange={(e) => handleItemChange(item.id, 'doctorName', e.target.value)}
                 />
              </div>
              
               <div className="space-y-2">
                 <Label>{t.reviewLabel}</Label>
                 <StarRating 
                    rating={item.review}
                    setRating={(rating) => handleItemChange(item.id, 'review', rating)}
                />
              </div>

              <div className="space-y-2">
                 <Label>{t.statusLabel}</Label>
                 <RadioGroup 
                    value={item.status}
                    onValueChange={(value) => handleItemChange(item.id, 'status', value)}
                    className="flex items-center gap-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="relieved" id={`relieved-${item.id}`} />
                        <Label htmlFor={`relieved-${item.id}`}>{t.statusRelieved}</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-relieved" id={`not-relieved-${item.id}`} />
                        <Label htmlFor={`not-relieved-${item.id}`}>{t.statusNotRelieved}</Label>
                    </div>
                 </RadioGroup>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>{t.recoveryLabel}: {item.recoveryPercentage}%</Label>
                <Slider
                    value={[item.recoveryPercentage]}
                    onValueChange={(value) => handleItemChange(item.id, 'recoveryPercentage', value[0])}
                    max={100}
                    step={5}
                />
              </div>

            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
