# Gmail API Setup Guide

This guide will help you set up Gmail API to send waitlist notification emails.

## Prerequisites

- A Google account (v12trinityengine@gmail.com)
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Name it "Trinity Engine Waitlist" (or any name you prefer)
5. Click "Create"

## Step 2: Enable Gmail API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Gmail API"
3. Click on "Gmail API"
4. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - User Type: External (unless you have a Google Workspace)
   - App name: "Trinity Engine Waitlist"
   - User support email: v12trinityengine@gmail.com
   - Developer contact: v12trinityengine@gmail.com
   - Click "Save and Continue"
   - Scopes: Add `https://www.googleapis.com/auth/gmail.send`
   - Click "Save and Continue"
   - Test users: Add v12trinityengine@gmail.com
   - Click "Save and Continue"
4. For OAuth client:
   - Application type: "Desktop app" (or "Web application" if deploying to a server)
   - Name: "Trinity Engine Waitlist Client"
   - Click "Create"
5. Download the credentials JSON file
6. Rename it to `credentials.json`
7. Place it in the `api/` directory

## Step 4: Generate Refresh Token

### Option A: Using Python Script (Recommended)

1. Create a file `api/setup_token.py`:

```python
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
import os

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def setup_token():
    creds = None
    credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    token_path = os.path.join(os.path.dirname(__file__), 'token.json')
    
    if not os.path.exists(credentials_path):
        print(f"Error: {credentials_path} not found!")
        return
    
    flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
    creds = flow.run_local_server(port=0)
    
    # Save the credentials for the next run
    with open(token_path, 'w') as token:
        token.write(creds.to_json())
    
    print(f"✓ Token saved to {token_path}")
    print("You can now use the Gmail API service!")

if __name__ == '__main__':
    setup_token()
```

2. Run the script:
```bash
cd api
python setup_token.py
```

3. A browser window will open. Sign in with v12trinityengine@gmail.com and authorize the app.

4. The `token.json` file will be created in the `api/` directory.

### Option B: Manual Setup

1. Use the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Select "Gmail API v1" > "https://www.googleapis.com/auth/gmail.send"
3. Click "Authorize APIs"
4. Sign in and authorize
5. Click "Exchange authorization code for tokens"
6. Copy the refresh token
7. Create `token.json` manually:

```json
{
  "token": "YOUR_ACCESS_TOKEN",
  "refresh_token": "YOUR_REFRESH_TOKEN",
  "token_uri": "https://oauth2.googleapis.com/token",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "scopes": ["https://www.googleapis.com/auth/gmail.send"]
}
```

## Step 5: Test the Setup

1. Make sure both `api/credentials.json` and `api/token.json` exist
2. Test sending an email by running:

```python
from api.gmail_service import send_waitlist_notification
send_waitlist_notification("test@example.com", 1)
```

## Step 6: Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. In the project directory, run: `vercel`
3. Add environment variables if needed (though credentials are in files)
4. Deploy: `vercel --prod`

## Important Notes

- **Security**: Never commit `credentials.json` or `token.json` to Git (they're in `.gitignore`)
- **Token Refresh**: The token will automatically refresh when it expires
- **Rate Limits**: Gmail API has rate limits (250 quota units per user per second)
- **Production**: For production, consider using a service account or storing tokens securely in environment variables

## Troubleshooting

### "Invalid credentials" error
- Make sure `credentials.json` and `token.json` are in the `api/` directory
- Regenerate the token using `setup_token.py`

### "Insufficient permissions" error
- Make sure the OAuth consent screen is configured
- Check that the scope `gmail.send` is included

### Token expires
- The refresh token should automatically refresh the access token
- If issues persist, regenerate the token

## Support

If you encounter issues, check:
1. Google Cloud Console for API quotas and errors
2. Gmail API documentation: https://developers.google.com/gmail/api
3. Ensure the email v12trinityengine@gmail.com has access to send emails

