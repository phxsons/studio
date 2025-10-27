'use server';

/**
 * @fileOverview Fetches weather conditions along a specified road trip route.
 *
 * - getWeatherForRoute - A function that fetches weather information.
 * - GetWeatherForRouteInput - The input type for the getWeatherForRoute function.
 * - WeatherInfo - The return type for the getWeatherForRoute function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWeatherForRouteInputSchema = z.object({
  origin: z.string().describe('The starting point of the road trip.'),
  destination: z.string().describe('The final destination of the road trip.'),
  waypoints: z.array(z.string()).describe('A list of planned stops (waypoints).'),
});
export type GetWeatherForRouteInput = z.infer<typeof GetWeatherForRouteInputSchema>;

const WeatherConditionSchema = z.object({
    location: z.string().describe('The city or area for the weather condition.'),
    temperature: z.number().describe('The temperature in Fahrenheit.'),
    condition: z.string().describe('A brief description of the weather (e.g., "Sunny", "Light Rain").'),
    icon: z.enum(['Sun', 'Cloudy', 'Wind', 'CloudRain', 'Snowflake', 'Zap', 'AlertTriangle' ]).describe('An icon representing the weather condition.')
});

const WeatherInfoSchema = z.object({
  overallSummary: z.string().describe('A brief summary of the weather for the entire route.'),
  conditions: z.array(WeatherConditionSchema).describe('A list of weather conditions at different points along the route.'),
});
export type WeatherInfo = z.infer<typeof WeatherInfoSchema>;
export type WeatherCondition = z.infer<typeof WeatherConditionSchema>;

export async function getWeatherForRoute(input: GetWeatherForRouteInput): Promise<WeatherInfo> {
  return getWeatherForRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherForRoutePrompt',
  input: { schema: GetWeatherForRouteInputSchema },
  output: { schema: WeatherInfoSchema },
  prompt: `You are a weather forecasting AI for a road trip application. Your task is to provide a weather forecast for the route from {{origin}} to {{destination}}{{#if waypoints}} via {{#each waypoints}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}.

  Provide a general summary of the weather conditions along the entire route.
  
  Then, provide a list of specific weather conditions for key locations or segments of the trip (e.g., origin, destination, and major cities or waypoints in between).
  
  For each condition, specify the location, temperature in Fahrenheit, a short description, and a suitable icon from the following list: Sun, Cloudy, Wind, CloudRain, Snowflake, Zap, AlertTriangle.
  
  Generate realistic but varied weather data for the purpose of a demo.
  `,
});

const getWeatherForRouteFlow = ai.defineFlow(
  {
    name: 'getWeatherForRouteFlow',
    inputSchema: GetWeatherForRouteInputSchema,
    outputSchema: WeatherInfoSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
