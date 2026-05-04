# Neurolab Inc

Neurolab builds clinical-grade neural interfaces engineered for precision, safety, and the next era of human-computer interaction. The Neurolab AI Platform is a comprehensive web application providing real-time telemetry, diagnostic analysis, and patient management.

## 🚀 Core Modules

### Dashboard & Patient Management
A centralized hub for managing patient rosters, upcoming schedules, and recent analysis reports.

![Dashboard](public/screenshots/dashboard.png)

### Clinical Diagnostics
Real-time, high-fidelity visualization of live EEG data streams. Features hardware configuration for various 10-20 systems, dynamic noise filtering, and anomaly detection.

![Clinical Diagnostics](public/screenshots/diagnostics.png)

### Offline Uploads & Analysis
Allows physicians to upload offline EDF/CSV neural recordings. The platform leverages advanced AI backends to parse the data, detect anomalies, and generate comprehensive PDF clinical reports.

![Offline Uploads](public/screenshots/uploads.png)

### Chat Interface
A dedicated chat module for direct communication and decision support interactions, seamlessly integrated with the platform's diagnostic tools.

![Chat Module](public/screenshots/chat.png)

## 🛠 Tech Stack

Our platform is built with a modern, high-performance web stack:

- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS with Framer Motion for micro-animations
- **UI Components**: Shadcn UI (Radix UI primitives)
- **State Management**: Zustand (Global state) & React Query (Server state)
- **Data Visualization**: Recharts & custom High-DPI Canvas engines
- **Forms & Validation**: React Hook Form with Zod

## 🛡 Security & Quality
We adhere to strict code quality and security standards, ensuring cryptographically secure random number generation and passing rigorous CodeQL security scans.

## 💻 Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
