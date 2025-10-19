'use server';

/**
 * @fileOverview A bias detection AI agent that analyzes text prompts for potential biases using RAG.
 *
 * - detectBiasFromPrompt - A function that handles the bias detection process.
 * - DetectBiasFromPromptInput - The input type for the detectBiasFromPrompt function.
 * - DetectBiasFromPromptOutput - The return type for the detectBiasFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectBiasFromPromptInputSchema = z.object({
  promptText: z
    .string()
    .describe('The text prompt to be analyzed for potential biases.'),
});
export type DetectBiasFromPromptInput = z.infer<typeof DetectBiasFromPromptInputSchema>;

const DetectBiasFromPromptOutputSchema = z.object({
  biasDetected: z
    .boolean()
    .describe('Whether or not bias was detected in the input prompt.'),
  biasExplanation: z
    .string()
    .describe('An explanation of the biases detected in the input prompt.'),
});
export type DetectBiasFromPromptOutput = z.infer<typeof DetectBiasFromPromptOutputSchema>;

export async function detectBiasFromPrompt(
  input: DetectBiasFromPromptInput
): Promise<DetectBiasFromPromptOutput> {
  return detectBiasFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectBiasFromPromptPrompt',
  input: {schema: DetectBiasFromPromptInputSchema},
  output: {schema: DetectBiasFromPromptOutputSchema},
  prompt: `You are an AI expert in detecting biases in text. You will analyze the given prompt for any potential biases.

  Prompt: {{{promptText}}}

  Based on your analysis, determine if any biases are present.
  If bias is detected:
  1. For each recognized bias, provide the bias title in bold (e.g., **Gender Bias**) on a new line, followed by its explanation.
  2. After detailing all biases, add a final paragraph with any other psychoanalysis of the text.
  3. Do not include any form of summary.
  If no bias is detected, explain why the text is considered neutral.

  Set the biasDetected field to true if bias is present, otherwise false.
  Provide the detailed explanation in the biasExplanation field.
  Follow the schema output format strictly.
  `,
});

const detectBiasFromPromptFlow = ai.defineFlow(
  {
    name: 'detectBiasFromPromptFlow',
    inputSchema: DetectBiasFromPromptInputSchema,
    outputSchema: DetectBiasFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
