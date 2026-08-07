"use client"
import { useState, useRef, useEffect } from "react"
import { 
    BsClock, BsCloudDownload, BsLock,
    BsCloudUpload, BsStars, BsDot,
    BsGear, BsX,
    BsCopy, BsBoxArrowUpRight,
    BsFileEarmark, BsCheckCircle, BsExclamationTriangle,
} from "react-icons/bs"
import Link from 'next/link'
import FileCard from '@/components/filecard'
import { success, errorT, warning, info, ToastContainer, Toast } from '@/components/toast' // Import the toast hook

// Types
interface FileMetadata {
    id: string
    admin_id: string
    name: string
    size: number
    type: string
    download_limit: number | null
    expires_at: string | null
    created_at: string
    drop_url: string
    admin_url: string
}

interface TimeOption {
    label: string
    value: number
}

const timeOptions: TimeOption[] = [
    { label: '5 mins', value: 5 * 60 },
    { label: '15 mins', value: 15 * 60 },
    { label: '30 mins', value: 30 * 60 },
    { label: '60 mins', value: 60 * 60 },
    { label: '3 hrs', value: 3 * 60 * 60 },
    { label: '6 hrs', value: 6 * 60 * 60 },
    { label: '12 hrs', value: 12 * 60 * 60 },
    { label: '24 hrs', value: 24 * 60 * 60 },
]

const downloadOptions: number[] = [1, 2, 3, 4, 5]

const MAX_FILE_SIZE: number = 100 * 1024 * 1024 // 100MB

