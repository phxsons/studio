'use server';

/**
 * @fileOverview An AI agent that suggests stops along a road trip route based on user interests and vehicle needs.
 *
 * - suggestStopsAlongRoute - A function that suggests stops.
 * - SuggestStopsInput - The input type for the suggestStopsAlongRoute function.
 * - SuggestStopsOutput - The return type for the suggestStopsAlongRoute function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestStopsInputSchema = z.object({
  origin: z.string().describe('The starting point of the road trip.'),
  destination: z.string().describe('The final destination of the road trip.'),
  waypoints: z.array(z.string()).describe('A list of already planned stops (waypoints).'),
  interests: z.array(z.string()).describe('A list of user interests e.g. hiking, photography, food.'),
  vehicleDetails: z.object({
    make: z.string().describe('The make of the vehicle.'),
    model: z.string().describe('The model of the vehicle.'),
    fuelType: z.string().describe('The fuel type of the vehicle.'),
    mpg: z.number().describe('The MPG of the vehicle.'),
  }).describe('Details about the user vehicle.'),
});

export type SuggestStopsInput = z.infer<typeof SuggestStopsInputSchema>;

const SuggestedStopSchema = z.object({
  name: z.string().describe("The name of the suggested stop."),
  location: z.string().describe("The city and state of the suggested stop."),
  type: z.enum(['interest', 'gas', 'food', 'lodging', 'activity']).describe("The category of the stop."),
  description: z.string().describe("A brief description of why this stop is recommended for the user."),
});

const SuggestStopsOutputSchema = z.object({
  suggestions: z.array(SuggestedStopSchema).describe('A list of suggested stops along the route.'),
});

export type SuggestStopsOutput = z.infer<typeof SuggestStopsOutputSchema>;
export type SuggestedStop = z.infer<typeof SuggestedStopSchema>;


export async function suggestStopsAlongRoute(input: SuggestStopsInput): Promise<SuggestStopsOutput> {
  return suggestStopsAlongRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStopsPrompt',
  input: { schema: SuggestStopsInputSchema },
  output: { schema: SuggestStopsOutputSchema },
  prompt: `You are a personalized travel assistant for the RoadHog app. Your task is to suggest interesting and popular stops along a road trip route based on the user's interests and vehicle fuel needs.

  The trip starts at {{origin}} and ends at {{destination}}.
  The user has already planned the following stops: {{#if waypoints}}{{#each waypoints}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}.

  User Profile:
  - Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  - Vehicle: {{vehicleDetails.make}} {{vehicleDetails.model}} with an MPG of {{vehicleDetails.mpg}} ({{vehicleDetails.fuelType}}).

  Based on the route, please suggest a few stops. The suggestions should be:
  1. Highly relevant to the user's interests.
  2. Popular and well-regarded points of interest.
  3. Geographically located between the origin, waypoints, and destination.
  4. Include suggestions for gas stations, considering the vehicle's MPG to suggest stops before the tank might run low (assume a 15-gallon tank and that it starts full).
  5. Diverse, including activities, food, and points of interest.

  For each suggestion, provide the name, location (city, state), type, and a short description explaining why it's a great choice for this user.
`,
});

const suggestStopsAlongRouteFlow = ai.defineFlow(
  {
    name: 'suggestStopsAlongRouteFlow',
    inputSchema: SuggestStopsInputSchema,
    outputSchema: SuggestStopsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
