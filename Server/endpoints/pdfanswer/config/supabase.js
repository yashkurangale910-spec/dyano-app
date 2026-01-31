
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
