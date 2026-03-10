# EmailJS Integration Documentation

## Overview
This project has been updated to use EmailJS for sending forest fire alert emails instead of Brevo SMTP backend service.

## Architecture Changes

### Before (Brevo SMTP)
- Backend received prediction
- Backend created alert in MongoDB
- Background task sent email via SMTP
- Database status updated after email sending

### After (EmailJS)
- Backend receives prediction and returns result to frontend
- Frontend checks if fire detected (confidence > 0.85)
- Frontend calls EmailJS to send alert email directly
- Email sent without backend involvement
- Cleaner separation of concerns

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @emailjs/browser
```

### 2. Environment Variables
Frontend `.env` file must contain:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_n4unjcg
VITE_EMAILJS_PUBLIC_KEY=NE9HowNKjH0tWyWkw
VITE_EMAILJS_TEMPLATE_ID=template_w5vg0q4
```

**Important**: These credentials are frontend-safe (public key only), not backend secrets.

## File Structure

```
frontend/
├── src/
│   ├── services/
│   │   ├── api.js                 # API calls to backend
│   │   ├── emailService.js        # NEW: EmailJS integration
│   │   └── ...
│   ├── components/
│   │   └── UploadForm.jsx         # UPDATED: Email trigger logic
│   └── ...
├── .env                           # EmailJS credentials
└── package.json
```

## Key Files

### `src/services/emailService.js`
Email service utility with four main functions:

1. **`initializeEmailJS()`**
   - Initializes EmailJS with public key
   - Called automatically by sendFireAlertEmail
   - Returns boolean success status

2. **`sendFireAlertEmail(data)`**
   - Sends fire alert email via EmailJS
   - Parameters: `{ location, confidence, timestamp, image_name }`
   - Returns: `{ success, message, error }`
   - Async function with proper error handling

3. **`formatAlertData(prediction, latitude, longitude)`**
   - Formats backend prediction result for email template
   - Converts coordinates to readable format
   - Returns properly structured data object

4. **`shouldSendAlert(prediction, confidence)`**
   - Determines if alert email should be sent
   - Checks: `prediction === "Fire" && confidence > 0.85`
   - Returns: boolean

### `src/components/UploadForm.jsx`
Upload form component with EmailJS integration:

**New State Variables**:
- `emailStatus`: Tracks email sending state ('sending', 'sent', 'failed', null)
- `emailError`: Stores email error message

**Updated handleSubmit()**:
- Calls backend prediction API
- Checks if fire should trigger alert
- Calls `sendFireAlertEmail()` with formatted data
- Updates UI based on email result
- Shows appropriate notification

**New UI Notifications**:
- Sending state: Yellow card with loading spinner
- Sent state: Green success alert
- Failed state: Red error alert with details

## Email Template Variables

The EmailJS template receives these variables:
```javascript
{
  location: "Latitude: 45.4215, Longitude: -75.6972",
  confidence: "94",  // Percentage as string
  time: "3/10/2026, 10:30:45 PM",
  image: "fire_image.jpg",
  subject: "Forest Fire Alert 🚨",
  message: "A potential forest fire has been detected. Please verify immediately."
}
```

## Usage Flow

1. User uploads satellite image
2. Frontend sends image to backend `/predict` endpoint
3. Backend processes image and returns prediction results
4. Frontend checks: `prediction === "Fire" && confidence > 0.85`
5. If true:
   - Format alert data
   - Call `sendFireAlertEmail(alertData)`
   - Show sending notification in UI
   - Update to success/failed notification
6. Email is sent to configured recipient via EmailJS

## Error Handling

The email service includes comprehensive error handling:

- Missing environment variables → Returns error object
- EmailJS API failure → Catches and logs error
- Network issues → Handled by EmailJS retry mechanism
- Invalid data → Validated before sending

All errors are logged to browser console and returned to UI for user feedback.

## Console Logging

For debugging, the following are logged:

**Success:**
```
Sending fire alert email with data: {location, confidence, timestamp, image}
Fire alert email sent successfully {response}
```

**Error:**
```
EmailJS configuration is incomplete
Error sending fire alert email: {error message}
Email sending failed: {error details}
```

## Backend Changes (Optional)

The Brevo SMTP logic in the backend can be:
- **Kept**: For redundant/backup email sending
- **Removed**: Simplify backend if EmailJS is sole email provider

Current estado: Backend SMTP still active for MongoDB alert tracking.

## Testing EmailJS

### 1. Verify Email Template Exists
- Log into EmailJS dashboard
- Confirm template with ID `template_w5vg0q4` exists
- Check template has variables: `{{location}}`, `{{confidence}}`, `{{time}}`, `{{image}}`

### 2. Test Fire Alert Trigger
- Upload satellite image with high fire probability
- Ensure confidence > 0.85
- Check UI shows "Sending..." then "✅ Sent"
- Verify email received with correct data

### 3. Test Error Handling
- Disable internet temporarily
- Try to send alert
- Verify error notification appears
- Check browser console for error logs

## Security Notes

✅ **Safe**: Public key is exposed in environment variables (by design)
✅ **Safe**: Email template ID is not sensitive
❌ **Danger**: Never expose EmailJS Service ID in frontend (not in this setup)
❌ **Danger**: Private MessageID not used in frontend

## Production Deployment

1. **Render/Production Server**:
   - Can use same .env setup (public key is safe)
   - No API changes needed for backend

2. **Email Domain**:
   - Update EmailJS template recipient email address
   - Or use dynamic recipient in template variables

3. **Rate Limiting**:
   - EmailJS has built-in rate limits
   - Monitor dashboard for failures
   - Implement frontend rate limiting if needed

## Comparison: Brevo SMTP vs EmailJS

| Feature | Brevo SMTP | EmailJS |
|---------|-----------|---------|
| **Location** | Backend | Frontend |
| **Secrets** | Private SMTP key | Public key only |
| **DB Status Tracking** | Automatic | Manual (if needed) |
| **Error Handling** | Backend logs | Frontend+Console |
| **User Feedback** | Dashboard update | Instant UI notification |
| **Infrastructure** | SMTP server | REST API |
| **Cold Start Impact** | Adds latency | None (frontend) |

## Common Issues

### Email Not Sending
1. Check .env credentials are correct
2. Verify template exists in EmailJS dashboard
3. Check browser console for errors
4. Test network connectivity

### Template Variables Missing
1. Confirm template contains `{{variable_name}}`
2. Verify `emailService.js` sends correct key names
3. Check EmailJS dashboard for typos

### Confidentiality Not Showing
1. Verify confidence value > 0.85 (not ≥ 0.85)
2. Check backend calculation accuracy
3. Monitor browser console for state changes

## Next Steps

1. ✅ EmailJS npm package installed
2. ✅ Environment variables configured
3. ✅ Email service utility created
4. ✅ UploadForm component updated
5. ⏳ Test with real fire image upload
6. ⏳ Deploy to production
7. ⏳ Monitor EmailJS dashboard for delivery

## Support & Debugging

- **EmailJS Status**: Check [EmailJS Dashboard](https://dashboard.emailjs.com)
- **Browser Console**: Open DevTools → Console tab for logs
- **Network Tab**: Monitor XHR requests to EmailJS API
- **Backend**: MongoDB still tracks alert creation & status
