# BookStore MERN Project

## Project Overview

BookStore is a full-stack web application built using the MERN (MongoDB, Express.js, React, Node.js) stack. This project provides a comprehensive bookstore platform with features for both users and administrators.

## Key Features

- User-friendly book browsing and purchasing
- Shopping cart functionality
- Cash-on-delivery payment system
- Secure admin dashboard
- Robust inventory management
- Book upload and management for administrators

## Technologies Used

- Frontend:

  - React
  - Redux
  - RTK Query Toolkit
  - Tailwind CSS

- Backend:

  - Node.js
  - Express.js
  - Mongoose
  - JWT (JSON Web Tokens)

- Database:
  - MongoDB

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/devhysterical/BookStore_MERN.git
cd BookStore_MERN
```

### 2. Install Dependencies

#### Backend Dependencies

```bash
cd backend
npm install
```

#### Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Running the Application

#### Start Backend Server

```bash
cd backend
npm start
```

#### Start Frontend Development Server

```bash
cd frontend
npm start
```

## Project Structure

```
BookStore_MERN/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── redux/
│       └── App.js
│
└── README.md
```

## Admin Dashboard Access

- Username: admin
- Password: admin123 (Please change this in production)

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner

## Deployment

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Deploy backend and frontend to your preferred hosting platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
