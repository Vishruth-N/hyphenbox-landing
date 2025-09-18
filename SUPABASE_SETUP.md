# Supabase Setup Instructions

## 1. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### How to find your Supabase credentials:

1. Go to your Supabase dashboard at https://app.supabase.com
2. Select your `hyphenbox-landing` project
3. Navigate to **Settings** → **API** in the left sidebar
4. Copy the following values:
   - **Project URL**: This is your `VITE_SUPABASE_URL`
   - **Project API keys** → **anon/public**: This is your `VITE_SUPABASE_ANON_KEY`

## 2. Create the Database Table

### Option A: Using Supabase SQL Editor (Recommended)

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the entire content of `supabase/schema.sql`
4. Click **Run** to execute the SQL

### Option B: Using Table Editor

1. Go to **Table Editor** in Supabase
2. Click **Create a new table**
3. Name it `data_requirements`
4. Add the following columns:

| Column Name | Type | Default | Notes |
|------------|------|---------|-------|
| id | uuid | gen_random_uuid() | Primary Key |
| full_name | text | - | Not Null |
| email | text | - | Not Null |
| phone | text | - | Not Null |
| company | text | - | Not Null |
| role_title | text | - | Nullable |
| data_type | text | - | Nullable |
| data_amount | text | - | Nullable |
| timeline | text | - | Nullable |
| hardware_setup | jsonb | [] | Nullable |
| additional_hardware | text | - | Nullable |
| budget_range | text | - | Nullable |
| created_at | timestamptz | now() | - |
| updated_at | timestamptz | now() | - |

## 3. Configure Row Level Security (RLS)

After creating the table:

1. Go to **Authentication** → **Policies**
2. Find the `data_requirements` table
3. Enable RLS
4. Add the following policies:

### Insert Policy (Allow public form submissions)
- **Name**: Enable insert for all users
- **Policy**: INSERT
- **Target roles**: public, anon
- **WITH CHECK expression**: `true`

### Select Policy (For admin access)
- **Name**: Enable select for authenticated users only
- **Policy**: SELECT
- **Target roles**: authenticated
- **USING expression**: `true`

## 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the form on your website
3. Fill out and submit the form
4. Check your Supabase dashboard under **Table Editor** → `data_requirements` to see the submitted data

## 5. Viewing Submitted Data

To view form submissions in Supabase:

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `data_requirements` table
3. You'll see all form submissions with their timestamps

You can also export the data as CSV or JSON from the table view.

## Troubleshooting

### "Database configuration error"
- Ensure the table is created with the correct name `data_requirements`
- Check that RLS policies are properly configured

### "Connection error"
- Verify your environment variables are correctly set
- Ensure the Supabase project URL and anon key are copied accurately
- Check that your Supabase project is active (not paused)

### Form submissions not appearing
- Check the browser console for any errors
- Verify RLS policies allow INSERT operations for anonymous users
- Ensure all required fields are being filled

## Security Notes

- The `anon` key is safe to use in client-side code as it's designed for public access
- RLS policies ensure data security at the database level
- Consider implementing rate limiting for production use
- Add server-side validation for production environments
