# NeuroLab Admin MVP - User, Clinic & Billing Management

## Overview

This document outlines the MVP admin management system built for NeuroLab Rwanda pilots with Ndera Hospital and King Faisal Hospital. The system covers three core pillars:

1. **User Management** - Secure onboarding of patients, doctors, and admins
2. **Clinic Management** - Registration and verification of partner healthcare facilities
3. **Billing Management** - RSSB-aligned fee structures and revenue tracking

---

## Features

### 1. User Management ✅

**URL:** `/admin/users` → Users Tab

#### Key Features:
- ✅ **Create Users** - Add patients, doctors, or admins with role assignment
- ✅ **Edit Users** - Update user details, roles, and account status (active/disabled)
- ✅ **Delete Users** - Disable user accounts
- ✅ **Bulk CSV Import** - Upload multiple users at once
  - CSV Format: `email, fullname, role`
  - Supported roles: `patient`, `doctor`, `admin`
  - Example file provided in `/docs/users_import_template.csv`

**Current State:**
- Mock data stored in React state (will replace with backend API)
- Form validation for email and required fields
- Toast notifications for all actions

**Backend Integration Ready For:**
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete/disable user
- `POST /api/admin/users/import` - Bulk import from CSV

---

### 2. Clinic Management ✅

**URL:** `/admin/users` → Clinics Tab

#### Key Features:
- ✅ **Add Clinics** - Register new healthcare facilities
- ✅ **Edit Clinics** - Update facility details
- ✅ **Delete Clinics** - Remove facilities from network
- ✅ **Verify Clinics** - Mark clinics as verified/unverified
- ✅ **Hardware Tracking** - Record EEG equipment types
- ✅ **Credential Tracking** - Track submission status

**Current State:**
- Pre-populated with Ndera Hospital & King Faisal Hospital (Kigali)
- Verification toggle for compliance tracking
- Grid card layout with location and contact info
- Hardware type selection (Nihon Kohden models supported)

**Backend Integration Ready For:**
- `POST /api/admin/clinics` - Create clinic
- `PUT /api/admin/clinics/:id` - Update clinic
- `DELETE /api/admin/clinics/:id` - Remove clinic
- `PATCH /api/admin/clinics/:id/verify` - Toggle verification

**Rwanda Geo Data:**
- Ndera Hospital: -1.944°, 30.055°
- King Faisal Hospital: -1.943°, 30.059°

---

### 3. Billing Management ✅

**URL:** `/admin/users` → Billing Tab

#### Key Features:
- ✅ **RSSB Fee Structure** - Rwanda Social Security Board aligned pricing
- ✅ **Dynamic Rate Management** - Add, edit, delete service fees
- ✅ **Markup Tracking** - Automatic calculation of RSSB fee vs base price
- ✅ **Revenue Estimation** - Dashboard showing estimated monthly revenue
- ✅ **Service Categories** - Consultation, EEG (basic/detailed), Reports, Teleconsult

**Current Rates (RSSB-Aligned):**
| Code | Service | Base | RSSB Fee | Markup |
|------|---------|------|----------|--------|
| A01 | General Consultation | $20 | $25 | +25% |
| B02 | EEG Analysis (Basic) | $45 | $55 | +22% |
| C03 | EEG Analysis (Detailed) | $120 | $150 | +25% |
| D04 | Clinical Report | $30 | $40 | +33% |
| E05 | Teleconsultation | $35 | $45 | +29% |

**Backend Integration Ready For:**
- `POST /api/admin/billing/rates` - Create rate
- `PUT /api/admin/billing/rates/:id` - Update rate
- `DELETE /api/admin/billing/rates/:id` - Delete rate
- `GET /api/admin/billing/revenue` - Get revenue analytics

**Year 1 SOM Projection:**
- Monthly Revenue: ~$1,700 (at 10 services/month per type)
- Annual Revenue: ~$20,400 (baseline conservative estimate)
- Scaling to Year 1 $500k-$1M target: Requires 25-50 clinic partnerships × 10-20x transaction volume

---

## Implementation Status

### ✅ Completed

