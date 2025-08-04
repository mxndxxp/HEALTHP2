
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HeartPulse,
  Activity,
  BedDouble,
  BrainCircuit,
  Thermometer,
  Smartphone,
  Bluetooth,
  TrendingUp,
  FileClock,
  Waves,
  Ruler,
  PersonStanding,
  Footprints,
  Flame,
  Zap,
  Power,
  Bell,
  Pill,
  Link,
  Phone,
  MessageCircle,
  Female,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  status: 'Connected' | 'Not Connected';
  statusColor: string;
};

const MetricCard = ({ icon, title, value, status, statusColor }: MetricCardProps) => (
  <Card className="flex flex-col">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
    <div className="border-t px-6 py-3">
        <Badge style={{ backgroundColor: statusColor, color: 'white' }}>{status}</Badge>
    </div>
  </Card>
);


type DeviceConnectivityProps = {
  t: any;
};

export function DeviceConnectivity({ t }: DeviceConnectivityProps) {
  const text = t;
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectDevice = async () => {
    if (!navigator.bluetooth) {
      toast({
        title: 'Web Bluetooth Not Supported',
        description: 'Your browser does not support the Web Bluetooth API. Please use a compatible browser like Chrome.',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    toast({
      title: 'Scanning for devices...',
      description: 'Please select a Bluetooth device from the browser prompt.',
    });

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: false,
        filters: [
          // Example filter for a common Heart Rate service
          { services: ['heart_rate'] }
        ],
        optionalServices: ['battery_service'], // Add other optional services you might need
      });
      
      toast({
        title: 'Device Selected',
        description: `Connecting to ${device.name || `ID: ${device.id}`}...`,
      });

      const server = await device.gatt?.connect();
      
      console.log('Connected to device:', device);
      console.log('GATT Server:', server);

      toast({
        title: 'Connection Successful!',
        description: `Successfully connected to ${device.name || `ID: ${device.id}`}. Check console for details.`,
      });

    } catch (error) {
      console.error('Bluetooth connection error:', error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('User cancelled')) {
        toast({
          title: 'Scan Cancelled',
          description: 'You cancelled the device selection.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: `Could not connect to the device. Error: ${errorMessage}`,
          variant: 'destructive',
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{text?.title ?? 'Device Connectivity'}</CardTitle>
          <CardDescription>{text?.description ?? 'Manage device connections and permissions'}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleConnectDevice} disabled={isConnecting}>
                {isConnecting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Bluetooth className="mr-2 h-4 w-4" />
                )}
                {isConnecting ? 'Scanning...' : text?.connectButton}
            </Button>
        </CardContent>
      </Card>

      {/* Cardiovascular Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><HeartPulse/> {text?.cardiovascular.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard icon={<HeartPulse className="h-4 w-4 text-muted-foreground" />} title={text?.cardiovascular.heartRate} value="72 bpm" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<Waves className="h-4 w-4 text-muted-foreground" />} title={text?.cardiovascular.ecg} value="Normal Sinus" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} title={text?.cardiovascular.bloodPressure} value="120/80" status="Not Connected" statusColor="#ef4444" />
            <MetricCard icon={<Ruler className="h-4 w-4 text-muted-foreground" />} title={text?.cardiovascular.bloodOxygen} value="98%" status="Connected" statusColor="#22c55e" />
        </CardContent>
      </Card>
      
       {/* Activity & Fitness Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity/> {text?.activity.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard icon={<Footprints className="h-4 w-4 text-muted-foreground" />} title={text?.activity.steps} value="8,452" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<Flame className="h-4 w-4 text-muted-foreground" />} title={text?.activity.calories} value="320 kcal" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<Zap className="h-4 w-4 text-muted-foreground" />} title={text?.activity.exercise} value="35 min" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<Power className="h-4 w-4 text-muted-foreground" />} title={text?.activity.vo2} value="42 ml/kg/min" status="Not Connected" statusColor="#ef4444" />
        </CardContent>
      </Card>

       {/* Sleep Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BedDouble/> {text?.sleep.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard icon={<FileClock className="h-4 w-4 text-muted-foreground" />} title={text?.sleep.stages} value="7h 32m" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} title={text?.sleep.quality} value="88/100" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<Bell className="h-4 w-4 text-muted-foreground" />} title={text?.sleep.apnea} value="None" status="Not Connected" statusColor="#ef4444" />
        </CardContent>
      </Card>

      {/* Stress & Mental Wellness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BrainCircuit/> {text?.stress.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MetricCard icon={<Waves className="h-4 w-4 text-muted-foreground" />} title={text?.stress.levels} value="Low" status="Connected" statusColor="#22c55e" />
            <MetricCard icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} title={text?.stress.management} value="75/100" status="Not Connected" statusColor="#ef4444" />
            <MetricCard icon={<MessageCircle className="h-4 w-4 text-muted-foreground" />} title={text?.stress.mindfulness} value="5 min" status="Connected" statusColor="#22c55e" />
        </CardContent>
      </Card>
      
      {/* Specialized Monitoring & Mobile App */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Thermometer/> {text?.specialized.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.specialized.skinTemp}</p><Button variant="outline" size="sm">{text?.connectButton}</Button></div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.specialized.bloodGlucose}</p><Badge>Upcoming</Badge></div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.specialized.fallDetection}</p><Badge variant="secondary">Enabled</Badge></div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.specialized.menstrual}</p><Button variant="outline" size="sm">{text?.connectButton}</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Smartphone/> {text?.mobile.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.mobile.medication}</p><Button variant="outline" size="sm">Configure</Button></div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.mobile.ehr}</p><Badge>Synced</Badge></div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.mobile.telehealth}</p><Button variant="outline" size="sm">Access</Button></div>
              <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50"><p>{text?.mobile.mentalHealth}</p><Button variant="outline" size="sm">Explore</Button></div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
