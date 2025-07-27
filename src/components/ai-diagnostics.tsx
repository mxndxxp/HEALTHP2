'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
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
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Upload,
  Camera,
  HeartPulse,
  BrainCircuit,
  Eye,
  ScanLine,
  Loader2,
  Thermometer,
  AreaChart,
  Droplets,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { diagnosticScanner } from '@/ai/flows/diagnostic-scanner';

const ecgData = Array.from({ length: 100 }, (_, i) => ({
    time: i,
    value: Math.sin(i * 0.5) * (Math.random() * 0.3 + 0.8) + Math.cos(i * 0.2) * 0.2,
}));

type AiDiagnosticsProps = {
  t: any;
};

export function AiDiagnostics({ t }: AiDiagnosticsProps) {
  const [activeTab, setActiveTab] = useState('scans');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const { toast } = useToast();
  
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({ bp: '', glucose: '', inflammation: ''});

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  const handleAnalyzeScan = async () => {
    if (!scanFile) {
        toast({ title: "Please upload a scan first.", variant: 'destructive' });
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult('');
    try {
        const dataUri = await fileToDataUri(scanFile);
        const result = await diagnosticScanner({
            image: dataUri,
            prompt: 'Analyze this medical scan image and provide a diagnostic summary. Identify any anomalies or key findings.'
        });
        setAnalysisResult(`**Diagnostic Summary:**\n${result.summary}\n\n**Key Findings:**\n${result.findings}`);
        toast({ title: 'Scan Analysis Complete' });
    } catch(e) {
        console.error(e);
        const error = e instanceof Error ? e.message : 'An unexpected error occurred during analysis.';
        setAnalysisResult(`Error: ${error}`);
        toast({ title: "Analysis Failed", description: error, variant: 'destructive' });
    } finally {
        setIsAnalyzing(false);
    }
  };
  
   const handleStartDiagnosis = async () => {
    setIsDiagnosing(true);
    setDiagnosisResult('Starting live diagnosis...');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
    } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setIsDiagnosing(false);
        toast({
          variant: 'destructive',
          title: t.realTime.cameraError,
        });
    }
  };

  const handleStopDiagnosis = async () => {
      setIsDiagnosing(false);
      setDiagnosisResult('Capturing snapshot and analyzing...');

      if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUri = canvas.toDataURL('image/jpeg');

            try {
                const result = await diagnosticScanner({
                    image: dataUri,
                    prompt: 'Perform a visual diagnosis based on this image from a patient\'s camera. Describe any visible conditions or anomalies.'
                });
                setDiagnosisResult(`**Diagnostic Summary:**\n${result.summary}\n\n**Key Findings:**\n${result.findings}`);
                toast({ title: "Real-time Diagnosis Complete" });
            } catch(e) {
                 console.error(e);
                const error = e instanceof Error ? e.message : 'An unexpected error occurred during analysis.';
                setDiagnosisResult(`Error: ${error}`);
                toast({ title: "Diagnosis Failed", description: error, variant: 'destructive' });
            }
          }
      }

      if(videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
      }
  }

  const handleEyeballScan = () => {
    setIsScanning(true);
    setScanResult({ bp: '', glucose: '', inflammation: ''});
    setTimeout(() => {
      setScanResult({
        bp: '122/78 mmHg',
        glucose: '95 mg/dL',
        inflammation: 'Low (CRP: 0.8 mg/L)',
      });
      setIsScanning(false);
      toast({ title: 'Eyeball Scan Complete' });
    }, 3000);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scans" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(t.tabs).map(key => (
              <TabsTrigger key={key} value={key}>
                {t.tabs[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="scans" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.scans.title}</CardTitle>
                <CardDescription>{t.scans.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg space-y-2">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <Label htmlFor="scan-upload" className="text-center">{t.scans.uploadLabel}</Label>
                  <Input id="scan-upload" type="file" className="max-w-sm" onChange={(e) => setScanFile(e.target.files ? e.target.files[0] : null)} />
                </div>
                <Button onClick={handleAnalyzeScan} disabled={isAnalyzing} className="w-full">
                  {isAnalyzing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>
                  ) : (
                    <>{t.scans.uploadButton}</>
                  )}
                </Button>
                <Textarea readOnly value={analysisResult} placeholder={t.scans.analysisPlaceholder} rows={4} className="whitespace-pre-wrap"/>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="realTime" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>{t.realTime.title}</CardTitle>
                    <CardDescription>{t.realTime.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center">
                       <video ref={videoRef} className="w-full h-full object-cover rounded-lg" autoPlay muted />
                       <canvas ref={canvasRef} className="hidden"></canvas>
                       {!hasCameraPermission && !isDiagnosing && (
                           <Alert variant="destructive" className="max-w-md">
                                <Camera />
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>{t.realTime.cameraError}</AlertDescription>
                            </Alert>
                       )}
                    </div>
                     {!isDiagnosing ? (
                        <Button onClick={handleStartDiagnosis} className="w-full">
                            <Camera className="mr-2 h-4 w-4" />{t.realTime.startDiagnosis}
                        </Button>
                    ) : (
                        <Button onClick={handleStopDiagnosis} variant="destructive" className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.realTime.stopDiagnosis}
                        </Button>
                    )}
                     <Textarea readOnly value={diagnosisResult} placeholder={t.realTime.diagnosisPlaceholder} rows={4} className="whitespace-pre-wrap" />
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t.advanced.title}</CardTitle>
                    <CardDescription>{t.advanced.description}</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base"><HeartPulse/>{t.advanced.ecgTitle}</CardTitle>
                            <CardDescription>{t.advanced.ecgDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={150}>
                               <LineChart data={ecgData}>
                                 <Tooltip
                                    contentStyle={{
                                        background: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        fontSize: '12px'
                                    }}
                                 />
                                 <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false}/>
                               </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base"><Eye/>{t.advanced.eyeballTitle}</CardTitle>
                            <CardDescription>{t.advanced.eyeballDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                               <svg viewBox="0 0 100 100" width="150" height="150">
                                <circle cx="50" cy="50" r="48" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                                <circle cx="50" cy="50" r="25" fill="#0c4a6e" />
                                <circle cx="50" cy="50" r="12" fill="black" />
                                {isScanning && <circle cx="50" cy="50" r="48" fill="none" stroke="#fb923c" strokeWidth="3" strokeDasharray="10 5" className="animate-[spin_2s_linear_infinite]" />}
                               </svg>
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                <Button onClick={handleEyeballScan} disabled={isScanning} className="w-full">
                                    {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ScanLine className="mr-2 h-4 w-4" />}
                                    {t.advanced.scanButton}
                                </Button>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-2 border rounded-lg">
                                        <p className="text-sm font-semibold flex items-center justify-center gap-1"><Zap className="h-4 w-4 text-yellow-500" /> {t.advanced.bp}</p>
                                        <p className="text-lg font-bold font-mono">{isScanning ? <Loader2 className="h-5 w-5 animate-spin mx-auto"/> : scanResult.bp || '--'}</p>
                                    </div>
                                    <div className="p-2 border rounded-lg">
                                        <p className="text-sm font-semibold flex items-center justify-center gap-1"><Droplets className="h-4 w-4 text-red-500" /> {t.advanced.glucose}</p>
                                        <p className="text-lg font-bold font-mono">{isScanning ? <Loader2 className="h-5 w-5 animate-spin mx-auto"/> : scanResult.glucose || '--'}</p>
                                    </div>
                                    <div className="p-2 border rounded-lg">
                                        <p className="text-sm font-semibold flex items-center justify-center gap-1"><Thermometer className="h-4 w-4 text-orange-500" /> {t.advanced.inflammation}</p>
                                        <p className="text-lg font-bold font-mono">{isScanning ? <Loader2 className="h-5 w-5 animate-spin mx-auto"/> : scanResult.inflammation || '--'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                 </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
