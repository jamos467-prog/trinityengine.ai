"""
Firestore service for waitlist data storage.
Provides abstraction layer for Firestore operations with JSON fallback.
"""

import os
import json
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
    Get Firestore client instance.
    
    Returns:
        Firestore client or None if unavailable
    """
    if not FIRESTORE_AVAILABLE:
        return None
    
    try:
        # In Cloud Functions, credentials are automatically available
        # For local development, use Application Default Credentials
        # or set GOOGLE_APPLICATION_CREDENTIALS environment variable
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
        # Count documents (note: this counts all documents, may be slow for large collections)
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


def migrate_from_json(json_path: str) -> int:
    """
    Migrate waitlist data from JSON file to Firestore.
    
    Args:
        json_path: Path to waitlist.json file
    
    Returns:
        Number of entries migrated
    """
    if not os.path.exists(json_path):
        print(f"⚠ JSON file not found: {json_path}")
        return 0
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            entries = json.load(f)
        
        if not isinstance(entries, list):
            print("⚠ JSON file does not contain a list")
            return 0
        
        migrated = 0
        for entry in entries:
            email = entry.get('email', '').lower()
            if not email:
                continue
            
            # Check if already exists
            existing = get_waitlist_entry(email)
            if existing:
                continue
            
            # Add to Firestore
            ip = entry.get('ip', 'unknown')
            if add_waitlist_entry(email, ip):
                migrated += 1
        
        print(f"✓ Migrated {migrated} entries from JSON to Firestore")
        return migrated
    except Exception as e:
        print(f"⚠ Error migrating from JSON: {e}")
        return 0

