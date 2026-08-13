# Manual Xiaomi Test Plan - PENDING

## Authentication Flow
- [ ] Cold launch with no saved token redirects to onboarding
- [ ] Onboarding shown only when incomplete
- [ ] Login shown after onboarding completion
- [ ] Registration success stores token and navigates to tabs
- [ ] Login success stores token and navigates to tabs
- [ ] Authenticated tabs open and show user data
- [ ] App restart restores session through /me endpoint
- [ ] Invalid saved token returns to login screen
- [ ] Incorrect password shows Parea error dialog
- [ ] Duplicate email shows validation error
- [ ] Rate limit message appears after many failed attempts
- [ ] Offline/network-unreachable behavior shows appropriate message
- [ ] Logout confirmation dialog appears
- [ ] Logout removes local token and navigates to login
- [ ] Android Back does not return to authenticated screens
- [ ] Android Back does not return to login after successful auth

## UI Components
- [ ] Safe areas display correctly
- [ ] Keyboard avoidance works on forms
- [ ] Password fields hide/show functionality
- [ ] Fast Refresh works during development
- [ ] No tokens or passwords appear in logs

## Native Features
- [ ] expo-secure-store properly stores/retrieves tokens
- [ ] localStorage fallback works on web (development only)
- [ ] No token appears in logs or console

## Error Handling
- [ ] 401 invalid credentials shows user-friendly message
- [ ] 401 invalid/revoked saved token clears session
- [ ] 422 validation errors map to form fields
- [ ] 429 rate limiting shows retry message
- [ ] Network errors show connection message
- [ ] Timeout errors handled gracefully
- [ ] Malformed/non-JSON responses handled safely