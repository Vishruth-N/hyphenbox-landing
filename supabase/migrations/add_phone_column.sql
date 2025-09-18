-- Add phone column to data_requirements table
-- First add as nullable
ALTER TABLE public.data_requirements 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update existing rows with a default value (if any exist)
-- You may want to change this default value or handle existing data differently
UPDATE public.data_requirements 
SET phone = 'Not provided' 
WHERE phone IS NULL;

-- Now make the column NOT NULL
ALTER TABLE public.data_requirements 
ALTER COLUMN phone SET NOT NULL;

-- Add an index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_data_requirements_phone ON public.data_requirements(phone);

-- Update the comment on the table to reflect the new structure
COMMENT ON COLUMN public.data_requirements.phone IS 'Required phone number for contact';
