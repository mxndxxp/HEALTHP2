'use server';
/**
 * @fileOverview An intelligent chatbot assistant with a medical background.
 *
 * - intelligentChatbot - A function that provides medical advice, navigation support, and explanations.
 * - IntelligentChatbotInput - The input type for the intelligentChatbot function.
 * - IntelligentChatbotOutput - The return type for the intelligentChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  patientData: z.string().optional().describe('The patient data to provide context for the chatbot.'),
});
export type IntelligentChatbotInput = z.infer<typeof IntelligentChatbotInputSchema>;

const IntelligentChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type IntelligentChatbotOutput = z.infer<typeof IntelligentChatbotOutputSchema>;

export async function intelligentChatbot(input: IntelligentChatbotInput): Promise<IntelligentChatbotOutput> {
  return intelligentChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentChatbotPrompt',
  input: {schema: IntelligentChatbotInputSchema},
  output: {schema: IntelligentChatbotOutputSchema},
  prompt: `You are an intelligent chatbot assistant with a medical background. Your goal is to provide medical advice, navigation support, and explanations to the user.

  You have access to the following patient data:
  {{patientData}}

  User message: {{message}}

  Response: `,
});

const intelligentChatbotFlow = ai.defineFlow(
  {
    name: 'intelligentChatbotFlow',
    inputSchema: IntelligentChatbotInputSchema,
    outputSchema: IntelligentChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
