# AshStore - Backend
## Clothing Based Ecommerce Store

### Dependencies Installation Command
 - Install both commands  

Dev Dependencies
```bash
npm install express typescript ts-node  @types/node @types/express @types/mongoose @types/jsonwebtoken @types/morgan @types/cookie-parser @types/cors @types/nodemailer @types/bcrypt --save-dev
```
Module Dependencies
```bash
npm install express typescript ts-node mongoose @dotenvx/dotenvx bcrypt cookie-parser cors joi jsonwebtoken morgan nodemailer nodemon
```
## Fixing TODOS
    1. Decode Google ID token on backend
    2. Implement email verification for Google sign-ups
    3. Add rate limiting for authentication endpoints
    4. Add Email Service

## Vulnerabilities
- agr user /auth/google per sirf email use kry joh DB ma hai toh bagair password ky login kr sakhta.
- Is vulnerability ko door krne ky liye, ensure karein ke Google authentication ke doran email verification implement kiya jaye.
- Iske ilawa, JWT tokens ko securely handle karna aur refresh tokens ko rotate karna bhi zaroori hai.
