import { createClient } from '@supabase/supabase-js';

const adminKey = process.env.SUPABASE_ADMIN_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = adminKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);
