# ZayneTutor Simple Maths Assignment System

Simple MERN-style assignment system for Maths only.

## Local setup
1. Install Node.js and MongoDB Atlas account.
2. In `server`, copy `.env.example` to `.env` and add your MongoDB Atlas URI and JWT secret.
3. Run:
   `npm install`
   `npm start`
4. In `client`, run:
   `npm install`
   `npm run dev`

Open the Vite URL shown in the terminal.

## Admin
Register a normal user first. In MongoDB Atlas, open the `users` collection and change that user's `role` from `student` to `admin`.

## Render
Deploy the `server` as a Web Service:
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`

Deploy the `client` as a Static Site:
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_API_URL=https://YOUR-SERVER.onrender.com/api`

For a React SPA on Render, add a rewrite from `/*` to `/index.html`.
