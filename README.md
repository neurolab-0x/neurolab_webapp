# Neurolab Platform

Neurolab Platform is the internal web application for managing a clinical neural-interface workflow. It provides separate experiences for patients, doctors, clinics, and administrators so each role can access the tools and data it needs without extra clutter.

The platform is built as a single-page React application with routed portals for:

- Patient onboarding, history, device tracking, appointments, uploads, chat, reviews, and decision support
- Doctor workflows for patient review, analysis, appointments, uploads, certification, and clinical decision support
- Clinic views for patient oversight, device management, and operational stats
- Admin operations for users, devices, sessions, clinics, billing, and partnerships
- Shared account settings, notifications, and calendar integration

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui and Radix UI primitives
- Zustand for client state
- TanStack Query and SWR for data fetching

## Getting Started

```bash
npm install
npm run dev
```

The app runs locally with Vite and is available at the URL shown in the terminal.

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint across the codebase
- `npm run test` runs the Vitest test suite

## Project Structure

- `src/App.tsx` defines the application routes and protected portal layout
- `src/components/` contains shared UI, shell, and auth components
- `src/modules/` contains feature modules for each portal area
- `src/pages/` contains standalone pages such as login, registration, and password recovery
- `src/store/` contains client-side state management

## Notes

- Auth pages are rendered outside the main platform shell.
- Role-based routing keeps patient, doctor, clinic, and admin views isolated.
- The repository includes CI workflows for linting, testing, build checks, security scanning, and dependency reporting.
