'use server';

/**
 * @fileOverview Provides an AI-driven medical assistant for doctors to analyze patient data.
 *
 * - doctorAiAssistant - A function that generates a detailed analysis for a doctor.
 * - DoctorAiAssistantInput - The input type for the doctorAiAssistant function.
 * - DoctorAiAssistantOutput - The return type for the doctorAiAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const DoctorAiAssistantInputSchema = z.object({
  patientData: z.string().describe("A JSON string of the patient's comprehensive health data, excluding uploaded files."),
  reportDocument: z.string().optional().describe("A medical report image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  prescriptionDocument: z.string().optional().describe("A prescription image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  problemPhoto: z.string().optional().describe("A photo of the medical issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type DoctorAiAssistantInput = z.infer<typeof DoctorAiAssistantInputSchema>;

const DoctorAiAssistantOutputSchema = z.object({
  diagnosticSummary: z.string().describe('A brief, high-level summary of the most important findings from the patient\'s health report, written for a medical professional.'),
  potentialConditions: z.string().describe('A point-by-point markdown list of potential conditions or differential diagnoses, including the reasoning for each based on the provided data.'),
  suggestedTreatments: z.string().describe('A point-by-point markdown list of potential evidence-based treatment suggestions, management plans, and recommended tests or specialist consultations.'),
  followUpQuestions: z.string().describe('A point-by-point markdown list of specific, targeted follow-up questions to ask the patient to gather more information and refine the diagnosis.'),
});
export type DoctorAiAssistantOutput = z.infer<typeof DoctorAiAssistantOutputSchema>;

export async function doctorAiAssistant(input: DoctorAiAssistantInput): Promise<DoctorAiAssistantOutput> {
  return doctorAiAssistantFlow(input);
}

const doctorAiAssistantPrompt = ai.definePrompt({
  name: 'doctorAiAssistantPrompt',
  input: {schema: DoctorAiAssistantInputSchema},
  output: {schema: DoctorAiAssistantOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are a highly advanced AI Medical Assistant for doctors. Your purpose is to provide a detailed, data-driven analysis of a patient's health report to support a medical professional's decision-making process. Your analysis must be clear, structured, and based on evidence from the provided data.

Analyze the patient's comprehensive health report provided below. This includes their self-reported data in JSON format and any uploaded medical documents or photos. Based on your complete analysis, generate the following sections for the attending physician:

1.  **Diagnostic Summary**: Provide a concise summary of the key findings from both the text data and images, using appropriate medical terminology.
2.  **Potential Conditions & Risks**: Create a point-by-point markdown list of potential conditions or differential diagnoses. For each point, briefly state the clinical reasoning based on the available data (e.g., "Diabetes Mellitus Type 2 - suggested by elevated HbA1c, reported polydipsia, and family history."). **Bold** the most likely diagnoses.
3.  **Suggested Treatments & Management**: Create a point-by-point markdown list of evidence-based suggestions for treatment and management. Include recommendations for specific diagnostic tests (e.g., "Comprehensive Metabolic Panel (CMP) to assess kidney and liver function"), specialist referrals (e.g., "Referral to an endocrinologist for diabetes management"), and initial treatment options (e.g., "Consider initiating Metformin 500mg daily.").
4.  **Follow-up Questions for Patient**: Create a point-by-point markdown list of specific, targeted questions to ask the patient on their next visit. These questions should aim to clarify ambiguities, gather more specific details, and help rule in or rule out potential diagnoses. (e.g., "Regarding the reported headaches, can you describe the exact location, character, and any associated visual disturbances?").

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

const doctorAiAssistantFlow = ai.defineFlow(
  {
    name: 'doctorAiAssistantFlow',
    inputSchema: DoctorAiAssistantInputSchema,
    outputSchema: DoctorAiAssistantOutputSchema,
  },
  async input => {
    const {output} = await doctorAiAssistantPrompt(input);
    return output!;
  }
);
