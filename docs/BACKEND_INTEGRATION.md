# NeuroLab Admin MVP - Backend Integration Guide

## 🔗 API Endpoints Required

### User Management APIs

#### 1. Get All Users
```
GET /api/admin/users
Response: User[]
```

#### 2. Create User
```
POST /api/admin/users
Body: {
  email: string (required, unique)
  fullName: string (required)
  role: 'patient' | 'doctor' | 'admin' (required)
}
Response: User (with id, createdAt)
Error: 400/409 if invalid/duplicate
```

#### 3. Update User
```
PUT /api/admin/users/:id
Body: {
  email?: string
  fullName?: string
  role?: 'patient' | 'doctor' | 'admin'
  status?: 'active' | 'disabled'
}
Response: User (updated)
Error: 404 if not found
```

#### 4. Delete/Disable User
```
DELETE /api/admin/users/:id
Response: { success: true }
Error: 404 if not found
```

#### 5. Bulk Import Users
```
POST /api/admin/users/import
Body: FormData {
  file: File (CSV)
}
CSV Format: email,fullname,role

Response: {
  imported: number
  errors: { row: number, error: string }[]
}
Error: 400 if invalid format
```

---

### Clinic Management APIs

#### 1. Get All Clinics
```
GET /api/admin/clinics
Response: Clinic[]
```

#### 2. Create Clinic
```
POST /api/admin/clinics
Body: {
  name: string (required)
  address: string
  city: string (required)
  phone: string
  contactPerson: string
  hardwareType?: string
  credentialsSubmitted?: boolean
}
Response: Clinic (with id, createdAt, verified=false by default)
Error: 400 if invalid
```

#### 3. Update Clinic
```
PUT /api/admin/clinics/:id
Body: {
  name?: string
  address?: string
  city?: string
  phone?: string
  contactPerson?: string
  hardwareType?: string
  credentialsSubmitted?: boolean
}
Response: Clinic (updated)
Error: 404 if not found
```

#### 4. Delete Clinic
```
DELETE /api/admin/clinics/:id
Response: { success: true }
Error: 404 if not found
```

#### 5. Verify/Unverify Clinic
```
PATCH /api/admin/clinics/:id/verify
Body: { verified: boolean }
Response: Clinic (updated)
Error: 404 if not found
```

---

### Billing Management APIs

#### 1. Get All Billing Rates
```
GET /api/admin/billing/rates
Response: BillingRate[]
```

#### 2. Create Billing Rate
```
POST /api/admin/billing/rates
Body: {
  code: string (required, unique)
  diagnosis: string (required)
  basePrice: number (required)
  rssbFee: number (required)
  category: 'consultation' | 'eeg_basic' | 'eeg_detailed' | 'report' | 'teleconsult'
  description?: string
}
Response: BillingRate (with id, createdAt)
Error: 400/409 if invalid/duplicate
```

#### 3. Update Billing Rate
```
PUT /api/admin/billing/rates/:id
Body: {
  code?: string
  diagnosis?: string
  basePrice?: number
  rssbFee?: number
  category?: string
  description?: string
}
Response: BillingRate (updated)
Error: 404 if not found
```

#### 4. Delete Billing Rate
```
DELETE /api/admin/billing/rates/:id
Response: { success: true }
Error: 404 if not found
```

#### 5. Get Revenue Analytics
```
GET /api/admin/billing/revenue?period=monthly
Response: {
  totalRevenue: number
  byService: { [category]: number }
  byClinic?: { [clinicId]: number }
  trend?: { date: string, revenue: number }[]
}
```

---

## 🔐 Authentication & Authorization

### Requirements

1. **JWT Token Validation**
   - All endpoints require valid JWT in Authorization header
   - Token format: `Authorization: Bearer <token>`

2. **Role-Based Access Control (RBAC)**
   - Only users with role `admin` can access `/api/admin/*` endpoints
   - Enforce at middleware level (before reaching handlers)

3. **Audit Logging**
   - Log all admin actions with: `admin_id`, `action`, `resource`, `timestamp`
   - Example: "admin@neurolab.rw created user patient1@hospital.rw"

### Example Middleware
```typescript
// Backend (pseudo-code)
const adminOnly = (req, res, next) => {
  const user = req.user; // From JWT token
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};
```

---

## 📝 Data Validation Rules

### User Validation
- Email: Must be valid format, unique
- Full Name: 2-100 characters, no special chars
- Role: Must be one of: patient, doctor, admin
- Status: active or disabled

### Clinic Validation
- Name: 2-100 characters, required
- City: 2-50 characters, required
- Phone: Valid phone format (optional)
- Address: Max 255 characters
- HardwareType: Enum of supported types
- Coordinates: If provided, must be valid lat/long

