# Waitlist API

This directory contains the serverless function for handling waitlist signups.

## Files

- `waitlist.py` - Main API endpoint handler
- `gmail_service.py` - Gmail API integration for sending notifications
- `setup_token.py` - Helper script to generate OAuth refresh token
- `credentials.json` - Gmail API OAuth credentials (not in git)
- `token.json` - OAuth refresh token (not in git)

## Setup

1. Follow the instructions in `../setup_gmail.md` to set up Gmail API
2. Place `credentials.json` in this directory
3. Run `python setup_token.py` to generate `token.json`
4. Deploy to Vercel (or your preferred serverless platform)

## Local Testing

To test locally, you can use a simple HTTP server or the Vercel CLI:

```bash
vercel dev
```

Then test the endpoint:

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Make sure to upload `credentials.json` and `token.json` to Vercel's environment or use Vercel's file system (they persist in `/tmp` on serverless functions).

For production, consider:
- Using environment variables for sensitive data
- Setting up proper error monitoring
- Adding rate limiting
- Using a database instead of JSON file for scalability

