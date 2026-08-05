import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function PUT(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const body = await request.json()
        const { download_limit, expires_at, password } = body

        if (!id) {
            return NextResponse.json(
                { error: 'Drop ID is required' },
                { status: 400 }
            )
        }

        // Build update object
        const updates = {}
        if (download_limit !== undefined) {
            updates.download_limit = download_limit
        }
        if (expires_at !== undefined) {
            updates.expires_at = expires_at
        }
        if (password !== undefined) {
            updates.password = password
        }
        updates.updated_at = new Date().toISOString()

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            )
        }

        const { data: file, error } = await supabase.client
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

        if (error || !file) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
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
        })

    } catch (error) {
        console.error('Error updating file:', error)
        return NextResponse.json(
            { error: 'Failed to update file' },
            { status: 500 }
        )
    }
}