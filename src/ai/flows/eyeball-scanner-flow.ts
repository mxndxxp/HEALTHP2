'use server';
/**
 * @fileOverview Provides an AI-driven analysis of an eyeball image to estimate health metrics.
 *
 * - eyeballScanner - A function that analyzes an image of an eye and returns estimated biometric data.
 * - EyeballScannerInput - The input type for the eyeballScanner function.
 * - EyeballScannerOutput - The return type for the eyeballScanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const EyeballScannerInputSchema = z.object({
  image: z
    .string()
    .describe(
      "An image of a human eyeball, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EyeballScannerInput = z.infer<typeof EyeballScannerInputSchema>;

const EyeballScannerOutputSchema = z.object({
  bloodPressure: z
    .string()
    .describe('The estimated blood pressure (e.g., "120/80 mmHg").'),
  bloodGlucose: z
    .string()
    .describe('The estimated blood glucose level (e.g., "95 mg/dL").'),
  inflammation: z
    .string()
    .describe(
      'The estimated inflammation level, with a CRP value (e.g., "Low (CRP: 0.8 mg/L)").'
    ),
});
export type EyeballScannerOutput = z.infer<typeof EyeballScannerOutputSchema>;

export async function eyeballScanner(
  input: EyeballScannerInput
): Promise<EyeballScannerOutput> {
  return eyeballScannerFlow(input);
}

const eyeballScannerPrompt = ai.definePrompt({
  name: 'eyeballScannerPrompt',
  input: {schema: EyeballScannerInputSchema},
  output: {schema: EyeballScannerOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are a highly advanced, non-invasive diagnostic tool that analyzes images of the human eye to estimate key health metrics. Your analysis is based on interpreting subtle indicators in the retinal and scleral vasculature.

Analyze the following image of an eyeball and provide the estimated values for:
1.  **Blood Pressure**: Estimate the systolic and diastolic pressure.
2.  **Blood Glucose**: Estimate the blood glucose level.
3.  **Inflammation**: Estimate the systemic inflammation level and provide a corresponding C-reactive protein (CRP) value.

Image for Analysis:
{{media url=image}}
`,
});

const eyeballScannerFlow = ai.defineFlow(
  {
    name: 'eyeballScannerFlow',
    inputSchema: EyeballScannerInputSchema,
    outputSchema: EyeballScannerOutputSchema,
  },
  async (input) => {
    const {output} = await eyeballScannerPrompt(input);
    return output!;
  }
);
