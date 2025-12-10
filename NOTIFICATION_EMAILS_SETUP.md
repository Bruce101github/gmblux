# Notification Emails Setup Guide

## Overview

The notification email system sends admin notifications to a list of email addresses when:
- Someone places a booking request
- Someone contacts via phone/WhatsApp (contact inquiries)

## Environment Variable Configuration

### Setting Up NOTIFICATION_EMAILS

The `NOTIFICATION_EMAILS` environment variable should contain a comma-separated list of email addresses.

**Format:**
```
NOTIFICATION_EMAILS=email1@example.com,email2@example.com,email3@example.com
```

**Examples:**
- Single email: `NOTIFICATION_EMAILS=admin@gmblux.com`
- Multiple emails: `NOTIFICATION_EMAILS=admin@gmblux.com,manager@gmblux.com,sales@gmblux.com`
- With spaces (automatically trimmed): `NOTIFICATION_EMAILS=admin@gmblux.com, manager@gmblux.com`

### Setting in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Add or update the `NOTIFICATION_EMAILS` secret:
   - **Name:** `NOTIFICATION_EMAILS`
   - **Value:** `email1@example.com,email2@example.com,email3@example.com`
4. Click **Save**

### Setting in Local Development

If you're running Supabase locally, add to your `.env` file or `supabase/.env`:

```env
NOTIFICATION_EMAILS=admin@gmblux.com,manager@gmblux.com
```

## How It Works

1. **Booking Requests**: When a user submits a booking request:
   - Customer receives a confirmation email
   - All emails in `NOTIFICATION_EMAILS` receive an admin notification

2. **Contact Inquiries**: When a user contacts via phone/WhatsApp:
   - A notification is created in the database
   - (Email notifications for contact inquiries can be added if needed)

## Testing

To test the notification system:

1. Ensure `NOTIFICATION_EMAILS` is set in your Supabase secrets
2. Submit a test booking request through the website
3. Check that all configured email addresses receive the notification

## Troubleshooting

### No emails received
- Verify `NOTIFICATION_EMAILS` is set in Supabase secrets
- Check that email addresses are valid and comma-separated
- Check Supabase Edge Function logs for errors
- Verify `RESEND_API_KEY` is configured correctly

### Some emails not received
- Check that all email addresses are valid
- Ensure no extra spaces or invalid characters
- Check Resend API logs for bounce/spam issues

### Error: "Missing environment variables"
- Ensure all required secrets are set:
  - `RESEND_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NOTIFICATION_EMAILS`

## Code Location

The notification email logic is in:
- `admin/supabase/functions/booking-emails/index.ts`

The function automatically:
- Parses comma-separated email addresses
- Sends to all recipients in the list
- Handles errors gracefully (continues even if admin email fails)
