'use server';
/**
 * @fileOverview Creates a Razorpay order for payments.
 *
 * - createRazorpayOrder - A function that creates a Razorpay order.
 * - CreateRazorpayOrderInput - The input type for the createRazorpayOrder function.
 * - CreateRazorpayOrderOutput - The return type for the createRazorpayOrder function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import Razorpay from 'razorpay';

const CreateRazorpayOrderInputSchema = z.object({
  amount: z.number().describe('The amount for the order in the smallest currency unit (e.g., paise for INR).'),
});
export type CreateRazorpayOrderInput = z.infer<typeof CreateRazorpayOrderInputSchema>;

const CreateRazorpayOrderOutputSchema = z.object({
  id: z.string().optional(),
  entity: z.string().optional(),
  amount: z.number().optional(),
  amount_paid: z.number().optional(),
  amount_due: z.number().optional(),
  currency: z.string().optional(),
  receipt: z.string().optional(),
  offer_id: z.any().optional(),
  status: z.string().optional(),
  attempts: z.number().optional(),
  notes: z.array(z.any()).optional(),
  created_at: z.number().optional(),
  error: z.string().optional(),
});
export type CreateRazorpayOrderOutput = z.infer<typeof CreateRazorpayOrderOutputSchema>;


export async function createRazorpayOrder(input: CreateRazorpayOrderInput): Promise<CreateRazorpayOrderOutput> {
    return createRazorpayOrderFlow(input);
}


const createRazorpayOrderFlow = ai.defineFlow(
  {
    name: 'createRazorpayOrderFlow',
    inputSchema: CreateRazorpayOrderInputSchema,
    outputSchema: CreateRazorpayOrderOutputSchema,
  },
  async ({ amount }) => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id === 'YOUR_KEY_ID' || key_secret === 'YOUR_KEY_SECRET') {
        const errorMsg = 'Razorpay API keys are not configured in the .env file. Please add your credentials to use the payment feature.';
        console.error(errorMsg);
        return { error: errorMsg };
    }

    try {
      const instance = new Razorpay({ key_id, key_secret });

      const options = {
        amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`
      };

      const order = await instance.orders.create(options);
      console.log("Razorpay order created:", order);
      return order;

    } catch (error: any) {
        console.error('Razorpay order creation failed:', error);
        return { error: error.message || 'An unknown error occurred with Razorpay.' };
    }
  }
);
