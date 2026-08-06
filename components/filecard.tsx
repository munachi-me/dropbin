import React from 'react'
import { 
    BsFileEarmarkZip,
    BsFileEarmarkText,
    BsPlay,
    BsFileEarmarkPdf,
    BsFileEarmarkMusic,
    BsImage,
    BsFileEarmark,
    BsDot,
    BsFileEarmarkCode,
    BsFileEarmarkExcel,
    BsFileEarmarkWord,
    BsFileEarmarkPpt,
    BsFileEarmarkBinary,
    BsFileEarmarkFont,
    BsFileEarmarkRuled,
    BsFileEarmarkPerson,
    BsFileEarmarkCheck,
    BsFileEarmarkX,
    BsFileEarmarkArrowUp,
    BsFileEarmarkArrowDown,
    BsFileEarmarkLock,
    BsFileEarmarkLockFill,
    BsCloudCheck,
    BsCloudSlash,
} from "react-icons/bs"
import { IconType } from 'react-icons'

// Types
export interface FileCardProps {
    f: FileData
    showMetadata?: boolean
    onRemove?: () => void
}

export interface FileData {
    id?: string | number
    file_id?: string
    admin_id?: string
    name?: string
    original_name?: string
    filename?: string
    size?: number
    file_size?: number
    type?: string
    mime_type?: string
    download_limit?: number | null
    download_count?: number
    expires_at?: string | null
    password?: string | null
    has_password?: boolean
    created_at?: string
    updated_at?: string
    status?: string
    drop_url?: string
    admin_url?: string
}

// Status icon props
interface StatusIconProps {
    expires_at?: string | null
    download_limit?: number | null
    download_count?: number
    password?: string | null
}

const divisor = 1024 // Use 1024 for proper file size calculation

