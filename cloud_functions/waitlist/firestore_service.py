"""
Firestore service for waitlist data storage.
Cloud Function version - uses Application Default Credentials.
"""

import os
from datetime import datetime
from typing import List, Dict, Optional, Any

try:
    from google.cloud import firestore
    FIRESTORE_AVAILABLE = True
except ImportError:
    FIRESTORE_AVAILABLE = False
    print("⚠ Firestore library not available. Install: pip install google-cloud-firestore")


# Firestore collection name
COLLECTION_NAME = 'waitlist'


def get_firestore_client() -> Optional[Any]:
    """
    Get Firestore client instance using Application Default Credentials.
    
    Returns:
        Firestore client or None if unavailable
    """
    if not FIRESTORE_AVAILABLE:
        return None
    
    try:
        # In Cloud Functions, credentials are automatically available via ADC
        # For local development, set GOOGLE_APPLICATION_CREDENTIALS
        client = firestore.Client()
        return client
    except Exception as e:
        print(f"⚠ Error initializing Firestore client: {e}")
        return None


def add_waitlist_entry(email: str, ip: str = 'unknown') -> bool:
    """
    Add a new email to the waitlist in Firestore.
    
    Args:
        email: Email address to add
        ip: IP address of the signup (optional)
    
    Returns:
        True if successful, False otherwise
    """
    client = get_firestore_client()
    if not client:
        return False
    
    try:
        # Check if email already exists
        existing = get_waitlist_entry(email)
        if existing:
            return True  # Already exists, consider it success
        
        # Add new entry
        entry = {
            'email': email.lower(),
            'timestamp': firestore.SERVER_TIMESTAMP,
            'ip': ip,
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Use email as document ID for easy lookup
        doc_ref = client.collection(COLLECTION_NAME).document(email.lower())
        doc_ref.set(entry)
        
        return True
    except Exception as e:
        print(f"⚠ Error adding waitlist entry to Firestore: {e}")
        return False


def get_waitlist_entry(email: str) -> Optional[Dict[str, Any]]:
    """
    Get a specific waitlist entry by email.
    
    Args:
        email: Email address to lookup
    
    Returns:
        Entry dict or None if not found
    """
    client = get_firestore_client()
    if not client:
        return None
    
    try:
        doc_ref = client.collection(COLLECTION_NAME).document(email.lower())
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            # Convert Firestore timestamp to ISO string if needed
            if 'timestamp' in data and hasattr(data['timestamp'], 'isoformat'):
                data['timestamp'] = data['timestamp'].isoformat()
            return data
        return None
    except Exception as e:
        print(f"⚠ Error getting waitlist entry from Firestore: {e}")
        return None


def get_waitlist_count() -> int:
    """
    Get total count of waitlist entries.
    
    Returns:
        Number of entries, or 0 if error
    """
    client = get_firestore_client()
    if not client:
        return 0
    
    try:
        collection_ref = client.collection(COLLECTION_NAME)
        # Count documents
        docs = list(collection_ref.stream())
        return len(docs)
    except Exception as e:
        print(f"⚠ Error getting waitlist count from Firestore: {e}")
        return 0


def get_all_waitlist_entries() -> List[Dict[str, Any]]:
    """
    Get all waitlist entries.
    
    Returns:
        List of entry dicts
    """
    client = get_firestore_client()
    if not client:
        return []
    
    try:
        collection_ref = client.collection(COLLECTION_NAME)
        docs = collection_ref.stream()
        
        entries = []
        for doc in docs:
            data = doc.to_dict()
            # Convert Firestore timestamp to ISO string if needed
            if 'timestamp' in data and hasattr(data['timestamp'], 'isoformat'):
                data['timestamp'] = data['timestamp'].isoformat()
            entries.append(data)
        
        # Sort by timestamp (newest first)
        entries.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        return entries
    except Exception as e:
        print(f"⚠ Error getting waitlist entries from Firestore: {e}")
        return []

