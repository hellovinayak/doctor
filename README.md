# ApexCare - Hospital Patient Management System

A full-stack MERN application for managing hospital operations including patients, doctors, nurses, staff, prescriptions, billing, and QR-based patient profiles.

## Project Structure

```
patientmngmt/
├── backend/              # Node.js/Express API server
│   ├── models/           # MongoDB schemas (Patient, Doctor, Nurse, Staff, User, Prescription, Invoice)
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   └── .env              # Environment variables
│
└── frontend/             # React frontend application
    ├── public/            # Static assets (favicon, dashboard image)
    ├── src/
    │   ├── components/    # Reusable UI components (Modal, DataTable, Sidebar, Navbar, etc.)
    │   ├── pages/         # Page components (Home, Login, Signup, Dashboard, PublicPatientProfile)
    │   ├── context/       # React context (AuthContext)
    │   └── services/      # API service layer (api.js)
    └── vite.config.js
```

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication (jsonwebtoken)
- Bcrypt password hashing (bcryptjs)
- CORS enabled
- RESTful API architecture

### Frontend
- React 19
- React Router v7
- Vite (build tool)
- React Toastify (notifications)
- jsPDF & jspdf-autotable (PDF generation)
- qrcode.react (QR code generation)
- Custom CSS with modern design system

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd patientmngmt
```

2. **Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

### Running the Application

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features

### Authentication & Authorization
- JWT-based session management
- Role-based access control (Admin, Doctor, Nurse, Staff)
- Self-signup restricted to non-admin roles (Admin provisioned via DB)
- Persistent login with localStorage
- Protected routes with automatic redirects

### Patient Management
- Full CRUD operations for patient records
- Track patient status (Admitted, Discharged, Under Treatment)
- Record medical information (blood type, allergies, diagnosis)
- Room number assignment & admission date tracking

### QR Code Patient Profiles
- Generate unique QR codes for each patient from the Patients table
- Scan QR code → opens a **public portal** (no login required)
- Public profile displays: medical history, allergies, diagnosis, prescriptions
- PDF download available from the public portal
- Copy shareable public link with one click

### Prescription & Medical Records
- Create detailed prescriptions with multiple medicines
- Track dosage, frequency, timing, duration, and special instructions
- Lab tests ordered & follow-up dates
- Search prescriptions by patient name
- Generate professional PDF prescriptions with hospital branding

### Billing & Invoice Generation
- Create invoices with dynamic line items
- Automatic tax calculation
- Payment status tracking (Paid, Pending, Overdue)
- Auto-generated invoice IDs (INV-XXXX)
- Search invoices by patient name
- Generate professional PDF invoices

### Doctor Management
- Manage doctor profiles with specializations
- Track experience and availability status
- Department assignments

### Nurse Management
- Shift scheduling (Morning, Afternoon, Night)
- Department assignments
- Qualification tracking

### Staff Management
- Position-based organization (Receptionist, Technician, Assistant, Administrator)
- Department assignments & salary tracking

### Dashboard
- Real-time statistics with animated stat cards
- Recent patient list
- Role-specific views (Admin sees everything, Doctor sees patients & prescriptions, etc.)

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/users` - Get all users (Admin)

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients/add` - Create patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors/add` - Create doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Nurses
- `GET /api/nurses` - Get all nurses
- `POST /api/nurses/add` - Create nurse
- `PUT /api/nurses/:id` - Update nurse
- `DELETE /api/nurses/:id` - Delete nurse

### Staff
- `GET /api/staff` - Get all staff
- `POST /api/staff/add` - Create staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff

### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `GET /api/prescriptions/patient/:patientId` - Get prescriptions by patient
- `POST /api/prescriptions/add` - Create prescription
- `PUT /api/prescriptions/:id` - Update prescription
- `DELETE /api/prescriptions/:id` - Delete prescription

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/patient/:patientId` - Get invoices by patient
- `POST /api/invoices/add` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

## Development

### Backend Development
```bash
cd backend
npm start
```

### Frontend Development
```bash
cd frontend
npm run dev    # Vite dev server with HMR on port 3000
```

### Building for Production
```bash
cd frontend
npm run build
```

## License

ISC
