// IMPORTANT: Load environment variables before anything else
import {config} from 'dotenv';
config();

// The rest of your AI flow imports
import '@/ai/flows/ai-analysis.ts';
import '@/ai/flows/intelligent-chatbot.ts';
import '@/ai/flows/translator.ts';
import '@/ai/flows/doctor-ai-assistant.ts';
import '@/ai/flows/diagnostic-scanner.ts';
