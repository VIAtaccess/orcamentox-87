import { createClient } from '@supabase/supabase-js';

// Public Supabase client using provided URL and anon key
// Note: anon key is safe to expose on the client.
const SUPABASE_URL = 'https://kyvqhdrcscfuxkprceem.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dnFoZHJjc2NmdXhrcHJjZWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NDMyNDAsImV4cCI6MjA2OTMxOTI0MH0.cv2KAN2EcJFwsjsOm7RpsMOjx45C1W1N_Usg-xbD6Eo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
