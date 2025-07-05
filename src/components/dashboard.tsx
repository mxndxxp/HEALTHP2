'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  HeartPulse,
  Activity,
  Smile,
  FileDown,
  QrCode,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Badge } from './ui/badge';

const lifestyleData = [
  { name: 'Sleep', score: 7, fill: 'hsl(var(--chart-1))' },
  { name: 'Diet', score: 6, fill: 'hsl(var(--chart-2))' },
  { name: 'Activity', score: 8, fill: 'hsl(var(--chart-3))' },
  { name: 'Stress', score: 5, fill: 'hsl(var(--chart-4))' },
];

const symptomData = [
  { month: 'Jan', severity: 4 },
  { month: 'Feb', severity: 5 },
  { month: 'Mar', severity: 3 },
  { month: 'Apr', severity: 6 },
  { month: 'May', severity: 5 },
  { month: 'Jun', severity: 7 },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Summary</h2>
          <p className="text-muted-foreground">
            A comprehensive health data visualization and export system.
          </p>
        </div>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User /> Patient Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">John Doe, 35</p>
            <p className="text-sm text-muted-foreground">ID: HC-1678886400-A9B8C7</p>
            <p className="text-sm">BMI: 23.1 (Normal)</p>
            <div className="flex justify-center pt-2">
                <QrCode className="h-20 w-20"/>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse /> Medical History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">Key Conditions:</p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">Hypertension</Badge>
              <Badge variant="secondary">Appendectomy</Badge>
            </div>
            <p className="font-semibold pt-2">Medications:</p>
             <div className="flex flex-wrap gap-1">
              <Badge>Lisinopril</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity /> Lifestyle Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={lifestyleData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip wrapperClassName="!bg-background !border-border" cursor={{fill: 'hsl(var(--muted))'}}/>
                <Bar dataKey="score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile /> Sense Organs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">Dental:</p>
            <p className="text-sm">2 teeth with sensitivity issues.</p>
             <p className="font-semibold pt-2">Eyes:</p>
            <p className="text-sm">Reports Myopia (nearsightedness).</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Symptom Severity Trend</CardTitle>
            <CardDescription>Severity rated on a 1-10 scale over 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
             <ResponsiveContainer width="100%" height={250}>
                <LineChart data={symptomData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="severity" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="5 5" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip wrapperClassName="!bg-background !border-border" />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
