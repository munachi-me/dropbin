"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from 'next/navigation'
import {
    BsDot, BsShieldCheck, BsClock, BsCloudDownload,
    BsLock, BsTrash, BsBoxArrowUpRight, BsPencil, BsX,
} from 'react-icons/bs'
import FileCard from '@/components/filecard'
import Link from 'next/link'
import { useToast } from '@/components/toast'

// Types
interface FileData {
    file_id?: string
    admin_id?: string
    name?: string
    filename?: string
    size?: number
    type?: string
    download_limit?: number | null
    download_count?: number
    expires_at?: string | null
    password?: string
    has_password?: boolean
    created_at?: string
    updated_at?: string
    status?: string
}

export default function Page() {
    const { slug } = useParams<{ slug: string }>()
    const router = useRouter()
    const [file, setFile] = useState<FileData>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [notFound, setNotFound] = useState<boolean>(false)
    const [deleting, setDeleting] = useState<boolean>(false)
    
    // Use the toast hook
    const { success, error: toastError, warning, info } = useToast()

    // Fetch file data
    async function fetchFile() {
        setLoading(true)
        if (!slug) return           
        
        try {                
            const res = await fetch(`/api/admin?id=${slug}`, { method: 'GET' })
            const data = await res.json()
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch file')
            }
            
            setFile(data)
            setLoading(false)
            
        } catch (error) {
            console.error('Error fetching file:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to load file'
            toastError(errorMessage)
            setLoading(false)
            setNotFound(true)
        }
    }

    useEffect(() => {
        fetchFile()
    }, [])

    // Delete file
    async function binFile(fileId: string) {
        if (!confirm('Are you sure you want to permanently delete this file? This action cannot be undone.')) {
            return
        }

        try {
            setDeleting(true)
            const res = await fetch(`/api/bin?id=${fileId}`, { method: 'DELETE' })
            const data = await res.json()
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete file')
            }
            success('File deleted successfully!')
            
            // Redirect to home or dashboard
            router.push('/drop')
            
        } catch (error) {
            console.error('Error deleting file:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete file'
            toastError(errorMessage)
        } finally {
            setDeleting(false)
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="w-full flex min-h-[100dvh] items-center justify-center px-4 py-24">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-sm text-foreground/60">Loading file...</p>
                </div>
            </div>
        )
    }

    // If file not found
    if (!file || Object.keys(file).length === 0 || notFound) {
        return (
            <div className="w-full flex min-h-[100dvh] items-center justify-center px-4 py-24">
                <div className="w-full max-w-md rounded-xl border flex flex-col items-center gap-4 p-8 bg-secondary/50 shadow-lg">
                    <BsX className="text-4xl text-destructive" />
                    <h2 className="text-xl font-semibold">File Not Found</h2>
                    <p className="text-sm text-foreground/60 text-center">
                        The file you're looking for doesn't exist or has been deleted.
                    </p>
                    <Link href="/" className="text-primary hover:underline text-sm">
                        Return to home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex min-h-[100dvh] items-center justify-center px-4 py-24">
            <div className="w-full max-w-3xl rounded-xl border flex flex-col items-center justify-center bg-secondary/50 shadow-lg">
                <div className="flex gap-4 items-center w-full justify-between border-b p-6">
                    <div className="flex items-center gap-2 text-primary text-sm">
                        <img src='/dropbin_icon.png' alt="DropBin Logo" className="w-auto h-[1.5em]" />
                        <h3 className="text-foreground font-bold">DropBin</h3>
                    </div>
                    <span className="text-xs mono-font bg-primary/10 text-primary px-3 py-1 rounded-full">
                        Admin Panel
                    </span>
                </div>

                <div className="w-full flex flex-wrap gap-6 p-6">
                    <span className="w-full flex items-center gap-2 text-foreground/60 text-xs">
                        <BsShieldCheck /> Scanned · No threats detected
                    </span>

                    <FileCard f={file} showMetadata={true} />

                    <div className="p-4 border rounded-lg bg-secondary flex flex-col gap-1 shadow-lg" style={{flex: '1 0 45%'}}>
                        <p className="flex items-center gap-2 font-semibold text-foreground/50 text-xs">
                            <i className="text-primary"><BsClock /></i> 
                            <span>Auto deletes</span> 
                        </p>
                        <span className="mono-font">
                            {file.expires_at ? new Date(file.expires_at).toLocaleString() : 'Never'}
                        </span>
                    </div>

                    <div className="p-4 border rounded-lg bg-secondary flex flex-col gap-1 shadow-lg" style={{flex: '1 0 45%'}}>
                        <p className="flex items-center gap-2 font-semibold text-foreground/50 text-xs">
                            <i className="text-primary"><BsCloudDownload /></i> 
                            <span>Downloads left</span> 
                        </p>
                        <span className="mono-font">
                            {file.download_limit !== null && file.download_limit !== undefined 
                                ? `${file.download_count || 0}/${file.download_limit}` 
                                : 'Unlimited'}
                        </span>
                    </div>

                    {file.password && (
                        <span className="w-full flex items-center gap-2 text-foreground/60 text-xs mono-font">
                            <i className="text-primary"><BsLock /></i>
                            <span>Password protected</span>
                        </span>
                    )}

                    <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                        <Link href={`/d/${file.file_id}`}
                        className="flex items-center justify-center gap-2 rounded-4xl py-3 px-4 border text-sm
                        hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all">
                            <BsBoxArrowUpRight /> View file
                        </Link>

                        <button 
                            type="button" 
                            onClick={() => file.file_id && binFile(file.file_id)}
                            disabled={deleting}
                            className={`flex items-center justify-center gap-2 rounded-4xl py-3 px-4 bg-destructive text-sm font-semibold
                            text-destructive-foreground hover:bg-red-600 hover:scale-105 transition-all
                            ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {deleting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <BsTrash /> Bin
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>            
        </div>
    )
}