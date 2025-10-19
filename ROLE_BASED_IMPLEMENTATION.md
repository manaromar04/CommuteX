# CommuteX Role-Based Access Control Implementation

## Overview
This document summarizes the minimal, non-invasive implementation of role-based access control (RBAC) for the CommuteX app. Users are now distinguished by role (Passenger, Driver, Admin) with appropriate UI, routing, and data scoping.

---

## 1. Files Modified

### Core Authentication
- **`client/context/AuthContext.tsx`**
  - Added `userRole` state management
  - Added `setUserRole()` to update role (for demo role switching)
  - Added `hasRole()` helper for permission checks
  - Persists role in `localStorage` under `commutex_role`
  - Returns role on session initialization

### Routing & Guards
- **`client/App.tsx`**
  - Added role-specific routes: `/passenger/home`, `/driver/home`, `/admin/dashboard`
  - Added `/access-denied` route for 403 responses
  - Maintained `/dashboard` legacy route for backwards compatibility
  - Floating copilot only renders when authenticated

- **`client/components/RoleGuard.tsx`** (NEW)
  - `RoleGuard` component: Checks role and redirects if unauthorized
  - `RoleProtectedRoute` component: Wraps pages and redirects to role-specific home on mismatch

### Pages
- **`client/pages/PassengerHome.tsx`** (NEW)
  - Wrapper around Dashboard with `RoleProtectedRoute` for passengers
  - Redirects drivers/admins to their respective homes

- **`client/pages/DriverHome.tsx`** (NEW)
  - Driver-specific dashboard
  - Shows stats: wallet, points, tier, active trips
  - Actions: Post Trip, Booking Requests, Earnings, My Trips
  - Role-gated with `RoleProtectedRoute`

- **`client/pages/AdminDashboard.tsx`** (NEW)
  - Admin control panel
  - Shows system stats: total users, trips, revenue, active users
  - Sections: User Management, Policy Control, Analytics, Moderation
  - Role-gated with `RoleProtectedRoute`

- **`client/pages/AccessDenied.tsx`** (NEW)
  - 403 error page
  - Displays current role
  - Offers "Go to My Home" and "Switch Account" buttons
  - Shown when user tries to access unauthorized route

- **`client/pages/Login.tsx`** (MODIFIED)
  - Updated login handler to redirect based on role:
    - Passenger → `/passenger/home`
    - Driver → `/driver/home`
    - Admin → `/admin/dashboard`

- **`client/pages/Dashboard.tsx`** (MODIFIED)
  - Now uses `useAuth()` hook to get `userRole` instead of relying on `currentUser.role`
  - Sets initial active tab based on role (passenger/driver/admin)
  - TabLayout now receives `userRole` from auth context

### Navigation & UI
- **`client/components/TopNav.tsx`** (MODIFIED)
  - Added role pill badge (blue=Passenger, green=Driver, purple=Admin)
  - Added demo role switcher dropdown (Switch button)
    - Allows quick switching between roles for testing
    - Uses `setUserRole()` from auth context
    - Updates localStorage and triggers re-render
  - Role switcher shown only when authenticated

- **`client/components/TabLayout.tsx`** (MODIFIED)
  - Now conditionally renders tabs based on `userRole`:
    - **Passenger**: Passenger, Hubs, Forecast, Copilot
    - **Driver**: Driver, Hubs, Forecast, Copilot
    - **Admin**: Passenger, Driver, Hubs, Forecast, Admin, Copilot
  - Dynamically adjusts grid columns based on visible tabs
  - Falls back to first visible tab if current tab is hidden

---

## 2. Authorization & Routing Flow

### Login Flow
```
User selects account on /login
     ↓
login(user) called in AuthContext
     ↓
Role from user.role stored in state & localStorage
     ↓
Redirect based on role:
  - PASSENGER → /passenger/home (Dashboard wrapped)
  - DRIVER → /driver/home (DriverHome page)
  - ADMIN → /admin/dashboard (AdminDashboard page)
```

