'use server';

/**
 * @fileOverview Fetches traffic alerts for a specified road trip route.
 *
 * - getTrafficForRoute - A function that fetches traffic alerts.
 * - GetTrafficForRouteInput - The input type for the getTrafficForRoute function.
 * - GetTrafficForRouteOutput - The return type for the getTrafficForRoute function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetTrafficForRouteInputSchema = z.object({
  origin: z.string().describe('The starting point of the road trip.'),
  destination: z.string().describe('The final destination of the road trip.'),
  waypoints: z.array(z.string()).describe('A list of planned stops (waypoints).'),
});

export type GetTrafficForRouteInput = z.infer<typeof GetTrafficForRouteInputSchema>;

const TrafficAlertSchema = z.object({
  location: z.string().describe('The location of the traffic alert (e.g., "near Denver, CO on I-25").'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the traffic issue.'),
  description: z.string().describe('A brief description of the traffic alert (e.g., "Minor congestion", "Accident reported", "Road closure").'),
  type: z.enum(['congestion', 'accident', 'construction', 'road_closure']).describe('The type of the traffic alert.')
});

const GetTrafficForRouteOutputSchema = z.object({
  alerts: z.array(TrafficAlertSchema).describe('A list of traffic alerts along the route.'),
});

export type GetTrafficForRouteOutput = z.infer<typeof GetTrafficForRouteOutputSchema>;
export type TrafficAlert = z.infer<typeof TrafficAlertSchema>;


export async function getTrafficForRoute(input: GetTrafficForRouteInput): Promise<GetTrafficForRouteOutput> {
  return getTrafficForRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getTrafficForRoutePrompt',
  input: { schema: GetTrafficForRouteInputSchema },
  output: { schema: GetTrafficForRouteOutputSchema },
  prompt: `You are a traffic monitoring AI for a road trip application. Your task is to generate a list of potential traffic alerts for the route from {{origin}} to {{destination}}{{#if waypoints}} via {{#each waypoints}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}.

  Generate a list of 1 to 3 realistic but fictional traffic alerts for demonstration purposes. 
  For each alert, provide:
  - location: The specific location of the alert.
  - severity: 'low', 'medium', or 'high'.
  - description: A short description of the event.
  - type: 'congestion', 'accident', 'construction', or 'road_closure'.

  If there are no significant issues, you can return an empty list of alerts.
`,
});

const getTrafficForRouteFlow = ai.defineFlow(
  {
    name: 'getTrafficForRouteFlow',
    inputSchema: GetTrafficForRouteInputSchema,
    outputSchema: GetTrafficForRouteOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
