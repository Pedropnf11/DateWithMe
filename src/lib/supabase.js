
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para criar um cliente com headers customizados (ex: creator_key)
export const getSupabaseClient = (creatorKey = null) => {
    if (!creatorKey) return supabase;

    return createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                'x-creator-key': creatorKey,
            },
        },
    });
};
