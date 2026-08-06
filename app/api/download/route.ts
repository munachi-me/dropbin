import { supabase } from '@/lib/supabase'
import { filebase } from '@/lib/filebase'
import { NextResponse } from 'next/server'
import { PostgrestError } from '@supabase/supabase-js'

// Types
interface FileData {
    file_id: string
    name: string
    filename: string
    size: number
    type: string
    download_limit: number | null
    download_count: number
    expires_at: string | null
    password: string | null
}

interface DownloadResponse {
    download_url: string
    filename: string
    file_size: number
    file_type: string
    expires_in: number
    download_count: number
    download_limit: number | null
    remaining_downloads: number | null
}

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const password = searchParams.get('password')

        // Validate ID
        if (!id) {
            return NextResponse.json(
                { error: 'Drop ID is required' },
                { status: 400 }
            )
        }

        // Validate ID format (optional)
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
                name,
                filename,
                size,
                type,
                download_limit,
                download_count,
                expires_at,
                password
            `)
            .eq('file_id', id)
            .single()

        // Handle database errors
        if (error) {
            console.error('Database error:', error)
            
            if (error.code === 'PGRST116') { // Not found
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

        // Password check
        if (file.password) {
            if (!password) {
                return NextResponse.json(
                    { 
                        error: 'Password required',
                        requires_password: true
                    },
                    { status: 401 }
                )
            }

            if (password !== file.password) {
                return NextResponse.json(
                    { 
                        error: 'Invalid password',
                        requires_password: true
                    },
                    { status: 401 }
                )
            }
        }

        // Generate presigned URL from Filebase
        let presignedUrl;
        try {
            presignedUrl = await filebase.download(file.filename)
            if (!presignedUrl) {
                throw new Error('Failed to generate presigned URL')
            }
        } catch (urlError) {
            console.error('Presigned URL generation error:', urlError)
            return NextResponse.json(
                { error: 'Failed to generate download link' },
                { status: 500 }
            )
        }

        // Update download count with optimistic locking
        const { error: updateError }: { error: PostgrestError | null } = await supabase.client
            .from('files')
            .update({ 
                download_count: file.download_count + 1,
                updated_at: new Date().toISOString()
            })
            .eq('file_id', id)
            .eq('download_count', file.download_count) // Optimistic locking

        if (updateError) {
            console.error('Failed to update download count:', updateError)
            // Continue anyway - the download URL is still valid
            // Log the error for monitoring but don't fail the request
        }

        // Calculate remaining downloads
        const newDownloadCount = file.download_count + 1
        const remainingDownloads = file.download_limit !== null 
            ? file.download_limit - newDownloadCount
            : null

        // Prepare response
        const responseData: DownloadResponse = {
            download_url: presignedUrl,
            filename: file.name,
            file_size: file.size,
            file_type: file.type,
            expires_in: 3600, // 1 hour
            download_count: newDownloadCount,
            download_limit: file.download_limit,
            remaining_downloads: remainingDownloads
        }

        return NextResponse.json(responseData, { status: 200 })

    } catch (error) {
        console.error('Download error:', error)
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        
        return NextResponse.json(
            { 
                error: 'Failed to download drop',
                message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        )
    }
}
