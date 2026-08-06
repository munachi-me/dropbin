import { testSupabaseConnection } from '@/lib/supabase'
import { NextResponse } from 'next/server'


export async function GET(): Promise<NextResponse> {
    try {

        const supabase = await testSupabaseConnection();
        if(!supabase.success) return NextResponse.json({ status: 400 })

        return NextResponse.json({ status: 200 })

    } catch (error) {
        console.error('Server Error:', error)        
        return NextResponse.json({ status: 500 })
    }
}
