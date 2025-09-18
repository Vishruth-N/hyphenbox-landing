import { createClient } from '@supabase/supabase-js'

// Database types for our form data
export interface DataRequirement {
  id?: string
  full_name: string
  email: string
  company: string
  role_title?: string
  data_type?: string
  data_amount?: string
  timeline?: string
  hardware_setup?: string[]
  additional_hardware?: string
  budget_range?: string
  created_at?: string
}

// Initialize Supabase client
// You need to set these environment variables in your .env.local file:
// VITE_SUPABASE_URL=your_supabase_project_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
