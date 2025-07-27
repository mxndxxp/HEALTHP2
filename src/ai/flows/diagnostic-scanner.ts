'use server';
/**
 * @fileOverview Provides an AI-driven diagnostic analysis of a medical image.
 *
 * - diagnosticScanner - A function that analyzes an image (scan or photo) and returns a diagnostic summary.
 * - DiagnosticScannerInput - The input type for the diagnosticScanner function.
 * - DiagnosticScannerOutput - The return type for the diagnosticScanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const DiagnosticScannerInputSchema = z.object({
  image: z.string().describe("An image of a medical scan or a photo of a physical condition, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  prompt: z.string().describe('A specific prompt guiding the analysis, e.g., "Analyze this chest X-ray for signs of pneumonia."'),
});
export type DiagnosticScannerInput = z.infer<typeof DiagnosticScannerInputSchema>;

const DiagnosticScannerOutputSchema = z.object({
  summary: z.string().describe('A brief, high-level summary of the diagnostic findings from the image.'),
  findings: z.string().describe('A point-by-point markdown list of the key findings, anomalies, or observations from the image.'),
});
export type DiagnosticScannerOutput = z.infer<typeof DiagnosticScannerOutputSchema>;

export async function diagnosticScanner(input: DiagnosticScannerInput): Promise<DiagnosticScannerOutput> {
  return diagnosticScannerFlow(input);
}

const diagnosticScannerPrompt = ai.definePrompt({
  name: 'diagnosticScannerPrompt',
  input: {schema: DiagnosticScannerInputSchema},
  output: {schema: DiagnosticScannerOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are a specialized AI medical imaging analyst. Your task is to analyze the provided image based on the user's prompt and provide a concise diagnostic report.

User's Request: "{{prompt}}"

Analyze the following image and provide:
1.  **Summary**: A brief, one or two-sentence summary of the main conclusion.
2.  **Findings**: A point-by-point markdown list of all significant observations, including any abnormalities, their characteristics, and location if possible.

Image for Analysis:
{{media url=image}}
`,
});

const diagnosticScannerFlow = ai.defineFlow(
  {
    name: 'diagnosticScannerFlow',
    inputSchema: DiagnosticScannerInputSchema,
    outputSchema: DiagnosticScannerOutputSchema,
  },
  async input => {
    const {output} = await diagnosticScannerPrompt(input);
    return output!;
  }
);
