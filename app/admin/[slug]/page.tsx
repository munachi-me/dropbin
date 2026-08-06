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

interface UpdateData {
    download_limit?: number
    expires_at?: string
}

export default function Page() {
    const { slug } = useParams<{ slug: string }>()
    const router = useRouter()
    const [file, setFile] = useState<FileData>({})
    const [loading, setLoading] = useState<boolean>(true)
    const [deleting, setDeleting] = useState<boolean>(false)
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)
    const [downloadLimit, setDownloadLimit] = useState<string>('')
    const [expiresAt, setExpiresAt] = useState<string>('')
    const [updating, setUpdating] = useState<boolean>(false)
    
    // Use the toast hook
    const { success, error: toastError, warning, info } = useToast()

    // Fetch file data
    useEffect(() => {
        async function fetchFile() {
            if (!slug) return
            
            try {
                setLoading(true)
                const res = await fetch(`/api/admin?id=${slug}`, { method: 'GET' })
                const data = await res.json()
                
                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch file')
                }
                
                console.log('File data:', data)
                setFile(data)
                
                // Set initial values for update modal
                if (data.download_limit !== null && data.download_limit !== undefined) {
                    setDownloadLimit(data.download_limit.toString())
                }
                if (data.expires_at) {
                    setExpiresAt(data.expires_at.split('T')[0])
                }
                
            } catch (error) {
                console.error('Error fetching file:', error)
                const errorMessage = error instanceof Error ? error.message : 'Failed to load file'
                toastError(errorMessage)
            } finally {
                setLoading(false)
            }
        }
        
        fetchFile()
    }, [slug, toastError])

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
            
            console.log('File deleted:', data)
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

    // Update file
    async function updateFile(fileId: string) {
        const updateData: UpdateData = {}
        
        if (downloadLimit) {
            updateData.download_limit = parseInt(downloadLimit, 10)
        }
        
        if (expiresAt) {
            updateData.expires_at = new Date(expiresAt).toISOString()
        }

        if (Object.keys(updateData).length === 0) {
            warning('Please update at least one field')
            return
        }

        try {
            setUpdating(true)
            const res = await fetch(`/api/update?id=${fileId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })
            
            const data = await res.json()
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to update file')
            }
            
            console.log('File updated:', data)
            success('File updated successfully!')
            
            // Refresh file data
            const refreshRes = await fetch(`/api/get?id=${fileId}`, { method: 'GET' })
            const refreshData = await refreshRes.json()
            setFile(refreshData)
            
            setShowUpdateModal(false)
            
        } catch (error) {
            console.error('Error updating file:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to update file'
            toastError(errorMessage)
        } finally {
            setUpdating(false)
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
    if (!file || Object.keys(file).length === 0) {
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
                        <img src='/dropbin_icon.png' alt="DropBin Logo" className="w-auto h-[1em]" />
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
                        <div className="flex items-center gap-3">
                            <Link href={`/d/${file.file_id}`}
                            className="flex items-center justify-center gap-2 rounded-4xl py-3 px-4 border text-sm
                            hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all">
                                <BsBoxArrowUpRight /> View file
                            </Link>

                            <button 
                                type="button" 
                                onClick={() => setShowUpdateModal(true)}
                                className="flex items-center justify-center gap-2 rounded-4xl py-3 px-4 bg-blue-500 text-sm font-semibold
                                text-white hover:bg-blue-600 hover:scale-105 transition-all"
                            >
                                <BsPencil /> Edit Settings
                            </button>
                        </div>

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

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-xl border shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit File Settings</h2>
                            <button 
                                onClick={() => setShowUpdateModal(false)}
                                className="p-1 hover:bg-accent rounded-full transition-colors"
                            >
                                <BsX className="text-2xl" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Download Limit
                                </label>
                                <input
                                    type="number"
                                    value={downloadLimit}
                                    onChange={(e) => setDownloadLimit(e.target.value)}
                                    placeholder="Enter download limit"
                                    className="w-full p-2 border rounded-md bg-secondary/50"
                                    min="0"
                                />
                                <p className="text-xs text-foreground/60 mt-1">
                                    Leave empty for unlimited downloads
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Expiration Date
                                </label>
                                <input
                                    type="date"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    className="w-full p-2 border rounded-md bg-secondary/50"
                                />
                                <p className="text-xs text-foreground/60 mt-1">
                                    Leave empty for no expiration
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => file.file_id && updateFile(file.file_id)}
                                    disabled={updating}
                                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-md font-semibold
                                    hover:bg-accent hover:text-accent-foreground transition-colors
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 inline mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Settings'
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 border rounded-md py-2 hover:bg-accent transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}