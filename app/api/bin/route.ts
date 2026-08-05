import { supabase } from '@/lib/supabase'
import { filebase } from '@/lib/filebase'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Drop ID is required' },
                { status: 400 }
            )
        }

        // Get file metadata (use file_id or admin_id based on your needs)
        const { data: file, error: fetchError } = await supabase.client
            .from('files')
            .select(`
                file_id,
                admin_id,
                name,
                filename
            `)
            .eq('file_id', id) // or .eq('admin_id', id) for admin delete
            .single()

        if (fetchError || !file) {
            return NextResponse.json(
                { error: 'Drop not found' },
                { status: 404 }
            )
        }

        // Delete from Filebase
        await filebase.delete(file.filename)

        // Delete from Supabase
        const { error: deleteError } = await supabase.client
            .from('files')
            .delete()
            .eq('file_id', file.file_id)

        if (deleteError) {
            throw deleteError
        }

        return NextResponse.json({
            success: true,
            message: 'Drop deleted successfully',
            id: file.file_id,
            name: file.name
        })

    } catch (error) {
        console.error('Error deleting drop:', error)
        return NextResponse.json(
            { error: 'Failed to delete drop' },
            { status: 500 }
        )
    }
}