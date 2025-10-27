'use server';

/**
 * @fileOverview An AI agent that suggests alternative Points of Interest (POIs) when the original POI is closed.
 *
 * - suggestAlternativePoi - A function that suggests an alternative POI based on user profile and the original POI.
 * - SuggestAlternativePoiInput - The input type for the suggestAlternativePoi function.
 * - SuggestAlternativePoiOutput - The return type for the suggestAlternativePoi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindUserLocationOutputSchema = z.object({
  location: z.string().describe('The user\'s current location.'),
});
export type FindUserLocationOutput = z.infer<typeof FindUserLocationOutputSchema>;

export async function findUserLocation(): Promise<FindUserLocationOutput> {
  return findUserLocationFlow();
}

const prompt = ai.definePrompt({
  name: 'findUserLocationPrompt',
  output: {schema: FindUserLocationOutputSchema},
  prompt: `You are a location detection agent. Your goal is to determine the user's current location based on their IP address.
  
  You must determine the user's current location based on their IP address.
`,
});

const findUserLocationFlow = ai.defineFlow(
  {
    name: 'findUserLocationFlow',
    outputSchema: FindUserLocationOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
