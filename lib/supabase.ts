import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://aswdbhrfkeoypdsblwiw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gOZoCPHC36o8Lo-yIu05Lw_yOendD0c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);