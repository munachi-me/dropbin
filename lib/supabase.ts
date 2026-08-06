// lib/supabase.js
import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Connection test result type
interface ConnectionTestResult {
  success: boolean
  data?: any
  error?: string
}

// Validate environment variables
if (!env.supabaseUrl) {
  throw new Error('supabaseUrl is required. Please check your environment variables.')
}

if (!env.supabaseServiceKey && !env.supabaseAnonKey) {
  throw new Error('supabaseKey (service or anon) is required. Please check your environment variables.')
}

// Use service key for server-side, anon key for client-side
const supabaseKey = env.supabaseServiceKey || env.supabaseAnonKey

// Create typed Supabase client
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

// Export typed client
export const supabase = {
  client: supabaseClient
}

// Export a function to test connection
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  try {
    const { data, error } = await supabaseClient
      .from('files')
      .select('id', { count: 'exact' })
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { 
        success: false, 
        error: error.message 
      }
    }
    
    console.log('✅ Supabase connection successful')
    return { 
      success: true, 
      data 
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Supabase connection error:', error)
    return { 
      success: false, 
      error: errorMessage 
    }
  }
}
