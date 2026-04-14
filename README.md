1. Built a React frontend app using Vite with routes for register, login, forgot password, and chat.
2. Integrated Keycloak authentication with auth provider, protected chat route, and login handled only by Keycloak.
3. Extracted senderId from Keycloak token using sub (fallback to preferred_username).
4. Created registration UI with username, Aadhaar, email, password, and confirm password with validation.
5. Created forgot password UI with username/email and OTP input (demo only).
6. Built chat UI with user list, message history, input box, send button, and logout.
7. Added optimistic UI so messages appear instantly when sent.
8. Integrated backend APIs: POST /send, GET /fetch/new/messages, GET /fetch/messages.
9. Managed API base URL using VITE_API_BASE_URL.
10. Ensured messages sync with backend without removing local messages.
11. Added placeholders for encryption/decryption and Aadhaar verification.
12. Application runs locally with working navigation and Keycloak login.
13. Chat functionality works with API calls and instant UI updates.
14. Linting and build are passing successfully.
15. Registration, OTP verification, Aadhaar check, and encryption are not yet implemented.
