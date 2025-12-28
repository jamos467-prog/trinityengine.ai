"""
Google Cloud Function for Trinity Engine waitlist API.
Handles email signups and sends notifications via Gmail API.
Uses Firestore for data storage.
"""

import json
import re
from datetime import datetime
from typing import Dict, Any

import functions_framework

try:
    from gmail_service import send_waitlist_notification
except ImportError:
    def send_waitlist_notification(email: str, total_count: int) -> None:
        print(f"Would send notification for {email} (total: {total_count})")

try:
    from firestore_service import (
        add_waitlist_entry,
        get_waitlist_entry,
        get_waitlist_count,
        FIRESTORE_AVAILABLE
    )
except ImportError:
    FIRESTORE_AVAILABLE = False
    def add_waitlist_entry(email: str, ip: str = 'unknown') -> bool:
        return False
    def get_waitlist_entry(email: str):
        return None
    def get_waitlist_count() -> int:
        return 0


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


@functions_framework.http
def waitlist_handler(request):
    """
    Cloud Function HTTP handler for waitlist signups.
    
    Expected request format:
    {
        "email": "user@example.com"
    }
    
    Returns:
    {
        "success": bool,
        "message": str
    }
    """
    # Handle CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return ('', 200, headers)
    
    # Only allow POST requests
    if request.method != 'POST':
        return (
            json.dumps({
                'success': False,
                'message': 'Method not allowed'
            }),
            405,
            headers
        )
    
    try:
        # Parse request body
        if request.is_json:
            data = request.get_json()
        else:
            try:
                data = json.loads(request.data)
            except (json.JSONDecodeError, AttributeError):
                data = {}
        
        email = data.get('email', '').strip().lower()
        
        # Validate email
        if not email:
            return (
                json.dumps({
                    'success': False,
                    'message': 'Email address is required'
                }),
                400,
                headers
            )
        
        if not validate_email(email):
            return (
                json.dumps({
                    'success': False,
                    'message': 'Invalid email address format'
                }),
                400,
                headers
            )
        
        # Get IP address from request
        ip_address = request.headers.get('X-Forwarded-For', 'unknown')
        if ip_address == 'unknown':
            ip_address = request.remote_addr or 'unknown'
        
        # Try Firestore first, fallback to JSON
        if FIRESTORE_AVAILABLE:
            # Use Firestore
            # Check if email already exists
            existing = get_waitlist_entry(email)
            if existing:
                total_count = get_waitlist_count()
                return (
                    json.dumps({
                        'success': True,
                        'message': 'You are already on the waitlist!'
                    }),
                    200,
                    headers
                )
            
            # Add to Firestore
            if add_waitlist_entry(email, ip_address):
                total_count = get_waitlist_count()
            else:
                # Firestore failed
                return (
                    json.dumps({
                        'success': False,
                        'message': 'Failed to add email to waitlist. Please try again later.'
                    }),
                    500,
                    headers
                )
        else:
            # Firestore not available
            return (
                json.dumps({
                    'success': False,
                    'message': 'Service temporarily unavailable. Please try again later.'
                }),
                503,
                headers
            )
        
        # Send notification email
        try:
            send_waitlist_notification(email, total_count)
        except Exception as e:
            # Log error but don't fail the signup
            print(f"Error sending notification email: {e}")
        
        return (
            json.dumps({
                'success': True,
                'message': 'Thank you for joining the waitlist! We\'ll notify you when Trinity Engine is ready.'
            }),
            200,
            headers
        )
    
    except json.JSONDecodeError:
        return (
            json.dumps({
                'success': False,
                'message': 'Invalid request format'
            }),
            400,
            headers
        )
    except Exception as e:
        print(f"Error processing waitlist signup: {e}")
        return (
            json.dumps({
                'success': False,
                'message': 'An error occurred. Please try again later.'
            }),
            500,
            headers
        )

