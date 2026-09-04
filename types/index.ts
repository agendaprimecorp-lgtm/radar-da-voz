// User Types
export enum UserType {
  ARTIST = 'artist',
  PRODUCER = 'producer',
  COMPANY = 'company',
  INFLUENCER = 'influencer',
  BAND = 'band',
  TV_RADIO = 'tv_radio',
}

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  name: string;
  bio?: string;
  profile_picture_url?: string;
  phone?: string;
  verified: boolean;
  location_city?: string;
  location_state?: string;
  lat?: number;
  lng?: number;
  created_at: string;
  updated_at: string;
}

// Talent Types
export interface Talent {
  id: string;
  user_id: string;
  specialty: string; // voz, violão, bateria, influencer, etc
  genre: string[];
  experience_years: number;
  verified: boolean;
  rating: number;
  portfolio_url?: string;
  created_at: string;
  user?: User;
}

// Audio Recording Types
export interface AudioRecording {
  id: string;
  talent_id: string;
  audio_url: string;
  duration_seconds: number;
  analysis_score: AudioAnalysis;
  status: 'analyzing' | 'completed' | 'failed';
  created_at: string;
}

export interface AudioAnalysis {
  nota: number; // 0-10
  nivel: 'iniciante' | 'intermediário' | 'profissional';
  clareza: number;
  naturalidade: number;
  tecnica: number;
  frequencias?: Record<string, number>;
}

// Video Submission Types
export interface VideoSubmission {
  id: string;
  talent_id: string;
  video_url: string;
  video_type: 'performance' | 'interview' | 'casting';
  analysis_score: VideoAnalysis;
  status: 'analyzing' | 'completed' | 'failed';
  created_at: string;
}

export interface VideoAnalysis {
  carisma: number;
  naturalidade: number;
  tecnica: number;
  score_geral: number;
  tempo_visto: number;
}

// Job Posting Types
export interface JobPosting {
  id: string;
  posted_by_id: string;
  title: string;
  description: string;
  specialty_required: string;
  genre_required: string[];
  location_city?: string;
  location_state?: string;
  budget_min: number;
  budget_max: number;
  status: 'open' | 'closed' | 'filled';
  created_at: string;
  expires_at: string;
  posted_by?: User;
}

// Application Types
export interface Application {
  id: string;
  job_id: string;
  talent_id: string;
  status: 'applied' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  created_at: string;
  job?: JobPosting;
  talent?: Talent;
}

// Ad Campaign Types
export interface AdCampaign {
  id: string;
  company_id: string;
  title: string;
  brief: string;
  budget: number;
  target_region: string;
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  created_at: string;
  company?: User;
}

// Campaign Submission Types
export interface CampaignSubmission {
  id: string;
  campaign_id: string;
  influencer_id: string;
  video_url: string;
  status: 'submitted' | 'approved' | 'rejected' | 'published';
  engagement_metrics: {
    views: number;
    likes: number;
    shares: number;
  };
  commission_amount: number;
  created_at: string;
  influencer?: User;
}

// Local Representative Types
export interface LocalRepresentative {
  id: string;
  influencer_id: string;
  region: string;
  city: string;
  followers_count: number;
  commission_percentage: number;
  active: boolean;
  created_at: string;
  influencer?: User;
}

// Message Types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: User;
}

// Transaction Types
export interface Transaction {
  id: string;
  user_id: string;
  type: 'subscription' | 'credit' | 'commission' | 'payout';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'stripe' | 'pix' | 'transfer';
  reference_id?: string;
  created_at: string;
}

// Review Types
export interface Review {
  id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  from_user?: User;
}

// Dashboard Types
export interface Dashboard {
  user: User;
  stats: {
    totalViews: number;
    totalApplications: number;
    totalEarnings: number;
    rating: number;
  };
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

// Filter Types
export interface TalentFilters {
  specialty?: string;
  genre?: string[];
  experience_years?: { min: number; max: number };
  rating?: { min: number };
  location_city?: string;
  location_state?: string;
  budget?: { min: number; max: number };
  sort?: 'rating' | 'recent' | 'popular';
}

export interface JobFilters {
  specialty?: string;
  genre?: string[];
  location_city?: string;
  location_state?: string;
  budget?: { min: number; max: number };
  status?: 'open' | 'closed' | 'filled';
}
