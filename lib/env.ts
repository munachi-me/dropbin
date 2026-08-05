
export const env: {
    supabaseUrl: string | any,
    supabaseAnonKey: string | any,
    supabaseServiceKey: string | any,
    filebaseEndpoint: string | any,
    filebaseBucket: string | any,
    filebaseKey: string | any,
    filebaseSecret: string | any,
} = {
    // Supabase
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    
    // Filebase
    filebaseEndpoint: process.env.FILEBASE_ENDPOINT || 'https://s3.filebase.com',
    filebaseBucket: process.env.FILEBASE_BUCKET,
    filebaseKey: process.env.FILEBASE_ACCESS_KEY,
    filebaseSecret: process.env.FILEBASE_SECRET_KEY,
}