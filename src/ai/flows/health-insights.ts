'use server';

/**
 * @fileOverview Provides AI-driven health insights based on patient data.
 *
 * - healthInsights - A function that generates health insights based on patient data.
 * - HealthInsightsInput - The input type for the healthInsights function.
 * - HealthInsightsOutput - The return type for the healthInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthInsightsInputSchema = z.object({
  patientData: z.string().describe('Comprehensive patient data including demographics and medical history.'),
  medicalHistory: z.string().describe('Detailed medical history including family history, past conditions, and medications.'),
  lifestyleFactors: z.string().describe('Lifestyle assessment including sleep, diet, exercise, and substance use.'),
  senseOrganData: z.string().describe('Assessment data for sense organs and other systems.'),
});
export type HealthInsightsInput = z.infer<typeof HealthInsightsInputSchema>;

const HealthInsightsOutputSchema = z.object({
  diagnosticSummary: z.string().describe('A summary of the patient diagnostic data.'),
  potentialConditions: z.string().describe('Potential health conditions based on the provided data.'),
  lifestyleRecommendations: z.string().describe('Lifestyle recommendations to improve health.'),
});
export type HealthInsightsOutput = z.infer<typeof HealthInsightsOutputSchema>;

export async function healthInsights(input: HealthInsightsInput): Promise<HealthInsightsOutput> {
  return healthInsightsFlow(input);
}

const healthInsightsPrompt = ai.definePrompt({
  name: 'healthInsightsPrompt',
  input: {schema: HealthInsightsInputSchema},
  output: {schema: HealthInsightsOutputSchema},
  prompt: `You are an AI health assistant that takes the patient data, medical history, lifestyle factors, and sense organ data to provide diagnostic summaries, predict potential conditions, and recommend lifestyle improvements.

Patient Data: {{{patientData}}}
Medical History: {{{medicalHistory}}}
Lifestyle Factors: {{{lifestyleFactors}}}
Sense Organ Data: {{{senseOrganData}}}

Generate a diagnostic summary:,
Predict potential conditions:
Recommend lifestyle improvements:
`,
});

const healthInsightsFlow = ai.defineFlow(
  {
    name: 'healthInsightsFlow',
    inputSchema: HealthInsightsInputSchema,
    outputSchema: HealthInsightsOutputSchema,
  },
  async input => {
    const {output} = await healthInsightsPrompt(input);
    return output!;
  }
);
