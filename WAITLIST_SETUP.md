# Waitlist Email Notifications - Quick Start

## What Was Implemented

✅ Serverless API endpoint (`/api/waitlist`) that:
- Accepts email signups via POST request
- Validates email format
- Stores signups in `waitlist.json`
- Sends email notifications to v12TrinityEngine@gmail.com via Gmail API
- Handles duplicates gracefully

✅ Frontend integration:
- Updated `script.js` to submit form data to API
- Added loading states and error handling
- Shows success/error messages to users

✅ Gmail API integration:
- OAuth2 authentication
- Automatic email notifications on new signups
- Includes signup email and total count

## Next Steps to Activate

### 1. Set Up Gmail API (Required)

Follow the detailed guide in `setup_gmail.md`. Quick summary:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Gmail API
4. Create OAuth 2.0 credentials (Desktop app type)
5. Download credentials as `api/credentials.json`
6. Run `python api/setup_token.py` to generate `api/token.json`

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd C:\Dev\trinityengine.ai
vercel --prod
```

**Important**: Upload `api/credentials.json` and `api/token.json` to Vercel:
- Go to Vercel dashboard > Your project > Settings > Environment Variables
- Or use Vercel CLI: `vercel env add` (though files are better stored as secrets)

For serverless functions, you can also:
- Store credentials in Vercel's file system (they persist in `/tmp`)
- Or use environment variables (base64 encode the JSON files)

### 3. Test the Integration

1. Visit your deployed website
2. Scroll to the waitlist section
3. Enter an email and click "Join Waitlist"
4. Check v12TrinityEngine@gmail.com for the notification

## File Structure

```
trinityengine.ai/
├── api/
│   ├── waitlist.py          # Main API endpoint
│   ├── gmail_service.py      # Gmail API helper
│   ├── setup_token.py       # Token generation script
│   ├── credentials.json     # OAuth credentials (not in git)
│   └── token.json           # Refresh token (not in git)
├── waitlist.json            # Storage file (not in git)
├── script.js                # Updated frontend
├── vercel.json              # Vercel configuration
├── requirements.txt         # Python dependencies
└── setup_gmail.md          # Detailed Gmail setup guide
```

## Troubleshooting

### "Error sending notification email"
- Check that `credentials.json` and `token.json` exist in `api/` directory
- Verify Gmail API is enabled in Google Cloud Console
- Ensure OAuth consent screen is configured
- Check that the refresh token hasn't expired

### "Method not allowed" or CORS errors
- Verify the API endpoint is deployed correctly
- Check that the route in `vercel.json` matches your deployment
- Ensure CORS headers are being sent

### Emails not being received
- Check spam folder
- Verify the notification email address in `gmail_service.py` (line 15)
- Check Google Cloud Console for API quota/errors
- Review serverless function logs in Vercel dashboard

## Security Notes

- ✅ `waitlist.json`, `credentials.json`, and `token.json` are in `.gitignore`
- ⚠️ Never commit sensitive files to Git
- ⚠️ For production, consider using environment variables or a secrets manager
- ⚠️ Consider adding rate limiting to prevent abuse

## Alternative: Use a Different Email Service

If Gmail API setup is too complex, you can replace `gmail_service.py` with:
- SendGrid
- Mailgun
- AWS SES
- SMTP (less secure, not recommended)

Just update the `send_waitlist_notification()` function in `gmail_service.py`.

