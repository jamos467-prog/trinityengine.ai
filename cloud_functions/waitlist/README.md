# Waitlist Cloud Function

Google Cloud Function for handling Trinity Engine waitlist signups.

## Deployment

### Prerequisites

1. Install Google Cloud SDK:
   ```bash
   # Download from https://cloud.google.com/sdk/docs/install
   ```

2. Authenticate:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. Enable required APIs:
   ```bash
   gcloud services enable cloudfunctions.googleapis.com
   gcloud services enable firestore.googleapis.com
   gcloud services enable gmail.googleapis.com
   ```

### Deploy Function

```bash
cd cloud_functions/waitlist
gcloud functions deploy waitlist \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=waitlist_handler \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json"
```

### Environment Variables

Set via GCP Console or CLI:

```bash
gcloud functions deploy waitlist \
  --update-env-vars KEY=VALUE
```

### Service Account

The function needs a service account with:
- Cloud Functions Invoker role
- Firestore User role
- Gmail API access (via OAuth token)

### Gmail API Setup

1. Place `credentials.json` and `token.json` in Cloud Storage
2. Mount them as secrets or environment variables
3. Or use Application Default Credentials

## Local Testing

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
functions-framework --target=waitlist_handler --port=8080

# Test
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Function URL

After deployment, you'll get a URL like:
```
https://REGION-PROJECT_ID.cloudfunctions.net/waitlist
```

Update `script.js` to use this URL instead of `/api/waitlist`.

