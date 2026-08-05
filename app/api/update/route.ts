import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { PostgrestError } from '@supabase/supabase-js'

// Types
interface UpdateData {
    download_limit?: number | null
    expires_at?: string | null
    password?: string | null
    updated_at?: string
}

interface FileResponse {
    file_id: string
    admin_id: string
    name: string
    download_limit: number | null
    download_count: number
    expires_at: string | null
    has_password: boolean
    updated_at: string
}

interface UpdateResponse {
    success: boolean
    message: string
    file: {
        id: string
        admin_id: string
        name: string
        download_limit: number | null
        download_count: number
        expires_at: string | null
        has_password: boolean
        updated_at: string
    }
}

export async function PUT(request: Request): Promise<NextResponse> {
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

        // Parse request body
        const body = await request.json()
        const { download_limit, expires_at, password }: UpdateData = body

        // Build update object
        const updates: UpdateData = {}
        
        if (download_limit !== undefined) {
            // Validate download limit is a positive number or null
            if (download_limit !== null && (typeof download_limit !== 'number' || download_limit < 0)) {
                return NextResponse.json(
                    { error: 'Download limit must be a positive number or null' },
                    { status: 400 }
                )
            }
            updates.download_limit = download_limit
        }
        
        if (expires_at !== undefined) {
            // Validate expires_at is a valid date string or null
            if (expires_at !== null && isNaN(new Date(expires_at).getTime())) {
                return NextResponse.json(
                    { error: 'Invalid expiration date format' },
                    { status: 400 }
                )
            }
            updates.expires_at = expires_at
        }
        
        if (password !== undefined) {
            // Validate password is a string or null
            if (password !== null && typeof password !== 'string') {
                return NextResponse.json(
                    { error: 'Password must be a string or null' },
                    { status: 400 }
                )
            }
            // Optional: Validate password length
            if (password !== null && password.length > 255) {
                return NextResponse.json(
                    { error: 'Password too long (max 255 characters)' },
                    { status: 400 }
                )
            }
            updates.password = password
        }

        updates.updated_at = new Date().toISOString()

        // Check if there are any fields to update
        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            )
        }

        // Update file in database
        const { data: file, error }: { 
            data: FileResponse | null, 
            error: PostgrestError | null 
        } = await supabase.client
            .from('files')
            .update(updates)
            .eq('file_id', id)
            .select(`
                file_id,
                admin_id,
                name,
                download_limit,
                download_count,
                expires_at,
                has_password:password,
                updated_at
            `)
            .single()

        // Handle database errors
        if (error) {
            console.error('Database error:', error)
            
            if (error.code === 'PGRST116') { // Not found
                return NextResponse.json(
                    { error: 'File not found' },
                    { status: 404 }
                )
            }
            
            return NextResponse.json(
                { error: 'Failed to update file' },
                { status: 500 }
            )
        }

        // Check if file exists
        if (!file) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        // Prepare response
        const responseData: UpdateResponse = {
            success: true,
            message: 'File updated successfully',
            file: {
                id: file.file_id,
                admin_id: file.admin_id,
                name: file.name,
                download_limit: file.download_limit,
                download_count: file.download_count,
                expires_at: file.expires_at,
                has_password: file.has_password,
                updated_at: file.updated_at
            }
        }

        return NextResponse.json(responseData, { status: 200 })

    } catch (error) {
        console.error('Error updating file:', error)
        
        // Type-safe error handling
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        
        return NextResponse.json(
            { 
                error: 'Failed to update file',
                message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        )
    }
}