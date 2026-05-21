ARCHITECTURE FOR SECURE AUTH API

Register
↓
Hash password
↓
Save user

-------------------

Login
↓
Validate credentials
↓
Generate:
- Access Token
- Refresh Token
↓
Hash refresh token
↓
Save hashed refresh token
↓
Return tokens

-------------------

Refresh
↓
Validate refresh token
↓
Issue new access token

-------------------

Logout
↓
Remove refresh token
↓
User session invalidated