### Billing Rate Validation
- Code: 3-10 alphanumeric, unique, required
- Diagnosis: 5-200 characters, required
- Prices: Positive numbers, basePrice ≤ rssbFee
- Category: Must be in enum
- Markup must be 0-100%

---

## 🗄️ Database Schema (Recommended)

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  fullName VARCHAR(100) NOT NULL,
  role ENUM('patient', 'doctor', 'admin') NOT NULL,
  clinic_id UUID FOREIGN KEY,
  status ENUM('active', 'disabled') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  INDEX(email),
  INDEX(role)
);
```

### clinics
```sql
CREATE TABLE clinics (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(50) NOT NULL,
  phone VARCHAR(20),
  contactPerson VARCHAR(100),
  hardwareType VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  credentialsSubmitted BOOLEAN DEFAULT FALSE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  INDEX(city),
  INDEX(verified)
);
```

### billing_rates
```sql
CREATE TABLE billing_rates (
  id UUID PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  diagnosis VARCHAR(200) NOT NULL,
  basePrice DECIMAL(10, 2) NOT NULL,
  rssbFee DECIMAL(10, 2) NOT NULL,
  category ENUM('consultation', 'eeg_basic', 'eeg_detailed', 'report', 'teleconsult'),
  description TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  INDEX(code),
  INDEX(category)
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  admin_id UUID NOT NULL FOREIGN KEY users(id),
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  changes JSON,
  timestamp TIMESTAMP DEFAULT NOW(),
  INDEX(admin_id),
  INDEX(resource_type),
  INDEX(timestamp)
);
```

---

## 🔄 Implementation Steps

### Phase 1: Basic CRUD (Week 1)
- [ ] Create User endpoints (GET, POST, PUT, DELETE)
- [ ] Create Clinic endpoints (GET, POST, PUT, DELETE)
- [ ] Create Billing Rate endpoints (GET, POST, PUT, DELETE)
- [ ] Database schema setup

### Phase 2: Authentication & Validation (Week 2)
- [ ] JWT middleware
- [ ] Admin role enforcement
- [ ] Input validation for all endpoints
- [ ] Error handling standardization

### Phase 3: Advanced Features (Week 3)
- [ ] CSV import for users
- [ ] Verify clinic endpoint
- [ ] Revenue analytics endpoint
- [ ] Audit logging
- [ ] Pagination for large datasets

### Phase 4: Testing & Deployment (Week 4)
- [ ] Unit tests for all endpoints
- [ ] Integration tests
- [ ] Load testing
- [ ] Security audit
- [ ] Production deployment

---

## 🚀 Frontend Integration Checklist

After backend is ready:

- [ ] Replace mock state with API calls
- [ ] Add loading spinners during requests
- [ ] Add error boundaries and error messages
- [ ] Implement pagination
- [ ] Add search/filter on tables
- [ ] Add refresh buttons
- [ ] Implement optimistic updates
- [ ] Add retry logic for failed requests
- [ ] Cache responses appropriately
- [ ] Add logout on 401 errors

### Example Frontend Integration (React)
```typescript
const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.status === 401) {
      // Redirect to login
    }
    const data = await response.json();
    setUsers(data);
  } catch (error) {
    setError(error.message);
    toast({ title: 'Error', description: 'Failed to load users' });
  } finally {
    setLoading(false);
  }
};
```

---

## 📊 Performance Targets

- GET endpoints: < 200ms
- POST/PUT endpoints: < 500ms
- Large imports (1000+ users): < 5s
- Database query response: < 100ms
- API rate limits: 100 req/min per admin user

---

## 🧪 Testing Requirements

### Unit Tests
- Email validation
- Price calculations
- Role checks
- CSV parsing

### Integration Tests
- Create → Read → Update → Delete workflows
- CSV import with error handling
- Role-based access control
- Audit logging

### API Tests
```bash
# Test user creation
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","fullName":"Test User","role":"patient"}'

# Test CSV import
curl -X POST http://localhost:3000/api/admin/users/import \
  -H "Authorization: Bearer <token>" \
  -F "file=@users.csv"
```

---

## 🌍 Rwanda-Specific Compliance

### RSSB (Rwanda Social Security Board)
- All fees must align with RSSB tariffs
- Export billing data for reimbursement claims
- Track per-diagnosis metrics

### CNRTL (Rwanda Data Protection)
- User consent tracking
- Data retention policies
- Right to deletion implementation

### Implementation
- [ ] Add RSSB export functionality
- [ ] Implement data retention policies
- [ ] Add consent tracking fields
- [ ] Audit trail for compliance

---

## 📞 Support & Questions

For technical questions during implementation:
- Backend lead: [Name]
- Frontend lead: [Name]
- DevOps: [Name]

---

**Status:** 🔴 Awaiting Backend Implementation
**Frontend Status:** ✅ Ready for Integration
**Last Updated:** January 19, 2026
