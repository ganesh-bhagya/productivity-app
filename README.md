# Productivity App

A personal productivity web app to track daily tasks and habits. Built as a Progressive Web App (PWA) with React frontend and NestJS backend.

## Features

- ✅ **Task Management**: Create, edit, and track tasks with categories, time blocks, and effort estimates
- ✅ **Habit Tracking**: Build habits with daily/weekly targets and streak tracking
- ✅ **Daily & Weekly Views**: Timeline and checklist layouts for task organization
- ✅ **Analytics Dashboard**: Weekly/monthly stats with charts and progress tracking
- ✅ **Routine Templates**: Pre-configure weekday/weekend templates for quick task setup
- ✅ **PWA Support**: Installable app with offline support and service worker caching
- ✅ **Mobile-First Design**: Responsive UI optimized for mobile devices

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router v6
- Zustand (state management)
- Axios (API client)
- Recharts (analytics charts)
- date-fns (date utilities)
- Vite PWA Plugin

### Backend
- NestJS 10 + TypeScript
- TypeORM (ORM)
- MySQL 8
- JWT Authentication
- Passport.js
- class-validator & class-transformer

## Project Structure

```
productivity-app/
├── backend/          # NestJS backend API
│   ├── src/
│   │   ├── auth/    # Authentication module
│   │   ├── tasks/   # Tasks CRUD
│   │   ├── habits/  # Habits & check-ins
│   │   ├── stats/   # Analytics & statistics
│   │   ├── templates/ # Routine templates
│   │   └── common/  # Shared entities, guards, decorators
│   └── package.json
├── frontend/        # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service
│   │   ├── store/      # Zustand stores
│   │   └── types/      # TypeScript types
│   └── package.json
└── docker-compose.yml # MySQL database setup
```

## Prerequisites

- Node.js 18+ and npm
- MySQL 8 installed and running

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd productivity-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

Create a MySQL database and user:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE productivity_db;

-- Create user and grant permissions
CREATE USER 'productivity_user'@'localhost' IDENTIFIED BY 'productivity_pass';
GRANT ALL PRIVILEGES ON productivity_db.* TO 'productivity_user'@'localhost';
FLUSH PRIVILEGES;
```

Alternatively, if you have MySQL installed, you can use any existing database and credentials. Just update the `.env` file accordingly.

### 3. Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=productivity_user
DB_PASSWORD=productivity_pass
DB_DATABASE=productivity_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

**Important**: Change the JWT secrets in production!

### 4. Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### 5. Run the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 6. Access the App

Open your browser and navigate to `http://localhost:5173`

1. Register a new account
2. Start creating tasks and habits!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get tasks (with filters: date, category, status, time_block, start_date, end_date)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/bulk-create` - Create multiple tasks

### Habits
- `GET /api/habits` - Get habits (optional: active_only=true)
- `GET /api/habits/:id` - Get single habit
- `POST /api/habits` - Create habit
- `PATCH /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/checkin` - Check in to habit
- `GET /api/habits/:id/checkins` - Get habit check-ins (optional: start_date, end_date)

### Statistics
- `GET /api/stats/weekly?week=YYYY-MM-DD` - Weekly statistics
- `GET /api/stats/habits?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Habits statistics
- `GET /api/stats/monthly?month=YYYY-MM` - Monthly statistics

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get single template
- `POST /api/templates` - Create template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/apply?date=YYYY-MM-DD` - Apply template to a date

## Database Schema

The app uses the following main tables:
- `users` - User accounts
- `tasks` - Tasks with categories, time blocks, and status
- `habits` - Habit definitions
- `habit_checkins` - Daily habit check-ins
- `routine_templates` - Routine templates
- `template_blocks` - Template time blocks

TypeORM will auto-sync the schema in development mode. For production, use migrations.

## PWA Features

The app is a Progressive Web App with:
- **Installable**: Can be installed on mobile devices and desktop
- **Offline Support**: Basic offline functionality with service worker
- **Caching**: Static assets and API responses are cached
- **Manifest**: App manifest for install prompt

To install:
- **Mobile**: Use browser's "Add to Home Screen" option
- **Desktop**: Use browser's install prompt (Chrome/Edge)

## Production Build

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`. Serve with a static file server (nginx, etc.).

## Development Tips

1. **Database**: TypeORM auto-syncs in development. For production, disable `synchronize` and use migrations.
2. **JWT Tokens**: Access tokens expire in 15 minutes. Refresh tokens last 7 days.
3. **Time Blocks**: Tasks are organized by time blocks (morning, work-hours, evening, late-night, weekend).
4. **Habit Streaks**: Streaks are calculated based on consecutive daily check-ins.
5. **Templates**: Create templates for your typical weekday/weekend routines for quick task setup.

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running: `mysql -u root -p` or check your system's MySQL service
- Check database credentials in `.env` match your MySQL setup
- Verify MySQL is accessible on port 3306
- Ensure the database `productivity_db` exists

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend CORS is enabled in `main.ts`

### JWT Token Issues
- Clear localStorage and re-login
- Check JWT secrets in backend `.env`
- Verify token expiration settings

## License

MIT

## Contributing

This is a personal project, but feel free to fork and customize for your needs!

# productivity-app
