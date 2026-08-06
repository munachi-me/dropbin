import { supabase } from '@/lib/supabase'
import { filebase } from '@/lib/filebase'
import { NextResponse } from 'next/server'
import { PostgrestError } from '@supabase/supabase-js'

// Types
interface FileData {
    file_id: string
    admin_id: string
    name: string
    filename: string
}

interface DeleteResponse {
    success: boolean
    message: string
    id: string
    name: string
}

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const adminId = searchParams.get('adminId') // Optional: for admin verification

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

        // Build query
        let query = supabase.client
            .from('files')
            .select(`
                file_id,
                admin_id,
                name,
                filename
            `)
            .eq('file_id', id)

        // If adminId is provided, verify it matches
        if (adminId) {
            query = query.eq('admin_id', adminId)
        }

        // Get file metadata
        const { data: file, error: fetchError }: { 
            data: FileData | null, 
            error: PostgrestError | null 
        } = await query.single()

        // Handle fetch errors
        if (fetchError) {
            console.error('Fetch error:', fetchError)
            
            if (fetchError.code === 'PGRST116') { // Not found
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

        // Delete from Filebase
        let filebaseDeleted = false
        try {
            const deleteResult = await filebase.delete(file.filename)
            if (deleteResult.success) {
                filebaseDeleted = true
                console.log(`✅ File ${file.filename} deleted from Filebase`)
            } else {
                console.warn(`⚠️ Failed to delete ${file.filename} from Filebase, continuing with database deletion`)
            }
        } catch (filebaseError) {
            console.error('Filebase deletion error:', filebaseError)
            // Continue with database deletion even if Filebase fails
        }

        // Delete from Supabase
        const { error: deleteError }: { error: PostgrestError | null } = await supabase.client
            .from('files')
            .delete()
            .eq('file_id', file.file_id)

        if (deleteError) {
            console.error('Database deletion error:', deleteError)
            
            // If Filebase deletion succeeded but database failed, log for manual cleanup
            if (filebaseDeleted) {
                console.error(`⚠️ CRITICAL: File ${file.filename} deleted from Filebase but database deletion failed. Manual cleanup required.`)
            }
            
            return NextResponse.json(
                { error: 'Failed to delete drop from database' },
                { status: 500 }
            )
        }

        // Prepare response
        const responseData: DeleteResponse = {
            success: true,
            message: 'Drop deleted successfully',
            id: file.file_id,
            name: file.name
        }

        return NextResponse.json(responseData, { status: 200 })

    } catch (error) {
        console.error('Error deleting drop:', error)
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        
        return NextResponse.json(
            { 
                error: 'Failed to delete drop',
                message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
            },
            { status: 500 }
        )
    }
}
