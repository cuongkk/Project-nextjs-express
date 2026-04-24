<div align="center">
  <h1>🚀 Project 6 - Modern Job Portal</h1>
  <p>A full-stack, production-ready recruitment platform built with Next.js 16, Express 5, and MongoDB.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 📖 Overview

Project 6 is a high-performance recruitment platform designed to bridge the gap between talented candidates and top-tier employers. It features real-time notifications, secure authentication, and a robust backend architecture optimized for production.

---

## ✨ Key Features

### 👤 For Candidates
- **Smart Search**: Filter jobs by category, location, and salary.
- **Dynamic CVs**: Upload and manage your professional resume with Cloudinary.
- **Application Tracking**: Monitor the status of your job applications in real-time.
- **Real-time Chat**: Direct communication with employers via Socket.IO.

### 🏢 For Employers
- **Company Branding**: Manage detailed company profiles and logos.
- **Job Management**: Post, update, and close job listings effortlessly.
- **Applicant Review**: Structured dashboard to review CVs and manage candidates.
- **Instant Notifications**: Get alerted when new applications arrive.

### 🛠 System Features
- **Production Hardening**: Env validation, structured logging, and graceful shutdowns.
- **Health Checks**: Built-in endpoints for monitoring (`/health`, `/ready`, `/live`).
- **Security**: Rate limiting, Helmet protection, and secure JWT handling.
- **Monorepo Design**: Clean separation between frontend and backend services.

---

## 💻 Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (React 19) | Modern, SSR-ready user interface. |
| **Backend** | Express 5 | Fast, unopinionated web framework. |
| **Database** | MongoDB + Mongoose | Scalable NoSQL data storage. |
| **Real-time** | Socket.IO | Bi-directional, event-based communication. |
| **Styles** | Tailwind CSS 4 + MUI | Beautiful, responsive UI components. |
| **Files** | Cloudinary | Cloud-based image and file management. |
| **DevOps** | Docker + Compose | Containerized development and deployment. |

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: 20+
- **npm**: 10+
- **MongoDB**: Local instance or MongoDB Atlas.
- **Docker Desktop**: (Optional) For containerized setup.

### 🐳 Quick Start with Docker
The easiest way to get started is using Docker Compose:

```bash
# Development mode (with hot reload)
docker compose -f docker-compose.dev.yml up --build

# Production-like mode
docker compose up --build
```

### 🛠 Manual Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd project-6
   ```

2. **Install Dependencies:**
   ```bash
   # Root
   npm install
   # Backend
   npm --prefix backend install
   # Frontend
   npm --prefix frontend install
   ```

3. **Run Services:**
   ```bash
   # Run Backend (http://localhost:5000)
   npm run dev:backend

   # Run Frontend (http://localhost:3000)
   npm run dev:frontend
   ```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
| :--- | :--- |
| `DATABASE` | MongoDB Connection URI |
| `PORT` | API Port (Default: 5000) |
| `JWT_ACCESS_SECRET` | Secret for Access Tokens |
| `JWT_REFRESH_SECRET`| Secret for Refresh Tokens |
| `CLOUDINARY_*` | Cloudinary credentials for uploads |
| `GMAIL_*` | Credentials for email notifications |

### Frontend (`frontend/.env.local`)
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API Base URL |
| `NEXT_PUBLIC_TINYMCE` | TinyMCE API Key |

---

## 🏗 Repository Structure

```text
project-6/
├── backend/               # Express + MongoDB API
│   ├── src/               # Source code
│   └── tests/             # Vitest + Supertest
├── frontend/              # Next.js 16 app
│   ├── src/               # React components & logic
│   └── public/            # Static assets
├── docker-compose.yml     # Production-ready orchestration
└── package.json           # Monorepo scripts
```

---

## 🛡 Production Hardening
This project is built with production reliability in mind:
- ✅ **Env Validation**: Joi-based schema validation at startup.
- ✅ **Graceful Shutdown**: Handles `SIGTERM`/`SIGINT` for zero-downtime stops.
- ✅ **Structured Logging**: Request-ID tracking for easier debugging.
- ✅ **Security Headers**: Optimized Helmet configuration.
- ✅ **Rate Limiting**: Protection against brute-force and DDoS.

---

## 📡 API Groups
- `📂 /auth` - Authentication flow
- `📂 /users` - User management
- `📂 /companies` - Company profiles
- `📂 /jobs` - Job postings
- `📂 /applications` - CV submissions
- `📂 /notifications` - Real-time alerts
- `📂 /search` - Advanced search logic

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---
<div align="center">
  Made with ❤️ for the Developer Community
</div>
