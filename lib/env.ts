// Define the type explicitly for better type safety
interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceKey: string;
  filebaseEndpoint: string;
  filebaseBucket: string;
  filebaseKey: string;
  filebaseSecret: string;
}

// Helper function to validate required environment variables
function getRequiredEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Helper for optional env vars with defaults
function getOptionalEnvVar(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const env: EnvConfig = {
  // Supabase - required
  supabaseUrl: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceKey: getRequiredEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  
  // Filebase - required except endpoint which has a default
  filebaseEndpoint: getOptionalEnvVar('FILEBASE_ENDPOINT', 'https://s3.filebase.com'),
  filebaseBucket: getRequiredEnvVar('FILEBASE_BUCKET'),
  filebaseKey: getRequiredEnvVar('FILEBASE_ACCESS_KEY'),
  filebaseSecret: getRequiredEnvVar('FILEBASE_SECRET_KEY'),
};