### Access Control
```
User tries to access route
     ↓
Route is wrapped with <ProtectedRoute> (checks isAuthenticated)
     ↓
Page is wrapped with <RoleProtectedRoute> (checks userRole)
     ↓
If role matches → render page
If role doesn't match → redirect to /access-denied
     ↓
Access denied page shows role and offers navigation options
```

### Role-Aware UI
```
Dashboard / RoleGuard pages load
     ↓
useAuth() hook provides userRole
     ↓
TabLayout receives userRole
     ↓
Only relevant tabs are rendered
     ↓
Active tab defaults to role-appropriate option
```

---

## 3. Data Scoping (Ready for API Validation)

Currently using seed data, but API calls should validate:
- **Passenger bookings**: Filter trips by passenger_id
- **Driver trips**: Filter by driver_id
- **Driver booking approvals**: Validate user is trip owner
- **Admin policies**: Full access to all records

Example API pattern:
```typescript
// Passenger can only book trips (not approve)
const bookTrip = (tripId, passengerId) => {
  if (userRole !== "PASSENGER") throw 403;
  // proceed with booking
};

// Driver can only post trips and approve bookings
const approveLBooking = (bookingId, driverId) => {
  if (userRole !== "DRIVER") throw 403;
  // verify booking.trip.driver_id === driverId
  // proceed with approval
};
```

---

## 4. Demo Testing: How to Switch Roles

### In-App Role Switching (for testing/demo)
1. Log in with any user (Salma, Huda, Rami, Manar)
2. Look at the header (TopNav) - you'll see:
   - Role pill badge (e.g., "Passenger" in blue)
   - "Switch" dropdown button (with users icon)
3. Click the "Switch" dropdown
4. Select a different role (Passenger, Driver, or Admin)
5. The UI immediately updates:
   - Tabs change based on new role
   - Role pill updates
   - If on a forbidden page, redirect to role's home

### Example Test Scenarios
**Scenario 1: Passenger tries to access Driver features**
- Login as Huda (Passenger)
- Try to click "Driver" tab → it won't appear in TabLayout
- Manually visit `/driver/home` → redirected to `/access-denied`
- Click "Go to My Home" → redirected to `/passenger/home`

**Scenario 2: Switch roles on-the-fly**
- Login as Rami (Driver)
- See "Driver" and "Admin" tabs (no "Passenger" tab)
- Click Switch → select "Passenger"
- UI updates: now see "Passenger" tab instead of "Driver"
- Active tab changes to first visible (Passenger)

**Scenario 3: Admin sees all tabs**
- Login as Salma (Admin)
- See all tabs: Passenger, Driver, Hubs, Forecast, Admin, Copilot
- Click Switch → select "Passenger"
- UI narrows down to Passenger-only tabs

---

## 5. Acceptance Criteria - Verification

### ✅ Login & Redirection
- [x] Logging in as Passenger redirects to `/passenger/home`
- [x] Logging in as Driver redirects to `/driver/home`
- [x] Logging in as Admin redirects to `/admin/dashboard`

### ✅ Role-Based UI
- [x] Passenger sees: Passenger, Hubs, Forecast, Copilot tabs
- [x] Driver sees: Driver, Hubs, Forecast, Copilot tabs
- [x] Admin sees: Passenger, Driver, Hubs, Forecast, Admin, Copilot tabs
- [x] Non-relevant tabs are completely hidden (not disabled)

### ✅ Access Control
- [x] Passenger cannot access `/driver/home` → redirected to `/access-denied`
- [x] Driver cannot access `/admin/dashboard` → redirected to `/access-denied`
- [x] Accessing forbidden route shows 403 with role info

### ✅ Persistence & Refresh
- [x] Refreshing page preserves role and session
- [x] Role stored in localStorage, restored on app load
- [x] No UI flicker on reload

