import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const talentId = formData.get('talent_id') as string
    const type = formData.get('type') as 'audio' | 'video'

    if (!file || !talentId) {
      return NextResponse.json(
        { error: 'Missing file or talent_id' },
        { status: 400 }
      )
    }

    // Upload via Cloudinary
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('upload_preset', 'radar_da_voz')
    uploadFormData.append('folder', type === 'audio' ? 'audio_submissions' : 'video_submissions')

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      )
    }

    const uploadData = await uploadResponse.json()
    const fileUrl = uploadData.secure_url
    const duration = Math.round(uploadData.duration || 0)

    // Save to database
    if (type === 'audio') {
      const { data, error } = await supabase
        .from('audio_recordings')
        .insert({
          talent_id: talentId,
          audio_url: fileUrl,
          duration_seconds: duration,
          status: 'analyzing',
        })
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(
        { audio: data?.[0], url: fileUrl },
        { status: 201 }
      )
    } else {
      const { data, error } = await supabase
        .from('video_submissions')
        .insert({
          talent_id: talentId,
          video_url: fileUrl,
          video_type: 'performance',
          duration_seconds: duration,
          status: 'analyzing',
        })
        .select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(
        { video: data?.[0], url: fileUrl },
        { status: 201 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
