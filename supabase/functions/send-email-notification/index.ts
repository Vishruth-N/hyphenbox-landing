import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CC_EMAIL = 'vishruth@hyphenbox.com'
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'hello@hyphenbox.com' // Update this with your verified Resend domain email
const FROM_NAME = Deno.env.get('FROM_NAME') || 'HyphenBox Team' // Friendly sender name

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: DataRequirement
  schema: string
  old_record?: DataRequirement
}

interface DataRequirement {
  id: string
  full_name: string
  email: string
  phone: string
  company: string
  role_title?: string
  data_type?: string
  data_amount?: string
  timeline?: string
  hardware_setup?: string[]
  additional_hardware?: string
  budget_range?: string
  created_at: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: WebhookPayload = await req.json()
    
    // Only process INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(JSON.stringify({ message: 'Skipping non-INSERT event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const { record } = payload

    // Format hardware setup for email
    const hardwareList = record.hardware_setup?.length 
      ? record.hardware_setup.join(', ') 
      : 'Not specified'

    // Format budget range for better readability
    const budgetDisplay = formatBudgetRange(record.budget_range)

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .info-section {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .info-item {
              margin-bottom: 15px;
              padding-bottom: 15px;
              border-bottom: 1px solid #eee;
            }
            .info-item:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .label {
              font-weight: bold;
              color: #555;
              display: inline-block;
              width: 150px;
            }
            .value {
              color: #333;
            }
            .requirements-section {
              background: #fff3cd;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #ffc107;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              color: #777;
              font-size: 12px;
              margin-top: 30px;
            }
            h1, h2 {
              margin: 0;
            }
            .highlight {
              background: #e3f2fd;
              padding: 2px 4px;
              border-radius: 3px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤖 New Data Collection Request</h1>
              <p style="margin: 10px 0 0 0;">HyphenBox Landing Page Form Submission</p>
            </div>
            
            <div class="content">
              <div class="info-section">
                <h2 style="color: #667eea; margin-bottom: 20px;">Contact Information</h2>
                <div class="info-item">
                  <span class="label">Name:</span>
                  <span class="value">${record.full_name}</span>
                </div>
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${record.email}">${record.email}</a></span>
                </div>
                <div class="info-item">
                  <span class="label">Phone:</span>
                  <span class="value"><a href="tel:${record.phone}">${record.phone}</a></span>
                </div>
                <div class="info-item">
                  <span class="label">Company:</span>
                  <span class="value">${record.company}</span>
                </div>
                ${record.role_title ? `
                <div class="info-item">
                  <span class="label">Role/Title:</span>
                  <span class="value">${record.role_title}</span>
                </div>
                ` : ''}
              </div>

              <div class="info-section">
                <h2 style="color: #667eea; margin-bottom: 20px;">Project Requirements</h2>
                ${record.data_type ? `
                <div class="info-item">
                  <span class="label">Data Type Needed:</span>
                  <div style="margin-top: 5px;">${record.data_type}</div>
                </div>
                ` : ''}
                ${record.data_amount ? `
                <div class="info-item">
                  <span class="label">Data Amount:</span>
                  <div style="margin-top: 5px;">${record.data_amount}</div>
                </div>
                ` : ''}
                ${record.timeline ? `
                <div class="info-item">
                  <span class="label">Timeline:</span>
                  <div style="margin-top: 5px;">${record.timeline}</div>
                </div>
                ` : ''}
                <div class="info-item">
                  <span class="label">Hardware Setup:</span>
                  <span class="value">${hardwareList}</span>
                </div>
                ${record.additional_hardware ? `
                <div class="info-item">
                  <span class="label">Additional Hardware:</span>
                  <div style="margin-top: 5px;">${record.additional_hardware}</div>
                </div>
                ` : ''}
                <div class="info-item">
                  <span class="label">Budget Range:</span>
                  <span class="value"><span class="highlight">${budgetDisplay}</span></span>
                </div>
              </div>

              <div class="requirements-section">
                <h3 style="margin-top: 0;">📋 Summary</h3>
                <p><strong>${record.full_name}</strong> from <strong>${record.company}</strong> is interested in data collection services.</p>
                ${record.timeline ? `<p>They need the data <strong>${record.timeline.toLowerCase()}</strong>.</p>` : ''}
                <p style="margin-bottom: 0;">Budget: <strong>${budgetDisplay}</strong></p>
              </div>

              <div class="footer">
                <p>This email was automatically generated from a form submission on hyphenbox.com</p>
                <p>Submission ID: ${record.id}</p>
                <p>Submitted at: ${new Date(record.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Create plain text version for email clients that don't support HTML
    const textContent = `
New Data Collection Request from HyphenBox Landing Page

CONTACT INFORMATION
-------------------
Name: ${record.full_name}
Email: ${record.email}
Phone: ${record.phone}
Company: ${record.company}
${record.role_title ? `Role/Title: ${record.role_title}` : ''}

PROJECT REQUIREMENTS
--------------------
${record.data_type ? `Data Type Needed: ${record.data_type}` : ''}
${record.data_amount ? `Data Amount: ${record.data_amount}` : ''}
${record.timeline ? `Timeline: ${record.timeline}` : ''}
Hardware Setup: ${hardwareList}
${record.additional_hardware ? `Additional Hardware: ${record.additional_hardware}` : ''}
Budget Range: ${budgetDisplay}

SUMMARY
-------
${record.full_name} from ${record.company} is interested in data collection services.
${record.timeline ? `They need the data ${record.timeline.toLowerCase()}.` : ''}
Budget: ${budgetDisplay}

---
Submission ID: ${record.id}
Submitted at: ${new Date(record.created_at).toLocaleString()}
    `.trim()

    // Send email using Resend API
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [record.email], // Send to the prospect
        cc: [CC_EMAIL], // CC vishruth@hyphenbox.com
        subject: `Welcome to HyphenBox - We've Received Your Data Collection Request`,
        html: htmlContent,
        text: textContent,
        reply_to: CC_EMAIL, // Set reply-to as vishruth@hyphenbox.com
      }),
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      throw new Error(`Failed to send email: ${error}`)
    }

    const emailResult = await emailResponse.json()

    // Optionally, you can log the submission to a separate table for tracking
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Log email sent (optional - requires creating an email_logs table)
    // await supabase.from('email_logs').insert({
    //   submission_id: record.id,
    //   email_sent_to: record.email,
    //   email_cc: CC_EMAIL,
    //   resend_id: emailResult.id,
    //   sent_at: new Date().toISOString()
    // })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        resend_id: emailResult.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
  return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function formatBudgetRange(budget?: string): string {
  if (!budget) return 'Not specified'
  
  const budgetMap: Record<string, string> = {
    'under-10k': 'Under $10,000',
    '10k-50k': '$10,000 - $50,000',
    '50k-100k': '$50,000 - $100,000',
    '100k-plus': '$100,000+',
    'discuss': 'To be discussed'
  }
  
  return budgetMap[budget] || budget
}