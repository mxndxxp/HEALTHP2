import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

// Load environment variables from .env to be used by the server
config();

export const ai = genkit({
  plugins: [
    googleAI({
      // Explicitly pass the API key from environment variables.
      // The plugin also looks for GOOGLE_API_KEY by default.
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  // Use a capable and efficient model to avoid quota issues.
  model: 'googleai/gemini-1.5-flash-latest',
});
