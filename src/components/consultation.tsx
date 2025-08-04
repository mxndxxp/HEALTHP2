
'use client';
import { useState, useRef, useEffect } from 'react';
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
} from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { HealthData, Doctor } from '@/lib/types';
import { User, Video as VideoIcon, Upload, MessageSquare, Phone, AlertTriangle, CheckCircle, Loader2, Link as LinkIcon, Copy } from 'lucide-react';
import { Payment } from './payment';
import { useToast as useAppToast } from '@/hooks/use-toast';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Progress } from '@/components/ui/progress';


type ConsultationProps = {
  data: HealthData;
  onDataChange: (section: keyof HealthData, data: any) => void;
  t: any;
  patientId: string;
};

export function Consultation({ data, onDataChange, t, patientId }: ConsultationProps) {
  const [activeTab, setActiveTab] = useState('booking');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast: appToast } = useAppToast();


  const { consultation, patientInfo } = data;
  const { booking, doctors } = consultation;

  const handleBookingChange = (field: keyof typeof booking, value: any) => {
    onDataChange('consultation', {
      ...consultation,
      booking: { ...booking, [field]: value },
    });
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleBookingChange('report', e.target.files[0]);
    }
  };
  
  const selectedDoctor = doctors.find(doc => doc.id === booking.doctorId);

  const handleBookingConfirmation = () => {
    setBookingConfirmed(true);
    appToast({
        title: "Appointment Confirmed",
        description: `Your appointment with ${selectedDoctor?.name} is booked.`,
        caseHistory: {
          type: 'Consultation Booked',
          description: `Appointment booked with ${selectedDoctor?.name}.`
        }
    })
  }
  
  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setVideoUrl(null);

    const storageRef = ref(storage, `consultation_videos/${patientId}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        appToast({
          title: "Upload Failed",
          description: "There was an error uploading your video. Please try again.",
          variant: 'destructive',
        });
        setIsUploading(false);
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoUrl(downloadURL);
          appToast({
            title: "Video Uploaded Successfully",
            description: "Your video has been sent to the doctor for review.",
            caseHistory: {
              type: 'Video Consultation',
              description: 'Patient uploaded a video for review.',
              details: { url: downloadURL }
            }
          });
          setIsUploading(false);
        });
      }
    );
  };
  
  const copyToClipboard = () => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl);
      appToast({
        title: "Copied to Clipboard",
        description: "The video link has been copied.",
      });
    }
  };


  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        appToast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };
    if (activeTab === 'session' && bookingConfirmed) {
      getCameraPermission();
    }
  }, [activeTab, appToast, bookingConfirmed]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="booking" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="booking">{t.tabs.booking}</TabsTrigger>
            <TabsTrigger value="session" disabled={!bookingConfirmed}>{t.tabs.session}</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="mt-4">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>{t.booking.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>{t.booking.selectDoctor}</Label>
                            <div className="flex gap-2">
                                <Select onValueChange={(val) => handleBookingChange('doctorId', val)} disabled={bookingConfirmed}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.booking.noDoctorSelected} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map(doctor => (
                                            <SelectItem key={doctor.id} value={String(doctor.id)}>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={doctor.avatar} data-ai-hint="doctor avatar" />
                                                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p>{doctor.name}</p>
                                                        <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="patient-name">{t.booking.patientNameLabel}</Label>
                                <Input id="patient-name" value={booking.patientName} onChange={(e) => handleBookingChange('patientName', e.target.value)} disabled={bookingConfirmed} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unique-id">{t.booking.uniqueIdLabel}</Label>
                                <Input id="unique-id" value={booking.uniqueId} readOnly />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="problem">{t.booking.problemLabel}</Label>
                            <Textarea id="problem" value={booking.problem} onChange={(e) => handleBookingChange('problem', e.target.value)} placeholder={t.booking.problemPlaceholder} disabled={bookingConfirmed}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="report-upload">{t.booking.reportLabel}</Label>
                            <Input id="report-upload" type="file" onChange={handleFileChange} disabled={bookingConfirmed} />
                        </div>
                    </CardContent>
                </Card>

                 <div className="lg:col-span-1">
                    {booking.doctorId && !bookingConfirmed ? (
                        <Payment 
                            t={t} 
                            onPaymentSuccess={handleBookingConfirmation} 
                            doctor={selectedDoctor}
                            patient={patientInfo}
                        />
                    ) : bookingConfirmed ? (
                        <Card className="flex flex-col items-center justify-center h-full text-center">
                            <CardHeader>
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto"/>
                                <CardTitle className="mt-4">Appointment Confirmed!</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Your booking with {selectedDoctor?.name} is complete. You can now proceed to the "Start Consultation" tab.</p>
                            </CardContent>
                        </Card>
                    ) : (
                         <Card className="flex items-center justify-center h-full">
                            <CardContent>
                                <p className="text-muted-foreground">{t.booking.selectDoctorFirst}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

            </div>
          </TabsContent>

          <TabsContent value="session" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t.session.title}</CardTitle>
                    <CardDescription>{selectedDoctor ? `Your appointment is with ${selectedDoctor.name}. ${t.session.description}` : 'Please book an appointment first.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    {selectedDoctor && bookingConfirmed ? (
                        <Tabs defaultValue="video" className="w-full">
                             <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                                <TabsTrigger value="video"><VideoIcon className="mr-2"/>{t.session.videoTitle}</TabsTrigger>
                                <TabsTrigger value="chat"><MessageSquare className="mr-2"/>{t.session.chatTitle}</TabsTrigger>
                                <TabsTrigger value="call"><Phone className="mr-2"/>{t.session.callTitle}</TabsTrigger>
                                <TabsTrigger value="upload"><Upload className="mr-2"/>{t.session.uploadTitle}</TabsTrigger>
                             </TabsList>
                             <TabsContent value="video" className="mt-4">
                                <Card className="w-full">
                                    <CardContent className="p-0 flex flex-col items-center justify-center bg-black rounded-lg relative aspect-video">
                                        <p className="text-white absolute top-4">{t.session.videoConference.connecting.replace('{name}', selectedDoctor.name)}</p>
                                        <video ref={videoRef} className="w-full h-full object-cover rounded-md" autoPlay muted />
                                        { !hasCameraPermission && (
                                            <div className="absolute inset-0 flex items-center justify-center p-4">
                                                <Alert variant="destructive" className="max-w-md">
                                                    <AlertTriangle />
                                                    <AlertTitle>{t.session.videoConference.cameraErrorTitle}</AlertTitle>
                                                    <AlertDescription>{t.session.videoConference.cameraErrorDesc}</AlertDescription>
                                                </Alert>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                             </TabsContent>
                             <TabsContent value="chat" className="mt-4">
                                <div className="text-center p-10 border rounded-lg">
                                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">{t.session.chatTitle}</h3>
                                    <p className="text-muted-foreground mt-2">{t.session.chatDesc}</p>
                                    <Button className="mt-4">{t.session.startButton}</Button>
                                </div>
                             </TabsContent>
                             <TabsContent value="call" className="mt-4">
                                <div className="text-center p-10 border rounded-lg">
                                    <Phone className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">{t.session.callTitle}</h3>
                                    <p className="text-muted-foreground mt-2">{t.session.callDesc}</p>
                                    <Button className="mt-4">{t.session.startButton}</Button>
                                </div>
                             </TabsContent>
                              <TabsContent value="upload" className="mt-4">
                                <div className="text-center p-10 border rounded-lg">
                                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <h3 className="mt-4 text-lg font-semibold">{t.session.uploadTitle}</h3>
                                  <p className="text-muted-foreground mt-2">{t.session.uploadDesc}</p>
                                  
                                  {isUploading && uploadProgress !== null ? (
                                    <div className="mt-4 w-full max-w-sm mx-auto">
                                      <Progress value={uploadProgress} />
                                      <p className="text-sm mt-2">{Math.round(uploadProgress)}% uploaded</p>
                                    </div>
                                  ) : videoUrl ? (
                                    <div className="mt-4 w-full max-w-sm mx-auto">
                                      <p className="text-green-600 font-semibold mb-2">Upload Complete!</p>
                                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
                                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                        <Input value={videoUrl} readOnly className="flex-1"/>
                                        <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button className="mt-4" asChild>
                                      <Label htmlFor="video-upload">{t.session.uploadButton}</Label>
                                    </Button>
                                  )}

                                  <Input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={isUploading}/>
                                </div>
                              </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="text-center p-10 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Please book and confirm an appointment first.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
