# Sindh Health Management Information System (SHMIS) & Unified EMR Platform

## Project Overview

The Sindh Health Management Information System (SHMIS) is a full-stack, web-based healthcare management platform designed to manage hospital operations and electronic medical records through a centralized system.

The platform provides an organized environment for managing hospitals, departments, doctors, patients, appointments, clinical records, prescriptions, and laboratory tests.

It also includes secure authentication and role-based access control to ensure that users can access only the features and records permitted for their roles.

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Axios
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- RESTful APIs
- JSON Web Token (JWT)
- bcrypt

## User Roles & Permissions

The system supports three user roles:

### 1. Admin
- Full access to the system.
- Add, view, update, and delete records.
- Manage hospitals, departments, doctors, and patients.
- Manage appointments, clinical records, prescriptions, and laboratory tests.
- Create login accounts for existing patients.
- Access dashboard and analytics.

### 2. Doctor
- View relevant healthcare records.
- View patient information and medical history.
- View assigned appointments and relevant healthcare information.
- Add, view, and update clinical records.
- Add, view, and update prescriptions.
- View relevant laboratory information.
- Cannot delete clinical records or prescriptions.

### 3. Patient
- Securely log in using assigned credentials.
- View their own patient information.
- Access their own appointments and medical records.
- Cannot access other patients' private information or administrative analytics.

## System Modules

1. **Dashboard** – Displays an overview of healthcare information and statistics.
2. **Patient Management** – Manage patient profiles and records.
3. **Hospital Management** – Manage hospital information.
4. **Department Management** – Organize hospital departments.
5. **Doctor Management** – Maintain doctor profiles and specializations.
6. **Appointment Management** – Manage patient appointments.
7. **Clinical Records** – Maintain patient clinical information.
8. **Prescription Management** – Store and manage prescription records.
9. **Laboratory Management** – Manage laboratory test records and reports.
10. **Authentication & Authorization** – Secure login and role-based access control.
11. **Analytics** – Display healthcare statistics and data summaries.

## Authentication & Security

- JWT-based user authentication.
- Password hashing using bcrypt.
- Protected API routes using authentication middleware.
- Role-based authorization for Admin, Doctor, and Patient.
- Patient login account creation by Admin.
- Environment variables for sensitive configuration.
- Restricted access to patient-specific records.

## Database Collections

The system uses MongoDB collections including:

- `hospitals`
- `departments`
- `doctors`
- `patients`
- `appointments`
- `clinicalrecords`
- `prescriptions`
- `labtests`
- `users`

MongoDB ObjectId references are used to establish relationships between related records.

Mongoose models define the structure and relationships of database records.

## Key Features

- Full-stack MERN-based architecture.
- RESTful API integration.
- CRUD operations.
- Secure authentication and authorization.
- Role-based access control.
- Patient-specific data access.
- Search and filtering.
- Dashboard and data visualization.
- MongoDB document referencing.
- Organized backend architecture using models, controllers, routes, and middleware.

## Project Structure

```text
SHMIS-EMR-System/
│
├── shmis-backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── SHMIS-FRONTEND-PROJECT/
    ├── public/
    ├── src/
    │   ├── components/
    │   └── pages/
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Archana-Lohana/SHMIS-EMR-System.git
cd SHMIS-EMR-System
```

### 2. Setup Backend

Open a terminal:

```bash
cd shmis-backend
npm install
```

Create a `.env` file inside the `shmis-backend` folder.

Configure the environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

Backend URL:

`http://localhost:5000`

### 3. Setup Frontend

Open a new terminal from the project root:

```bash
cd SHMIS-FRONTEND-PROJECT
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173`

## API Endpoints

| Module | Endpoint |
|---|---|
| Authentication | `/api/auth/login` |
| Patient Account Creation | `/api/auth/create-patient` |
| Hospitals | `/api/hospitals` |
| Departments | `/api/departments` |
| Doctors | `/api/doctors` |
| Patients | `/api/patients` |
| Appointments | `/api/appointments` |
| Clinical Records | `/api/clinical-records` |
| Prescriptions | `/api/prescriptions` |
| Laboratory Tests | `/api/lab-tests` |
| Analytics | `/api/analytics` |

## Environment & Version Control

- Sensitive environment variables are stored in `.env`.
- The `.env` file must never be uploaded to GitHub.
- `.env.example` provides a configuration template.
- `node_modules` and build output directories are excluded from version control.
- JWT secrets and database credentials must remain private.

## Project Purpose

This project is developed as an academic Database Management System (DBMS) project to demonstrate the practical implementation of database design, MongoDB, backend development, REST APIs, authentication, authorization, and healthcare information management.

## Project Team

This project is developed collaboratively by:

1. **Archana Lohana**
2. **Tanisha Kumari**
3. **Twinkle Lohana**

**GitHub Profile:** [Archana-Lohana](https://github.com/Archana-Lohana)
