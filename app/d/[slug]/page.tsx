"use client"
import { useState, useRef, useEffect } from "react"
import { useParams } from 'next/navigation'
import {
    BsDot, BsShieldCheck, BsClock, BsCloudDownload,
    BsLock, BsUnlock, BsDownload
} from 'react-icons/bs'
import FileCard from '@/components/filecard'
import { useToast } from '@/components/toast'

// Types
interface FileData {
    id?: string
    name?: string
    size?: number
    type?: string
    password?: string
    download_limit?: number | null
    download_count?: number
    expires_at?: string | null
    created_at?: string
    has_password?: boolean
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

export default function Page() {
    const { slug } = useParams<{ slug: string }>()
    const [file, setFile] = useState<FileData>({})
    const [lock, setLock] = useState<boolean>(false)
    const [downloading, setDownloading] = useState<boolean>(false)
    const passwordRef = useRef<HTMLInputElement>(null)
    
    // Use the toast hook
    const { success, error: toastError, warning, info } = useToast()

    async function fetchFile() {
        if (!slug) return
        
        try {
            const res = await fetch(`/api/get?id=${slug}`, { method: 'GET' })
            const data = await res.json()
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch drop')
            }
            setFile(data)
            
            if (data.password) {
                setLock(true)
                info('This file is password protected')
            }
        } catch (error) {
            console.error('Error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to load file'
            toastError(errorMessage)
        }
    }

    useEffect(() => {
        fetchFile()
    }, [])

    function handleUnlock() {
        const enteredPassword = passwordRef.current?.value || ''
        
        if (enteredPassword === file.password) {
            setLock(false)
            success('Access granted!')
        } else {
            toastError('Access denied! Incorrect password.')
        }
    }

    async function downloadFile() {
        if (downloading || !slug) return
        
        setDownloading(true)
        
        try {
            // Get the presigned URL
            const res = await fetch(`/api/download?id=${slug}`, { method: 'GET' })
            const data: DownloadResponse = await res.json()
            
            if (!res.ok) {
                throw new Error(data as unknown as string || 'Download Failed')
            }

            // Check if download limit is reached
            if (data.remaining_downloads !== null && data.remaining_downloads < 0) {
                toastError('Download limit reached!')
                setDownloading(false)
                return
            }

            // Direct download using anchor tag
            const link = document.createElement('a')
            link.href = data.download_url
            link.download = data.filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Show success message with remaining downloads
            if (data.remaining_downloads !== null) {
                success(`Download started! ${data.remaining_downloads} download${data.remaining_downloads !== 1 ? 's' : ''} remaining`)
            } else {
                success('Download started!')
            }
            
            fetchFile()

        } catch (error) {
            console.error('Error downloading:', error)
            const errorMessage = error instanceof Error ? error.message : 'Download failed'
            toastError(errorMessage)
        } finally {
            setDownloading(false)
        }
    }

    // Alternative download method using fetch + blob
    async function downloadFileWithBlob() {
        if (downloading || !slug) return
        
        setDownloading(true)
        
        try {
            // Get the presigned URL
            const res = await fetch(`/api/download?id=${slug}`, { method: 'GET' })
            const data: DownloadResponse = await res.json()
            
            if (!res.ok) {
                throw new Error(data as unknown as string || 'Download Failed')
            }

            // Fetch the actual file from presigned URL
            const fileResponse = await fetch(data.download_url)
            if (!fileResponse.ok) {
                throw new Error('Failed to fetch file')
            }
            
            const blob = await fileResponse.blob()
            
            // Create a download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = data.filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            // Clean up
            window.URL.revokeObjectURL(url)

            // Update the file state
            fetchFile()
            
            success('Download complete!')

        } catch (error) {
            console.error('Error downloading:', error)
            const errorMessage = error instanceof Error ? error.message : 'Download failed'
            toastError(errorMessage)
        } finally {
            setDownloading(false)
        }
    }

    // Loading state
    if (!file || Object.keys(file).length === 0) {
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

    return (
        <div className="w-full flex min-h-[100dvh] items-center justify-center px-4 py-24">
            {lock ? 
            <div className="w-full max-w-xl rounded-xl border flex flex-col gap-4 p-6 items-start bg-secondary/50 shadow-lg">                
                <i className="p-4 rounded-sm text-primary bg-primary/10"><BsLock /></i>
                <h2 className="text-base text-left font-semibold">Password required</h2>
                <p className="text-foreground/60 text-left text-sm">Enter the password to access this drop.</p>

                <input 
                    ref={passwordRef} 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="Enter password"
                    className="w-full p-3 border rounded-sm bg-none text-foreground text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                />

                <button 
                    type="button" 
                    onClick={handleUnlock}
                    className="w-full flex items-center justify-center gap-2 rounded-4xl p-4 bg-primary text-sm font-semibold
                    text-primary-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105"
                >
                    <BsUnlock /> Unlock
                </button> 
            </div>
            :
            <div className="w-full max-w-3xl rounded-xl border flex flex-col items-center justify-center bg-secondary/50 shadow-lg">
                <div className="flex gap-4 items-center w-full justify-between border-b p-6">
                    <div className="flex items-center gap-2 text-primary text-sm">
                        <img src='/dropbin_icon.png' alt="DropBin Logo" className="w-auto h-[1em]" />
                        <h3 className="text-foreground font-bold">DropBin</h3>
                    </div>
                    <span className="text-xs mono-font">
                        Secure transfer
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

                    <button 
                        type="button" 
                        onClick={downloadFile}
                        disabled={downloading}
                        className={`w-full flex items-center justify-center gap-2 rounded-4xl p-4 bg-primary text-sm font-semibold relative glow
                        text-primary-foreground hover:bg-accent hover:text-accent-foreground animate-pulse-ring
                        ${downloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {downloading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <BsCloudDownload /> Download file
                            </>
                        )}
                    </button>
                </div>               
            </div>
            }
        </div>
    )
}