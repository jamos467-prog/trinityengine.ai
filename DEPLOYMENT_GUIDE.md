# Google Cloud Platform Deployment Guide

This guide walks you through deploying the Trinity Engine waitlist API to Google Cloud Platform.

## Prerequisites

1. **Google Cloud Account**: v12TrinityEngine@gmail.com
2. **Google Cloud SDK**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk)
3. **Project Created**: Set up in GCP Console

## Step 1: Set Up Firestore

1. Go to [Firestore Console](https://console.cloud.google.com/firestore)
2. Select your project
3. Click "Create Database"
4. Choose "Native mode" (recommended)
5. Select a location (e.g., `us-central`)
6. Click "Create"

## Step 2: Enable Required APIs

Run these commands or enable in the Console:

```bash
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gmail.googleapis.com  # Already enabled for Gmail API
run.googleapis.com     # For Cloud Functions Gen 2
```

## Step 3: Set Up Gmail API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" > "Credentials"
3. Create OAuth 2.0 credentials (if not already done)
4. Download credentials as `credentials.json`
5. Generate refresh token using `api/setup_token.py`

## Step 4: Store Credentials in Secret Manager

For production, store credentials securely:

```bash
# Create secret for Gmail token
echo '{"token": "...", "refresh_token": "..."}' | \
  gcloud secrets create gmail-token --data-file=-

# Grant Cloud Function access
gcloud secrets add-iam-policy-binding gmail-token \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Or upload to Cloud Storage:

```bash
gsutil cp api/token.json gs://YOUR_BUCKET/gmail-token.json
```

## Step 5: Deploy Cloud Function

```bash
cd cloud_functions/waitlist

# Deploy the function
gcloud functions deploy waitlist \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=waitlist_handler \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars="GMAIL_TOKEN_PATH=gs://YOUR_BUCKET/gmail-token.json"
```

### Alternative: Deploy with Secret Manager

```bash
gcloud functions deploy waitlist \
  --gen2 \
  --runtime=python311 \
  --region=us-central1 \
  --source=. \
  --entry-point=waitlist_handler \
  --trigger-http \
  --allow-unauthenticated \
  --set-secrets="GMAIL_TOKEN=gmail-token:latest"
```

## Step 6: Get Function URL

After deployment, get the function URL:

```bash
gcloud functions describe waitlist --gen2 --region=us-central1 --format="value(serviceConfig.uri)"
```

Or find it in the Console under Cloud Functions.

## Step 7: Update Website

Update `script.js` to use the Cloud Function URL:

```javascript
const WAITLIST_API_URL = 'https://REGION-PROJECT_ID.cloudfunctions.net/waitlist';

// In the fetch call:
const response = await fetch(WAITLIST_API_URL, {
  // ... rest of the code
});
```

## Step 8: Migrate Existing Data

If you have existing `waitlist.json` data:

```bash
# Set up Application Default Credentials
gcloud auth application-default login

# Run migration script
cd api
python migrate_to_firestore.py
```

## Testing

### Test Locally

```bash
cd cloud_functions/waitlist
pip install -r requirements.txt
functions-framework --target=waitlist_handler --port=8080

# In another terminal:
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test Deployed Function

```bash
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Monitoring

1. **Cloud Logging**: View logs in [Cloud Logging Console](https://console.cloud.google.com/logs)
2. **Cloud Monitoring**: Set up alerts in [Cloud Monitoring](https://console.cloud.google.com/monitoring)
3. **Firestore Console**: View data in [Firestore Console](https://console.cloud.google.com/firestore)

## Troubleshooting

### "Permission denied" errors
- Check IAM roles for the Cloud Function service account
- Ensure Firestore API is enabled
- Verify service account has Firestore User role

### Gmail API not working
- Verify `token.json` is accessible
- Check OAuth token hasn't expired
- Ensure Gmail API is enabled
- Check service account has necessary permissions

### CORS errors
- Verify CORS headers are set correctly in the function
- Check browser console for specific error messages
- Ensure `Access-Control-Allow-Origin` is set to `*` or your domain

## Cost Estimation

**Free Tier (Always Free):**
- Firestore: 50K reads/day, 20K writes/day
- Cloud Functions: 2M invocations/month
- Cloud Logging: 50GB logs/month

**Estimated Monthly Cost (Low Usage):**
- ~$0-10/month for initial scale

## Security Best Practices

1. **Use Secret Manager** for sensitive credentials
2. **Enable IAM** with least privilege
3. **Set up CORS** properly (consider restricting origins)
4. **Add rate limiting** to prevent abuse
5. **Enable audit logs** for monitoring
6. **Use HTTPS only** (enforced by Cloud Functions)

## Next Steps

- Set up monitoring and alerting
- Add rate limiting
- Implement analytics tracking
- Set up automated backups
- Consider adding authentication for admin endpoints

