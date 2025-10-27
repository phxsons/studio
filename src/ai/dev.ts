'use server';
/**
 * @fileOverview A development file for registering Genkit plugins and flows.
 */

import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Initialize Genkit with the Google AI plugin.
export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracing: true,
});
import '@/ai/flows/summarize-poi-reviews.ts';
import '@/ai/flows/generate-personalized-road-trip-itinerary.ts';
import '@/ai/flows/suggest-alternative-poi.ts';
import '@/ai/flows/suggest-stops-along-route.ts';
import '@/ai/flows/find-user-location.ts';
import '@/ai/flows/get-weather-for-route.ts';
import '@/ai/flows/get-traffic-for-route.ts';
