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
  diagnosticSummary: z.string().describe('A concise summary of the most important findings from the patient\'s health report, highlighting key problem areas.'),
  potentialConditions: z.string().describe('A list of potential health conditions or risks identified from the data, along with brief explanations and reasoning.'),
  lifestyleRecommendations: z.string().describe('A list of actionable lifestyle recommendations tailored to the patient to improve their health.'),
  suggestedNextSteps: z.string().describe('Recommendations for next steps, such as specific medical tests, consultations with specialists (e.g., cardiologist, endocrinologist), or follow-up appointments. This should be framed as professional advice, not a definitive diagnosis.'),
});
export type HealthInsightsOutput = z.infer<typeof HealthInsightsOutputSchema>;

export async function healthInsights(input: HealthInsightsInput): Promise<HealthInsightsOutput> {
  return healthInsightsFlow(input);
}

const healthInsightsPrompt = ai.definePrompt({
  name: 'healthInsightsPrompt',
  input: {schema: HealthInsightsInputSchema},
  output: {schema: HealthInsightsOutputSchema},
  prompt: `You are a highly advanced AI with deep learning capabilities, trained extensively on medical data to function as an expert medical diagnostician. Your purpose is to provide a detailed, data-driven analysis of a patient's health report. Your analysis must be clear, structured, and actionable.

IMPORTANT: Your suggestions are for informational purposes and to guide the patient and their healthcare provider. Always include a disclaimer that this analysis is not a substitute for a direct consultation with a qualified medical professional.

Analyze the patient's comprehensive health report provided below in JSON format. Based on your analysis, generate the following:

1.  **Diagnostic Summary**: Provide a concise yet thorough summary of the key findings. **Highlight and bold** the most critical health concerns or abnormal data points that require immediate attention.
2.  **Potential Conditions**: Based on a holistic view of the data, identify potential health risks or underlying conditions. For each condition, explain your reasoning by correlating different data points from the report (e.g., "The combination of high blood pressure in family history, a high-stress lifestyle, and reported palpitations may indicate a risk for cardiovascular disease.").
3.  **Lifestyle Recommendations**: Offer specific, actionable lifestyle changes. Go beyond generic advice; tailor recommendations to the patient's specific data (e.g., "Given the patient's poor sleep quality and high caffeine intake, recommend reducing caffeine after 2 PM and establishing a consistent sleep schedule.").
4.  **Suggested Next Steps**: Provide a clear plan for what the patient should do next. This should include recommendations for specific lab tests (e.g., "A1c blood test for diabetes risk"), consultations with specialists (e.g., "Consult a cardiologist for the reported chest pain"), and follow-up actions. Frame this as guidance for the patient's doctor.

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
