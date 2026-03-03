# uConnect - Setup Instructions

## Project Overview

uConnect is a complete academic management system built with React, Supabase, and the Refined Academic design system. This platform provides students with a unified hub for courses, schedules, payments, advising, events, clubs, and skill challenges.

## Design System

The application follows the **Refined Academic** design system with the following exact colors:

- **Background**: `#F8F7F4` (Warm off-white)
- **Card Borders**: `#E8E4DE` (Subtle warm gray)
- **Sidebar**: `#1C1917` (Deep charcoal)
- **Sidebar Borders**: `#292524` (Lighter charcoal)
- **Primary Blue**: `#2563EB` (Professional blue)
- **Accent Amber**: `#F59E0B` (Warm amber)
- **Text Primary**: `#1C1917` (Charcoal)
- **Text Secondary**: `#78716C` (Medium gray)
- **Text Muted**: `#A8A29E` (Light gray)

**Typography**:
- Headings: Fraunces (serif)
- Body: DM Sans / Plus Jakarta Sans (sans-serif)

## Technology Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: React Context API
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Active Supabase account with project set up

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**

   The `.env` file is already configured with the Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://msddzxzwxnykpkdwyxle.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_P3egFJPX-GPmJGZiJ-_uAA_9lt-3gtZ
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Authentication

### Demo Account

For testing purposes, a demo account is available:
- **Email**: demo@uconnect.edu
- **Password**: Demo1234!

Use the "Continue with demo account" button on the login page for quick access.

### User Registration

1. Navigate to `/register`
2. Enter full name, email, and password (minimum 6 characters)
3. Submit the form
4. Check email for verification link
5. Click the verification link to activate account
6. Return to `/login` and sign in

### Sign In Flow

1. Navigate to `/login`
2. Enter email and password
3. Click "Sign in" or use demo account button
4. Redirected to `/app/dashboard` upon successful authentication

## Application Structure

### Public Routes
- `/` - Landing page with hero, features, and skill arena highlights
- `/login` - Authentication page with email/password and demo login
- `/register` - User registration with email verification

### Protected Routes (require authentication)
All protected routes are prefixed with `/app/`:

- `/app/dashboard` - Main dashboard with stats, activity, and events
- `/app/courses` - View enrolled courses with progress tracking
- `/app/enrollment` - Browse and enroll in available courses
- `/app/payments` - Payment history and pending transactions
- `/app/advising` - Academic advisor information and messaging
- `/app/events` - Campus events calendar and registration
- `/app/clubs` - Student organizations and club memberships
- `/app/skill-arena` - Coding challenges and leaderboard
- `/app/settings` - User profile and account settings

## Key Features

### Real-time Updates
- Live enrollment changes
- Real-time leaderboard updates
- Message notifications
- Event registration counts

### Session Persistence
- Auto-refresh tokens
- Persistent sessions across browser restarts
- Secure localStorage-based session management

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1400px)
- Touch-friendly interface
- Optimized for all screen sizes

## File Structure

```
src/
├── components/
│   ├── Layout.jsx           # Main layout wrapper
│   ├── Sidebar.jsx          # Navigation sidebar
│   └── ProtectedRoute.jsx   # Route protection wrapper
├── contexts/
│   └── AuthContext.jsx      # Authentication state management
├── lib/
│   └── supabaseClient.js    # Supabase configuration
├── pages/
│   ├── Landing.jsx          # Public landing page
│   ├── Login.jsx            # Sign in page
│   ├── Register.jsx         # Registration page
│   ├── Dashboard.jsx        # Main dashboard
│   ├── Courses.jsx          # Course management
│   ├── Enrollment.jsx       # Course enrollment
│   ├── Payments.jsx         # Payment history
│   ├── Advising.jsx         # Academic advising
│   ├── Events.jsx           # Campus events
│   ├── Clubs.jsx            # Student clubs
│   ├── SkillArena.jsx       # Coding challenges
│   ├── Settings.jsx         # User settings
│   ├── Index.jsx            # Route redirector
│   └── NotFound.jsx         # 404 page
├── App.jsx                  # Main app component with routing
├── main.jsx                 # Application entry point
└── index.css                # Global styles with CSS variables
```

## Supabase Configuration

### Database Tables (Required)

The application expects the following Supabase tables to be set up:

1. **profiles** - User profile information
2. **courses** - Course catalog
3. **enrollments** - Student course enrollments
4. **payments** - Payment records
5. **advisors** - Academic advisors
6. **advising_sessions** - Advising appointments
7. **messages** - Messaging system
8. **events** - Campus events
9. **event_registrations** - Event attendance
10. **clubs** - Student organizations
11. **club_memberships** - Club memberships
12. **skill_challenges** - Coding challenges
13. **challenge_submissions** - Challenge submissions
14. **leaderboard** - Skill arena rankings

### Row Level Security (RLS)

Ensure RLS policies are configured for all tables to restrict access to authenticated users and their own data.

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure all TypeScript files (.ts/.tsx) have been removed
   - Verify `tailwind.config.js` exists (not .ts)
   - Check that `index.html` references `/src/main.jsx` (not .tsx)

2. **Authentication Issues**
   - Verify `.env` file contains correct Supabase credentials
   - Check Supabase dashboard for authentication settings
   - Ensure email confirmation is configured in Supabase

3. **Route Issues**
   - Clear browser cache and localStorage
   - Verify all routes in `App.jsx` are correct
   - Check that ProtectedRoute wrapper is applied to private routes

4. **Styling Issues**
   - Run `npm run dev` to ensure Tailwind is compiling
   - Check browser console for CSS errors
   - Verify `index.css` is imported in `main.jsx`

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Keep components focused and reusable
- Use descriptive variable and function names
- Comment complex logic

### Color Usage
- Always use exact hex values from the design system
- Avoid using arbitrary colors
- Maintain consistent spacing with Tailwind utilities

### Component Guidelines
- Extract reusable components
- Props should be clearly defined
- Handle loading and error states
- Implement proper accessibility

## Testing

### Manual Testing Checklist

- [ ] Landing page loads correctly
- [ ] Login with demo account works
- [ ] User registration flow completes
- [ ] Email verification link received
- [ ] Dashboard displays after login
- [ ] All navigation links work
- [ ] Sidebar navigation functions
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout functionality works
- [ ] Session persists across page refreshes

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains production-ready files

3. Deploy to your preferred hosting platform:
   - Vercel
   - Netlify
   - AWS Amplify
   - Firebase Hosting

4. Configure environment variables on hosting platform

5. Set up custom domain (optional)

## Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase documentation for auth issues
- Verify all environment variables are correct
- Ensure database tables are properly configured

## License

This project is for educational and demonstration purposes.
