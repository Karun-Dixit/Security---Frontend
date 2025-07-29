# CSRF Implementation Guide

This document provides a comprehensive guide for implementing CSRF protection in the frontend application.

## Overview

Cross-Site Request Forgery (CSRF) protection has been implemented using the following approach:

1. **CSRF Service**: Manages token fetching, caching, and refreshing
2. **API Client**: Axios wrapper with automatic CSRF token injection
3. **React Hooks**: Utilities for CSRF management in components
4. **Secure Forms**: Form components with built-in CSRF protection
5. **Error Handling**: Global error boundaries and user-friendly error messages

## Architecture

### 1. CSRF Service (`src/services/csrfService.js`)

**Purpose**: Centralized CSRF token management

**Key Features**:

- Token fetching from `/api/csrf-token` endpoint
- Token caching to avoid unnecessary requests
- Automatic token refresh with deduplication
- Token validation and clearing

**Usage**:

```javascript
import { csrfService } from "../services/csrfService";

// Get current token (fetches if not available)
const token = await csrfService.getToken();

// Refresh token
await csrfService.refreshToken();

// Clear token
csrfService.clearToken();
```

### 2. API Client (`src/services/apiClient.js`)

**Purpose**: HTTP client with automatic CSRF protection

**Key Features**:

- Automatic CSRF token injection for POST/PUT/PATCH/DELETE requests
- 403 CSRF error handling with automatic retry
- Token refresh on CSRF failures
- Centralized error handling

**Usage**:

```javascript
import { api } from "../services/apiClient";

// All HTTP methods include CSRF protection automatically
const response = await api.post("/api/user/register", userData);
const data = await api.get("/api/user/profile");
```

### 3. CSRF React Hooks (`src/hooks/useCSRF.js`)

**Purpose**: React hooks for CSRF management in components

#### `useCSRF()`

```javascript
const { initializeCSRF, refreshCSRF, clearCSRF, isLoading, error, hasToken } =
  useCSRF();
```

#### `useSecureForm(onSubmit)`

```javascript
const { handleSubmit, isSubmitting, csrfError, clearError } = useSecureForm(
  async (formData) => {
    // Your form submission logic
  }
);
```

### 4. Secure Form Component (`src/components/SecureForm.jsx`)

**Purpose**: Form wrapper with automatic CSRF protection

**Features**:

- Automatic CSRF error display
- Form submission state management
- Loading indicators
- Error recovery

**Usage**:

```jsx
import SecureForm from "../components/SecureForm";

<SecureForm
  onSubmit={async (formData, event) => {
    // Handle form submission
    await api.post("/api/endpoint", formData);
  }}
  className="space-y-4"
>
  <input name="username" type="text" required />
  <button type="submit">Submit</button>
</SecureForm>;
```

### 5. Error Boundary (`src/components/ErrorBoundary.jsx`)

**Purpose**: Global error handling for CSRF and other errors

**Features**:

- Catches unhandled errors
- Specific handling for CSRF errors
- User-friendly error UI
- Development error details

## Implementation Details

### Token Flow

1. **App Initialization**:

   - CSRF token is fetched on app startup
   - Token is cached in memory
   - App waits for CSRF initialization before making API calls

2. **API Requests**:

   - All POST/PUT/PATCH/DELETE requests automatically include CSRF token
   - GET requests don't include CSRF tokens (not required)

3. **Error Handling**:

   - 403 CSRF errors trigger automatic token refresh
   - Original request is retried with new token
   - Multiple simultaneous refresh attempts are deduplicated

4. **Token Refresh**:
   - Tokens are refreshed automatically on CSRF errors
   - Manual refresh available through hooks
   - Tokens are cleared on logout (401 errors)

### Security Headers

The API client sends CSRF tokens via the `X-CSRF-Token` header:

```javascript
config.headers["X-CSRF-Token"] = csrfToken;
```

### Error Recovery

The implementation includes multiple layers of error recovery:

1. **Automatic Retry**: CSRF errors trigger token refresh and request retry
2. **User Notification**: Toast notifications for various error states
3. **Error Boundary**: Catches unhandled errors with recovery options
4. **Form-Level Errors**: SecureForm displays CSRF-specific error messages

## Migration from Regular Axios

### Before (using regular axios):

```javascript
const { data } = await axios.post(
  `${backendUrl}/api/user/login`,
  {
    email,
    password,
  },
  { withCredentials: true }
);
```

### After (using secure API client):

```javascript
const { data } = await api.post("/api/user/login", {
  email,
  password,
});
```

**Changes Made**:

- Replaced `axios` with `api` from `apiClient.js`
- Removed manual `withCredentials: true` (handled automatically)
- Removed manual URL construction with `backendUrl` (handled by baseURL)
- CSRF tokens are injected automatically

## Best Practices

### 1. Use the API Client

Always use the `api` client from `apiClient.js` instead of raw axios for HTTP requests.

### 2. Handle CSRF Errors Gracefully

Use the `useSecureForm` hook for forms that submit data:

```jsx
const { handleSubmit, csrfError } = useSecureForm(async (formData) => {
  await api.post("/api/endpoint", formData);
});

return (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.target));
    }}
  >
    {csrfError && <div className="error">{csrfError}</div>}
    {/* form fields */}
  </form>
);
```

### 3. Initialize CSRF Early

The AppContext automatically initializes CSRF tokens on app startup. Ensure the `csrfInitialized` flag is used to prevent premature API calls.

### 4. Clear Tokens on Logout

CSRF tokens are automatically cleared when 401 errors are received, but you can also manually clear them:

```javascript
import { csrfService } from "../services/csrfService";

const logout = () => {
  csrfService.clearToken();
  // other logout logic
};
```

## Environment Variables

Ensure your `.env` file includes:

```
VITE_BACKEND_URL=http://localhost:4000
```

The CSRF service will automatically use this URL to fetch tokens from `/api/csrf-token`.

## Error Messages

### User-Facing Messages:

- **CSRF Token Expired**: "Security token expired. Please try again."
- **Token Refresh Failed**: "Failed to refresh security token. Please reload the page."
- **General CSRF Error**: "Security verification failed. Please refresh the page."

### Developer Messages:

- Console logs include detailed error information
- Development mode shows full error stack traces in ErrorBoundary

## Testing

### Manual Testing:

1. **Normal Flow**: Submit forms and verify CSRF tokens are included
2. **Token Expiry**: Simulate token expiry and verify automatic refresh
3. **Error Recovery**: Test error boundary with network failures
4. **Session Expiry**: Verify proper handling of 401 errors

### Monitoring:

- Check browser network tab for `X-CSRF-Token` headers
- Monitor console for CSRF-related logs
- Verify toast notifications appear for errors

## Troubleshooting

### Common Issues:

1. **"CSRF token not found"**:

   - Ensure backend endpoint `/api/csrf-token` is available
   - Check if CSRF service initialized successfully
   - Verify network connectivity

2. **"Token refresh loop"**:

   - Check for multiple simultaneous requests causing conflicts
   - Verify token deduplication logic in csrfService

3. **"Session expired" loops**:

   - Ensure 401 errors clear CSRF tokens properly
   - Check if authentication state is managed correctly

4. **Forms not submitting**:
   - Verify forms use SecureForm component or useSecureForm hook
   - Check for CSRF errors in form state
   - Ensure API client is used instead of raw axios

### Debug Mode:

Enable debug logging by setting in browser console:

```javascript
localStorage.setItem("debug", "csrf");
```

This implementation provides robust CSRF protection while maintaining a smooth user experience with automatic error recovery and user-friendly error messages.
