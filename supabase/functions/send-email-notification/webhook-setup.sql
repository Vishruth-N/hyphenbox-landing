-- Database Webhook Setup for Email Notifications
-- Run this SQL in your Supabase SQL Editor after deploying the edge function

-- Create the webhook to trigger the edge function when a new row is inserted
-- Replace 'YOUR_PROJECT_ID' with your actual Supabase project ID
-- You can find your project ID in the Supabase dashboard URL: https://app.supabase.com/project/YOUR_PROJECT_ID

-- First, enable the pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to trigger the webhook
CREATE OR REPLACE FUNCTION trigger_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  project_id TEXT;
  edge_function_url TEXT;
  service_role_key TEXT;
  payload JSONB;
BEGIN
  -- IMPORTANT: Replace these values with your actual project details
  project_id := 'YOUR_PROJECT_ID'; -- Replace with your Supabase project ID
  edge_function_url := 'https://' || project_id || '.supabase.co/functions/v1/send-email-notification';
  
  -- You'll need to set this as a secret in your database
  -- Run: SELECT vault.create_secret('service_role_key', 'your-service-role-key');
  service_role_key := vault.read_secret('service_role_key');
  
  -- Prepare the webhook payload
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'data_requirements',
    'schema', 'public',
    'record', to_jsonb(NEW),
    'old_record', NULL
  );
  
  -- Send the webhook using pg_net
  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := payload::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the data_requirements table
DROP TRIGGER IF EXISTS on_data_requirements_insert ON public.data_requirements;
CREATE TRIGGER on_data_requirements_insert
  AFTER INSERT ON public.data_requirements
  FOR EACH ROW
  EXECUTE FUNCTION trigger_email_notification();

-- Alternative: Using Supabase Database Webhooks (Simpler approach)
-- Instead of the above trigger, you can use Supabase's built-in Database Webhooks feature
-- This is the recommended approach as it's simpler to manage

/*
To set up using Supabase Database Webhooks (Recommended):

1. Go to your Supabase Dashboard
2. Navigate to Database → Webhooks
3. Click "Create a new hook"
4. Configure as follows:
   - Name: send-email-on-form-submission
   - Table: data_requirements
   - Events: Check "Insert"
   - Type: Supabase Edge Functions
   - Edge Function: send-email-notification
   - HTTP Headers: Leave empty (Supabase handles auth automatically)
5. Click "Create webhook"

This approach is simpler and doesn't require storing the service role key in the database.
*/
