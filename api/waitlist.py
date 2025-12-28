"""
Waitlist API endpoint for Trinity Engine website.
Handles email signups and sends notifications via Gmail API.
Uses Firestore for storage with JSON fallback.
"""

import json
import os
import re
from datetime import datetime
from typing import Dict, Any

try:
    from gmail_service import send_waitlist_notification
except ImportError:
    # Fallback if gmail_service is not available
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


def load_waitlist() -> list:
    """Load waitlist from JSON file (fallback only)."""
    waitlist_path = os.path.join(os.path.dirname(__file__), '..', 'waitlist.json')
    if os.path.exists(waitlist_path):
        try:
            with open(waitlist_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_waitlist(waitlist: list) -> None:
    """Save waitlist to JSON file (fallback only)."""
    waitlist_path = os.path.join(os.path.dirname(__file__), '..', 'waitlist.json')
    try:
        with open(waitlist_path, 'w', encoding='utf-8') as f:
            json.dump(waitlist, f, indent=2, ensure_ascii=False)
    except IOError as e:
        print(f"Error saving waitlist: {e}")


def handler(request):
    """
    Serverless function handler for waitlist signups (Vercel Python runtime).
    
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
    
    # Get request method and body
    method = request.get('method', 'GET')
    
    # Handle preflight OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    # Only allow POST requests
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': 'Method not allowed'
            })
        }
    
    try:
        # Parse request body
        body = request.get('body', '{}')
        if isinstance(body, str):
            data = json.loads(body)
        else:
            data = body
        
        email = data.get('email', '').strip().lower()
        
        # Validate email
        if not email:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Email address is required'
                })
            }
        
        if not validate_email(email):
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({
                    'success': False,
                    'message': 'Invalid email address format'
                })
            }
        
        # Try Firestore first, fallback to JSON
        ip_address = request.get('headers', {}).get('x-forwarded-for', 'unknown')
        
        if FIRESTORE_AVAILABLE:
            # Use Firestore
            # Check if email already exists
            existing = get_waitlist_entry(email)
            if existing:
                total_count = get_waitlist_count()
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'success': True,
                        'message': 'You are already on the waitlist!'
                    })
                }
            
            # Add to Firestore
            if add_waitlist_entry(email, ip_address):
                total_count = get_waitlist_count()
            else:
                # Firestore failed, fallback to JSON
                print("⚠ Firestore operation failed, falling back to JSON")
                waitlist = load_waitlist()
                existing_emails = [entry.get('email', '').lower() for entry in waitlist]
                if email in existing_emails:
                    return {
                        'statusCode': 200,
                        'headers': headers,
                        'body': json.dumps({
                            'success': True,
                            'message': 'You are already on the waitlist!'
                        })
                    }
                
                signup_entry = {
                    'email': email,
                    'timestamp': datetime.utcnow().isoformat(),
                    'ip': ip_address
                }
                waitlist.append(signup_entry)
                save_waitlist(waitlist)
                total_count = len(waitlist)
        else:
            # Use JSON fallback
            waitlist = load_waitlist()
            existing_emails = [entry.get('email', '').lower() for entry in waitlist]
            if email in existing_emails:
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({
                        'success': True,
                        'message': 'You are already on the waitlist!'
                    })
                }
            
            signup_entry = {
                'email': email,
                'timestamp': datetime.utcnow().isoformat(),
                'ip': ip_address
            }
            waitlist.append(signup_entry)
            save_waitlist(waitlist)
            total_count = len(waitlist)
        
        # Send notification email
        try:
            send_waitlist_notification(email, total_count)
        except Exception as e:
            # Log error but don't fail the signup
            print(f"Error sending notification email: {e}")
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'message': 'Thank you for joining the waitlist! We\'ll notify you when Trinity Engine is ready.'
            })
        }
    
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': 'Invalid request format'
            })
        }
    except Exception as e:
        print(f"Error processing waitlist signup: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({
                'success': False,
                'message': 'An error occurred. Please try again later.'
            })
        }

