export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          user_type: 'artist' | 'producer' | 'company' | 'influencer' | 'band' | 'tv_radio'
          name: string
          bio: string | null
          profile_picture_url: string | null
          phone: string | null
          verified: boolean
          location_city: string | null
          location_state: string | null
          lat: number | null
          lng: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      talents: {
        Row: {
          id: string
          user_id: string
          specialty: string
          genre: string[]
          experience_years: number
          verified: boolean
          rating: number
          review_count: number
          portfolio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['talents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['talents']['Insert']>
      }
      audio_recordings: {
        Row: {
          id: string
          talent_id: string
          audio_url: string
          duration_seconds: number
          analysis_score: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['audio_recordings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['audio_recordings']['Insert']>
      }
      video_submissions: {
        Row: {
          id: string
          talent_id: string
          video_url: string
          video_type: 'performance' | 'interview' | 'casting'
          duration_seconds: number | null
          analysis_score: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['video_submissions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['video_submissions']['Insert']>
      }
      job_postings: {
        Row: {
          id: string
          posted_by_id: string
          title: string
          description: string | null
          specialty_required: string
          genre_required: string[]
          location_city: string | null
          location_state: string | null
          budget_min: number
          budget_max: number
          status: 'open' | 'closed' | 'filled'
          created_at: string
          expires_at: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['job_postings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['job_postings']['Insert']>
      }
      applications: {
        Row: {
          id: string
          job_id: string
          talent_id: string
          status: 'applied' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['applications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['applications']['Insert']>
      }
      ad_campaigns: {
        Row: {
          id: string
          company_id: string
          title: string
          brief: string
          budget: number
          target_region: string | null
          target_city: string | null
          status: 'open' | 'in_progress' | 'completed' | 'closed'
          created_at: string
          expires_at: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ad_campaigns']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ad_campaigns']['Insert']>
      }
      campaign_submissions: {
        Row: {
          id: string
          campaign_id: string
          influencer_id: string
          video_url: string
          status: 'submitted' | 'approved' | 'rejected' | 'published'
          engagement_metrics: Json
          commission_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['campaign_submissions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['campaign_submissions']['Insert']>
      }
      local_representatives: {
        Row: {
          id: string
          influencer_id: string
          region: string
          city: string
          followers_count: number
          commission_percentage: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['local_representatives']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['local_representatives']['Insert']>
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'subscription' | 'credit' | 'commission' | 'payout'
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_method: 'stripe' | 'pix' | 'transfer' | null
          reference_id: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'starter' | 'pro' | 'enterprise'
          status: string
          stripe_subscription_id: string | null
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
