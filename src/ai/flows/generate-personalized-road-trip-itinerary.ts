'use server';

/**
 * @fileOverview Generates a personalized road trip itinerary based on user profile and trip details.
 *
 * - generatePersonalizedRoadTripItinerary - A function that generates the itinerary.
 * - RoadTripItineraryInput - The input type for the generatePersonalizedRoadTripItinerary function.
 * - RoadTripItineraryOutput - The return type for the generatePersonalizedRoadTripItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RoadTripItineraryInputSchema = z.object({
  startingPoint: z.string().describe('The starting point of the road trip.'),
  destination: z.string().describe('The final destination of the road trip.'),
  tripType: z.array(z.string()).describe('The type of trip (e.g., Business, Leisure, Family Vacation).'),
  vehicleType: z.array(z.string()).describe('The type of vehicle being used.'),
  interests: z.array(z.string()).describe('A list of user interests e.g. hiking, photography, food.'),
  lodgingPreferences: z.array(z.string()).describe('Preferred lodging options, e.g., hotels, RV parks, camping.'),
  lodgingMemberships: z.array(z.string()).optional().describe('Any lodging memberships the user has (e.g., KOA, Harvest Host).'),
});

export type RoadTripItineraryInput = z.infer<typeof RoadTripItineraryInputSchema>;

const ItineraryStopSchema = z.object({
  name: z.string().describe('The name of the stop or point of interest.'),
  location: z.string().describe('The city and state of the stop.'),
  activity: z.string().describe('A suggested activity or description for this stop.'),
});

const RoadTripItineraryOutputSchema = z.object({
  itinerary: z
    .array(ItineraryStopSchema)
    .describe('A list of stops for the road trip itinerary, including location and suggested activities.'),
});

export type RoadTripItineraryOutput = z.infer<typeof RoadTripItineraryOutputSchema>;

export async function generatePersonalizedRoadTripItinerary(
  input: RoadTripItineraryInput
): Promise<RoadTripItineraryOutput> {
  return generatePersonalizedRoadTripItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'roadTripItineraryPrompt',
  input: {schema: RoadTripItineraryInputSchema},
  output: {schema: RoadTripItineraryOutputSchema},
  prompt: `You are a personalized travel assistant. Your goal is to generate a detailed road trip itinerary based on the user's preferences, interests and vehicle.

  The trip will start at {{startingPoint}} and end at {{destination}}.

  Here are the user's trip details:
  - Trip Type: {{#each tripType}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  - Vehicle Type: {{#each vehicleType}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  - Interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  - Lodging Preferences: {{#each lodgingPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  {{#if lodgingMemberships.length}}
  - Lodging Memberships: {{#each lodgingMemberships}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  {{/if}}

  Generate a list of objects, each describing one stop in the itinerary for the road trip. 
  For each stop, provide a name, location (city, state), and a suggested activity.
  The itinerary should be a logical route from the start to the destination.
  Optimize the recommended stops, activities, and lodging options for scenic value, accessibility, and any membership benefits mentioned.
  Create a reasonable number of stops based on the distance between the start and end points. A cross-country trip might have 5-7 stops, while a shorter trip might have 2-3.
`,
});

const generatePersonalizedRoadTripItineraryFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRoadTripItineraryFlow',
    inputSchema: RoadTripItineraryInputSchema,
    outputSchema: RoadTripItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
