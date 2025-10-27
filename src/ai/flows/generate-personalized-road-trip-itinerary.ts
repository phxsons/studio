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
  durationDays: z.number().describe('The duration of the road trip in days.'),
  interests: z.array(z.string()).describe('A list of user interests e.g. hiking, photography, food.'),
  vehicleDetails: z
    .object({
      make: z.string().describe('The make of the vehicle.'),
      model: z.string().describe('The model of the vehicle.'),
      fuelType: z.string().describe('The fuel type of the vehicle.'),
      mpg: z.number().describe('The MPG of the vehicle.'),
    })
    .describe('Details about the user vehicle.'),
  travelPreferences: z
    .object({
      pace: z.enum(['relaxed', 'moderate', 'fast']).describe('Preferred travel pace.'),
      lodgingPreferences: z.array(z.string()).describe('Preferred lodging options, e.g., hotels, RV parks, camping.'),
      foodPreferences: z.array(z.string()).describe('Preferred food cuisine, e.g., Italian, Mexican, etc.'),
    })
    .describe('The travel preferences of the user'),
});

export type RoadTripItineraryInput = z.infer<typeof RoadTripItineraryInputSchema>;

const RoadTripItineraryOutputSchema = z.object({
  itinerary: z
    .array(z.string())
    .describe('A list of strings, each describing one stop in the itinerary for the road trip, including location and suggested activities.'),
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

  The trip will start at {{startingPoint}} and end at {{destination}} and will last {{durationDays}} days.

  The user has the following interests: {{#each interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  Their vehicle is a {{vehicleDetails.make}} {{vehicleDetails.model}} that runs on {{vehicleDetails.fuelType}} and has an MPG of {{vehicleDetails.mpg}}.
  The user's pace is {{travelPreferences.pace}}.
  Their lodging preferences are: {{#each travelPreferences.lodgingPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.
  They are interested in the following food: {{#each travelPreferences.foodPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}.

  Generate a list of strings, each describing one stop in the itinerary for the road trip. Make sure that the itinerary includes locations and suggested activities.
  The itinerary should be optimized around the vehicle's fuel efficiency.
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
