# HireLoop Client

HireLoop is a Next.js app for job seekers and recruiters. The current project
has a marketing home page, authentication screens, a recruiter dashboard, and a
job-posting flow.

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- HeroUI components
- Better Auth
- MongoDB

## Project Structure

```txt
src/
  app/                         Next.js routes and API routes
    auth/                      Sign in and sign up pages
    dashboard/                 Recruiter dashboard pages
    api/                       Server API routes
  Components/                  Reusable UI components
    Dashboard/                 Dashboard-only components
    Shared/                    Navbar and Footer
  lib/                         Shared app logic
    actions/                   Server actions
    auth.js                    Better Auth server config
    auth-client.js             Better Auth client helper
    db.js                      MongoDB connection helper
```

## Environment Variables

Create a `.env` or `.env.local` file in the project root with these values:

```txt
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
DATABASE_NAME=
NEXT_PUBLIC_SERVER_URL=
NEXT_PUBLIC_IMAGE_UPLOAD_API=
```

Do not commit real secret values to Git.

`NEXT_PUBLIC_IMAGE_UPLOAD_API` is the `imgbb` upload key used by the recruiter
company form when a logo image is selected.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production client: `https://hireloop-client-six.vercel.app`
Production server: `https://hireloop-server-tan-iota.vercel.app`

## Useful Commands

```bash
npm run lint
npm run build
```

## Important Files

- `src/lib/db.js`: Creates one reusable MongoDB client.
- `src/lib/auth.js`: Configures Better Auth and the user role field.
- `src/lib/actions/jobs.js`: Sends new job form data to the jobs API.
- `src/app/dashboard/recruiter/jobs/new/page.jsx`: Recruiter job creation form.
- `src/app/api/recruiter/jobs/route.js`: Auth-protected job creation API route.

## Beginner Notes

- Files named `page.jsx` become browser pages.
- Files named `route.js` become API endpoints.
- Components with `"use client"` can use hooks like `useState`.
- Server files can safely use secrets from `process.env`.
- Keep repeated UI data in arrays, then render it with `.map()`.
