'use client';

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
import { Textarea } from '@/components/ui/textarea';
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
} from 'lucide-react';

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <RadioGroup defaultValue="male" className="flex items-center gap-4">
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
          <div className="space-y-2">
            <Label htmlFor="phone">
              <IconLabel icon={Phone}>Phone Number</IconLabel>
            </Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">
              <IconLabel icon={MapPin}>Address</IconLabel>
            </Label>
            <Textarea
              id="address"
              placeholder="123 Main St, Anytown, USA 12345"
            />
          </div>
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
          <div className="space-y-2 md:col-span-2">
            <Label>
              <IconLabel icon={BadgeInfo}>Unique ID</IconLabel>
            </Label>
            <Input id="uniqueId" value={uniqueId} readOnly className="font-mono bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