export default function Drop() {    
    const [autoDelete, setAutoDelete] = useState<TimeOption>(timeOptions[2])
    const [downloadLimit, setDownloadLimit] = useState<number>(5)
    const [password, setPassword] = useState<string>('')
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState<boolean>(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([])
    const [isComplete, setIsComplete] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [toast, setToast] = useState<Toast[]>([])
    
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        addFiles(selectedFiles)
        if (e.target) {
            e.target.value = ''
        }
    }

    // Add files with validation
    const addFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter(file => {
            if (file.size > MAX_FILE_SIZE) {
                setError(`File "${file.name}" exceeds the 100MB limit`)
                const tst: Toast = warning(`File "${file.name}" exceeds the 100MB limit`)
                setToast(prev => [tst, ...prev])
                return false
            }
            return true
        })

        if (validFiles.length === 0) {
            return
        }

        setFiles(prev => [...prev, ...validFiles])
        setError('')
        const tst: Toast = info(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} added`)
        setToast(prev => [tst, ...prev])
    }

    // Remove a file
    const removeFile = (index: number) => {
        const removed = files[index]
        setFiles(prev => prev.filter((_, i) => i !== index))
        const tst: Toast = warning(`Removed "${removed.name}"`)
        setToast(prev => [tst, ...prev])
    }

    // Clear all files
    const clearFiles = () => {
        setFiles([])
        setError('')
        const tst: Toast = info('All files cleared')
        setToast(prev => [tst, ...prev])
    }

    // Upload files
    const uploadFiles = async () => {
        if (files.length === 0) {
            setError('Please select at least one file')
            const tst: Toast = warning('Please select at least one file')
            setToast(prev => [tst, ...prev])
            return
        }

        setUploading(true)
        setUploadProgress(0)
        setError('')
        
        const uploaded: FileMetadata[] = []
        let completed = 0

        for (const file of files) {
            try {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('downloadLimit', downloadLimit.toString())
                
                const expiresAt = new Date()
                expiresAt.setSeconds(expiresAt.getSeconds() + autoDelete.value)
                formData.append('expiresAt', expiresAt.toISOString())
                
                if (password) {
                    formData.append('password', password)
                }
                
                const res = await fetch('/api/drop', {
                    method: 'POST',
                    body: formData
                })

                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || `Upload failed with status ${res.status}`)
                }

                const data = await res.json()
                
                if (!data.file) {
                    throw new Error('Invalid response from server')
                }

                uploaded.push(data.file)
                completed++
                setUploadProgress(Math.round((completed / files.length) * 100))

            } catch (error) {
                console.error('Upload error for file:', file.name, error)
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
                setError(`Failed to upload "${file.name}": ${errorMessage}`)
                const tst: Toast = errorT(`Failed to upload "${file.name}"`)
                setToast(prev => [tst, ...prev])
                break
            }
        }

        if (uploaded.length > 0) {
            setUploadedFiles(uploaded)
            setIsComplete(true)
            setFiles([])
            const tst: Toast = success(`${uploaded.length} file${uploaded.length > 1 ? 's' : ''} uploaded successfully!`)
            setToast(prev => [tst, ...prev])
        }

        setUploading(false)
    }

    // Copy to clipboard with toast notification
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            const tst: Toast = success('Link copied to clipboard!')
            setToast(prev => [tst, ...prev])
        } catch (error) {
            console.error('Copy error:', error)
            // Fallback
            try {
                const textarea = document.createElement('textarea')
                textarea.value = text
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
                const tst: Toast = success('Link copied to clipboard!')
                setToast(prev => [tst, ...prev])
            } catch (fallbackError) {
                toastError('Failed to copy link')
            }
        }
    }

    // Reset form
    const resetForm = () => {
        setIsComplete(false)
        setUploadedFiles([])
        setFiles([])
        setUploadProgress(0)
        setError('')
        setPassword('')
        setDownloadLimit(5)
        setAutoDelete(timeOptions[2])
        const tst: Toast = info('Ready for new upload')
        setToast(prev => [tst, ...prev])
    }

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.add('border-primary', 'bg-primary/5')
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-primary', 'bg-primary/5')
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-primary', 'bg-primary/5')
        }
        const droppedFiles = Array.from(e.dataTransfer.files)
        if (droppedFiles.length > 0) {
            addFiles(droppedFiles)
        }
    }

    // Get total size
    const getTotalSize = (): string => {
        const total = files.reduce((sum, file) => sum + file.size, 0)
        return formatSize(total)
    }

    // Format file size
    const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    const testConnection = async () => {
        const res = await fetch('/api')
        if(res.ok){
            const tst: Toast = info('Welcome to DropBin! Drop your files to get started.')
            setToast(prev => [tst, ...prev])
        }
    }
    const closeT = (id: string) => {
        const newT = toast.filter(t => t.id != id)
        setToast(newT)
    }

    useEffect(() => {
        testConnection()          
    }, [])

    // Success View
    if (isComplete) {
        return (
            <div className="w-full flex items-center min-h-[100dvh] justify-center px-4 py-28">
                <ToastContainer toasts={toast} onClose={closeT} />
                <div className="w-full max-w-3xl rounded-xl border flex flex-col items-center justify-center gap-6 bg-secondary/50 p-8 shadow-lg">
                    <div className="flex items-center gap-3 w-full">
                        <span className="p-2 rounded-full bg-success/10 text-success text-2xl">
                            <BsCheckCircle />
                        </span>
                        <span className="flex flex-col w-full items-start gap-1">
                            <h2 className="text-lg font-semibold">Upload Complete!</h2>
                            <p className="text-foreground/60 text-sm">
                                {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded successfully
                            </p>
                        </span>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        {uploadedFiles.map((f, i) => (
                            <div key={i} className="w-full p-4 text-sm flex flex-col items-center gap-3 shadow-lg 
                            rounded-lg bg-secondary border">
                                <p className="w-full flex items-center gap-3 font-semibold">
                                    <i className="text-primary text-lg"><BsFileEarmark /></i> 
                                    <span className="w-full mono-font text-foreground text-sm truncate">
                                        {f.name}
                                    </span>
                                </p>
                                
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex items-center gap-2 w-full text-xs">
                                        <span className="text-foreground/60 whitespace-nowrap">Share link:</span>
                                        <span className="w-full overflow-hidden border rounded-lg bg-background p-2 truncate">
                                            {`${window.location.origin}${f.drop_url}`}
                                        </span>
                                        <button 
                                            onClick={() => copyToClipboard(`${window.location.origin}${f.drop_url}`)}
                                            className="p-2 rounded-full hover:bg-accent hover:text-foreground transition-colors"
                                            title="Copy link"
                                        >
                                            <BsCopy />
                                        </button>
                                        <Link href={f.drop_url} className="p-2 rounded-full hover:bg-accent hover:text-foreground transition-colors">
                                            <BsBoxArrowUpRight />
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-2 w-full text-xs">
                                        <span className="text-foreground/60 whitespace-nowrap">Admin link:</span>
                                        <span className="w-full overflow-hidden border rounded-lg bg-background p-2 truncate">
                                            {`${window.location.origin}${f.admin_url}`}
                                        </span>
                                        <button 
                                            onClick={() => copyToClipboard(`${window.location.origin}${f.admin_url}`)}
                                            className="p-2 rounded-full hover:bg-accent hover:text-foreground transition-colors"
                                            title="Copy link"
                                        >
                                            <BsCopy />
                                        </button>
                                        <Link href={f.admin_url} className="p-2 rounded-full hover:bg-accent hover:text-foreground transition-colors">
                                            <BsBoxArrowUpRight />
                                        </Link>
                                    </div>
                                </div>

                                <div className="w-full flex flex-wrap gap-4 text-xs text-foreground/60">
                                    <span>Size: {formatSize(f.size)}</span>
                                    <span>Downloads: {f.download_limit || '∞'}</span>
                                    {f.expires_at && (
                                        <span>Expires: {new Date(f.expires_at).toLocaleString()}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="w-full border" />

                    <div className="w-full flex gap-3">
                        <button 
                            onClick={resetForm}
                            className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-4 bg-primary text-sm font-semibold
                            text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                            <BsCloudUpload /> New Drop
                        </button>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="flex-1 flex items-center justify-center gap-2 rounded-full py-3 px-4 border text-sm font-semibold
                            hover:bg-accent hover:text-accent-foreground transition-all"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <ToastContainer toasts={toast} onClose={closeT} />
            {/* Hero Section */}
            <div className="w-full mx-auto pt-24 pb-12 px-4 flex flex-col justify-center items-center gap-4 grid-bg">
                <span className="flex items-center gap-2 text-xs text-foreground/60 py-1 px-3 rounded-lg border bg-secondary">
                    <i className="text-primary"><BsStars /></i> 
                    The Conduit
                </span>
                <h1 className="text-2xl md:text-4xl font-bold">
                    Share files in <span className="gradient-text">seconds.</span>
                </h1>
                <p className="text-foreground/60 text-center w-full max-w-xl text-sm md:text-base">
                    Drop a file, grab the link, and let DropBin handle the rest.
                </p>
            </div>

            {/* Drop Zone */}
            <div className="w-full max-w-3xl mx-auto px-4 mb-12">
                <div 
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="w-full p-12 rounded-xl border-2 border-dashed flex flex-col items-center shadow-lg
                    justify-center gap-4 bg-background hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        multiple
                        onChange={handleFileSelect}
                        accept="*/*"
                    />
                    
                    <span className="text-primary bg-primary/10 p-4 rounded-sm text-4xl">
                        <BsCloudUpload />
                    </span>
                    
                    <div className="flex flex-col items-center gap-2">
                        <h4 className="text-lg font-semibold">Drag & drop your files</h4>
                        <p className="text-foreground/60 text-center">
                            or <span className="text-primary hover:text-accent hover:underline cursor-pointer">
                                browse
                            </span> to choose.
                        </p>
                        <p className="text-foreground/60 text-xs mt-2">
                            Maximum file size: 100 MB
                        </p>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
                        <BsExclamationTriangle />
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="ml-auto">
                            <BsX />
                        </button>
                    </div>
                )}
            </div>

            {/* File List & Settings */}
            {files.length > 0 && (
                <div id="files" className="w-full max-w-3xl mx-auto px-4 pb-24 flex flex-col justify-center gap-4">
                    {/* File count and size */}
                    <div className="flex items-center justify-between gap-4 text-xs mono-font w-full font-medium">
                        <span>{files.length} file{files.length > 1 ? 's' : ''}</span>
                        <span className="text-foreground/60">{getTotalSize()} total</span>
                        <button 
                            onClick={clearFiles}
                            className="text-destructive hover:bg-destructive/10 px-2 py-1 rounded transition-colors"
                        >
                            Clear all
                        </button>
                    </div>

                    {/* File Cards */}
                    <div className="flex flex-col gap-3 w-full">
                        {files.map((f, i) => (
                            <FileCard 
                                key={i} 
                                f={f}
                                onRemove={() => removeFile(i)}
                            />
                        ))}
                    </div>

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="w-full">
                            <div className="flex justify-between text-xs mb-1">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                                <div 
                                    className="gradient-bg h-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    <div className="w-full flex flex-col gap-6 justify-start p-6 rounded-xl border bg-secondary/50 shadow-lg">
                        <p className="text-foreground/60 text-sm flex items-center gap-2">
                            <BsGear /> Drop settings
                        </p>

                        {/* Auto Delete */}
                        <div className="w-full flex flex-col gap-3 justify-start text-sm">
                            <p className="flex items-center gap-2 font-semibold">
                                <i className="text-primary"><BsClock /></i> 
                                <span>Auto delete</span> 
                            </p>
                            <span className="text-foreground/60 text-xs">Files auto-delete after this period.</span>

                            <div className="w-full flex flex-wrap gap-1.5 text-xs">
                                {timeOptions.map((option) => (
                                    <button 
                                        key={option.label} 
                                        onClick={() => setAutoDelete(option)}                                
                                        className={`px-3 py-1.5 rounded-lg border transition-all
                                        ${option.label === autoDelete.label 
                                            ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                                            : 'text-foreground/60 hover:text-foreground hover:border-primary'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Download Limit */}
                        <div className="w-full flex flex-col gap-3 justify-start text-sm">
                            <p className="flex items-center gap-2 font-semibold">
                                <i className="text-primary"><BsCloudDownload /></i> 
                                <span>Download limit</span> 
                            </p>
                            <span className="text-foreground/60 text-xs">Link goes dark after this many downloads.</span>

                            <div className="w-full flex flex-wrap gap-1.5 text-xs">
                                {downloadOptions.map((d) => (
                                    <button 
                                        key={d} 
                                        onClick={() => setDownloadLimit(d)}                                
                                        className={`px-3 py-1.5 rounded-lg border transition-all
                                        ${d === downloadLimit 
                                            ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                                            : 'text-foreground/60 hover:text-foreground hover:border-primary'}`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Password Protection */}
                        <div className="w-full flex flex-col gap-3 justify-start text-sm">
                            <p className="flex items-center gap-2 font-semibold">
                                <i className="text-primary"><BsLock /></i> 
                                <span>Password protection <span className="text-foreground/60 font-normal">(optional)</span></span> 
                            </p>
                            <span className="text-foreground/60 text-xs">Recipients must enter this to download.</span>

                            <input 
                                type="text" 
                                placeholder="Leave empty for no password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2.5 border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="w-full flex flex-wrap items-center gap-2 justify-start text-xs p-4 rounded-lg border bg-secondary/50 shadow-lg">
                        <p className="flex items-center gap-2">
                            <i className="text-primary"><BsClock /></i> 
                            <span>Expires in {autoDelete.label}</span> 
                        </p>
                        <BsDot />
                        <p className="flex items-center gap-2">
                            <i className="text-primary"><BsCloudDownload /></i> 
                            <span>{downloadLimit || '∞'} download{downloadLimit !== 1 ? 's' : ''}</span> 
                        </p>
                        {password && (
                            <>
                                <BsDot />
                                <p className="flex items-center gap-2">
                                    <i className="text-primary"><BsLock /></i> 
                                    <span>Password protected</span> 
                                </p>
                            </>
                        )}
                    </div>

                    {/* Upload Button */}
                    <button 
                        onClick={uploadFiles}
                        disabled={uploading || files.length === 0}
                        className={`w-full flex items-center justify-center gap-2 rounded-full p-4 bg-primary text-sm font-semibold
                        text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-all
                        ${(uploading || files.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Uploading {uploadProgress}%
                            </>
                        ) : (
                            <>
                                <BsCloudUpload /> Generate {files.length > 1 ? 'links' : 'link'}
                            </>
                        )}
                    </button>
                </div>
            )}
        </>
    )
}