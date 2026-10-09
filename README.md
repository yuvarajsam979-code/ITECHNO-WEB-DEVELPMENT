# CampusGuard — Premium Role-Based Authentication & Dashboard System
### Hackverse Web Development Competition — Production-Grade Front-End Prototype

> **Quick Execution**: Open [`index.html`](file:///Users/sam/Documents/ITECHNO%20WEB%20DEVELPMENT%20/index.html) directly in any modern browser or visit `http://localhost:8080/`. No build steps or server dependencies required.

---

## 1. Architecture Overview & User Journey

CampusGuard has been upgraded with a **dedicated role-based authentication gateway** and **four distinct, role-gated dashboards**. The generic header role-switching dropdown has been completely removed in favor of a secure user journey:

```
[1. User lands on CampusGuard]
              ↓
[2. Premium Login Gateway (#login-view)]
              ↓
[3. Select Member Role Card] (Student / HOD / Dean / Higher Authority)
              ↓
[4. Enter / Auto-Fill Credentials] (Adapted form fields & helper)
              ↓
[5. Client-Side Authentication Verification]
              ↓
┌─────────────┬──────────────────┬─────────────────┬──────────────────────┐
│   Student   │       HOD        │      Dean       │   Higher Authority   │
│  Dashboard  │    Dashboard     │    Dashboard    │ Executive Dashboard  │
└─────────────┴──────────────────┴─────────────────┴──────────────────────┘
              ↓
[6. Sign Out Button] → Clears Session State & Returns to Login
```

---

## 2. Demo Credentials Reference Table

For judges and evaluators, each role has configured demo credentials and a one-click **"✨ Auto-Fill"** button on the login form:

| Role Category | Demo Identifier | Demo Password | Assigned Identity | Scope & Jurisdictional Clearance |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | `student@campus.edu` *(or `STU-2026-041`)* | `student123` | **Karthik S.** (Student) | Submit complaints, track own reports, view safe zones |
| **Head of Dept (HOD)** | `hod.mech@campus.edu` *(or `FAC-MECH-012`)* | `hod123` | **Dr. K. Ramanathan** (HOD Mech) | Review Stage 1 cases; reporter identity strictly masked |
| **Dean** | `dean.affairs@campus.edu` *(or `ADMIN-DEAN-001`)* | `dean123` | **Prof. S. Soundararajan** (Dean) | Manage Level 2 escalations; proctorial directives |
| **Higher Authority** | `authority.exec@campus.edu` *(or `EXEC-VC-001`)* | `authority123` | **Dr. Malathi Narayanan** (Vice Chancellor) | Level 3 statutory tribunals; authorized unmasked records |

---

## 3. Four Dedicated Role Dashboards

### A. Student Dashboard (`#student-portal-view`)
- **Navigation**: Home • Report an Incident • Track My Complaint • My Reports • Safe Zones • Profile • Sign Out.
- **Home**: Welcome greeting, summary metrics calculated from permitted filings, offline and online ragging cards, whistleblower rights overview.
- **Report an Incident**: 5-step confidential wizard with category selector, date constraint (no future dates), location/platform input, live 1000-char counter, evidence upload (PNG/JPG/PDF <10MB), and anonymous reporting toggle.
- **Track My Complaint**: Public tracking via Reference ID (`CR-YYYY-XXXX`) displaying stage badges, next expected review steps, and a chronological milestone timeline.
- **My Reports**: Interactive list of reports submitted by the logged-in student.
- **Safety Guide & Safe Zones**: Stylized interactive SVG campus map with 4 clickable safety checkpoints, duty wardens, and emergency intercom numbers.

### B. Head of Department (HOD) Dashboard (`#hod-portal-view`)
- **Navigation**: Overview • Assigned Complaints • Under Review • Escalation History • Department Safety Summary • Profile • Sign Out.
- **Metrics**: Assigned to HOD (Level 1), Awaiting Initial Review, Under Department Review, Escalated to Dean (Level 2).
- **Privacy Enforcement**: Complainant identity is **strictly masked** (`🔒 [Confidential - Identity Shielded Under University Anti-Retaliation Policy]`).
- **Administrative Actions**:
  - Open assigned complaints and review incident facts.
  - "Mark Under Review" (updates status in timeline).
  - Add internal department notes (stored in case audit trail).
  - "Forward to Dean →" (escalates case to Level 2).

### C. Dean of Student Affairs Dashboard (`#dean-portal-view`)
- **Navigation**: Overview • Escalated Complaints • Awaiting Review • Cases Under Review • HOD Escalation History • Reports & Trends • Profile • Sign Out.
- **Metrics**: Cases Escalated to Dean, Awaiting Proctorial Review, Active Inquiries, Escalated to Higher Authority.
- **Privacy Enforcement**: Complainant identity remains **masked** (`🔒 [Confidential - Restricted at Dean Level to Prevent Retaliation]`).
- **Proctorial Actions**:
  - Review prior departmental escalation history.
  - Add proctorial directives and campus security patrol instructions.
  - "Initiate Proctorial Action".
  - "Escalate to Higher Authority →" (escalates repeated case to Level 3).

### D. Higher Authority / Disciplinary Board Dashboard (`#higher-authority-portal-view`)
- **Navigation**: Executive Overview • Stage 3 Escalations • All Authorized Cases • Pending Decisions • Review History • Safety Analytics • Profile • Sign Out.
- **Executive Styling**: Midnight navy with violet (`#8b5cf6`) highlights and statutory tribunal crest.
- **Metrics**: Stage 3 Critical Cases, Cases Under Statutory Hearing, Pending Decisions, Resolved & Closed Cases.
- **Authorized Disclosure**:
  - If non-anonymous: Displays unmasked complainant identity (`👁️ [Authorized Executive Clearance]`).
  - If anonymous: Displays identity sealed notice (`🔒 [Anonymous Whistleblower]`).
- **Executive Actions**:
  - "Convene Statutory Tribunal Hearing".
  - Record executive resolution orders and disciplinary findings.
  - "Resolve & Close Case ✓".

---

## 4. Automatic Escalation Engine Integration

The deterministic 3-tier escalation rule engine is preserved and integrated:
- **1st Report** under a case group → Assigned to **HOD (Level 1)**.
- **2nd Report** under the same case group → Automatically escalated to **Dean (Level 2)**.
- **3rd+ Report** under the same case group → Critical escalation to **Higher Authority (Level 3)**.

Every transition logs a timestamped event into the case timeline and dispatches a notification specifically to the targeted authority role.

---

## 5. Route Protection & Access Guard

The application includes an **Access Control Guard** (`showView` / `denyAccess`):
- Unauthenticated users cannot view any portal dashboard and are redirected to the Login Gateway.
- If a student session attempts to open the HOD, Dean, or Higher Authority views, access is immediately blocked with an **Access Denied** alert, keeping the user securely on their permitted dashboard.
- Clicking **"Sign Out"** destroys the session (`AppState.currentUser = null`), hides the authenticated header, and resets the interface to the Login Gateway.

---

## 6. Verification Checklist

- [x] **Login Page Render**: Role selection cards, adapted form fields, auto-fill demo button.
- [x] **Student Authentication**: `student@campus.edu` / `student123` opens only Student Dashboard.
- [x] **HOD Authentication**: `hod.mech@campus.edu` / `hod123` opens only HOD Dashboard.
- [x] **Dean Authentication**: `dean.affairs@campus.edu` / `dean123` opens only Dean Dashboard.
- [x] **Higher Authority Authentication**: `authority.exec@campus.edu` / `authority123` opens only Executive Dashboard.
- [x] **Invalid Credentials**: Rejection error displayed without crashing.
- [x] **Role Navigation**: Navigation bar shows only links appropriate for the active role.
- [x] **Access Guard**: Unauthorized navigation attempts blocked with notification.
- [x] **HOD Privacy Shield**: Whistleblower identity strictly masked in HOD views.
- [x] **Dean Privacy Shield**: Whistleblower identity strictly masked in Dean views.
- [x] **Higher Authority Unmasking**: Permitted unmasking shown only for non-anonymous cases.
- [x] **Sign Out Flow**: Clears session state and returns to login page cleanly.
- [x] **Role-Specific Notifications**: Notifications filtered per role in the notification drawer.
- [x] **Multi-Step Complaint Wizard**: Complete 5-step filing process with evidence upload and anonymous toggle.
- [x] **Public Tracking**: Reference ID lookup with chronological action timeline.
- [x] **Interactive Safe Zones**: Stylized SVG campus map with responsive checkpoint pins.
- [x] **Responsive Mobile Layout**: Validated across small mobile (320px+), tablet, and desktop viewports.

---

## 7. Security Limitations & Production Transition

This implementation is a **browser-only front-end competition prototype**:
- Client-side credentials and JavaScript access guards demonstrate UI/UX authorization behavior.
- In a production university deployment, authentication must be enforced via an OAuth2/SAML IdP (e.g. Keycloak or Azure AD), secure HTTP-only cookies, JSON Web Tokens (JWT) verified on server microservices, encrypted database storage with Row-Level Security, and cloud storage pre-signed URLs for evidence files.
# ITECHNO-WEB-DEVELPMENT
