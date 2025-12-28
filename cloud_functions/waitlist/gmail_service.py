"""
Gmail API service for sending waitlist notification emails.
Cloud Function version - uses Application Default Credentials.
"""

import os
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

try:
    from google.auth import default
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
    GMAIL_AVAILABLE = True
except ImportError:
    GMAIL_AVAILABLE = False
    print("⚠ Gmail API libraries not available")


# Gmail API scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# Notification email address
NOTIFICATION_EMAIL = 'v12trinityengine@gmail.com'


def get_gmail_service() -> Optional[object]:
    """
    Get authenticated Gmail API service using Application Default Credentials.
    
    Returns:
        Gmail service object or None if authentication fails
    """
    if not GMAIL_AVAILABLE:
        return None
    
    try:
        # Use Application Default Credentials (ADC)
        # In Cloud Functions, this automatically uses the service account
        # For local testing, set GOOGLE_APPLICATION_CREDENTIALS
        creds, project = default(scopes=SCOPES)
        
        # If using OAuth token (for user account), load from environment or Secret Manager
        token_path = os.environ.get('GMAIL_TOKEN_PATH', '/tmp/token.json')
        if os.path.exists(token_path):
            from google.oauth2.credentials import Credentials
            from google.auth.transport.requests import Request
            
            try:
                creds = Credentials.from_authorized_user_file(token_path, SCOPES)
                if creds.expired and creds.refresh_token:
                    creds.refresh(Request())
            except Exception as e:
                print(f"⚠ Error loading OAuth token: {e}")
                # Fall back to ADC
                creds, project = default(scopes=SCOPES)
        
        service = build('gmail', 'v1', credentials=creds)
        return service
    except Exception as e:
        print(f"⚠ Error building Gmail service: {e}")
        return None


def create_message(to: str, subject: str, body: str) -> dict:
    """
    Create a message for an email.
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Email body (HTML)
    
    Returns:
        Message dict with base64 encoded content
    """
    message = MIMEMultipart('alternative')
    message['to'] = to
    message['subject'] = subject
    
    # Add HTML body
    html_part = MIMEText(body, 'html')
    message.attach(html_part)
    
    # Encode message
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
    return {'raw': raw_message}


def send_email(to: str, subject: str, body: str) -> bool:
    """
    Send an email using Gmail API.
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Email body (HTML)
    
    Returns:
        True if successful, False otherwise
    """
    if not GMAIL_AVAILABLE:
        print("⚠ Gmail API not available")
        return False
    
    service = get_gmail_service()
    if not service:
        print("⚠ Could not get Gmail service")
        return False
    
    try:
        message = create_message(to, subject, body)
        service.users().messages().send(
            userId='me',
            body=message
        ).execute()
        return True
    except HttpError as error:
        print(f"⚠ Error sending email: {error}")
        return False
    except Exception as e:
        print(f"⚠ Unexpected error: {e}")
        return False


def send_waitlist_notification(email: str, total_count: int) -> None:
    """
    Send notification email when someone joins the waitlist.
    
    Args:
        email: Email address of the new signup
        total_count: Total number of people on the waitlist
    """
    subject = f"New Waitlist Signup - Trinity Engine ({total_count} total)"
    
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #33e7ff;">New Waitlist Signup</h2>
        <p>A new person has joined the Trinity Engine waitlist:</p>
        <ul>
            <li><strong>Email:</strong> {email}</li>
            <li><strong>Total Waitlist Count:</strong> {total_count}</li>
        </ul>
        <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
            This is an automated notification from the Trinity Engine website.
        </p>
    </body>
    </html>
    """
    
    send_email(NOTIFICATION_EMAIL, subject, body)

