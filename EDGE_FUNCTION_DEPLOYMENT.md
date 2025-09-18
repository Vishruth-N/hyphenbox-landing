# Edge Function Deployment Guide for Email Notifications

This guide will help you deploy the Supabase Edge Function that sends automated emails when someone fills out the data requirements form.

## Prerequisites

✅ **Completed:**
- Supabase CLI installed and updated
- Edge function created in `supabase/functions/send-email-notification/`

⚠️ **You need:**
- Resend API key (you mentioned you have this)
- A verified domain in Resend for sending emails
- Your Supabase project credentials

## Step 1: Configure Resend

1. **Verify your domain in Resend** (if not already done):
   - Go to https://resend.com/domains
   - Add and verify `hyphenbox.com` or your preferred domain
   - Update the `FROM_EMAIL` in the edge function if using a different domain

## Step 2: Link Your Supabase Project

Run this command in your project root:

```bash
supabase link --project-ref YOUR_PROJECT_ID
```

To find your project ID:
1. Go to your Supabase dashboard
2. The project ID is in the URL: `https://app.supabase.com/project/[PROJECT_ID]`
https://supabase.com/dashboard/project/yguewxxpijzsdiwewaum/functions/new
3. Or go to Settings → General → Reference ID

## Step 3: Set Environment Variables

Set the required secrets for your edge function:

```bash
# Set your Resend API key
supabase secrets set RESEND_API_KEY=your_resend_api_key_here

# Set the FROM email (must be from a verified domain in Resend)
supabase secrets set FROM_EMAIL=noreply@hyphenbox.com

# The following are automatically available, no need to set:
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
```

## Step 4: Deploy the Edge Function

Deploy your edge function to Supabase:

```bash
# Deploy the function
supabase functions deploy send-email-notification

# Verify deployment
supabase functions list
```

## Step 5: Set Up Database Webhook

### Option A: Using Supabase Dashboard (Recommended - Easiest)

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Webhooks**
3. Click **"Create a new hook"**
4. Configure as follows:
   - **Name**: `send-email-on-form-submission`
   - **Table**: `data_requirements`
   - **Events**: ✅ Insert (check only this)
   - **Type**: `Supabase Edge Functions`
   - **Edge Function**: `send-email-notification` (select from dropdown)
   - **HTTP Headers**: Leave empty
   - **Webhook Payload**: Keep default
5. Click **"Create webhook"**

### Option B: Using SQL (Alternative)

If you prefer to use SQL or the dashboard method doesn't work:

1. Go to **SQL Editor** in Supabase
2. Get your service role key from Settings → API → service_role key
3. Run this SQL (replace the placeholders):

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS vault;

-- Store your service role key securely
SELECT vault.create_secret('service_role_key', 'your-service-role-key-here');

-- Then run the webhook setup SQL from webhook-setup.sql
```

## Step 6: Test the Integration

### Test Locally First (Optional)

```bash
# Serve the function locally
supabase functions serve send-email-notification

# In another terminal, test with curl
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/send-email-notification' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "type": "INSERT",
    "table": "data_requirements",
    "record": {
      "id": "test-123",
      "full_name": "Test User",
      "email": "test@example.com",
      "company": "Test Company",
      "role_title": "Developer",
      "data_type": "Test data type",
      "data_amount": "1000 samples",
      "timeline": "2 weeks",
      "hardware_setup": ["UMI", "ALOHA"],
      "budget_range": "10k-50k",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }'
```

### Test in Production

1. Go to your website
2. Fill out the data requirements form with test data
3. Submit the form
4. Check:
   - The email should arrive at the submitted email address
   - CC should be sent to vishruth@hyphenbox.com
   - Check Supabase logs: Database → Webhooks → View logs

## Step 7: Monitor and Debug

### View Function Logs

```bash
# View recent logs
supabase functions logs send-email-notification

# Follow logs in real-time
supabase functions logs send-email-notification --follow
```

### Check in Dashboard

1. Go to **Edge Functions** in Supabase dashboard
2. Click on `send-email-notification`
3. View invocations and logs

## Troubleshooting

### Email not sending?

1. **Check Resend API key**:
   ```bash
   supabase secrets list
   ```

2. **Verify domain in Resend**:
   - Must use email from verified domain
   - Check Resend dashboard for domain status

3. **Check webhook is active**:
   - Database → Webhooks → Check if enabled

4. **View function logs**:
   ```bash
   supabase functions logs send-email-notification --follow
   ```

### Common Issues

- **"Failed to fetch"**: Check if edge function URL is correct
- **"Unauthorized"**: Verify service role key is set correctly
- **"Domain not verified"**: Verify domain in Resend
- **No logs appearing**: Check if webhook is properly configured

## Email Customization

To customize the email:
1. Edit `/supabase/functions/send-email-notification/index.ts`
2. Modify the HTML/text templates in the `htmlContent` and `textContent` variables
3. Redeploy: `supabase functions deploy send-email-notification`

## Security Notes

- Never commit API keys to git
- Use environment variables for all sensitive data
- The edge function uses service role key internally (managed by Supabase)
- Ensure RLS policies are appropriate for your use case

## Quick Command Reference

```bash
# Link project
supabase link --project-ref YOUR_PROJECT_ID

# Set secrets
supabase secrets set RESEND_API_KEY=your_key_here
supabase secrets set FROM_EMAIL=noreply@hyphenbox.com

# Deploy function
supabase functions deploy send-email-notification

# View logs
supabase functions logs send-email-notification --follow

# List functions
supabase functions list

# Delete function (if needed)
supabase functions delete send-email-notification
```

## Next Steps

After successful deployment:
1. ✅ Test with a real form submission
2. ✅ Verify emails are received
3. ✅ Monitor logs for first 24 hours
4. 🔔 Consider adding:
   - Email to admin/slack for notifications
   - Rate limiting
   - Email templates for different scenarios
   - Analytics tracking
