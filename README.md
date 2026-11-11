# Sindh Health Management Information System (SHMIS) & Unified EMR Platform

## Project Overview

The Sindh Health Management Information System (SHMIS) is a web-based healthcare management platform designed to organize hospital operations and patient medical records through a centralized system.

The platform provides modules for managing hospitals, departments, doctors, patients, appointments, clinical records, prescriptions, and laboratory tests.

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
- REST API

## System Modules

1. **Dashboard** – Displays an overview of healthcare information and statistics.
2. **Patient Management** – Add, view, update, and manage patient records.
3. **Hospital Management** – Manage hospital information.
4. **Department Management** – Organize hospital departments.
5. **Doctor Management** – Maintain doctor profiles and specializations.
6. **Appointment Management** – Manage patient appointments.
7. **Clinical Records** – Maintain patient clinical information.
8. **Prescription Management** – Store prescription records.
9. **Laboratory Management** – Manage laboratory test records and reports.

## Database Collections

The system uses the following MongoDB collections:

- hospitals
- departments
- doctors
- patients
- appointments
- clinicalrecords
- prescriptions
- labtests

MongoDB ObjectId references are used to establish relationships between related records.

## Key Features

- RESTful API architecture
- CRUD operations
- MongoDB database integration
- Search and filtering
- Data visualization and analytics
- Referenced documents using Mongoose
- Organized backend structure with models, controllers, and routes

## Project Structure

```text
SHMIS-EMR-System/
│
├── shmis-backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── SHMIS-FRONTEND-PROJECT/
    ├── public/
    ├── src/
    ├── .env.example
    ├── package.json
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

```bash
cd shmis-backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shmis_emr
```

Start the backend:

```bash
npm start
```

The backend will run at:

`http://localhost:5000`

### 3. Setup Frontend

Open a separate terminal:

```bash
cd SHMIS-FRONTEND-PROJECT
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

Make sure the frontend API configuration points to the running backend.

## API Endpoints

| Module | Endpoint |
|---|---|
| Hospitals | `/api/hospitals` |
| Departments | `/api/departments` |
| Doctors | `/api/doctors` |
| Patients | `/api/patients` |
| Appointments | `/api/appointments` |
| Clinical Records | `/api/clinical-records` |
| Prescriptions | `/api/prescriptions` |
| Lab Tests | `/api/lab-tests` |
| Analytics | `/api/analytics` |

## Security Note

- Environment variables are stored in `.env`.
- The `.env` file must not be uploaded to GitHub.
- `.env.example` can be used as a configuration template.
- `node_modules` is excluded from version control.

## Project Purpose

This project is developed as an academic database management system project to demonstrate the practical implementation of database design, backend development, REST APIs, and healthcare information management.

## Project Team

This project is developed collaboratively by the following team members:

1. **Archana Lohana**
2. **Tanisha Kumari**
3. **Twinkle Lohana**

**GitHub Profile:** [Archana-Lohana](https://github.com/Archana-Lohana)

---

*Academic Project – SHMIS & Unified EMR Platform*
