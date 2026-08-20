import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { PostgrestError } from '@supabase/supabase-js'

// Types
interface FileData {
    file_id: string
    admin_id: string
    name: string
    filename: string
    size: number
    type: string
    download_limit: number | null
    download_count: number
    expires_at: string | null
    password: string | null
    created_at: string
    updated_at: string
    status: string
}

interface FileResponse {
    file_id: string  // Keep consistent with database
    admin_id: string
    name: string
    filename?: string
    size: number
    type: string
    download_limit: number | null
    download_count: number
    expires_at: string | null
    has_password: boolean
    created_at: string
    password?: string  // Only include if explicitly requested and authenticated
}

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const includePassword = searchParams.get('include_password') === 'true' // Optional flag

        // Validate ID
        if (!id) {
            return NextResponse.json(
                { error: 'Admin ID is required' },
                { status: 400 }
            )
        }

        // Validate ID format (adjust based on your ID format)
        if (id.length < 8 || id.length > 64) {
            return NextResponse.json(
                { error: 'Invalid admin ID format' },
                { status: 400 }
            )
        }

        // Fetch file from database
        const { data: file, error }: { 
            data: FileData | null, 
            error: PostgrestError | null 
        } = await supabase
            .from('files')
            .select(`
                file_id,
                admin_id,
                name,
                filename,
                size,
                type,
                download_limit,
                download_count,
                expires_at,
                password,
                created_at,
                updated_at,
                status
            `)
            .eq('admin_id', id)
            .maybeSingle() // Use maybeSingle instead of single to avoid PGRST116 error

        // Handle database errors
        if (error) {
            console.error('Database error:', error)
            
            // Check if it's a "not found" error
            if (error.code === 'PGRST116' || error.message?.includes('not found')) {
                return NextResponse.json(
                    { error: 'Drop not found' },
                    { status: 404 }
                )
            }
            
            return NextResponse.json(
                { error: 'Failed to fetch drop metadata' },
                { status: 500 }
            )
        }

        // Check if file exists
        if (!file) {
            return NextResponse.json(
                { error: 'Drop not found' },
                { status: 404 }
            )
        }

        // Check if file is deleted or inactive
        if (file.status === 'deleted' || file.status === 'inactive') {
            return NextResponse.json(
                { 
                    error: 'This drop has been deleted',
                    status: file.status
                },
                { status: 410 }
            )
        }

        // Check if file is expired
        if (file.expires_at && new Date(file.expires_at) < new Date()) {
            return NextResponse.json(
                { 
                    error: 'Drop has expired',
                    expired: true,
                    expires_at: file.expires_at
                },
                { status: 410 }
            )
        }

        // Check download limit
        if (file.download_limit !== null && file.download_count >= file.download_limit) {
            return NextResponse.json(
                { 
                    error: 'Download limit exceeded',
                    download_limit_reached: true,
                    download_count: file.download_count,
                    download_limit: file.download_limit
                },
                { status: 403 }
            )
        }

        // Prepare response data
        const responseData: FileResponse = {
            file_id: file.file_id,
            admin_id: file.admin_id,
            name: file.name,
            filename: file.filename,
            size: file.size,
            type: file.type,
            download_limit: file.download_limit,
            download_count: file.download_count,
            expires_at: file.expires_at,
            has_password: !!file.password,
            created_at: file.created_at,
        }

        // Only include password if explicitly requested (for admin view)
        // In production, you should never return the raw password
        // Instead, just return has_password: true
        if (includePassword && file.password) {
            // You might want to hash or encrypt this in production
            responseData.password = file.password
        }

        return NextResponse.json(responseData, { status: 200 })

    } catch (error) {
        console.error('Error fetching drop:', error)
        
        // Type-safe error handling
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        
        return NextResponse.json(
            { 
                error: 'Failed to fetch drop metadata',
                message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        )
    }
}
