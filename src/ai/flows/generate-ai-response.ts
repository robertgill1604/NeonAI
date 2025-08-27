'use server';

/**
 * @fileOverview A Genkit flow that generates AI responses based on user prompts.
 *
 * - generateAIResponse - A function that generates an AI response based on a prompt.
 * - GenerateAIResponseInput - The input type for the generateAIResponse function.
 * - GenerateAIResponseOutput - The return type for the generateAIResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAIResponseInputSchema = z.object({
  prompt: z.string().describe('The prompt for generating the AI response.'),
});
export type GenerateAIResponseInput = z.infer<typeof GenerateAIResponseInputSchema>;

const GenerateAIResponseOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});
export type GenerateAIResponseOutput = z.infer<typeof GenerateAIResponseOutputSchema>;

export async function generateAIResponse(input: GenerateAIResponseInput): Promise<GenerateAIResponseOutput> {
  return generateAIResponseFlow(input);
}

const generateAIResponsePrompt = ai.definePrompt({
  name: 'generateAIResponsePrompt',
  input: {schema: GenerateAIResponseInputSchema},
  output: {schema: GenerateAIResponseOutputSchema},
  prompt: `You are a helpful AI assistant. Please respond to the following prompt: {{{prompt}}}`,
});

const generateAIResponseFlow = ai.defineFlow(
  {
    name: 'generateAIResponseFlow',
    inputSchema: GenerateAIResponseInputSchema,
    outputSchema: GenerateAIResponseOutputSchema,
  },
  async input => {
    const {output} = await generateAIResponsePrompt(input);
    return output!;
  }
);
