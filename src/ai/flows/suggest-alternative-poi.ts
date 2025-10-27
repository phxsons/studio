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

const SuggestAlternativePoiInputSchema = z.object({
  userProfile: z
    .object({
      avatar: z.string().optional().describe('URL of the user avatar image.'),
      vehicleDetails: z
        .object({
          make: z.string().optional().describe('Vehicle make.'),
          model: z.string().optional().describe('Vehicle model.'),
          fuelType: z.string().optional().describe('Fuel type.'),
          mpg: z.number().optional().describe('Miles per gallon.'),
        })
        .optional()
        .describe('Vehicle details of the user.'),
      homeLocation: z.string().optional().describe('Home location of the user.'),
      hobbiesAndInterests: z.array(z.string()).describe('Hobbies and interests of the user.'),
      socialMediaLinks: z
        .object({
          instagram: z.string().optional().describe('Instagram profile URL.'),
          facebook: z.string().optional().describe('Facebook profile URL.'),
          tiktok: z.string().optional().describe('TikTok profile URL.'),
          linkedin: z.string().optional().describe('LinkedIn profile URL.'),
        })
        .optional()
        .describe('Social media links of the user.'),
    })
    .describe('User profile data including avatar, vehicle details, home location, hobbies, and social media links.'),
  originalPoi: z
    .object({
      name: z.string().describe('Name of the original point of interest.'),
      type: z.string().describe('Type of the original point of interest (e.g., restaurant, hotel, event).'),
      description: z.string().optional().describe('Description of the original point of interest.'),
      location: z.string().describe('Location of the original point of interest.'),
      cuisine: z.string().optional().describe('Cuisine of the original point of interest if it is a restaurant.'),
    })
    .describe('Details of the original point of interest that is closed.'),
  reasonClosed: z.string().describe('The reason the original point of interest is closed.'),
});
export type SuggestAlternativePoiInput = z.infer<typeof SuggestAlternativePoiInputSchema>;

const SuggestAlternativePoiOutputSchema = z.object({
  alternativePoi: z
    .object({
      name: z.string().describe('Name of the alternative point of interest.'),
      type: z.string().describe('Type of the alternative point of interest.'),
      description: z.string().optional().describe('Description of the alternative point of interest.'),
      location: z.string().describe('Location of the alternative point of interest.'),
      reasonRecommended: z.string().describe('Why this POI is being recommended for the user'),
    })
    .describe('Details of the suggested alternative point of interest.'),
});
export type SuggestAlternativePoiOutput = z.infer<typeof SuggestAlternativePoiOutputSchema>;

export async function suggestAlternativePoi(input: SuggestAlternativePoiInput): Promise<SuggestAlternativePoiOutput> {
  return suggestAlternativePoiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativePoiPrompt',
  input: {schema: SuggestAlternativePoiInputSchema},
  output: {schema: SuggestAlternativePoiOutputSchema},
  prompt: `You are a travel assistant for the RoadHog mobile app. The user is looking for an alternative point of interest (POI) because their original choice is closed. The reason it is closed is {{{reasonClosed}}}.

  Given the following user profile, original POI, and the reason for closure, suggest an alternative POI that aligns with the user's interests and provides a similar experience.

  User Profile:
  {{#if userProfile.avatar}}
  Avatar: {{userProfile.avatar}}
  {{/if}}
  {{#if userProfile.vehicleDetails}}
  Vehicle Details:
    Make: {{userProfile.vehicleDetails.make}}
    Model: {{userProfile.vehicleDetails.model}}
    Fuel Type: {{userProfile.vehicleDetails.fuelType}}
    MPG: {{userProfile.vehicleDetails.mpg}}
  {{/if}}
  {{#if userProfile.homeLocation}}
  Home Location: {{userProfile.homeLocation}}
  {{/if}}
  Hobbies and Interests: {{#each userProfile.hobbiesAndInterests}}- {{{this}}}
  {{/each}}
  {{#if userProfile.socialMediaLinks}}
  Social Media Links:
    {{#if userProfile.socialMediaLinks.instagram}}Instagram: {{userProfile.socialMediaLinks.instagram}}{{/if}}
    {{#if userProfile.socialMediaLinks.facebook}}Facebook: {{userProfile.socialMediaLinks.facebook}}{{/if}}
    {{#if userProfile.socialMediaLinks.tiktok}}TikTok: {{userProfile.socialMediaLinks.tiktok}}{{/if}}
    {{#if userProfile.socialMediaLinks.linkedin}}LinkedIn: {{userProfile.socialMediaLinks.linkedin}}{{/if}}
  {{/if}}

  Original POI:
  Name: {{originalPoi.name}}
  Type: {{originalPoi.type}}
  {{#if originalPoi.description}}Description: {{originalPoi.description}}{{/if}}
  Location: {{originalPoi.location}}
  {{#if originalPoi.cuisine}}Cuisine: {{originalPoi.cuisine}}{{/if}}

  Provide an alternative POI suggestion with the following details:
  - name
  - type
  - description
  - location
  - reasonRecommended (Explain why this POI is suitable for the user based on their profile and the original POI).
  `,
});

const suggestAlternativePoiFlow = ai.defineFlow(
  {
    name: 'suggestAlternativePoiFlow',
    inputSchema: SuggestAlternativePoiInputSchema,
    outputSchema: SuggestAlternativePoiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
