import { NextRequest, NextResponse } from 'next/server'
import { filebase } from '@/lib/filebase'
import { supabase } from '@/lib/supabase'
import { v7 as uuid } from 'uuid'
import { PostgrestError } from '@supabase/supabase-js'

// Constants
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_MIME_TYPES = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript',
    // Archives
    'application/zip', 'application/x-zip-compressed',
    'application/x-rar-compressed', 'application/x-7z-compressed',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac',
    // Video
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
]

// Types
interface FileMetadata {
    id: string
    file_id: string
    admin_id: string
    name: string
    filename: string
    size: number
    type: string
    download_limit: number
    download_count: number
    expires_at: string | null
    password: string | null
    created_at: string
    updated_at: string
}

interface UploadResponse {
    success: boolean
    file: {
        id: string
        admin_id: string
        name: string
        size: number
        type: string
        download_limit: number
        expires_at: string | null
        created_at: string
        drop_url: string
        admin_url: string
    }
}

interface UploadError {
    error: string
    maxSize?: number
    fileSize?: number
    message?: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Parse form data
        const formData = await request.formData()
        
        // Get file and metadata
        const file = formData.get('file')
        const downloadLimit = formData.get('downloadLimit')
        const expiresAt = formData.get('expiresAt')
        const password = formData.get('password')

        // Validate file exists
        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            const errorResponse: UploadError = {
                error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
                maxSize: MAX_FILE_SIZE,
                fileSize: file.size
            }
            return NextResponse.json(errorResponse, { status: 400 })
        }

        // // Validate file type (optional - remove if you want to accept all files)
        // if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
        //     console.warn(`⚠️ File type not in allowed list: ${file.type}`)
        //     // Uncomment to reject:
        //     // return NextResponse.json(
        //     //     { error: `File type ${file.type} is not allowed` },
        //     //     { status: 400 }
        //     // )
        // }

        // Generate unique IDs
        const fileId = uuid()
        const adminId = uuid()
        
        // Get file extension and name
        const originalName = file.name
        const fileExtension = originalName.slice(originalName.lastIndexOf('.') + 1)
        const fileName = `${fileId}.${fileExtension}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Filebase
        const uploadResult = await filebase.upload(
            fileName,
            buffer,
            file.type,
            originalName
        )

        if (!uploadResult.success) {
            return NextResponse.json(
                { error: 'Failed to upload file to storage' },
                { status: 500 }
            )
        }

        // Prepare metadata
        const metadata: FileMetadata = {
            id: uuid(),
            file_id: fileId,
            admin_id: adminId,
            name: originalName,
            filename: fileName,
            size: file.size,
            type: file.type,
            download_limit: downloadLimit ? parseInt(downloadLimit.toString(), 10) : 5,
            download_count: 0,
            expires_at: expiresAt ? expiresAt.toString() : null,
            password: password ? password.toString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        console.log('📝 Metadata:', metadata)

        // Save to Supabase
        const { data, error: dbError }: { 
            data: FileMetadata | null, 
            error: PostgrestError | null 
        } = await supabase.client
            .from('files')
            .insert(metadata)
            .select()
            .single()

        if (dbError) {
            console.error('❌ Database error:', dbError)
            
            // Cleanup: delete from Filebase if database fails
            try {
                await filebase.delete(fileName)
                console.log(`🧹 Cleaned up file: ${fileName}`)
            } catch (cleanupError) {
                console.error('❌ Cleanup error:', cleanupError)
            }
            
            return NextResponse.json(
                { error: 'Failed to save file metadata' },
                { status: 500 }
            )
        }

        // Generate URLs
        const dropUrl = `/d/${fileId}`
        const adminUrl = `/admin/${adminId}`

        // Prepare response
        const responseData: UploadResponse = {
            success: true,
            file: {
                id: fileId,
                admin_id: adminId,
                name: originalName,
                size: file.size,
                type: file.type,
                download_limit: metadata.download_limit,
                expires_at: metadata.expires_at,
                created_at: metadata.created_at,
                drop_url: dropUrl,
                admin_url: adminUrl,
            }
        }

        return NextResponse.json(responseData, { status: 201 })

    } catch (error) {
        console.error('❌ Upload error:', error)
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        
        return NextResponse.json(
            { 
                error: 'Upload failed',
                message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        )
    }
}