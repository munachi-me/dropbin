// lib/filebase.ts
import { env } from './env'
import { 
    S3Client, 
    PutObjectCommand,
    PutObjectCommandOutput,
    GetObjectCommand,
    DeleteObjectCommand,
    DeleteObjectCommandOutput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Type definitions
interface UploadOptions {
    filetype?: string
    originalName?: string
}

interface UploadResult {
    success: boolean
    data?: PutObjectCommandOutput
    error?: Error
}

interface DownloadResult {
    success: boolean
    url: string
    error?: Error
}

interface DeleteResult {
    success: boolean
    data?: DeleteObjectCommandOutput
    error?: Error
}

// Debug environment variables
console.log('Filebase Config:', {
    endpoint: env.filebaseEndpoint,
    bucket: env.filebaseBucket,
    hasKey: !!env.filebaseKey,
    hasSecret: !!env.filebaseSecret,
})

// Validate required env vars
if (!env.filebaseBucket || !env.filebaseKey || !env.filebaseSecret) {
    throw new Error('Missing required Filebase environment variables')
}

// Initialize S3 client
const client = new S3Client({
    endpoint: env.filebaseEndpoint,
    region: 'auto',
    credentials: {
        accessKeyId: env.filebaseKey,
        secretAccessKey: env.filebaseSecret,
    },
    forcePathStyle: true,
})

export const filebase = {
    async upload(
        filename: string, 
        buffer: Buffer | Uint8Array | Blob | string,
        filetype?: string, 
        originalName?: string
    ): Promise<UploadResult> {
        try {
            console.log(`Uploading to Filebase: ${filename}`)
            
            const uploadCommand = new PutObjectCommand({
                Bucket: env.filebaseBucket,
                Key: filename,
                Body: buffer,
                ContentType: filetype || 'application/octet-stream',
                Metadata: {
                    originalName: originalName || filename,
                    uploadDate: new Date().toISOString(),
                },
            })

            const result = await client.send(uploadCommand)
            console.log('Filebase upload result:', result)
            
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error('Filebase upload error:', error)
            return {
                success: false,
                error: error as Error
            }
        }
    },
    
    async download(filename: string): Promise<DownloadResult> {
        try {
            const command = new GetObjectCommand({
                Bucket: env.filebaseBucket,
                Key: filename,
            })

            const presignedUrl = await getSignedUrl(client, command, {
                expiresIn: 3600 // 1 hour
            })

            return {
                success: true,
                url: presignedUrl,
            }
        } catch (error) {
            console.error('Filebase download error:', error)
            return {
                success: false,
                url: '',
                error: error as Error
            }
        }
    },
    
    async delete(filename: string): Promise<DeleteResult> {
        try {
            const deleteCommand = new DeleteObjectCommand({
                Bucket: env.filebaseBucket,
                Key: filename
            })

            const result = await client.send(deleteCommand)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error('Filebase delete error:', error)
            return {
                success: false,
                error: error as Error
            }
        }
    }
}

// Optional: Export client for direct use if needed
export { fbclient as s3Client }
