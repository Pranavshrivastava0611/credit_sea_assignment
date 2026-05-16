# Loan Management System (LMS) - CreditSea Assignment

A robust, full-stack Loan Management System built with **Next.js 14**, **Node.js/Express**, and **MongoDB**. This application handles the entire loan lifecycle from application to closure, featuring a custom Business Rule Engine (BRE) and Role-Based Access Control (RBAC).

---

## 🚀 Submission Information

### 1. GitHub Repository
- **URL**: [https://github.com/Pranavshrivastava0611/credit_sea_assignment](https://github.com/Pranavshrivastava0611/credit_sea_assignment)
- **Status**: Public

### 2. Working Video Demo
- **URL**: [https://vimeo.com/your-video-link](https://vimeo.com/your-video-link) *(Please replace with actual link)*
- **Contents**: 
  - Borrower application flow (BRE Pass/Fail)
  - Sales lead view
  - Sanction officer approval/rejection
  - Disbursement process
  - Collection & Payment recording
  - Loan closure

### 3. Login Credentials
Use these accounts to test the system after running the seed script.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@lms.com` | `Admin@123` |
| **Sales** | `sales@lms.com` | `Sales@123` |
| **Sanction** | `sanction@lms.com` | `Sanction@123` |
| **Disbursement** | `disburse@lms.com` | `Disburse@123` |
| **Collection** | `collection@lms.com` | `Collect@123` |
| **Borrower** | `borrower@lms.com` | `Borrower@123` |

---

## ✨ Features

- 🔐 **Secure Auth**: JWT-based authentication with Access and Refresh tokens stored in HTTP-only cookies.
- 👥 **RBAC**: 6 distinct roles with specific permissions and dashboard views.
- ⚙️ **BRE (Business Rule Engine)**: Server-side validation of borrower eligibility (Age, Salary, Employment, etc.).
- 📂 **Local Storage**: Multer implementation for storing salary slips directly on the server (Local Device Storage).
- 📊 **Dynamic Dashboards**: Real-time status tracking for borrowers and action queues for executives.
- 🌓 **Premium UI**: Modern dark-first design with glass-morphism, responsive layouts, and smooth animations (Framer Motion).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, Axios, Framer Motion.
- **Backend**: Node.js, Express.js, TypeScript, Multer.
- **Database**: MongoDB (Atlas) with Mongoose.
- **Validation**: Zod (Schema validation).

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or local MongoDB instance.

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your MONGODB_URI and JWT secrets

# Seed the database (Creates the test accounts listed above)
npm run seed

# Run in development mode
npm run dev
```

#### Backend Environment Variables (.env)
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run in development mode
npm run dev
```

#### Frontend Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🔄 Loan Lifecycle Flow

1. **APPLIED**: Borrower submits details + salary slip. BRE checks eligibility.
2. **SANCTIONED**: Sanction officer reviews and approves the application.
3. **DISBURSED**: Disbursal officer records the fund transfer.
4. **CLOSED**: Collection agent records payments until the total repayment is met.
5. **REJECTED**: terminal state if eligibility or documents fail.

---

## 📁 Project Structure

```text
├── backend
│   ├── src
│   │   ├── controllers     # Request handlers
│   │   ├── middleware      # Auth, RBAC, Upload
│   │   ├── models          # Mongoose schemas
│   │   ├── routes          # API endpoints
│   │   ├── services        # Business logic (BRE, Loan calc)
│   │   └── seed            # Database seeding script
│   └── uploads             # Local storage for documents
└── frontend
    ├── src
    │   ├── app             # Next.js App Router pages
    │   ├── components      # Reusable UI components
    │   ├── hooks           # Custom React hooks (API calls)
    │   ├── store           # Zustand state management
    │   └── lib             # Utilities and Axios config
```
