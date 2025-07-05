
'use client';
import { useRef, useState } from 'react';
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';

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

export function PatientInformation() {
  const uniqueId = `HC-${Date.now()}-A9B8C7`;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1 flex flex-col items-center gap-4 pt-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={avatarPreview || "https://placehold.co/200x200.png"} alt="User" data-ai-hint="user avatar" />
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
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                <IconLabel icon={User}>Full Name</IconLabel>
              </Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">
                <IconLabel icon={Calendar}>Age</IconLabel>
              </Label>
              <Input id="age" type="number" placeholder="35" />
            </div>
            <div className="space-y-2">
              <Label>
                <IconLabel icon={Heart}>Gender</IconLabel>
              </Label>
              <RadioGroup defaultValue="male" className="flex items-center gap-4 pt-2">
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
              <Input id="email" type="email" placeholder="john.doe@example.com" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">
                <IconLabel icon={Phone}>Phone Number</IconLabel>
              </Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
             <Label>
              <IconLabel icon={MapPin}>Address</IconLabel>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input id="address1" placeholder="Address Line 1" />
                 <Input id="address2" placeholder="Address Line 2 (Optional)" />
                 <Input id="city" placeholder="City" />
                 <Input id="district" placeholder="District / County" />
                 <Input id="state" placeholder="State / Province" />
                 <Input id="postal-code" placeholder="Postal / Zip Code" />
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height">
                <IconLabel icon={Ruler}>Height (cm)</IconLabel>
              </Label>
              <Input id="height" type="number" placeholder="180" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">
                <IconLabel icon={Weight}>Weight (kg)</IconLabel>
              </Label>
              <Input id="weight" type="number" placeholder="75" />
            </div>
            <div className="space-y-2">
                <Label>
                <IconLabel icon={BadgeInfo}>Unique ID</IconLabel>
                </Label>
                <Input id="uniqueId" value={uniqueId} readOnly className="font-mono bg-muted" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
