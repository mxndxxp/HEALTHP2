'use server';

/**
 * @fileOverview Provides AI-driven health analysis based on patient data, acting as an expert medical diagnostician.
 *
 * - aiAnalysis - A function that generates a detailed health analysis.
 * - AiAnalysisInput - The input type for the aiAnalysis function.
 * - AiAnalysisOutput - The return type for the aiAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const AiAnalysisInputSchema = z.object({
  patientData: z.string().describe("A JSON string of the patient's comprehensive health data, excluding uploaded files."),
  reportDocument: z.string().optional().describe("A medical report image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  prescriptionDocument: z.string().optional().describe("A prescription image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  problemPhoto: z.string().optional().describe("A photo of the medical issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AiAnalysisInput = z.infer<typeof AiAnalysisInputSchema>;

const AiAnalysisOutputSchema = z.object({
  diagnosticSummary: z.string().describe('A brief, high-level summary of the most important findings from the patient\'s health report.'),
  highlightedProblems: z.string().describe('A point-by-point markdown list of the key problems, risks, or conditions identified from the data.'),
  suggestedTreatments: z.string().describe('A point-by-point markdown list of potential treatment suggestions, next steps, or cures. This should include recommendations for specific tests or specialist consultations.'),
  lifestyleRecommendations: z.string().describe('A point-by-point markdown list of actionable lifestyle changes and suggestions tailored to the patient.'),
});
export type AiAnalysisOutput = z.infer<typeof AiAnalysisOutputSchema>;

export async function aiAnalysis(input: AiAnalysisInput): Promise<AiAnalysisOutput> {
  return aiAnalysisFlow(input);
}

const aiAnalysisPrompt = ai.definePrompt({
  name: 'aiAnalysisPrompt',
  input: {schema: AiAnalysisInputSchema},
  output: {schema: AiAnalysisOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are a highly advanced AI with deep learning capabilities, trained extensively on medical data to function as an expert medical diagnostician. Your purpose is to provide a detailed, data-driven analysis of a patient's health report. Your analysis must be clear, structured, and actionable, presented in point-by-point markdown lists for clarity.

IMPORTANT: Your suggestions are for informational purposes and to guide the patient and their healthcare provider. Always include a disclaimer that this analysis is not a substitute for a direct consultation with a qualified medical professional.

Analyze the patient's comprehensive health report provided below. This includes their self-reported data in JSON format and any uploaded medical documents or photos. Based on your complete analysis, generate the following:

1.  **Diagnostic Summary**: Provide a concise yet thorough summary of the key findings from both the text data and images.
2.  **Highlighted Problems**: Create a point-by-point markdown list of the most critical health concerns, risks, or abnormal data points that require attention. **Bold** the most severe issues.
3.  **Suggested Treatments and Next Steps**: Create a point-by-point markdown list of suggestions for how to cure or manage the highlighted problems. This should include recommendations for specific lab tests (e.g., "A1c blood test for diabetes risk"), consultations with specialists (e.g., cardiologist, endocrinologist), and other follow-up actions.
4.  **Lifestyle Recommendations**: Create a point-by-point markdown list of specific, actionable lifestyle changes. Go beyond generic advice; tailor recommendations to the patient's specific data (e.g., "Given your high stress level and afternoon headaches, incorporate 10-minute mindfulness breaks into your workday.").

Patient's Health Data (JSON format):
{{{patientData}}}

{{#if reportDocument}}
---
Uploaded Medical Report:
{{media url=reportDocument}}
---
{{/if}}

{{#if prescriptionDocument}}
---
Uploaded Prescription:
{{media url=prescriptionDocument}}
---
{{/if}}

{{#if problemPhoto}}
---
Uploaded Problem Photo:
{{media url=problemPhoto}}
---
{{/if}}
`,
});

const aiAnalysisFlow = ai.defineFlow(
  {
    name: 'aiAnalysisFlow',
    inputSchema: AiAnalysisInputSchema,
    outputSchema: AiAnalysisOutputSchema,
  },
  async input => {
    const {output} = await aiAnalysisPrompt(input);
    return output!;
  }
);
