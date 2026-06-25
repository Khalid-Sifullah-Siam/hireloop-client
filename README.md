<div align="center">

# ðŸ’¼ HireLoop

### Find better opportunities. Hire the right people.

A modern, role-based job platform that connects job seekers, recruiters, and administrators in one place.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://hireloop-client-six.vercel.app)

[View Live Website](https://hireloop-client-six.vercel.app) 

[Client Repository](https://github.com/Khalid-Sifullah-Siam/hireloop-client) 

[Server Repository](https://github.com/Khalid-Sifullah-Siam/hireloop-server)

</div>

---

## About the Project

HireLoop makes the hiring process easier for both job seekers and recruiters.
Job seekers can discover, save, and apply for jobs, while recruiters can create
company profiles and manage job posts. Administrators have a separate dashboard
for controlling users, companies, jobs, and payment records.

The platform also includes role-based access, subscription plans, application
limits, account approval, and Stripe checkout.

## Main Features

### For Job Seekers

- Browse and search available jobs
- Filter jobs by title, company, category, location, type, and status
- View complete job details
- Save jobs and remove them later
- Apply for approved jobs
- Track submitted applications
- Manage profile settings
- View subscription and payment history
- Upgrade plans for a higher monthly application limit

### For Recruiters

- Create and manage a company profile
- Upload a company logo with imgBB
- Create, edit, and delete job posts
- View recruiter dashboard statistics
- Manage jobs from a dedicated dashboard
- Select plans with different active job limits
- View billing and payment history

### For Administrators

- View platform statistics
- Manage users and account roles
- Approve, reject, suspend, or restore accounts
- Review and manage registered companies
- Review and manage job posts
- View platform payment records

### Platform Features

- Email and password authentication with Better Auth
- Job seeker, recruiter, and admin roles
- Protected routes and role-based dashboards
- Account approval and suspension system
- Free and paid subscription plans
- Stripe checkout and 30-day paid plans
- MongoDB data storage
- Responsive design for desktop and mobile devices
- Loading, error, and custom not-found pages
- Toast messages for clear user feedback

## Built With

| Frontend | Backend and Services |
| --- | --- |
| Next.js 16 App Router | Node.js and Express.js |
| React 19 | MongoDB |
| Tailwind CSS 4 | Better Auth |
| HeroUI | Stripe |
| Motion | imgBB |
| Lucide React | Vercel |

## User Roles

| Role | Access |
| --- | --- |
| **Job Seeker** | Browse, save, and apply for jobs; manage applications, profile, and billing |
| **Recruiter** | Manage a company profile, publish jobs, update listings, and view billing |
| **Admin** | Manage users, companies, jobs, account status, and payments |

## Subscription Plans

HireLoop provides separate plans for job seekers and recruiters.

| User Type | Plans |
| --- | --- |
| **Job Seeker** | Free, Pro, and Premium |
| **Recruiter** | Free, Growth, and Enterprise |

Each plan controls features such as the monthly job application limit or the
number of active job posts. Paid plans remain active for 30 days before the
account returns to its free plan.

## Getting Started

### Prerequisites

Install these tools before running the project:

- [Node.js](https://nodejs.org/) version 20 or newer
- [Git](https://git-scm.com/)
- The [HireLoop server](https://github.com/Khalid-Sifullah-Siam/hireloop-server)

### 1. Clone the client repository

```bash
git clone https://github.com/Khalid-Sifullah-Siam/hireloop-client.git
cd hireloop-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the project root:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=your_database_name
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_IMAGE_UPLOAD_API=your_imgbb_api_key
```

> [!IMPORTANT]
> Never upload real passwords, API keys, or secret values to GitHub. Replace
> `NEXT_PUBLIC_SERVER_URL` with the deployed server URL in production.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Keep the HireLoop server running so jobs, payments, and other API features work.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Check the project for linting problems |
| `npm run check:data` | Check project data with the included script |

## Project Structure

```text
src/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ auth/                  # Sign-in and sign-up pages
â”‚   â”œâ”€â”€ companies/             # Company listing
â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”œâ”€â”€ admin/             # Admin dashboard
â”‚   â”‚   â”œâ”€â”€ recruiter/         # Recruiter dashboard
â”‚   â”‚   â””â”€â”€ seeker/            # Job seeker dashboard
â”‚   â”œâ”€â”€ job/                   # Job details and application
â”‚   â”œâ”€â”€ jobs/                  # Job browsing and search
â”‚   â””â”€â”€ plans/                 # Plans and payment success
â”œâ”€â”€ Components/
â”‚   â”œâ”€â”€ Dashboard/             # Dashboard components
â”‚   â”œâ”€â”€ Jobs/                  # Job-related components
â”‚   â””â”€â”€ Shared/                # Navbar, footer, and shared UI
â””â”€â”€ lib/
    â”œâ”€â”€ actions/               # Server actions
    â”œâ”€â”€ api/                   # API helper functions
    â”œâ”€â”€ auth.js                # Better Auth configuration
    â””â”€â”€ db.js                  # MongoDB connection

public/
â”œâ”€â”€ images/                    # Website images
â””â”€â”€ photos/                    # Project screenshots
```

---

<div align="center">

Built to make job searching and hiring simpler.

If you like this project, consider giving the repositories a â­.

</div>

## Photos

### Photo 01

![HireLoop Photo 01](./public/photos/Screenshot%20%28173%29.png)

### Photo 02

![HireLoop Photo 02](./public/photos/Screenshot%20%28174%29.png)

### Photo 03

![HireLoop Photo 03](./public/photos/Screenshot%20%28175%29.png)

### Photo 04

![HireLoop Photo 04](./public/photos/Screenshot%20%28176%29.png)

### Photo 05

![HireLoop Photo 05](./public/photos/Screenshot%20%28177%29.png)

### Photo 06

![HireLoop Photo 06](./public/photos/Screenshot%20%28178%29.png)

### Photo 07

![HireLoop Photo 07](./public/photos/Screenshot%20%28179%29.png)

### Photo 08

![HireLoop Photo 08](./public/photos/Screenshot%20%28181%29.png)

### Photo 09

![HireLoop Photo 09](./public/photos/Screenshot%20%28182%29.png)

### Photo 10

![HireLoop Photo 10](./public/photos/Screenshot%20%28183%29.png)

### Photo 11

![HireLoop Photo 11](./public/photos/Screenshot%20%28184%29.png)

### Photo 12

![HireLoop Photo 12](./public/photos/Screenshot%20%28185%29.png)

### Photo 13

![HireLoop Photo 13](./public/photos/Screenshot%20%28186%29.png)

### Photo 14

![HireLoop Photo 14](./public/photos/Screenshot%20%28187%29.png)

### Photo 15

![HireLoop Photo 15](./public/photos/Screenshot%20%28188%29.png)

### Photo 16

![HireLoop Photo 16](./public/photos/Screenshot%20%28189%29.png)

### Photo 17

![HireLoop Photo 17](./public/photos/Screenshot%20%28190%29.png)

### Photo 18

![HireLoop Photo 18](./public/photos/Screenshot%20%28191%29.png)

### Photo 19

![HireLoop Photo 19](./public/photos/Screenshot%20%28192%29.png)

### Photo 20

![HireLoop Photo 20](./public/photos/Screenshot%20%28193%29.png)

### Photo 21

![HireLoop Photo 21](./public/photos/Screenshot%20%28194%29.png)

### Photo 22

![HireLoop Photo 22](./public/photos/Screenshot%20%28195%29.png)

### Photo 23

![HireLoop Photo 23](./public/photos/Screenshot%20%28197%29.png)

### Photo 24

![HireLoop Photo 24](./public/photos/Screenshot%20%28199%29.png)

### Photo 25

![HireLoop Photo 25](./public/photos/Screenshot%20%28200%29.png)

### Photo 26

![HireLoop Photo 26](./public/photos/Screenshot%20%28201%29.png)

### Photo 27

![HireLoop Photo 27](./public/photos/Screenshot%20%28202%29.png)

### Photo 28

![HireLoop Photo 28](./public/photos/Screenshot%20%28203%29.png)

### Photo 29

![HireLoop Photo 29](./public/photos/Screenshot%20%28204%29.png)

### Photo 30

![HireLoop Photo 30](./public/photos/Screenshot%20%28205%29.png)

### Photo 31

![HireLoop Photo 31](./public/photos/Screenshot%20%28206%29.png)
