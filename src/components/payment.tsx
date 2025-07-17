'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentForm } from "./payment-form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

type PaymentProps = {
    t: any;
};

export function Payment({ t }: PaymentProps) {
    const [isPaid, setIsPaid] = useState(false);

    if (isPaid) {
        return (
            <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[50vh]">
                <Card className="w-full">
                    <CardHeader className="items-center text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4"/>
                        <CardTitle>{t.success.title}</CardTitle>
                        <CardDescription>{t.success.alertDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="default" className="border-green-200 bg-green-50/50">
                            <CheckCircle className="h-4 w-4 !text-green-600"/>
                            <AlertTitle className="text-green-800">{t.success.alertTitle}</AlertTitle>
                            <AlertDescription className="text-green-700">
                                You can now access all features, including the AI Analysis and Health Report sections.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
       <div className="max-w-2xl mx-auto">
            <Card className="mb-6 text-center">
                <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{t.paymentForm.title}</CardTitle>
                    <CardDescription>{t.paymentForm.description.replace('{amount}', '500')}</CardDescription>
                </CardHeader>
                <CardContent>
                     <PaymentForm amount={500} t={t.paymentForm} onPaymentSuccess={() => setIsPaid(true)} />
                </CardContent>
            </Card>
       </div>
    );
}