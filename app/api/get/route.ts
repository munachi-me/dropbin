import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

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

        if (error || !file) {
            return NextResponse.json(
                { error: 'Drop not found' },
                { status: 404 }
            )
        }

        // Check if expired
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

        const responseData = {
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
            ...(file.password && { password: file.password }),
        }

        return NextResponse.json(responseData)

    } catch (error) {
        console.error('Error fetching drop:', error)
        return NextResponse.json(
            { error: 'Failed to fetch drop metadata' },
            { status: 500 }
        )
    }
}