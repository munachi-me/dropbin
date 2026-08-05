import { NextRequest, NextResponse } from 'next/server'
import { filebase } from '@/lib/filebase'
import { supabase } from '@/lib/supabase'
import { v7 as uuid } from 'uuid'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export async function POST(request: NextRequest) {
    try {

        const formData = await request.formData()
        const file = formData.get('file')
        const downloadLimit = formData.get('downloadLimit')
        const expiresAt = formData.get('expiresAt')
        const password = formData.get('password')

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Generate unique IDs
        const fileId = uuid()
        const adminId = uuid()
        const fname = String(file.name)
        const fileExtension = fname.slice(fname.indexOf('.') + 1)
        const fileName = `${fileId}.${fileExtension}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Filebase
        const uploadResult = await filebase.upload(
            fileName,
            buffer,
            file.type,
            file.name
        )

        if (!uploadResult) {
            return NextResponse.json(
                { error: 'Failed to upload file to storage' },
                { status: 500 }
            )
        }

        // Save metadata to Supabase
        const metadata = {
            id: uuid(),
            file_id: fileId,
            admin_id: adminId,
            name: file.name,
            filename: fileName,
            size: file.size,
            type: file.type,
            download_limit: downloadLimit || 5,
            download_count: 0,
            expires_at: expiresAt || null,
            password: password || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }
        console.log(metadata)

        const { data, error: dbError } = await supabase.client
            .from('files')
            .insert(metadata)
            .select()
            .single()

        if (dbError) {
            console.error('Database error:', dbError)
            // Cleanup: delete from Filebase if database fails
            await filebase.delete(fileName)
            return NextResponse.json(
                { error: 'Failed to save file metadata' },
                { status: 500 }
            )
        }

        // Generate URLs
        const dropUrl = `/d/${fileId}`
        const adminUrl = `/admin/${adminId}`

        // // Auto delete
        // const autodel = setInterval(async ()=>{
        //     const now = new Date().toISOString()
        //     if(now >= expiresAt){
        //         await fetch(`/api/bin?id=${fileId}`, { method: 'DELETE' })
        //         const clearAutodel = clearInterval(autodel)                
        //     }
        // }, 1000)

        return NextResponse.json({
            success: true,
            file: {
                id: fileId,
                admin_id: adminId,
                name: file.name,
                size: file.size,
                type: file.type,
                download_limit: metadata.download_limit,
                expires_at: metadata.expires_at,
                created_at: metadata.created_at,
                drop_url: dropUrl,
                admin_url: adminUrl,
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        )
    }
}