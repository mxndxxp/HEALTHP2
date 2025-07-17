'use client';
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, ScanLine, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PaymentFormProps = {
    amount: number;
    t: any;
    onPaymentSuccess: () => void;
};

export function PaymentForm({ amount, t, onPaymentSuccess }: PaymentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            setIsLoading(false);
            onPaymentSuccess();
            toast({
                title: "Payment Successful",
                description: `Your payment of ₹${amount} was processed successfully.`,
            });
        }, 1500);
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card" disabled={isLoading}><CreditCard className="mr-2" />{t.card.tabTitle}</TabsTrigger>
                    <TabsTrigger value="upi" disabled={isLoading}><ScanLine className="mr-2" />{t.upi.tabTitle}</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t.card.nameLabel}</Label>
                            <Input id="name" placeholder={t.card.namePlaceholder} required disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card-number">{t.card.numberLabel}</Label>
                            <Input id="card-number" placeholder={t.card.numberPlaceholder} required disabled={isLoading} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry-month">{t.card.expiryMonthLabel}</Label>
                                <Input id="expiry-month" placeholder="MM" required disabled={isLoading}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expiry-year">{t.card.expiryYearLabel}</Label>
                                <Input id="expiry-year" placeholder="YYYY" required disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">{t.card.cvcLabel}</Label>
                                <Input id="cvc" placeholder="CVC" required disabled={isLoading} />
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="upi" className="mt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="upi-id">{t.upi.idLabel}</Label>
                            <Input id="upi-id" placeholder={t.upi.idPlaceholder} disabled={isLoading} />
                        </div>
                        <div className="text-center text-sm text-muted-foreground my-4">{t.upi.or}</div>
                        <div className="flex justify-center gap-4">
                            <Button variant="outline" type="button" className="flex-1" disabled={isLoading}>{t.upi.gpay}</Button>
                            <Button variant="outline" type="button" className="flex-1" disabled={isLoading}>{t.upi.phonepe}</Button>
                            <Button variant="outline" type="button" className="flex-1" disabled={isLoading}>{t.upi.paytm}</Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            <Button type="submit" size="lg" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    t.payButton.replace('{amount}', amount)
                )}
            </Button>
        </form>
    );
}