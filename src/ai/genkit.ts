import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Environment variables are now loaded in the dev entrypoint (src/ai/dev.ts)
// and via the hosting environment in production.

export const ai = genkit({
  plugins: [
    googleAI({
      // Explicitly pass the API key from environment variables.
      // The plugin also looks for GOOGLE_API_KEY by default.
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
});
