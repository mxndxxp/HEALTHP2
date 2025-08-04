
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
  Briefcase,
  Users,
  Handshake,
  CalendarDays,
  Sparkles,
  LocateFixed,
  Loader2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import type { HealthData, PatientInfo } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { reverseGeocode } from '@/ai/flows/reverse-geocode';

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
  t: any;
};

export function PatientInformation({ data, setData, t }: PatientInformationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const patientData = data.patientInfo;
  const { toast } = useToast();

  const handleFieldChange = (field: keyof PatientInfo | `address.${keyof PatientInfo['address']}`, value: any) => {
    const newData = { ...data };
    if (field.startsWith('address.')) {
        const addressField = field.split('.')[1] as keyof PatientInfo['address'];
        newData.patientInfo.address[addressField] = value;
    } else {
        (newData.patientInfo as any)[field] = value;
    }

    // Sync patient name to consultation booking
    if (field === 'name') {
      newData.consultation.booking.patientName = value;
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

  const handleGenerateId = () => {
    const { name, phone } = patientData;
    if (!name || !phone) {
      toast({
        title: t.idGenerationError.title,
        description: t.idGenerationError.description,
        variant: "destructive"
      });
      return;
    }

    const namePart = name.slice(0, 3).toUpperCase().replace(/\s/g, '');
    const phonePart = phone.slice(-4);
    const timestamp = Date.now().toString().slice(-6);
    const newId = `HC-${namePart}${phonePart}-${timestamp}`;
    
    const newData = {
      ...data,
      patientInfo: {
        ...data.patientInfo,
        uniqueId: newId,
      },
      consultation: {
        ...data.consultation,
        booking: {
          ...data.consultation.booking,
          uniqueId: newId,
        },
      },
    };

    setData(newData);
  };

  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
        variant: 'destructive',
      });
      return;
    }

    setIsFetchingLocation(true);
    toast({
      title: 'Fetching Location...',
      description: 'Please wait while we determine your location.',
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode({ latitude, longitude });

          handleFieldChange('address.line1', address.line1);
          handleFieldChange('address.line2', address.line2 || '');
          handleFieldChange('address.city', address.city);
          handleFieldChange('address.district', address.district);
          handleFieldChange('address.state', address.state);
          handleFieldChange('address.postalCode', address.postalCode);

          toast({
            title: 'Location Found!',
            description: 'Address has been filled in automatically.',
          });
        } catch (error) {
           toast({
            title: 'Could Not Get Address',
            description: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
            variant: 'destructive',
          });
        } finally {
            setIsFetchingLocation(false);
        }
      },
      (error) => {
        toast({
          title: 'Could Not Fetch Location',
          description: `Error: ${error.message}`,
          variant: 'destructive',
        });
        setIsFetchingLocation(false);
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
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
                {t.uploadButton}
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
                <IconLabel icon={User}>{t.fullName}</IconLabel>
              </Label>
              <Input id="name" placeholder={t.fullNamePlaceholder} value={patientData.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">
                <IconLabel icon={Calendar}>{t.age}</IconLabel>
              </Label>
              <Input id="age" type="number" placeholder="35" value={patientData.age} onChange={(e) => handleFieldChange('age', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>
                <IconLabel icon={Heart}>{t.gender}</IconLabel>
              </Label>
              <RadioGroup value={patientData.gender} onValueChange={(value) => handleFieldChange('gender', value)} className="flex items-center gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">{t.genderMale}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">{t.genderFemale}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-binary" id="non-binary" />
                  <Label htmlFor="non-binary">{t.genderNonBinary}</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                <IconLabel icon={Mail}>{t.email}</IconLabel>
              </Label>
              <Input id="email" type="email" placeholder={t.emailPlaceholder} value={patientData.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone">
                <IconLabel icon={Phone}>{t.phone}</IconLabel>
              </Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" value={patientData.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="occupation">
                    <IconLabel icon={Briefcase}>{t.occupation}</IconLabel>
                </Label>
                <Input id="occupation" placeholder={t.occupationPlaceholder} value={patientData.occupation} onChange={(e) => handleFieldChange('occupation', e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label>
                    <IconLabel icon={Users}>{t.maritalStatus.label}</IconLabel>
                </Label>
                 <Select value={patientData.maritalStatus} onValueChange={(value) => handleFieldChange('maritalStatus', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder={t.maritalStatus.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="single">{t.maritalStatus.single}</SelectItem>
                        <SelectItem value="married">{t.maritalStatus.married}</SelectItem>
                        <SelectItem value="divorced">{t.maritalStatus.divorced}</SelectItem>
                        <SelectItem value="widowed">{t.maritalStatus.widowed}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="dateOfVisit">
                    <IconLabel icon={CalendarDays}>{t.dateOfVisit}</IconLabel>
                </Label>
                <Input id="dateOfVisit" type="date" value={patientData.dateOfVisit} onChange={(e) => handleFieldChange('dateOfVisit', e.target.value)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="referredBy">
                    <IconLabel icon={Handshake}>{t.referredBy}</IconLabel>
                </Label>
                <Input id="referredBy" placeholder={t.referredByPlaceholder} value={patientData.referredBy} onChange={(e) => handleFieldChange('referredBy', e.target.value)} />
            </div>
          </div>

          <div className="md:col-span-3 space-y-4 border-t pt-8 mt-2">
            <div className="flex justify-between items-center">
              <Label>
                <IconLabel icon={MapPin}>{t.address.label}</IconLabel>
              </Label>
              <Button variant="outline" size="sm" onClick={handleFetchLocation} disabled={isFetchingLocation}>
                {isFetchingLocation ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="mr-2 h-4 w-4" />
                )}
                Use Current Location
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input id="address1" placeholder={t.address.line1} value={patientData.address.line1} onChange={(e) => handleFieldChange('address.line1', e.target.value)} />
                 <Input id="address2" placeholder={t.address.line2} value={patientData.address.line2} onChange={(e) => handleFieldChange('address.line2', e.target.value)} />
                 <Input id="city" placeholder={t.address.city} value={patientData.address.city} onChange={(e) => handleFieldChange('address.city', e.target.value)} />
                 <Input id="district" placeholder={t.address.district} value={patientData.address.district} onChange={(e) => handleFieldChange('address.district', e.target.value)} />
                 <Input id="state" placeholder={t.address.state} value={patientData.address.state} onChange={(e) => handleFieldChange('address.state', e.target.value)} />
                 <Input id="postal-code" placeholder={t.address.postalCode} value={patientData.address.postalCode} onChange={(e) => handleFieldChange('address.postalCode', e.target.value)} />
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-8 mt-2">
            <div className="space-y-2">
              <Label htmlFor="height">
                <IconLabel icon={Ruler}>{t.height}</IconLabel>
              </Label>
              <Input id="height" type="number" placeholder="180" value={patientData.height} onChange={(e) => handleFieldChange('height', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">
                <IconLabel icon={Weight}>{t.weight}</IconLabel>
              </Label>
              <Input id="weight" type="number" placeholder="75" value={patientData.weight} onChange={(e) => handleFieldChange('weight', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>
                <IconLabel icon={BadgeInfo}>{t.uniqueId}</IconLabel>
                </Label>
                <div className="flex items-center gap-2">
                  <Input id="uniqueId" value={patientData.uniqueId} readOnly className="font-mono bg-muted flex-grow" />
                  <Button type="button" variant="outline" onClick={handleGenerateId}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t.generateButton}
                  </Button>
                </div>
            </div>
          </div>

          <div className="md:col-span-3 border-t pt-8 mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="dob">
                    <IconLabel icon={Calendar}>{t.dob}</IconLabel>
                </Label>
                <Input id="dob" type="date" value={patientData.dob} onChange={(e) => handleFieldChange('dob', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="birth-time">
                    <IconLabel icon={Clock}>{t.birthTime}</IconLabel>
                </Label>
                <Input id="birth-time" type="time" value={patientData.birthTime} onChange={(e) => handleFieldChange('birthTime', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="birth-place">
                    <IconLabel icon={Map}>{t.birthPlace}</IconLabel>
                </Label>
                <Input id="birth-place" placeholder={t.birthPlacePlaceholder} value={patientData.birthPlace} onChange={(e) => handleFieldChange('birthPlace', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label>
                    <IconLabel icon={Baby}>{t.deliveryType.label}</IconLabel>
                </Label>
                <Select value={patientData.deliveryType} onValueChange={(value) => handleFieldChange('deliveryType', value)}>
                    <SelectTrigger>
                        <SelectValue placeholder={t.deliveryType.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">{t.deliveryType.normal}</SelectItem>
                        <SelectItem value="c-section">{t.deliveryType.cSection}</SelectItem>
                        <SelectItem value="forceps">{t.deliveryType.forceps}</SelectItem>
                        <SelectItem value="vacuum">{t.deliveryType.vacuum}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="delivery-time">
                    <IconLabel icon={Truck}>{t.deliveryTime.label}</IconLabel>
                </Label>
                <Input id="delivery-time" placeholder={t.deliveryTime.placeholder} value={patientData.deliveryTime} onChange={(e) => handleFieldChange('deliveryTime', e.target.value)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
