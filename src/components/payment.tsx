'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type PaymentProps = {
    t: any;
    onPaymentSuccess: () => void;
};

export function Payment({ t, onPaymentSuccess }: PaymentProps) {
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        // Simulate a successful payment after a short delay
        const timer = setTimeout(() => {
            setIsPaid(true);
            onPaymentSuccess();
        }, 1500);

        return () => clearTimeout(timer);
    }, [onPaymentSuccess]);


    return (
       <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                     {isPaid ? (
                        <Alert variant="default" className="border-green-200 bg-green-50/50 text-left">
                            <CheckCircle className="h-4 w-4 !text-green-600"/>
                            <AlertTitle className="text-green-800">{t.success.alertTitle}</AlertTitle>
                            <AlertDescription className="text-green-700">
                                {t.success.alertDescription}
                            </AlertDescription>
                        </Alert>
                     ) : (
                        <div className="flex flex-col items-center justify-center gap-4 p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Processing confirmation...</p>
                        </div>
                     )}
                </CardContent>
            </Card>
       </div>
    );
}
