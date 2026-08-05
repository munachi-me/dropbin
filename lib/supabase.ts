// lib/supabase.js
import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Validate environment variables
if (!env.supabaseUrl) {
    throw new Error('supabaseUrl is required. Please check your environment variables.')
}

if (!env.supabaseServiceKey && !env.supabaseAnonKey) {
    throw new Error('supabaseKey (service or anon) is required. Please check your environment variables.')
}

// Use service key for server-side, anon key for client-side
const supabaseKey = env.supabaseServiceKey || env.supabaseAnonKey

const supabaseClient = createClient(
    env.supabaseUrl,
    supabaseKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
        db: {
            schema: 'public',
        },
    }
)

export const supabase = {
    client: supabaseClient,
}

// Export a function to test connection
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('files')
            .select('count')
            .limit(1)
        
        if (error) {
            console.error('Supabase connection error:', error)
            return { success: false, error: error.message }
        }
        
        console.log('✅ Supabase connection successful')
        return { success: true, data }
    } catch (error) {
        console.error('Supabase connection error:', error)
        return { success: false, error: error.message }
    }
}