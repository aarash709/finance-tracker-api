# Finance tracker — API

Minimal NestJS API for finance tracking and planning.

## Tech stack
- TypeScript
- NestJS
- Passport
- Prisma with postgreSQL


## Environment
Create a `.env` file at project root with the following:
- JWT_SECRET=your_jwt_secret
- SESSION_SECRET=your_session_secret
- CLIENT_ORIGIN=http://localhost:3000
- PORT=4000
- NODE_ENV=development
- GOOGLE_CLIENT_ID=yourconsoleclientid
- GOOGLE_CLIENT_SECRET=yoursecret
- GOOGLE_CALLBACK_URL=callback from the console

## Quick start
```bash
1. Install
   npm install
2. Generate prisma
   npx prisma generate

3. Development (watch)
   npm run start:dev
```
## Notes
- Ensure SESSION_SECRET is set; the server throws an error when missing.
- If using HTTPS in production, set NODE_ENV=production so cookies become secure.
- Update allowed origins via CLIENT_ORIGIN.

## Licence
