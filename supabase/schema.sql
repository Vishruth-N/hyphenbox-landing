-- Create data_requirements table for storing form submissions
CREATE TABLE IF NOT EXISTS public.data_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    role_title TEXT,
    data_type TEXT,
    data_amount TEXT,
    timeline TEXT,
    hardware_setup JSONB DEFAULT '[]'::jsonb,
    additional_hardware TEXT,
    budget_range TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.data_requirements ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow INSERT operations from authenticated and anonymous users
-- (since this is a public form)
CREATE POLICY "Enable insert for all users" ON public.data_requirements
    FOR INSERT TO public, anon WITH CHECK (true);

-- Create a policy to allow SELECT for authenticated users only (for admin purposes)
CREATE POLICY "Enable select for authenticated users only" ON public.data_requirements
    FOR SELECT TO authenticated USING (true);

-- Create an index on email for faster lookups
CREATE INDEX idx_data_requirements_email ON public.data_requirements(email);

-- Create an index on created_at for sorting
CREATE INDEX idx_data_requirements_created_at ON public.data_requirements(created_at DESC);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_data_requirements_updated_at
    BEFORE UPDATE ON public.data_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
