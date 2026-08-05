// lib/filebase.js
import { env } from './env'
import { 
    S3Client, 
    PutObjectCommand,
    GetObjectCommand, 
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Debug environment variables
console.log('Filebase Config:', {
    endpoint: env.filebaseEndpoint,
    bucket: env.filebaseBucket,
    hasKey: !!env.filebaseKey,
    hasSecret: !!env.filebaseSecret,
})

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
    async upload(filename, buffer, filetype, originalName) {
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
            return result
        } catch (error) {
            console.error('Filebase upload error:', error)
            return null
        }
    },
    
    async download(filename) {
        try {
            const command = new GetObjectCommand({
                Bucket: env.filebaseBucket,
                Key: filename,
            })

            const presignedUrl = await getSignedUrl(client, command, {
                expiresIn: 3600
            })

            return presignedUrl
        } catch (error) {
            console.error('Filebase download error:', error)
            return null
        }
    },
    
    async delete(filename) {
        try {
            const deleteCommand = new DeleteObjectCommand({
                Bucket: env.filebaseBucket,
                Key: filename
            })

            const result = await client.send(deleteCommand)
            return result
        } catch (error) {
            console.error('Filebase delete error:', error)
            return null
        }
    }
}