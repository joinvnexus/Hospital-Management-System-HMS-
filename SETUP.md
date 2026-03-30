# Hospital Management System (HMS) - Setup & Documentation

## Project Overview

Hospital Management System (HMS) is a comprehensive fullstack web application for managing patients, doctors, appointments, and prescriptions. Built with React, Node.js/Express, and MongoDB, HMS provides a secure, scalable solution for healthcare management.

## Project Structure

```
Hospital-Management-System-HMS/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context (Auth, Patient, etc.)
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS & Tailwind
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/              # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & error handling
│   │   ├── utils/           # Utilities (JWT, password)
│   │   ├── config/          # Database config
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Technologies Used

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hms
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=HMS
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Patient Registration
```
POST /auth/register/patient
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 30,
  "gender": "Male",
  "phone": "1234567890"
}
```

#### Patient Login
```
POST /auth/login/patient
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Doctor Registration
```
POST /auth/register/doctor
Content-Type: application/json

{
  "firstName": "Dr. Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "9876543210",
  "speciality": "Cardiology",
  "license": "MED123456"
}
```

#### Doctor Login
```
POST /auth/login/doctor
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}
```

### Patient Endpoints

#### Get All Patients
```
GET /patients
```

#### Get Patient by ID
```
GET /patients/:id
```

#### Update Patient
```
PUT /patients/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "age": 31
}
```

#### Get Patient Medical History
```
GET /patients/:id/history
```

#### Delete Patient
```
DELETE /patients/:id
Authorization: Bearer {token}
```

### Doctor Endpoints

#### Get All Doctors
```
GET /doctors
```

#### Get Doctor by ID
```
GET /doctors/:id
```

#### Get Doctor Schedule
```
GET /doctors/:id/schedule
```

#### Update Doctor
```
PUT /doctors/:id
Authorization: Bearer {token}
```

#### Delete Doctor
```
DELETE /doctors/:id
Authorization: Bearer {token}
```

### Appointment Endpoints

#### Create Appointment
```
POST /appointments
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "date": "2026-03-25",
  "time": "10:00 AM",
  "reason": "Regular checkup"
}
```

#### Get Appointments
```
GET /appointments?patientId=xxx&doctorId=yyy
```

#### Get Appointment by ID
```
GET /appointments/:id
```

#### Update Appointment
```
PUT /appointments/:id
Authorization: Bearer {token}
```

#### Cancel Appointment
```
PATCH /appointments/:id/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Unable to attend"
}
```

#### Delete Appointment
```
DELETE /appointments/:id
Authorization: Bearer {token}
```

### Prescription Endpoints

#### Create Prescription
```
POST /prescriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "medicines": [
    {
      "name": "Aspirin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "7 days",
      "instructions": "Take with food"
    }
  ],
  "notes": "Follow up after 1 week"
}
```

#### Get Prescriptions
```
GET /prescriptions?patientId=xxx&doctorId=yyy
```

#### Get Prescriptions by Patient
```
GET /prescriptions/patient/:patientId
```

#### Get Prescription by ID
```
GET /prescriptions/:id
```

#### Update Prescription
```
PUT /prescriptions/:id
Authorization: Bearer {token}
```

#### Delete Prescription
```
DELETE /prescriptions/:id
Authorization: Bearer {token}
```

## Database Models

### Patient Schema
- firstName (String, required)
- lastName (String, required)
- email (String, required, unique)
- password (String, required)
- age (Number, required)
- gender (String, enum: ['Male', 'Female', 'Other'])
- phone (String, required, unique)
- address (String)
- medicalHistory (Object)
  - conditions (Array)
  - allergies (Array)
  - medications (Array)
- role (String, default: 'patient')
- timestamps

### Doctor Schema
- firstName (String, required)
- lastName (String, required)
- email (String, required, unique)
- password (String, required)
- phone (String, required, unique)
- speciality (String, required)
- license (String, required)
- experience (Number)
- schedule (Object with days)
- bio (String)
- consultationFee (Number)
- role (String, default: 'doctor')
- timestamps

### Appointment Schema
- patientId (Reference to Patient)
- doctorId (Reference to Doctor)
- date (Date, required)
- time (String, required)
- status (String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'])
- reason (String)
- notes (String)
- cancelledAt (Date)
- cancelledReason (String)
- timestamps

### Prescription Schema
- patientId (Reference to Patient)
- doctorId (Reference to Doctor)
- medicines (Array of objects with name, dosage, frequency, duration, instructions)
- notes (String)
- diagnosisDate (Date)
- expiryDate (Date)
- timestamps

## Development Phases

### Phase 1: Authentication System ✅
- Login/Signup for patients and doctors
- JWT token implementation
- Password hashing with bcryptjs

### Phase 2: Patient & Doctor Modules (In Progress)
- Patient registration and profile management
- Doctor profile and schedule management
- Medical history tracking

### Phase 3: Appointment System
- Book appointments
- View appointments
- Cancel/reschedule appointments
- Doctor availability

### Phase 4: Prescription System
- Create prescriptions
- Manage medicines and dosage
- View prescription history

### Phase 5: Testing & Deployment
- Unit and integration tests
- Frontend deployment (Vercel/Netlify)
- Backend deployment (Render/VPS)
- Database setup (MongoDB Atlas)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access Control**: Different permissions for patients, doctors, and admins
- **CORS**: Cross-origin request handling
- **Environment Variables**: Sensitive data in .env files
- **Input Validation**: Express validator for request validation

## Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Deployment

### Backend Deployment (Render)
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build settings
4. Deploy

### Database (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create a cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in .env

## Future Enhancements

- [ ] Online payment integration
- [ ] SMS notification system
- [ ] PDF report generation
- [ ] Admin analytics dashboard
- [ ] Video consultation
- [ ] Telemedicine features
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Appointment reminders

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Wait for review and approval

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check MongoDB Atlas connection string
- Verify MONGODB_URI in .env file

### CORS Error
- Check CORS configuration in backend
- Verify frontend API_BASE_URL in .env

### JWT Token Issues
- Ensure JWT_SECRET in .env is set
- Check token expiration time

## Support

For issues or questions, please contact the development team or open an issue on GitHub.

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Last Updated**: March 2026


## Maintenance log
Project tree was cleared and all markdown files were updated on 2026-03-26.
