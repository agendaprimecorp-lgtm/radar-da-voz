import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadAudio(
  file: File,
  folder: string = 'audio_submissions'
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'radar_da_voz')
  formData.append('folder', folder)
  formData.append('resource_type', 'auto')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload file')
  }

  const data = await response.json()
  return data.secure_url
}

export async function uploadVideo(
  file: File,
  folder: string = 'video_submissions'
): Promise<string> {
  return uploadAudio(file, folder)
}

export async function getUploadSignature(timestamp: number, folder: string) {
  const response = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamp, folder }),
  })

  if (!response.ok) {
    throw new Error('Failed to get upload signature')
  }

  return response.json()
}
