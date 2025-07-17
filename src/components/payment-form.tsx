
'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PaymentFormProps = {
    amount: number;
    t: any;
    onPaymentSuccess: () => void;
};

// Define the Razorpay options type for type safety
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: { razorpay_payment_id: string }) => void;
    prefill: {
        name: string;
        email: string;
        contact: string;
    };
    notes: {
        address: string;
    };
    theme: {
        color: string;
    };
}

// Extend the Window interface to include Razorpay
declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => {
            open: () => void;
            on: (event: string, callback: () => void) => void;
        };
    }
}


export function PaymentForm({ amount, t, onPaymentSuccess }: PaymentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Add Razorpay script to the page
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // Step 1: Call our backend to create a Razorpay order
            const orderResponse = await fetch('/api/create-razorpay-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });

            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order.');
            }
            
            const order = await orderResponse.json();

            // Step 2: Open Razorpay checkout with the order details
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxxx', // Use public key from env or a dummy
                amount: order.amount,
                currency: order.currency,
                name: 'HealthSight Platform',
                description: 'Comprehensive Health Report Fee',
                order_id: order.id,
                handler: (response) => {
                    // This function is called after a successful payment
                    console.log('Razorpay Payment ID:', response.razorpay_payment_id);
                    toast({
                        title: "Payment Successful",
                        description: `Your payment of ₹${amount} was processed.`,
                    });
                    onPaymentSuccess();
                },
                prefill: {
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    contact: '+919876543210'
                },
                notes: {
                    address: 'HealthSight Corp Office'
                },
                theme: {
                    color: '#2563EB' // Matches primary theme color
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', () => {
                 toast({
                    title: "Payment Failed",
                    description: "Please try again or use a different payment method.",
                    variant: 'destructive'
                });
            });

            rzp.open();

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Could not initiate payment. Please try again.",
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="text-center">
             <Button 
                onClick={handlePayment} 
                size="lg" 
                className="w-full mt-6" 
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.processingButton || 'Processing...'}
                    </>
                ) : (
                    t.payButton.replace('{amount}', amount)
                )}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">{t.secureNote || 'Your payment is processed securely by Razorpay.'}</p>
        </div>
    );
}