export default function FileCard({ f, showMetadata = false, onRemove }: FileCardProps) {
    // Format file size
    const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    // Get file extension
    const getExtension = (filename?: string): string => {
        if (!filename) return ''
        const lastDot = filename.lastIndexOf('.')
        return lastDot > 0 ? filename.slice(lastDot + 1).toUpperCase() : ''
    }

    // Get file icon based on mime type
    const getFileIcon = (type?: string, filename?: string): IconType => {
        // Check by mime type
        if (type) {
            const lowerType = type.toLowerCase()
            if (lowerType.includes('text')) return BsFileEarmarkText
            if (lowerType.includes('image')) return BsImage
            if (lowerType.includes('video')) return BsPlay
            if (lowerType.includes('audio')) return BsFileEarmarkMusic
            if (lowerType.includes('pdf')) return BsFileEarmarkPdf
            if (lowerType.includes('zip') || lowerType.includes('compressed')) return BsFileEarmarkZip
            if (lowerType.includes('javascript') || lowerType.includes('json') || 
                lowerType.includes('html') || lowerType.includes('css')) {
                return BsFileEarmarkCode
            }
            if (lowerType.includes('spreadsheet') || lowerType.includes('excel') || 
                lowerType.includes('csv')) {
                return BsFileEarmarkExcel
            }
            if (lowerType.includes('word') || lowerType.includes('document')) {
                return BsFileEarmarkWord
            }
            if (lowerType.includes('presentation') || lowerType.includes('powerpoint')) {
                return BsFileEarmarkPpt
            }
        }

        // Fallback: check by extension
        if (filename) {
            const ext = filename.split('.').pop()?.toLowerCase() || ''
            
            const extensionMap: Record<string, IconType> = {
                // Code files
                'js': BsFileEarmarkCode,
                'jsx': BsFileEarmarkCode,
                'ts': BsFileEarmarkCode,
                'tsx': BsFileEarmarkCode,
                'html': BsFileEarmarkCode,
                'css': BsFileEarmarkCode,
                'scss': BsFileEarmarkCode,
                'json': BsFileEarmarkCode,
                'xml': BsFileEarmarkCode,
                'yaml': BsFileEarmarkCode,
                'yml': BsFileEarmarkCode,
                'toml': BsFileEarmarkCode,
                'py': BsFileEarmarkCode,
                'rb': BsFileEarmarkCode,
                'go': BsFileEarmarkCode,
                'rs': BsFileEarmarkCode,
                'c': BsFileEarmarkCode,
                'cpp': BsFileEarmarkCode,
                'h': BsFileEarmarkCode,
                'hpp': BsFileEarmarkCode,
                'java': BsFileEarmarkCode,
                'php': BsFileEarmarkCode,
                'swift': BsFileEarmarkCode,
                'kt': BsFileEarmarkCode,
                'dart': BsFileEarmarkCode,
                'sh': BsFileEarmarkCode,
                'bash': BsFileEarmarkCode,
                'zsh': BsFileEarmarkCode,
                'fish': BsFileEarmarkCode,
                // Spreadsheet files
                'csv': BsFileEarmarkExcel,
                'xls': BsFileEarmarkExcel,
                'xlsx': BsFileEarmarkExcel,
                // Document files
                'doc': BsFileEarmarkWord,
                'docx': BsFileEarmarkWord,
                'odt': BsFileEarmarkWord,
                // Presentation files
                'ppt': BsFileEarmarkPpt,
                'pptx': BsFileEarmarkPpt,
                'odp': BsFileEarmarkPpt,
                // Text files
                'txt': BsFileEarmarkText,
                'md': BsFileEarmarkText,
                'rst': BsFileEarmarkText,
                // PDF
                'pdf': BsFileEarmarkPdf,
                // Archives
                'zip': BsFileEarmarkZip,
                'rar': BsFileEarmarkZip,
                '7z': BsFileEarmarkZip,
                'gz': BsFileEarmarkZip,
                'tar': BsFileEarmarkZip,
                // Audio
                'mp3': BsFileEarmarkMusic,
                'wav': BsFileEarmarkMusic,
                'ogg': BsFileEarmarkMusic,
                'flac': BsFileEarmarkMusic,
                'aac': BsFileEarmarkMusic,
                'm4a': BsFileEarmarkMusic,
                // Video
                'mp4': BsPlay,
                'avi': BsPlay,
                'mov': BsPlay,
                'wmv': BsPlay,
                'mkv': BsPlay,
                'webm': BsPlay,
                'flv': BsPlay,
                // Images
                'jpg': BsImage,
                'jpeg': BsImage,
                'png': BsImage,
                'gif': BsImage,
                'svg': BsImage,
                'webp': BsImage,
                'bmp': BsImage,
                'ico': BsImage,
                'tiff': BsImage,
                'heic': BsImage,
            }
            
            return extensionMap[ext] || BsFileEarmark
        }

        return BsFileEarmark
    }

    // Get status icon (for metadata view)
    const getStatusIcon = (data: StatusIconProps) => {
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return <BsFileEarmarkX className="text-destructive" title="Expired" />
        }
        if (data.download_limit && data.download_count && data.download_count >= data.download_limit) {
            return <BsCloudSlash className="text-destructive" title="Download limit reached" />
        }
        if (data.password) {
            return <BsFileEarmarkLock className="text-warning" title="Password protected" />
        }
        return <BsCloudCheck className="text-green-500" title="Active" />
    }

    const fileName = f.name || f.original_name || ''
    const fileSize = f.size || f.file_size || 0
    const fileType = f.type || f.mime_type || ''
    
    const FileIcon = getFileIcon(fileType, fileName)
    const extension = getExtension(fileName)

    return (
        <div className="overflow-hidden p-3 rounded-xl border flex gap-4 items-center w-full bg-secondary shadow-lg hover:shadow-xl transition-all group">
            {/* Icon */}
            <span className="p-3 rounded-sm bg-primary/10 text-primary text-xl flex-shrink-0">
                <FileIcon />
            </span>

            {/* File Info */}
            <span className="flex flex-col w-full text-foreground items-start gap-1 overflow-hidden min-w-0">
                <p 
                    className="w-full overflow-hidden text-sm font-semibold mono-font truncate" 
                    title={fileName}
                >
                    {fileName}
                </p>
                
                <div className="flex items-center gap-1 text-foreground/60 text-xs mono-font flex-wrap">
                    {extension && (
                        <>
                            <span>{extension}</span>
                            <BsDot className="flex-shrink-0" />
                        </>
                    )}
                    <span className="whitespace-nowrap">{formatSize(fileSize)}</span>
                    
                    {/* Show additional metadata */}
                    {showMetadata && (
                        <>
                            <BsDot className="flex-shrink-0" />
                            <span className="whitespace-nowrap">
                                {f.download_count || 0}/{f.download_limit || '∞'} downloads
                            </span>
                            {f.created_at && (
                                <>
                                    <BsDot className="flex-shrink-0" />
                                    <span className="whitespace-nowrap text-foreground/40">
                                        {new Date(f.created_at).toLocaleDateString()}
                                    </span>
                                </>
                            )}
                        </>
                    )}
                </div>

                {/* Status badge for metadata view */}
                {showMetadata && (
                    <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon({
                            expires_at: f.expires_at,
                            download_limit: f.download_limit,
                            download_count: f.download_count,
                            password: f.password,
                        })}
                        {f.expires_at && (
                            <span className="text-[10px] text-foreground/40">
                                Expires: {new Date(f.expires_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                )}
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-1 flex-shrink-0">
                {onRemove && (
                    <button 
                        onClick={onRemove}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all"
                        title="Remove file"
                    >
                        <BsFileEarmarkX className="text-lg" />
                    </button>
                )}
            </div>
        </div>
    )
}