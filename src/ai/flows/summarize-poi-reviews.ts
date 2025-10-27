'use server';

/**
 * @fileOverview Summarizes user reviews for a Point of Interest (POI).
 *
 * - summarizePoiReviews - A function that handles the summarization of POI reviews.
 * - SummarizePoiReviewsInput - The input type for the summarizePoiReviews function.
 * - SummarizePoiReviewsOutput - The return type for the summarizePoiReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePoiReviewsInputSchema = z.object({
  poiName: z.string().describe('The name of the point of interest.'),
  reviews: z.string().describe('A list of user reviews for the POI.'),
});
export type SummarizePoiReviewsInput = z.infer<typeof SummarizePoiReviewsInputSchema>;

const SummarizePoiReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user reviews for the POI.'),
});
export type SummarizePoiReviewsOutput = z.infer<typeof SummarizePoiReviewsOutputSchema>;

export async function summarizePoiReviews(input: SummarizePoiReviewsInput): Promise<SummarizePoiReviewsOutput> {
  return summarizePoiReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePoiReviewsPrompt',
  input: {schema: SummarizePoiReviewsInputSchema},
  output: {schema: SummarizePoiReviewsOutputSchema},
  prompt: `You are an AI assistant designed to summarize user reviews for a Point of Interest (POI).

  Summarize the following reviews for {{poiName}}:

  Reviews: {{{reviews}}}

  Summary: `,
});

const summarizePoiReviewsFlow = ai.defineFlow(
  {
    name: 'summarizePoiReviewsFlow',
    inputSchema: SummarizePoiReviewsInputSchema,
    outputSchema: SummarizePoiReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
