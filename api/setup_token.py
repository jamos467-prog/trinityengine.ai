"""
Helper script to generate Gmail API refresh token.
Run this once to set up authentication.
"""

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
import os

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def setup_token():
    """Generate and save Gmail API refresh token."""
    creds = None
    credentials_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    token_path = os.path.join(os.path.dirname(__file__), 'token.json')
    
    if not os.path.exists(credentials_path):
        print(f"❌ Error: {credentials_path} not found!")
        print("Please download credentials.json from Google Cloud Console")
        print("See setup_gmail.md for instructions")
        return
    
    print("Starting OAuth flow...")
    print("A browser window will open. Please sign in with v12trinityengine@gmail.com")
    
    flow = InstalledAppFlow.from_client_secrets_file(credentials_path, SCOPES)
    creds = flow.run_local_server(port=0)
    
    # Save the credentials for the next run
    with open(token_path, 'w') as token:
        token.write(creds.to_json())
    
    print(f"✓ Token saved to {token_path}")
    print("✓ Gmail API is now configured!")
    print("\nYou can now deploy to Vercel or test locally.")

if __name__ == '__main__':
    setup_token()

