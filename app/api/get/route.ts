import { supabase } from '@/lib/supabase'
import { filebase } from '@/lib/filebase' // Import filebase
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
    status: string
}

interface FileResponse {
    id: string
    admin_id: string
    name: string
    size: number
    type: string
    download_limit: number | null
    download_count: number
    expires_at: string | null
    has_password: boolean
    created_at: string
    password?: string
}

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        // Validate ID
        if (!id) {
            return NextResponse.json(
                { error: 'Drop ID is required' },
                { status: 400 }
            )
        }

        // Validate ID format
        if (id.length < 8 || id.length > 64) {
            return NextResponse.json(
                { error: 'Invalid drop ID format' },
                { status: 400 }
            )
        }

        // Fetch file from database
        const { data: file, error }: { 
            data: FileData | null, 
            error: PostgrestError | null 
        } = await supabase.client
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
                status
            `)
            .eq('file_id', id)
            .single()

        // Handle database errors
        if (error) {
            console.error('Database error:', error)
            
            if (error.code === 'PGRST116') {
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

        // Check if file is expired - DELETE IF EXPIRED
        if (file.expires_at && new Date(file.expires_at) < new Date()) {
            console.log(`🗑️ File ${file.file_id} expired, deleting...`)
            
            try {
                // Delete from Filebase
                await filebase.delete(file.filename)
                
                // Delete from Supabase
                await supabase.client
                    .from('files')
                    .delete()
                    .eq('file_id', file.file_id)
                
                console.log(`✅ File ${file.file_id} deleted successfully`)
            } catch (deleteError) {
                console.error(`❌ Failed to delete expired file ${file.file_id}:`, deleteError)
                // Even if deletion fails, return expired status
            }
            
            return NextResponse.json(
                { 
                    error: 'Drop has expired and has been deleted',
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
            id: file.file_id,
            admin_id: file.admin_id,
            name: file.name,
            size: file.size,
            type: file.type,
            download_limit: file.download_limit,
            download_count: file.download_count,
            expires_at: file.expires_at,
            has_password: !!file.password,
            created_at: file.created_at,
        }

        // Only include password if it exists (for admin view)
        if (file.password) {
            responseData.password = file.password
        }

        return NextResponse.json(responseData, { status: 200 })

    } catch (error) {
        console.error('Error fetching drop:', error)
        
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
