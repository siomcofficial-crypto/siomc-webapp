
import { createClient } from '@supabase/supabase-js';

// Read credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Validate configuration
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'SiOMC: Missing Supabase environment variables. ' +
    'Please check your .env.local file.'
  );
}

// Create one shared Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

console.log('SiOMC: Supabase client initialized');
