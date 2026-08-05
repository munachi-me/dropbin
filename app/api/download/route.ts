import { supabase } from '@/lib/supabase'
import { filebase } from '@/lib/filebase'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const password = searchParams.get('password')

        if (!id) {
            return NextResponse.json(
                { error: 'Drop ID is required' },
                { status: 400 }
            )
        }

        const { data: file, error } = await supabase.client
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

        if (error || !file) {
            return NextResponse.json(
                { error: 'Drop not found' },
                { status: 404 }
            )
        }

        // Check expiration
        if (file.expires_at && new Date(file.expires_at) < new Date()) {
            return NextResponse.json(
                { error: 'Drop has expired' },
                { status: 410 }
            )
        }

        // Check download limit
        if (file.download_limit && file.download_count >= file.download_limit) {
            return NextResponse.json(
                { error: 'Download limit exceeded' },
                { status: 403 }
            )
        }

        // Password check
        if (file.password && file.password !== password) {
            return NextResponse.json(
                { error: 'Invalid or missing password' },
                { status: 401 }
            )
        }

        // Generate presigned URL
        const presignedUrl = await filebase.download(file.filename)
        if (!presignedUrl) {
            return NextResponse.json(
                { error: 'Failed to generate download link' },
                { status: 500 }
            )
        }

        // Update download count
        await supabase.client
            .from('files')
            .update({ 
                download_count: file.download_count + 1,
                updated_at: new Date().toISOString()
            })
            .eq('file_id', id)

        return NextResponse.json({
            download_url: presignedUrl,
            filename: file.name,
            file_size: file.size,
            file_type: file.type,
            expires_in: 3600,
            download_count: file.download_count + 1,
            download_limit: file.download_limit,
            remaining_downloads: file.download_limit !== null 
                ? file.download_limit - (file.download_count + 1)
                : null
        })

    } catch (error) {
        console.error('Download error:', error)
        return NextResponse.json(
            { error: 'Failed to download drop' },
            { status: 500 }
        )
    }
}