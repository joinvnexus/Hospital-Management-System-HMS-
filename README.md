# Hospital Management System (HMS)

Hospital Management System (HMS) is a full-stack web application for managing patients, doctors, appointments, and prescriptions.

## Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcryptjs

## Project Structure

```text
.
|-- frontend/
|-- backend/
|-- README.md
`-- SETUP.md
```

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:3000` and backend runs on `http://localhost:5000`.

## Setup Guide

For full installation, environment variables, API notes, and troubleshooting, see [SETUP.md](SETUP.md).
