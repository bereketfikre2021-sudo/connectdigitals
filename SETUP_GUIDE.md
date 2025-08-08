# Contact Form Setup Guide

## 🚀 Quick Setup

### 1. Email Configuration (PHP)

#### Step 1: Install PHPMailer
Download PHPMailer from: https://github.com/PHPMailer/PHPMailer
- Extract the files
- Upload the `PHPMailer` folder to your website root directory

#### Step 2: Configure Gmail SMTP
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Update `contact.php`**:
   ```php
   $smtp_username = "your-gmail@gmail.com"; // Your Gmail
   $smtp_password = "your-16-digit-app-password"; // App password
   ```

### 2. Google Sign-In Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API

#### Step 2: Configure OAuth 2.0
1. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
2. Choose "Web application"
3. Add authorized origins:
   - `http://localhost` (for testing)
   - `https://yourdomain.com` (your actual domain)
4. Copy the Client ID

#### Step 3: Update HTML
Replace `YOUR_GOOGLE_CLIENT_ID` in `index.html`:
```html
data-client_id="123456789-abcdefghijklmnop.apps.googleusercontent.com"
```

## 📧 Email Features

### What You'll Receive
- **Subject**: "New Contact Form Submission - [Client Name]"
- **Content**: Client's name, email, and message
- **Reply-to**: Set to client's email address

### Auto-Reply to Clients
- **Subject**: "Thank you for contacting Connect Digitals"
- **Content**: Confirmation message with their original message

## 🔐 Google Sign-In Features

### User Experience
- **One-click sign-in** with Google account
- **Auto-fills** name and email fields
- **Secure** OAuth 2.0 authentication
- **No passwords** needed from users

### Data Retrieved
- Full name
- Email address
- Profile picture (available but not used)
- Google account ID

## 🛠️ Troubleshooting

### Email Not Sending
1. **Check SMTP settings** in `contact.php`
2. **Verify Gmail App Password** is correct
3. **Check server logs** for PHP errors
4. **Test with simple mail()** first

### Google Sign-In Not Working
1. **Verify Client ID** is correct
2. **Check domain** is in authorized origins
3. **Enable Google+ API** in Google Cloud Console
4. **Check browser console** for errors

### Common Issues
- **CORS errors**: Add your domain to authorized origins
- **SMTP timeout**: Check firewall settings
- **PHP errors**: Enable error reporting for debugging

## 🔒 Security Notes

### Email Security
- **SMTP with TLS** encryption
- **Input sanitization** prevents XSS
- **Honeypot field** blocks spam bots
- **Validation** on both client and server

### Google Sign-In Security
- **OAuth 2.0** standard
- **JWT tokens** for authentication
- **HTTPS required** for production
- **Domain verification** prevents phishing

## 📱 Testing

### Local Testing
1. **Upload files** to local server (XAMPP, WAMP, etc.)
2. **Test form submission** with real data
3. **Check email delivery** to your Gmail
4. **Test Google Sign-In** with test account

### Production Testing
1. **Upload to live server**
2. **Update domain** in Google Cloud Console
3. **Test with real users**
4. **Monitor email delivery**

## 📞 Support

If you encounter issues:
1. **Check browser console** for JavaScript errors
2. **Check server logs** for PHP errors
3. **Verify all credentials** are correct
4. **Test each component** separately

## 🎯 Success Indicators

### Email Working
- ✅ Receive emails in your Gmail
- ✅ Auto-reply sent to clients
- ✅ No error messages in form

### Google Sign-In Working
- ✅ Sign-in button appears
- ✅ Clicking fills form fields
- ✅ No console errors
- ✅ Works on mobile and desktop 