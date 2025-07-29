# Password Reset Backend Implementation Guide

This document provides the backend endpoints needed to support the password reset feature in the frontend.

## Required Backend Endpoints

### 1. **POST /api/user/forgot-password**

**Purpose**: Send password reset email to user

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Implementation Requirements**:

- Validate email exists in database
- Generate secure reset token (JWT or random string)
- Store token with expiration (recommended: 1 hour)
- Send email with reset link: `${FRONTEND_URL}/reset-password?token=${resetToken}`
- Rate limit: Max 3 requests per 15 minutes per email

---

### 2. **POST /api/user/verify-reset-token** (Optional)

**Purpose**: Verify if reset token is valid

**Request Body**:

```json
{
  "token": "reset-token-here"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Token is valid"
}
```

**Implementation Requirements**:

- Validate token exists and hasn't expired
- Return appropriate error messages for invalid/expired tokens

---

### 3. **POST /api/user/reset-password**

**Purpose**: Reset user password with new password

**Request Body**:

```json
{
  "token": "reset-token-here",
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response Success**:

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Response Error (Same Password)**:

```json
{
  "success": false,
  "message": "New password cannot be the same as your current password"
}
```

**Implementation Requirements**:

- Validate token exists and hasn't expired
- Validate password and confirmPassword match
- Hash new password and compare with current password hash
- If new password matches current password, return error
- Update user password in database
- Invalidate/delete the reset token
- Optional: Log password change event

---

## Security Considerations

### Token Generation

```javascript
// Example using crypto (Node.js)
const crypto = require("crypto");
const resetToken = crypto.randomBytes(32).toString("hex");

// Or using JWT
const jwt = require("jsonwebtoken");
const resetToken = jwt.sign(
  { userId: user._id, type: "password-reset" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```

### Password Comparison

```javascript
const bcrypt = require("bcrypt");

// Check if new password is same as current
const isSamePassword = await bcrypt.compare(
  newPassword,
  user.currentPasswordHash
);
if (isSamePassword) {
  return res.status(400).json({
    success: false,
    message: "New password cannot be the same as your current password",
  });
}
```

### Database Schema Addition

Add these fields to your User model:

```javascript
{
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordResetAttempts: {
    type: Number,
    default: 0
  },
  lastPasswordResetRequest: Date
}
```

---

## Email Template

**Subject**: Reset Your Password - [Your App Name]

**HTML Body**:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Password Reset</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>

      <p>Hello,</p>

      <p>
        We received a request to reset your password for your account. If you
        made this request, click the button below to reset your password:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="${resetLink}"
          style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;"
        >
          Reset My Password
        </a>
      </div>

      <p>
        <strong>This link will expire in 1 hour for security reasons.</strong>
      </p>

      <p>
        If you didn't request this password reset, you can safely ignore this
        email. Your password will not be changed.
      </p>

      <p>
        If the button doesn't work, you can copy and paste this link into your
        browser:
      </p>
      <p style="word-break: break-all; color: #2563eb;">${resetLink}</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #666;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </body>
</html>
```

---

## Rate Limiting Implementation

```javascript
// Example using express-rate-limit
const rateLimit = require("express-rate-limit");

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to forgot password route
app.post(
  "/api/user/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordHandler
);
```

---

## Error Codes Reference

| Status | Error Message                                              | Description                     |
| ------ | ---------------------------------------------------------- | ------------------------------- |
| 400    | "Email is required"                                        | Missing email in request        |
| 404    | "User not found"                                           | Email doesn't exist in database |
| 400    | "Token is required"                                        | Missing reset token             |
| 400    | "Invalid or expired token"                                 | Token doesn't exist or expired  |
| 400    | "Passwords do not match"                                   | password !== confirmPassword    |
| 400    | "New password cannot be the same as your current password" | Password reuse prevention       |
| 429    | "Too many password reset attempts"                         | Rate limit exceeded             |
| 500    | "Failed to send reset email"                               | Email service error             |

---

## Testing Checklist

### Forgot Password Flow:

- ✅ Valid email sends reset email
- ✅ Invalid email returns appropriate error
- ✅ Rate limiting works (max 3 attempts per 15 min)
- ✅ Email contains correct reset link
- ✅ Token expires after 1 hour

### Reset Password Flow:

- ✅ Valid token allows password reset
- ✅ Invalid/expired token shows error
- ✅ Password validation works
- ✅ Same password detection works
- ✅ Successful reset invalidates token
- ✅ User can login with new password

### Security Tests:

- ✅ Tokens are securely generated
- ✅ Tokens expire properly
- ✅ Old tokens are invalidated after use
- ✅ Rate limiting prevents abuse
- ✅ Password comparison prevents reuse

This implementation ensures secure password reset functionality with protection against common vulnerabilities and user-friendly error handling.
