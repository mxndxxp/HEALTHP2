
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { createRazorpayOrder } from "@/ai/flows/create-razorpay-order";
import { useToast } from "@/hooks/use-toast";

declare global {
    interface Window {
        Razorpay: any;
    }
}

type PaymentProps = {
    t: any;
    onPaymentSuccess: () => void;
    doctor: { name: string; avatar: string; specialization: string } | undefined;
    patient: { name: string; email: string; phone: string };
};

export function Payment({ t, onPaymentSuccess, doctor, patient }: PaymentProps) {
    const [orderId, setOrderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const consultationFee = 500; // in INR

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const generateOrder = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await createRazorpayOrder({ amount: consultationFee * 100 }); // Amount in paise
                if (result.id) {
                    setOrderId(result.id);
                } else {
                    throw new Error(result.error || 'Failed to create Razorpay order.');
                }
            } catch (err: any) {
                setError(err.message || 'Could not initiate payment.');
                toast({
                    title: "Payment Error",
                    description: err.message,
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        };

        generateOrder();
    }, [toast]);

    const handlePayment = () => {
        if (!orderId || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            toast({
                title: "Payment Initialization Failed",
                description: "Cannot proceed with payment. Order ID or Razorpay Key is missing.",
                variant: 'destructive'
            });
            return;
        }
        
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: consultationFee * 100,
            currency: "INR",
            name: "HealthSight Consultation",
            description: `Booking with ${doctor?.name || 'a doctor'}`,
            image: "https://placehold.co/100x100.png",
            order_id: orderId,
            handler: function (response: any) {
                // Here you would typically verify the payment signature on your backend
                console.log('Payment successful:', response);
                onPaymentSuccess();
                toast({
                    title: "Payment Successful!",
                    description: "Your appointment has been confirmed.",
                });
            },
            prefill: {
                name: patient.name,
                email: patient.email,
                contact: patient.phone
            },
            notes: {
                address: "HealthSight Corporate Office"
            },
            theme: {
                color: "#2563eb" // primary blue
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
             toast({
                title: "Payment Failed",
                description: response.error.description,
                variant: 'destructive'
            });
        });

        rzp.open();
    };

    return (
       <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{t.payment.title}</CardTitle>
                    <CardDescription>{t.payment.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center gap-4 p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Initializing secure payment...</p>
                        </div>
                    ) : error ? (
                         <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : (
                        <div>
                             <div className="text-left p-4 border rounded-lg bg-muted/50 mb-6">
                                <h3 className="font-semibold">Booking Summary</h3>
                                <div className="flex justify-between mt-2"><span>Consultation with {doctor?.name}</span><span>₹{consultationFee}</span></div>
                                <div className="flex justify-between mt-1 text-lg font-bold border-t pt-2"><span>Total</span><span>₹{consultationFee}</span></div>
                            </div>
                            <Button onClick={handlePayment} size="lg" className="w-full">
                                Proceed to Pay ₹{consultationFee}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
       </div>
    );
}
