import { createClient } from '@supabase/supabase-js';

// Supabase Project Credentials provided by user:
// Project: SmartShop BD (btcgigozmmjapvelqhtf)
export const SUPABASE_URL: string = 
  import.meta.env.VITE_SUPABASE_URL || 'https://btcgigozmmjapvelqhtf.supabase.co';

export const SUPABASE_ANON_KEY: string = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0Y2dpZ296bW1qYXB2ZWxxaHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDc4NTYsImV4cCI6MjEwODIyMzg1Nn0.JfCsL1ppa0aUajiUsFSGvUjSGbsWqmhPK6ow55HLTMM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
