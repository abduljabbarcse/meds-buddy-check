# MediCare Medication Management App

![{DB351378-AAC8-444D-97C8-76C1DEC6BC69}](https://github.com/user-attachments/assets/fe2ea305-051f-44d5-81a5-0004e40af411)

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

![{CE489BB2-2B4E-410B-B810-59EFD64C8895}](https://github.com/user-attachments/assets/c1235723-1696-4ac7-850f-68f5924d4abc)
![{54F06CFC-716F-4B7A-98BB-9BF736FEE8BE}](https://github.com/user-attachments/assets/7efbeb79-f9fe-4b22-84a9-76fa64ebe17b)
![{96A4AA2D-20C9-4B08-BC04-294563D7BABC}](https://github.com/user-attachments/assets/666dfb39-680b-4028-942d-40b633ea63c3)
![{22735FE0-D48C-4A7F-B779-F19F31349522}](https://github.com/user-attachments/assets/34927bfd-1a30-4635-a4c0-447cd92e113c)

![{F6D48D5A-9D99-45D7-B8FE-2768439DD810}](https://github.com/user-attachments/assets/7315168e-4d1f-4245-aaee-bcd95ee40660)

## Future Improvements

- Push notifications for medication reminders
- Caretaker-patient messaging system
- Advanced analytics dashboard
- Medication refill reminders
```
