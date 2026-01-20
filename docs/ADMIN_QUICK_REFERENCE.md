# NeuroLab Admin MVP - Quick Reference Guide

## 📍 Access Points

| Feature | URL | Route |
|---------|-----|-------|
| **Main Admin Portal** | `/admin` | AdminDashboard |
| **User Management** | `/admin/users` (Tab: Users) | AdminUsersPage |
| **Clinic Management** | `/admin/users` (Tab: Clinics) | AdminUsersPage |
| **Billing Management** | `/admin/users` (Tab: Billing) | AdminUsersPage |

## 🎛️ Component Quick Reference

### UserManagement.tsx
**Location:** `src/components/admin/UserManagement.tsx`
**Functions:**
- `handleCreateUser()` - Add new user
- `handleUpdateUser()` - Edit user
- `handleDeleteUser()` - Disable user
- `handleCSVImport()` - Bulk import from CSV

**Dialogs:**
- Create User Dialog
- Edit User Dialog  
- Import CSV Dialog

### ClinicManagement.tsx
**Location:** `src/components/admin/ClinicManagement.tsx`
**Functions:**
- `handleCreateClinic()` - Register clinic
- `handleUpdateClinic()` - Update clinic info
- `handleDeleteClinic()` - Remove clinic
- `handleVerifyClinic()` - Toggle verification

**Pre-loaded Clinics:**
- Ndera Hospital (Verified)
- King Faisal Hospital (Verified)

### BillingManagement.tsx
**Location:** `src/components/admin/BillingManagement.tsx`
**Functions:**
- `handleCreateRate()` - Add pricing tier
- `handleUpdateRate()` - Modify rate
- `handleDeleteRate()` - Remove rate
- `calculateMarkup()` - Auto-calc RSSB markup

**Dashboard Widgets:**
- Total Active Rates
- Average RSSB Fee
- Est. Monthly Revenue

## 📊 Data Models

### User
```typescript
{
  id: string;
  email: string;
  fullName: string;
  role: 'patient' | 'doctor' | 'admin';
  clinic?: string;
  status?: 'active' | 'disabled';
  createdAt?: string;
}
```

### Clinic
```typescript
{
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  contactPerson: string;
  hardwareType?: string;  // "Nihon Kohden EEG-1000" etc
  verified: boolean;
  credentialsSubmitted: boolean;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
}
```

### BillingRate
```typescript
{
  id: string;
  code: string;               // "A01"
  diagnosis: string;          // Service name
  basePrice: number;          // Base cost
  rssbFee: number;           // RSSB-aligned price
  description?: string;
  category: 'consultation' | 'eeg_basic' | 'eeg_detailed' | 'report' | 'teleconsult';
  createdAt?: string;
}
```

## 🔄 State Management

All components use **React State** (useState) for mock data:
- User state stored in UserManagement component
- Clinic state stored in ClinicManagement component
- Billing state stored in BillingManagement component

⚠️ **Note:** Data is lost on page refresh (intentional for MVP)

## 📥 CSV Import Specification

**Filename:** `users_import.csv`
**Format:** Comma-separated values

**Required Columns:**
1. `email` - Valid email address
2. `fullname` - User's full name
3. `role` - One of: `patient`, `doctor`, `admin`

**Example:**
```csv
email,fullname,role
patient1@hospital.rw,Patient One,patient
dr.john@hospital.rw,Dr. John,doctor
admin@hospital.rw,Admin,admin
```

**Location:** `/docs/users_import_template.csv`

## 🎯 Default RSSB Rates

| Code | Service | Base | RSSB | Markup |
|------|---------|------|------|--------|
| A01 | General Consultation | $20 | $25 | 25% |
| B02 | EEG (Basic) | $45 | $55 | 22% |
| C03 | EEG (Detailed) | $120 | $150 | 25% |
| D04 | Clinical Report | $30 | $40 | 33% |
| E05 | Teleconsultation | $35 | $45 | 29% |

## 🇷🇼 Rwanda Data

**Pre-loaded Clinics:**
- **Ndera Hospital**
  - Location: Kigali
  - Coordinates: -1.944°, 30.055°
  - Hardware: Nihon Kohden EEG-1000
  - Status: Verified

- **King Faisal Hospital**
  - Location: Kigali
  - Coordinates: -1.943°, 30.059°
  - Hardware: Nihon Kohden EEG-1200
  - Status: Verified

## 🔌 Backend Integration Checklist

- [ ] Connect User APIs (`POST /api/admin/users`, `PUT`, `DELETE`, etc.)
- [ ] Connect Clinic APIs (`POST /api/admin/clinics`, `PUT`, `DELETE`, `PATCH`)
- [ ] Connect Billing APIs (`POST /api/admin/billing/rates`, `PUT`, `DELETE`)
- [ ] Add authentication/authorization
- [ ] Implement role-based access control
- [ ] Add request loading states
- [ ] Add error boundary
- [ ] Implement audit logging
- [ ] Add data persistence

## 🎨 UI Components Used

From ShadCN UI library:
- `Button` - All action buttons
- `Card` - Container panels
- `Input` - Text fields
- `Select` - Dropdown menus
- `Dialog` - Modal dialogs
- `Textarea` - Multi-line text
- `Label` - Form labels
- `Alert` - Error messages
- `Tabs` - Navigation tabs
- `Badge` - Status indicators

## 🚨 Error Handling

All components use:
- `try/catch` blocks for async operations
- `useToast()` hook for notifications
- Form validation before submission
- Confirmation dialogs for destructive actions

Example toast usage:
```typescript
toast({ 
  title: 'Success', 
  description: 'User created' 
});

toast({ 
  title: 'Error', 
  description: 'Failed to save', 
  variant: 'destructive' 
});
```

## 📱 Responsive Design

- Mobile: Stacked layout, tab icons only
- Tablet: Grid layouts (2-col), partial text
- Desktop: Full tables/grids, full descriptions

## 🔐 Security Notes

**Frontend (Currently):**
- Form validation
- Confirmation dialogs
- Role-based UI (placeholder)

**Backend (Required):**
- JWT/session authentication
- Admin role enforcement
- Rate limiting on imports
- Input sanitization
- Audit logging
- Data encryption

## 📝 Common Tasks

### Add a User
1. Click "Create User" button
2. Fill email, fullname, role
3. Click "Create User"
4. See toast notification

### Import Users
1. Click "Import CSV" button
2. Select `users_import.csv`
3. Click "Import Users"
4. See users added to table

### Register Clinic
1. Click "Add Clinic" button
2. Fill clinic details
3. Select hardware type
4. Click "Add Clinic"

### Adjust Billing Rate
1. Click "Edit" on a rate
2. Update RSSB fee
3. Markup % auto-calculates
4. Click "Update Rate"

## 🐛 Troubleshooting

**Data disappears on refresh:**
- Expected behavior (mock data)
- Backend persistence will fix this

**Form won't submit:**
- Check required fields marked with *
- Verify email format
- See browser console for errors

**Missing component warning:**
- Ensure all UI imports exist in `src/components/ui/`
- Check for typos in component names

## 📞 Contact

For questions about:
- **Implementation:** See `/docs/ADMIN_MVP.md`
- **Backend Integration:** Contact dev team
- **Deployment:** Contact DevOps team

---

**Quick Links:**
- [Full Documentation](./ADMIN_MVP.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [CSV Template](./users_import_template.csv)

**Version:** 1.0 MVP
**Last Updated:** January 19, 2026
