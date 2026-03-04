# uConnect - Quick Start Guide

## Get Running in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to: `http://localhost:8080`

## Test the Application

### Option 1: Use Demo Account (Fastest)
1. Click "Sign in" on landing page
2. Click "Continue with demo account" button
3. Access dashboard immediately

**Demo Credentials:**
- Email: `demo@uconnect.edu`
- Password: `Demo1234!`

### Option 2: Create New Account
1. Click "Get Started" or "Request access" on landing page
2. Fill in full name, email, and password (min 6 characters)
3. Submit form
4. Check email for verification link
5. Click verification link
6. Return to login page
7. Sign in with your credentials

## What You'll See

### Landing Page (/)
- Hero section with branding
- Feature highlights
- Skill Arena showcase
- Call-to-action buttons

### Login Page (/login)
- Split-screen design
- Dark sidebar with stats
- Email/password inputs
- Demo account button
- Link to registration

### Dashboard (/app/dashboard)
- Welcome message
- Statistics cards (GPA, courses, deadlines, payments)
- Recent activity feed
- Upcoming events
- Quick actions

### Available Routes
- `/` - Landing page
- `/login` - Sign in
- `/register` - Create account
- `/app/dashboard` - Main dashboard
- `/app/courses` - My courses
- `/app/enrollment` - Course enrollment
- `/app/payments` - Payment history
- `/app/advising` - Academic advising
- `/app/events` - Campus events
- `/app/clubs` - Student clubs
- `/app/skill-arena` - Coding challenges
- `/app/settings` - User settings

## Troubleshooting

### Port Already in Use
If port 8080 is taken, Vite will automatically use the next available port.

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Authentication Issues
1. Check `.env` file exists with Supabase credentials
2. Verify Supabase project is active
3. Check browser console for errors

### Environment Variables Not Loading
```bash
# Restart dev server after changing .env
npm run dev
```

## Project Structure Overview

```
src/
├── pages/           # All page components
├── components/      # Reusable components (Layout, Sidebar, etc.)
├── contexts/        # React context providers (Auth)
├── lib/            # Utilities and configurations (Supabase)
├── App.jsx         # Main app with routing
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## Key Files

- **`.env`** - Environment variables (Supabase credentials)
- **`src/App.jsx`** - Application routes
- **`src/contexts/AuthContext.jsx`** - Authentication logic
- **`src/lib/supabaseClient.js`** - Supabase configuration
- **`tailwind.config.js`** - Design system configuration

## Design System

### Colors
- Background: `#F8F7F4`
- Sidebar: `#1C1917`
- Primary Blue: `#2563EB`
- Accent Amber: `#F59E0B`

### Typography
- Headings: Fraunces (serif)
- Body: DM Sans (sans-serif)

## Next Steps

1. Explore the different pages
2. Test navigation between routes
3. Try enrolling in courses
4. Check the skill arena leaderboard
5. Update your profile in settings

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Need More Help?

- See `SETUP.md` for detailed installation guide
- See `DESIGN_SYSTEM.md` for styling guidelines
- See `PROJECT_SUMMARY.md` for complete overview

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Features to Explore

- Real-time updates on enrollment
- Interactive skill challenges
- Event registration
- Club memberships
- Payment tracking
- Academic advising messaging
- Course progress tracking

Enjoy using uConnect!
