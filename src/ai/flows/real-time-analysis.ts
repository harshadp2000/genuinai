'use server';

/**
 * @fileOverview Real-time text analysis flow using Gemini API and a custom knowledge base.
 *
 * - analyzeTextStream - A function that streams analysis results of the input text in real-time.
 * - RealTimeAnalysisInput - The input type for the analyzeTextStream function.
 * - RealTimeAnalysisOutput - The return type for the analyzeTextStream function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RealTimeAnalysisInputSchema = z.object({
  text: z.string().describe('The text to analyze.'),
});
export type RealTimeAnalysisInput = z.infer<typeof RealTimeAnalysisInputSchema>;

const RealTimeAnalysisOutputSchema = z.object({
  analysis: z.string().describe('The real-time analysis of the text.'),
});
export type RealTimeAnalysisOutput = z.infer<typeof RealTimeAnalysisOutputSchema>;

export async function analyzeTextStream(input: RealTimeAnalysisInput): Promise<RealTimeAnalysisOutput> {
  return realTimeAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'realTimeAnalysisPrompt',
  input: {schema: RealTimeAnalysisInputSchema},
  output: {schema: RealTimeAnalysisOutputSchema},
  prompt: `You are an AI text analysis expert. Analyze the following text in real-time, providing nuanced insights based on your extensive knowledge base.\n\nText: {{{text}}}`,
});

const realTimeAnalysisFlow = ai.defineFlow(
  {
    name: 'realTimeAnalysisFlow',
    inputSchema: RealTimeAnalysisInputSchema,
    outputSchema: RealTimeAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
