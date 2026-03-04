# uConnect

**uConnect** is a streamlined Academic Success & Student Management System. It serves as a central hub for students to manage their academic journey, connect with faculty mentors, and stay on top of their educational requirements.

## Key Features

* **Success Center:** A centralized dashboard for academic status and tracking.
* **Smart Advising:** Seamlessly book and manage sessions with department-specific advisors.
* **Real-time Messaging:** Direct communication channel between students and faculty.
* **Profile Management:** Secure student record management with Supabase integration.
* **Modern UI:** A fast, responsive interface built with React, Tailwind CSS, and Framer Motion.

## Tech Stack

* **Frontend:** React (Vite)
* **Styling:** Tailwind CSS + Lucide Icons
* **Backend/Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth
* **Deployment:** Lovable / Vercel

## Getting Started

1. **Clone & Install**
```sh
git clone <YOUR_GIT_URL>
cd uConnect
npm install

```


2. **Environment Setup**
Create a `.env` file in the root and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key

```


3. **Run Development**
```sh
npm run dev