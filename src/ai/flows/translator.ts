'use server';

/**
 * @fileOverview A flow for translating text to a specified language.
 * This flow can handle both single strings and JSON strings containing multiple text values.
 *
 * - translateText - A function that translates a given text to a target language.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to be translated. This can be a simple string or a JSON string of key-value pairs.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Hindi", "Tamil").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text. If the input was JSON, this will be the translated JSON string.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translateTextPrompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `You are an expert translator. Your task is to translate the provided text to {{targetLanguage}}.

- If the input text is a JSON string, translate only the string values of the JSON object.
- Keep the JSON keys and the overall structure exactly the same.
- Do not add, remove, or change any keys in the JSON.
- Preserve any HTML-like tags (e.g., <br />) or placeholders (e.g., {name}) in the translated strings.
- Return a single, valid, translated JSON string as your output.

- If the input text is a simple string (not JSON), just translate the string.

Return only the translated text (or JSON string), with no preamble or explanation.

Text to translate:
"{{text}}"
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await translateTextPrompt(input);
    return output!;
  }
);
