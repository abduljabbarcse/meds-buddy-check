# MediCare Medication Management App

![{8361A89D-836F-460E-970F-2D8228559D71}](https://github.com/user-attachments/assets/080627f4-e9e1-4f52-bdc9-ae50d20148ee)

A comprehensive medication management system with role-based access for patients and caretakers, built with React, TypeScript, and Supabase.

## Live Demo

🔗 [View Live Demo on Netlify]([https://your-netlify-site-url.netlify.app](https://meds-buddy-check-task.netlify.app/))

## Features Implemented

### Core Features (Completed)
- **Authentication System**
  - Supabase email/password authentication
  - Role-based access (patient/caretaker)
  - Session management
  - Protected routes

- **Medication Management**
  - Full CRUD operations for medications
  - Patient-specific medication tracking
  - Time-based medication scheduling
  - Calendar visualization

- **Tracking & Analytics**
  - Medication intake logging
  - Adherence rate calculation
  - Streak tracking
  - Daily status indicators

- **Media Uploads**
  - Proof image uploads for medication intake
  - Supabase storage integration

### Technical Highlights
- React Query for data fetching with optimistic updates
- TypeScript end-to-end type safety
- Form validation with react-hook-form
- Responsive UI with Tailwind CSS
- Real-time updates using Supabase subscriptions

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/medicare-app.git
   cd medicare-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file based on `.env.example` with your Supabase credentials

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## Deployment

The application is deployed on Netlify with the following configuration:
- Automatic deploys from main branch
- Environment variables set in Netlify dashboard
- Supabase functions enabled

## Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, ShadCN UI components
- **State Management**: React Query, Zustand
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Testing**: Vitest, React Testing Library
- **Deployment**: Netlify

## Screenshots

![Dashboard](![{D3856C76-7FAF-4B18-A6AC-6D46823898AA}](https://github.com/user-attachments/assets/71f4ce4e-e6cc-4816-bbf1-fb17c30f9a69)
)
![Medication List](![{C9972B28-AB71-4928-A6E2-7BFAFBDF4F3F}](https://github.com/user-attachments/assets/98adedc5-34c5-47b1-ad85-e835f0260236)
)
![Calendar View](![{87EA931F-8A3C-4C71-8BEB-04F6AA7B66B9}](https://github.com/user-attachments/assets/6df4623e-4b58-4f86-a6ce-c9c92eb91e2b)
)
![{F6D48D5A-9D99-45D7-B8FE-2768439DD810}](https://github.com/user-attachments/assets/7315168e-4d1f-4245-aaee-bcd95ee40660)

## Future Improvements

- Push notifications for medication reminders
- Caretaker-patient messaging system
- Advanced analytics dashboard
- Medication refill reminders
```