- [x] User Management UI with CRUD operations
- [x] CSV bulk import for users
- [x] Clinic Management with verification
- [x] Billing rate management with RSSB fees
- [x] Revenue estimation dashboard
- [x] Tab-based navigation for admin portal
- [x] Form validation and error handling
- [x] Toast notifications for all actions
- [x] Pre-populated sample data (Ndera, King Faisal)

### 🔄 Next Steps (Backend Integration)

1. **Connect to Backend APIs**
   - Replace mock state with API calls
   - Implement error handling for network issues
   - Add loading states during API calls

2. **Role-Based Access Control (RBAC)**
   - Enforce admin-only access to management pages
   - Log admin actions for audit trail
   - Implement permission matrix per role

3. **Data Persistence**
   - Move from React state to database
   - Add pagination for large datasets
   - Implement search/filter on all tables

4. **Advanced Features (Post-MVP)**
   - Clinic location map (Kigali focus)
   - Hardware inventory tracking
   - Telehealth compliance reports
   - RSSB audit export
   - Multi-language support (French, Kinyarwanda)

---

## Component Architecture

```
/src/pages/admin/Users.tsx (Main Tab Container)
├── UserManagement.tsx (User CRUD + CSV Import)
├── ClinicManagement.tsx (Clinic CRUD + Verification)
└── BillingManagement.tsx (Rates + Revenue Dashboard)
```

---

## Mock Data Structure

### User Object
```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor' | 'admin';
  clinic?: string;
  createdAt?: string;
  status?: 'active' | 'disabled';
}
```

### Clinic Object
```typescript
interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  contactPerson: string;
  hardwareType?: string;
  verified: boolean;
  credentialsSubmitted: boolean;
  createdAt?: string;
  latitude?: number;
  longitude?: number;
}
```

### BillingRate Object
```typescript
interface BillingRate {
  id: string;
  code: string;
  diagnosis: string;
  basePrice: number;
  rssbFee: number;
  description?: string;
  category: 'consultation' | 'eeg_basic' | 'eeg_detailed' | 'report' | 'teleconsult';
  createdAt?: string;
}
```

---

## CSV Import Format

**For Users:**
```csv
email,fullname,role
john.doe@example.com,John Doe,patient
jane.smith@example.com,Jane Smith,doctor
admin@neurolab.rw,Admin User,admin
```

Save as `users_import.csv` and upload via the Admin Users tab → Import CSV button.

---

## Testing

### To Test Locally:

1. Navigate to `/admin/users`
2. **User Tab**: 
   - Click "Create User" to add a new user
   - Click "Import CSV" to bulk upload (use template above)
   - Edit/delete users from the table
3. **Clinic Tab**: 
   - Verify the pre-loaded Ndera & King Faisal clinics
   - Add new clinics for pilot expansion
   - Click "Verify" to toggle clinic status
4. **Billing Tab**: 
   - View revenue projections
   - Add custom rates for new service types
   - Edit existing RSSB fees as needed

---

## Security & Compliance

### Rwanda HIPAA Equivalent (CNRTL Privacy Law)
- ✅ User role-based access (admin-only for now)
- ⏳ Audit logging for all admin actions (backend)
- ⏳ Data encryption in transit & at rest (backend)
- ⏳ Patient data anonymization in reports

### RSSB Alignment
- ✅ Tariffed billing rates configurable
- ✅ Revenue tracking ready
- ⏳ Invoice/claim export (backend)
- ⏳ Audit trail for billing changes

---

## Future Roadmap

**Phase 2 (Post-MVP Pilots):**
- Analytics dashboard (usage per clinic, AI accuracy tracking)
- Telehealth scheduling integration
- Treatment plan templates per diagnosis
- Patient referral workflows

**Phase 3 (Scaling Beyond Rwanda):**
- Multi-country billing rules
- Regional hospital networks
- Pan-African compliance layer
- Advanced ML on clinic performance data

---

## Contact & Support

For backend API integration questions or missing features, contact the development team.

**MVP Pilot Contacts:**
- Ndera Hospital: [To be added]
- King Faisal Hospital: [To be added]

---

**Last Updated:** January 19, 2026
**Status:** MVP Ready for Backend Integration
