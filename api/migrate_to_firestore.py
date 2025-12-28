"""
Migration script to move waitlist data from JSON to Firestore.
Run this once after setting up Firestore.
"""

import os
import sys

# Add parent directory to path to import firestore_service
sys.path.insert(0, os.path.dirname(__file__))

from firestore_service import migrate_from_json, get_all_waitlist_entries, get_waitlist_count


def main():
    """Run migration from JSON to Firestore."""
    # Get path to waitlist.json
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, '..', 'waitlist.json')
    
    print("Starting migration from JSON to Firestore...")
    print(f"JSON file: {json_path}")
    
    if not os.path.exists(json_path):
        print(f"⚠ JSON file not found: {json_path}")
        print("Nothing to migrate.")
        return
    
    # Run migration
    migrated = migrate_from_json(json_path)
    
    if migrated > 0:
        print(f"\n✓ Migration complete!")
        print(f"  Migrated {migrated} entries to Firestore")
        
        # Verify
        total = get_waitlist_count()
        print(f"  Total entries in Firestore: {total}")
        
        # Show sample entries
        entries = get_all_waitlist_entries()
        if entries:
            print(f"\n  Sample entries:")
            for entry in entries[:5]:
                print(f"    - {entry.get('email')} ({entry.get('created_at', 'unknown date')})")
    else:
        print("\n⚠ No entries migrated. They may already exist in Firestore.")


if __name__ == '__main__':
    main()

