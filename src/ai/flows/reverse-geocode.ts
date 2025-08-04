'use server';
/**
 * @fileOverview A flow for converting latitude and longitude coordinates into a physical address.
 *
 * - reverseGeocode - A function that takes coordinates and returns a structured address.
 * - ReverseGeocodeInput - The input type for the reverseGeocode function.
 * - ReverseGeocodeOutput - The return type for the reverseGeocode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ReverseGeocodeInputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type ReverseGeocodeInput = z.infer<typeof ReverseGeocodeInputSchema>;

const ReverseGeocodeOutputSchema = z.object({
  line1: z.string().describe('Street number and route.'),
  line2: z.string().describe('Sub-locality or other secondary address info.').optional(),
  city: z.string().describe('City or locality.'),
  district: z.string().describe('Administrative area level 2 (e.g., county).'),
  state: z.string().describe('Administrative area level 1 (e.g., state).'),
  postalCode: z.string().describe('Postal code.'),
  country: z.string().describe('Country.'),
});
export type ReverseGeocodeOutput = z.infer<typeof ReverseGeocodeOutputSchema>;

export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> {
  return reverseGeocodeFlow(input);
}

const reverseGeocodeFlow = ai.defineFlow(
  {
    name: 'reverseGeocodeFlow',
    inputSchema: ReverseGeocodeInputSchema,
    outputSchema: ReverseGeocodeOutputSchema,
  },
  async ({ latitude, longitude }) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is not configured.');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error(`Geocoding failed: ${data.status} - ${data.error_message || 'No results found.'}`);
    }

    const result = data.results[0];
    const addressComponents = result.address_components;

    const getComponent = (type: string) => addressComponents.find((c: any) => c.types.includes(type))?.long_name || '';

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');

    return {
      line1: `${streetNumber} ${route}`.trim(),
      line2: getComponent('sublocality_level_1'),
      city: getComponent('locality'),
      district: getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1'),
      postalCode: getComponent('postal_code'),
      country: getComponent('country'),
    };
  }
);
