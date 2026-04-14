Built a complete React frontend app (Vite) with routes for register, login, forgot-password, and chat.
Added Registration UI with fields: username, Aadhaar number, email, password, confirm password (with password match check).
Added Forgot Password UI with username/email + OTP input (demo verification placeholder).
Added Chat UI with:
left-side user list (app menu),
message history box,
message input + send button,
logout button.
Added placeholder sections for:
frontend message encryption/decryption,
Aadhaar verification.
Integrated Keycloak auth:
auth provider/context setup,
protected chat route,
login now Keycloak-only.
senderId for messages now comes from Keycloak token (sub fallback to preferred_username), not manual input.
Integrated backend endpoints:
POST /send with MessageDTO in body,
GET /fetch/new/messages?userId=...,
GET /fetch/messages with both user IDs as query params.
Added API base URL support through env (VITE_API_BASE_URL) with default http://localhost:8080.
Improved chat behavior:
sent messages show instantly in UI (optimistic update),
backend fetch merges messages without wiping local ones.
Functional right now
App runs on localhost with working pages and navigation.
Keycloak login button and session-based route protection are wired.
Chat send action calls /send with proper JSON body.
Fetch calls for new and conversation messages are wired.
Messages appear immediately when sent from UI.
Lint/build are passing successfully.
Still placeholder / pending backend logic
Registration submit is UI-only (no backend registration call yet).
Forgot password OTP verification is UI demo only.
Aadhaar verification section is placeholder.
Encryption/decryption logic is placeholder.
