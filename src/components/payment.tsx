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
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500" /> {t.success.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="default" className="border-green-500">
                            <CheckCircle className="h-4 w-4 !text-green-500"/>
                            <AlertTitle>{t.success.alertTitle}</AlertTitle>
                            <AlertDescription>{t.success.alertDescription}</AlertDescription>
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
