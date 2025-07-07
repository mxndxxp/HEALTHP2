'use client';
import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Calendar,
  Heart,
  Mail,
  Phone,
  MapPin,
  Ruler,
  Weight,
  BadgeInfo,
  Upload,
  Clock,
  Map,
  Baby,
  Truck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import type { HealthData, PatientInfo } from '@/lib/types';

const IconLabel = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-5 w-5 text-muted-foreground" />
    {children}
  </div>
);

type PatientInformationProps = {
  data: HealthData;
  setData: (data: HealthData) => void;
};

export function PatientInformation({ data, setData }: PatientInformationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patientData = data.patientInfo;

  const handleFieldChange = (field: keyof PatientInfo | `address.${keyof PatientInfo['address']}`, value: any) => {
    const newData = { ...data };
    if (field.startsWith('address.')) {
        const addressField = field.split('.')[1] as keyof PatientInfo['address'];
        newData.patientInfo.address[addressField] = value;
    } else {
        (newData.patientInfo as any)[field] = value;
    }
    setData(newData);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange('avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Basic Information</CardTitle>
        <CardDescription>
          Collect comprehensive demographic and physical information about the
          patient.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
          <div className="md:col-span-1 flex flex-col items-center gap-4 pt-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={patientData.avatar} alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
            </Button>
            <Input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="space-y-2">
              <Label htmlFor="name">
                <IconLabel icon={User}>Full Name</IconLabel>
              </Label>
              <Input id="name" placeholder="John Doe" value={patientData.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">
                <IconLabel icon={Calendar}>Age</IconLabel>
              </Label>
              <Input id="age" type="number" placeholder="35" value={patientData.age} onChange={(e) => handleFieldChange('age', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>
                <IconLabel icon={Heart}>Gender</IconLabel>
              </Label>
              <RadioGroup value={patientData.gender} onValueChange={(value) => handleFieldChange('gender', value)} className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-binary" id="non-binary" />
                  <Label htmlFor="non-binary">Non-binary</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                <IconLabel icon={Mail}>Email</IconLabel>
              </Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" value={patientData.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">
                <IconLabel icon={Phone}>Phone Number</IconLabel>
              </Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={patientData.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
             <Label>
              <IconLabel icon={MapPin}>Address</IconLabel>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input id="address1" placeholder="Address Line 1" value={patientData.address.line1} onChange={(e) => handleFieldChange('address.line1', e.target.value)} />
                 <Input id="address2" placeholder="Address Line 2 (Optional)" value={patientData.address.line2} onChange={(e) => handleFieldChange('address.line2', e.target.value)} />
                 <Input id="city" placeholder="City" value={patientData.address.city} onChange={(e) => handleFieldChange('address.city', e.target.value)} />
                 <Input id="district" placeholder="District / County" value={patientData.address.district} onChange={(e) => handleFieldChange('address.district', e.target.value)} />
                 <Input id="state" placeholder="State / Province" value={patientData.address.state} onChange={(e) => handleFieldChange('address.state', e.target.value)} />
                 <Input id="postal-code" placeholder="Postal / Zip Code" value={patientData.address.postalCode} onChange={(e) => handleFieldChange('address.postalCode', e.target.value)} />
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height">
                <IconLabel icon={Ruler}>Height (cm)</IconLabel>
              </Label>
              <Input id="height" type="number" placeholder="180" value={patientData.height} onChange={(e) => handleFieldChange('height', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">
                <IconLabel icon={Weight}>Weight (kg)</IconLabel>
              </Label>
              <Input id="weight" type="number" placeholder="75" value={patientData.weight} onChange={(e) => handleFieldChange('weight', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>
                <IconLabel icon={BadgeInfo}>Unique ID</IconLabel>
                </Label>
                <Input id="uniqueId" value={patientData.uniqueId} readOnly className="font-mono bg-muted" />
            </div>
          </div>

          <div className="md:col-span-3 border-t pt-8 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="dob">
                    <IconLabel icon={Calendar}>Date of Birth</IconLabel>
                </Label>
                <Input id="dob" type="date" value={patientData.dob} onChange={(e) => handleFieldChange('dob', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="birth-time">
                    <IconLabel icon={Clock}>Birth Time</IconLabel>
                </Label>
                <Input id="birth-time" type="time" value={patientData.birthTime} onChange={(e) => handleFieldChange('birthTime', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="birth-place">
                    <IconLabel icon={Map}>Birth Place</IconLabel>
                </Label>
                <Input id="birth-place" placeholder="City, State, Country" value={patientData.birthPlace} onChange={(e) => handleFieldChange('birthPlace', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>
                    <IconLabel icon={Baby}>Delivery Type</IconLabel>
                </Label>
                <Select value={patientData.deliveryType} onValueChange={(value) => handleFieldChange('deliveryType', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="c-section">C-Section</SelectItem>
                        <SelectItem value="forceps">Forceps</SelectItem>
                        <SelectItem value="vacuum">Vacuum</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="delivery-time">
                    <IconLabel icon={Truck}>Delivery Time</IconLabel>
                </Label>
                <Input id="delivery-time" placeholder="e.g., Full-term, Preterm" value={patientData.deliveryTime} onChange={(e) => handleFieldChange('deliveryTime', e.target.value)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
