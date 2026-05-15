# Loan Management System (CreditSea)

Full-stack LMS built with **Next.js 14** + **Express.js** + **MongoDB**.

## Features

- 🔐 **JWT Authentication** with access/refresh tokens
- 👥 **Role-Based Access Control** (6 roles: Admin, Sales, Sanction, Disbursement, Collection, Borrower)
- 📝 **Multi-step Loan Application** with BRE (Business Rule Engine)
- 📊 **Operations Dashboard** with role-gated modules
- 💰 **Payment Collection** with auto-close on full repayment
- 🎨 **Dark-first UI** with glass-morphism design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| State | Zustand |
| HTTP | Axios with interceptors |

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env        # Fill in your values
npm install
npm run seed                # Creates all role accounts
npm run dev                 # Starts on :8000
```

### Frontend
```bash
cd frontend
cp .env.example .env.local  # Fill in NEXT_PUBLIC_API_URL
npm install
npm run dev                 # Starts on :3000
```

## Login Credentials (post-seed)

| Role         | Email                | Password      |
|--------------|----------------------|---------------|
| Admin        | admin@lms.com        | Admin@123     |
| Sales        | sales@lms.com        | Sales@123     |
| Sanction     | sanction@lms.com     | Sanction@123  |
| Disbursement | disburse@lms.com     | Disburse@123  |
| Collection   | collection@lms.com   | Collect@123   |
| Borrower     | borrower@lms.com     | Borrower@123  |

## API Endpoints

### Auth
- `POST /api/v1/auth/signup` — Register borrower
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/logout` — Logout
- `POST /api/v1/auth/refresh-token` — Refresh access token
- `GET /api/v1/auth/me` — Current user

### Borrower
- `POST /api/v1/borrower/bre-check` — Run eligibility check
- `POST /api/v1/borrower/upload-salary-slip` — Upload salary slip
- `POST /api/v1/borrower/apply` — Submit loan application
- `GET /api/v1/borrower/my-loans` — Get own loans

### Operations
- `GET /api/v1/sales/leads` — Sales leads
- `GET /api/v1/sanction/loans` — APPLIED loans
- `PATCH /api/v1/sanction/loans/:id/approve` — Approve loan
- `PATCH /api/v1/sanction/loans/:id/reject` — Reject loan
- `GET /api/v1/disbursement/loans` — SANCTIONED loans
- `PATCH /api/v1/disbursement/loans/:id/disburse` — Disburse loan
- `GET /api/v1/collection/loans` — DISBURSED loans
- `POST /api/v1/collection/loans/:id/payment` — Record payment
- `GET /api/v1/collection/loans/:id/payments` — Payment history

### Admin
- `GET /api/v1/admin/all-loans` — All loans
- `GET /api/v1/admin/all-users` — All users

## Loan Status Flow
```
APPLIED → SANCTIONED → DISBURSED → CLOSED
      ↘ REJECTED (terminal)
```
