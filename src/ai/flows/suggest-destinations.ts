'use server';

/**
 * @fileOverview An AI agent that suggests top-rated destinations based on user interests.
 *
 * - suggestDestinations - A function that suggests destinations.
 * - SuggestDestinationsInput - The input type for the suggestDestinations function.
 * - SuggestDestinationsOutput - The return type for the suggestDestinations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { userProfile } from '@/lib/data';

const SuggestedDestinationSchema = z.object({
  name: z.string().describe("The name of the suggested destination."),
  location: z.string().describe("The city and state of the suggested destination."),
  rating: z.number().describe("A rating out of 5, can be a float."),
  category: z.string().describe("The category of the destination (e.g., National Park, Museum, Restaurant)."),
  description: z.string().describe("A brief description of why this destination is recommended for the user based on their interests."),
});

const SuggestDestinationsOutputSchema = z.object({
  destinations: z.array(SuggestedDestinationSchema).describe('A list of suggested destinations.'),
});

export type SuggestedDestination = z.infer<typeof SuggestedDestinationSchema>;
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;


export async function suggestDestinations(): Promise<SuggestDestinationsOutput> {
  // In a real app, you'd pass the current user's interests.
  // For now, we'll use the hardcoded user profile.
  return suggestDestinationsFlow({ interests: userProfile.interests });
}

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: z.object({ interests: z.array(z.string()) }),
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async ({ interests }) => {
    const prompt = `You are a travel expert for the RoadHog app. Your task is to suggest top-rated destinations based on a user's interests.

User Interests: ${interests.join(", ")}

Based on these interests, please suggest 5 destinations. The suggestions should be:
1. Highly relevant to the user's interests.
2. Well-known and popular destinations (e.g., national parks, famous museums, iconic landmarks).
3. Geographically diverse within the United States.

For each suggestion, provide the name, location (city, state), a rating (out of 5), the category, and a short description explaining why it's a great choice for this user.
`;
    
    const { output } = await ai.generate({
      prompt: prompt,
      output: { schema: SuggestDestinationsOutputSchema },
    });
    return output!;
  }
);
