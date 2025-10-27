import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-poi-reviews.ts';
import '@/ai/flows/generate-personalized-road-trip-itinerary.ts';
import '@/ai/flows/suggest-alternative-poi.ts';