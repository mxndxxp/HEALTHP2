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
  fullReportData: z.string().describe('A JSON string representing the complete health report of a patient, including demographics, medical history, lifestyle, and sense organ assessments.'),
});
export type HealthInsightsInput = z.infer<typeof HealthInsightsInputSchema>;

const HealthInsightsOutputSchema = z.object({
  diagnosticSummary: z.string().describe('A concise summary of the most important findings from the patient\'s health report.'),
  potentialConditions: z.string().describe('A list of potential health conditions or risks identified from the data, along with brief explanations.'),
  lifestyleRecommendations: z.string().describe('A list of actionable lifestyle recommendations tailored to the patient to improve their health.'),
});
export type HealthInsightsOutput = z.infer<typeof HealthInsightsOutputSchema>;

export async function healthInsights(input: HealthInsightsInput): Promise<HealthInsightsOutput> {
  return healthInsightsFlow(input);
}

const healthInsightsPrompt = ai.definePrompt({
  name: 'healthInsightsPrompt',
  input: {schema: HealthInsightsInputSchema},
  output: {schema: HealthInsightsOutputSchema},
  prompt: `You are an expert AI health assistant. Your task is to analyze a patient's comprehensive health report, provided as a JSON string, and generate a detailed analysis.

The report includes patient demographics, medical history, lifestyle factors, and sense organ data.

Carefully review all the information in the following JSON data and provide:
1.  **Diagnostic Summary**: A clear and concise summary of the key findings. Highlight any abnormal or noteworthy data points.
2.  **Potential Conditions**: Based on the combination of all data, identify potential health risks or underlying conditions. For each potential condition, briefly explain your reasoning based on the provided data.
3.  **Lifestyle Recommendations**: Offer specific, actionable advice for lifestyle changes (diet, exercise, sleep, etc.) that could help improve the patient's health based on their profile.

Patient's Full Health Report (JSON format):
{{{fullReportData}}}
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
