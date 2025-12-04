# Quick Setup Guide

## Step-by-Step Setup

### 1. Set up MySQL Database

Make sure MySQL 8 is installed and running on your system.

Create the database and user:

```sql
mysql -u root -p

CREATE DATABASE productivity_db;
CREATE USER 'productivity_user'@'localhost' IDENTIFIED BY 'productivity_pass';
GRANT ALL PRIVILEGES ON productivity_db.* TO 'productivity_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Or use your existing MySQL database - just update the credentials in `backend/.env`.

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example if you have one, or create manually)
# See README.md for .env contents

# Start backend in development mode
npm run start:dev
```

Backend should be running on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with:
# VITE_API_URL=http://localhost:3000/api

# Start frontend
npm run dev
```

Frontend should be running on `http://localhost:5173`

### 4. First Run

1. Open `http://localhost:5173` in your browser
2. Click "Sign up" to create an account
3. Start adding tasks and habits!

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

**Backend**: Change `PORT` in `backend/.env`
**Frontend**: Change port in `frontend/vite.config.ts` (server.port)

### Database Connection Error

1. Check MySQL is running (varies by OS - check your MySQL service)
2. Verify credentials in `backend/.env` match your MySQL setup
3. Ensure the database `productivity_db` exists
4. Try connecting manually: `mysql -u productivity_user -p productivity_db`

### TypeScript Errors

Run `npm install` in both backend and frontend directories to ensure all dependencies are installed.

## Next Steps

- Create your first task
- Set up habits (e.g., "Gym 3x per week", "Read 30 mins daily")
- Create routine templates for quick task setup
- Check out the Analytics page to see your progress!

