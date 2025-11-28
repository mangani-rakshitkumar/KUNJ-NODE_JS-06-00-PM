# Email Setup Guide

## Gmail Configuration

1. **Enable 2-Factor Authentication** in your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Update index.js**:
   ```javascript
   const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
           user: 'your-actual-email@gmail.com',
           pass: 'your-16-digit-app-password'
       }
   })
   ```

## Alternative Email Services

### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'your-email@outlook.com',
        pass: 'your-password'
    }
})
```

### Custom SMTP
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.your-provider.com',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email@domain.com',
        pass: 'your-password'
    }
})
```