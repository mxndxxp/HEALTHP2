'use server';
/**
 * @fileOverview Provides an AI-driven analysis of a fingerprint to estimate health metrics.
 *
 * - fingerprintScanner - A function that analyzes a fingerprint and returns estimated biometric data.
 * - FingerprintScannerInput - The input type for the fingerprintScanner function.
 * - FingerprintScannerOutput - The return type for the fingerprintScanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const FingerprintScannerInputSchema = z.object({
  // No input needed, the prompt generates the data.
});
export type FingerprintScannerInput = z.infer<typeof FingerprintScannerInputSchema>;

const FingerprintScannerOutputSchema = z.object({
    cardiovascular: z.object({
        heartRate: z.string().describe('Estimated heart rate (e.g., "72 bpm").'),
        hrv: z.string().describe('Estimated Heart Rate Variability (e.g., "45 ms").'),
    }),
    perfusion: z.object({
        spo2: z.string().describe('Estimated Blood Oxygen Saturation (e.g., "98%").'),
        capillaryRefill: z.string().describe('Estimated Capillary Refill Time (e.g., "< 2 seconds").'),
    }),
    neurological: z.object({
        tremor: z.string().describe('Tremor detection analysis (e.g., "No significant tremor detected").'),
        sweatActivity: z.string().describe('Sweat gland activity analysis (e.g., "Normal").'),
    }),
    metabolic: z.object({
        glucose: z.string().describe('Estimated Blood Glucose Level (e.g., "90 mg/dL - Experimental").'),
        alcohol: z.string().describe('Estimated Blood Alcohol Level (e.g., "0.00% BAC").'),
    }),
    dermatological: z.object({
        hydration: z.string().describe('Estimated skin hydration level (e.g., "Good").'),
        woundHealing: z.string().describe('Wound healing tracking analysis (e.g., "No wounds detected").'),
    }),
});
export type FingerprintScannerOutput = z.infer<typeof FingerprintScannerOutputSchema>;

export async function fingerprintScanner(
  input: FingerprintScannerInput
): Promise<FingerprintScannerOutput> {
  return fingerprintScannerFlow(input);
}

const fingerprintScannerPrompt = ai.definePrompt({
  name: 'fingerprintScannerPrompt',
  input: {schema: FingerprintScannerInputSchema},
  output: {schema: FingerprintScannerOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are a futuristic biometric analysis tool that can estimate a wide range of health metrics from a simulated fingerprint scan. Based on a standard healthy adult, generate realistic but estimated values for all fields in the output schema. Mark highly experimental fields like blood glucose with "(Experimental)".`,
});

const fingerprintScannerFlow = ai.defineFlow(
  {
    name: 'fingerprintScannerFlow',
    inputSchema: FingerprintScannerInputSchema,
    outputSchema: FingerprintScannerOutputSchema,
  },
  async (input) => {
    const {output} = await fingerprintScannerPrompt(input);
    return output!;
  }
);
