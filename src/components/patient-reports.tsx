
'use client';

import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileDown, AlertTriangle, FileHeart } from 'lucide-react';
import type { Report } from '@/lib/types';
import { subscribeToPatientReports } from '@/lib/report-service';

const PrintableReport = React.forwardRef(({ reportData }: any, ref: any) => {
    if (!reportData) return null;
    return (
        <div ref={ref} className="p-8 bg-white text-black font-sans">
            <header className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h1 className="text-2xl font-bold text-primary">HealthSight Medical Report</h1>
                    <p className="text-sm">Generated on: {new Date(reportData.createdAt.toDate()).toLocaleDateString()}</p>
                </div>
                <div>
                    <p><span className="font-semibold">Doctor:</span> {reportData.doctorName}</p>
                </div>
            </header>
            <section className="py-4 border-b">
                <h2 className="text-lg font-semibold">Patient Details</h2>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <p><span className="font-semibold">Patient ID:</span> {reportData.patientId}</p>
                </div>
            </section>
            <main className="py-6">
                <h2 className="text-lg font-semibold mb-2">Report Content</h2>
                <div className="p-4 border rounded-md bg-gray-50 min-h-[400px]">
                    <p className="whitespace-pre-wrap">{reportData.content}</p>
                </div>
            </main>
            <footer className="pt-8 mt-16">
                 <h3 className="font-semibold">Doctor's Signature:</h3>
                 <div className="mt-4 border-t pt-2">
                    {reportData.signatureDataUrl && <img src={reportData.signatureDataUrl} alt="Doctor's Signature" className="h-20 w-auto" />}
                 </div>
                 <p className="text-xs text-gray-500 mt-4">Report Approved on: {new Date(reportData.approvedAt.toDate()).toLocaleString()}</p>
            </footer>
        </div>
    );
});
PrintableReport.displayName = 'PrintableReport';


export function PatientReports({ patientId, t }: { patientId: string, t: any }) {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const reportToPrintRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!patientId) return;
        
        setIsLoading(true);
        const unsubscribe = subscribeToPatientReports(patientId, (approvedReports) => {
            setReports(approvedReports);
            setIsLoading(false);
        }, (err) => {
            console.error("Failed to fetch reports:", err);
            setError("Could not load your reports. Please try again later.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [patientId]);

    const handlePrint = useReactToPrint({
        content: () => reportToPrintRef.current,
        documentTitle: `report-${selectedReport?.id}`,
        onBeforeGetContent: () => Promise.resolve(),
    });

    const handleDownloadClick = (report: Report) => {
        setSelectedReport(report);
        setTimeout(() => handlePrint(), 0);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex justify-center items-center p-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {error && (
                    <div className="flex flex-col items-center justify-center p-10 text-destructive">
                        <AlertTriangle className="h-8 w-8 mb-2"/>
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && reports.length === 0 && (
                     <div className="flex flex-col items-center justify-center p-10 text-muted-foreground border-2 border-dashed rounded-lg">
                        <FileHeart className="h-10 w-10 mb-4" />
                        <p className="font-semibold">{t.noReports.title}</p>
                        <p className="text-sm">{t.noReports.description}</p>
                    </div>
                )}
                {!isLoading && !error && reports.length > 0 && (
                    <Accordion type="single" collapsible className="w-full">
                        {reports.map((report) => (
                            <AccordionItem value={report.id} key={report.id}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full pr-4">
                                        <div className="flex items-center gap-3">
                                            <FileHeart className="h-5 w-5 text-primary" />
                                            <div className="text-left">
                                                <p className="font-semibold">Report from {report.doctorName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Dated: {new Date(report.createdAt.toDate()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Approved</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 space-y-4">
                                    <div className="p-4 border rounded-md bg-muted/50 max-h-48 overflow-y-auto">
                                        <p className="text-sm whitespace-pre-wrap">{report.content}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-semibold">Doctor's Signature:</p>
                                            <img src={report.signatureDataUrl} alt="Signature" className="h-16 w-32 object-contain bg-white p-1 border rounded-md" />
                                        </div>
                                        <Button onClick={() => handleDownloadClick(report)}>
                                            <FileDown className="mr-2 h-4 w-4" /> Download PDF
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
            {/* Hidden component for printing */}
            <div className="hidden">
                <PrintableReport ref={reportToPrintRef} reportData={selectedReport} />
            </div>
        </Card>
    );
}
