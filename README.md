# StaffSync1 - Human Resource Management System (HRM)

An enterprise-grade, comprehensive Human Resource Management System built with React, TypeScript, Tailwind CSS, Express architecture, and simulated JWT authentication.

## 🌟 Key Features

### 1. Role-Based Access Control (RBAC)
- **HR Personnel Portal**: Full workforce oversight, personnel directory CRUD operations, organizational attendance tracking, master leave queue clearances, company bulletin board publishing, and executive workforce reports.
- **Team Manager Portal**: Direct report roster oversight, 1-click team leave approval/rejection with decision remarks, team punch status, and team skill development tracking.
- **Employee Self-Service**: Biometric/web punch clock with live elapsed shift timer, leave quota tracking (Casual, Sick, Earned, Maternity/Paternity, Unpaid), leave application workflow with automatic business day computation, company announcements, and training program enrollments.

### 2. Core Modules
- **Authentication & Security**: Simulated HMAC SHA-256 JWT generation with role payload claims (`sub`, `role`, `email`, `iat`, `exp`), credential sign-in, and 1-click persona switching.
- **Employee Directory**: Filterable by department and role, comprehensive profile drawer (contact, residential, compensation, emergency contacts, competencies).
- **Attendance & Time Logs**: Real-time punch in/out, work mode tracking (In-Office, Remote/VPN, Hybrid), daily hours computation, and CSV export.
- **Leave Management**: Automated business day computation (excluding weekends), quota balances, review queue with decision remarks, and balance deduction upon approval.
- **Announcements**: Categorized bulletins (General, Policy, Holiday, Urgent) with priority tagging and pin-to-top controls.
- **Training Hub**: Course catalog with capacity limits, learning outcomes, and 1-click enroll/withdraw actions.
- **Executive Analytics & Reporting**: Department headcount distribution, annual gross payroll estimation, compliance rates, and CSV data export.
- **System Test & QA Console**: Built-in test runner validating Authentication, Attendance math, Leave state transitions, Employee schema integrity, and Dashboard metrics.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **State & Data Layer**: In-memory & LocalStorage persisted service with RESTful CRUD methods
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/en24cs3011179-dev/StaffSync1.git

# Navigate to project directory
cd StaffSync1

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📄 License
MIT License.