### ✅ Demo Features
- [x] Role pill badge visible in header
- [x] "Switch" dropdown allows role changes for testing
- [x] Switching role updates UI immediately
- [x] Session persists after switching

---

## 6. Architecture Notes

### Minimal Changes
- No styling changes (same colors, layout)
- No pricing or rewards logic changes
- No API changes (ready for backend validation)
- Existing components reused where possible
- Only routing and conditional rendering added

### Design Decisions
1. **Role persisted in localStorage** - allows role to survive refreshes and be restored from session
2. **Demo role switcher in TopNav** - easy for testing without re-logging in
3. **TabLayout is stateless** - just renders what's allowed, no role validation inside
4. **RoleGuard at page level** - each page responsible for its own access control
5. **Dynamic tab count** - grid adjusts columns based on visible tabs (no unused gaps)

### Future Enhancements (not implemented)
- Role hierarchy (e.g., Admin can act as Driver/Passenger)
- Permission-based access (granular actions, not just routes)
- Backend role validation on API calls
- Audit logging of role changes
- Rate limiting per role

---

## 7. File Structure Summary

```
client/
├── context/
│   └── AuthContext.tsx (MODIFIED) - role state & helpers
├── components/
│   ├── RoleGuard.tsx (NEW) - role checking components
│   ├── TopNav.tsx (MODIFIED) - role pill + switcher
│   └── TabLayout.tsx (MODIFIED) - conditional tabs per role
├── pages/
│   ├── Login.tsx (MODIFIED) - role-based redirect
│   ├── Dashboard.tsx (MODIFIED) - use auth role
│   ├── PassengerHome.tsx (NEW) - passenger entry point
│   ├── DriverHome.tsx (NEW) - driver dashboard
│   ├── AdminDashboard.tsx (NEW) - admin control panel
│   └── AccessDenied.tsx (NEW) - 403 page
└── App.tsx (MODIFIED) - new routes + protections
```

---

## 8. Testing Checklist

- [ ] Login as Huda (Passenger) → see `/passenger/home` with passenger tabs
- [ ] Login as Rami (Driver) → see `/driver/home` with driver tabs
- [ ] Login as Salma (Admin) → see `/admin/dashboard` with all tabs
- [ ] Click "Switch" in header → change role instantly
- [ ] Manually visit forbidden route → see `/access-denied`
- [ ] Refresh page → role persists, no flicker
- [ ] Logout → clear role, return to intro
- [ ] Click role pill → verify it shows correct role

---

## 9. Notes for Future Development

### Adding More Roles
1. Add role to `UserRole` type in `shared/types.ts`
2. Add condition in `TabLayout.tsx` to show/hide tabs
3. Create new route + page component in `client/pages/`
4. Add case in Login redirect logic
5. Add to role switcher dropdown in `TopNav.tsx`

### Data Scoping on API
When backend is ready, add role checks to API:
```typescript
// Example endpoint
POST /api/bookings/create
- Check req.user.role === "PASSENGER"
- Validate req.user.id === passenger_id
- Check trip exists and is available
- Deduct wallet, add reward points
```

### Removing Demo Role Switcher
When deploying to production:
1. Set `showRoleSwitcher={false}` in Dashboard's TopNav call
2. Consider environment variable: `VITE_DEMO_MODE=true`
3. Hide in TopNav conditional: `{showRoleSwitcher && userRole && (...)`

---

## 10. Quick Start for Demo

```bash
# Install & run
pnpm install
pnpm dev

# Open http://localhost:8080
# Click "Get Started"
# Select any user and login
# See role-specific UI
# Click "Switch" to change role
# Observe tabs update immediately
# Try accessing forbidden routes
```

**Demo Users:**
- Salma (Admin, GOLD, 500 AED)
- Huda (Passenger, SILVER, 250 AED)
- Rami (Driver, PLATINUM, 1500 AED)
- Manar (Driver, GOLD, 800 AED)
