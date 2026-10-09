/**
 * CAMPUSGUARD — PREMIUM ROLE-BASED AUTHENTICATION & DASHBOARD SYSTEM
 * Hackverse Web Development Competition
 * Vanilla JavaScript (ES6+) Architecture
 * 
 * Modules:
 * 1. Demo Credentials & Authentication State
 * 2. Escalation Engine & Global State Management
 * 3. Seed Dataset
 * 4. Localization Dictionary (English & Tamil)
 * 5. Authentication Controller (Login, Role Adapt, Auto-Fill, Logout)
 * 6. Role-Based Navigation & Access Control Guard
 * 7. Student Portal Controller (Home, Report Form, Track, My Reports, Safety Map, Profile)
 * 8. HOD Dashboard Controller (Assigned Cases, Masked Identity, Dept Notes, Escalate to Dean)
 * 9. Dean Dashboard Controller (Escalated Cases, Proctorial Review, Escalate to Higher Auth)
 * 10. Higher Authority Executive Dashboard (Authorized Disclosure, Tribunal Hearings, Resolve)
 * 11. Role-Filtered Notifications System
 * 12. Safe Zones Map & Modals
 * 13. Accessibility, Font Scaling, Theme & i18n
 */

'use strict';

/* ==========================================================================
   1. DEMO CREDENTIALS & AUTHENTICATION CONFIGURATION
   ========================================================================== */

const DEMO_CREDENTIALS = {
  student: {
    roleKey: 'student',
    roleTitle: 'Student Member',
    badgeText: 'Student Member Authentication',
    idLabel: 'Student Email / Roll Number',
    idPlaceholder: 'student@campus.edu or STU-2026-041',
    validIdentifiers: ['student@campus.edu', 'stu-2026-041', 'student'],
    validPassword: 'student123',
    profile: {
      role: 'student',
      name: 'Karthik S.',
      id: 'STU-2026-041',
      email: 'student@campus.edu',
      dept: 'Mechanical Engineering',
      title: 'Student Complainant',
      avatar: 'S'
    }
  },
  hod: {
    roleKey: 'hod',
    roleTitle: 'Head of Department (HOD)',
    badgeText: 'Head of Department (Level 1)',
    idLabel: 'Official Department Email / Faculty ID',
    idPlaceholder: 'hod.mech@campus.edu or FAC-MECH-012',
    validIdentifiers: ['hod.mech@campus.edu', 'fac-mech-012', 'hod'],
    validPassword: 'hod123',
    profile: {
      role: 'hod',
      name: 'Dr. K. Ramanathan',
      id: 'FAC-MECH-012',
      email: 'hod.mech@campus.edu',
      dept: 'Department of Mechanical Engineering',
      title: 'Head of Department',
      avatar: 'H'
    }
  },
  dean: {
    roleKey: 'dean',
    roleTitle: 'Dean of Student Affairs',
    badgeText: 'Dean of Student Affairs (Level 2)',
    idLabel: 'Directorate Email / Admin ID',
    idPlaceholder: 'dean.affairs@campus.edu or ADMIN-DEAN-001',
    validIdentifiers: ['dean.affairs@campus.edu', 'admin-dean-001', 'dean'],
    validPassword: 'dean123',
    profile: {
      role: 'dean',
      name: 'Prof. S. Soundararajan',
      id: 'ADMIN-DEAN-001',
      email: 'dean.affairs@campus.edu',
      dept: 'Directorate of Student Welfare',
      title: 'Dean of Student Affairs',
      avatar: 'D'
    }
  },
  higher_authority: {
    roleKey: 'higher_authority',
    roleTitle: 'Higher Authority / Disciplinary Board',
    badgeText: 'Higher Authority (Level 3)',
    idLabel: 'Executive Tribunal Email / Statutory ID',
    idPlaceholder: 'authority.exec@campus.edu or EXEC-VC-001',
    validIdentifiers: ['authority.exec@campus.edu', 'exec-vc-001', 'authority', 'vc'],
    validPassword: 'authority123',
    profile: {
      role: 'higher_authority',
      name: 'Dr. Malathi Narayanan',
      id: 'EXEC-VC-001',
      email: 'authority.exec@campus.edu',
      dept: 'Executive Directorate',
      title: 'Vice Chancellor & Tribunal Chair',
      avatar: 'VC'
    }
  }
};

/* ==========================================================================
   2. ESCALATION ENGINE & GLOBAL STATE MANAGEMENT
   ========================================================================== */

const ESCALATION_CONFIG = {
  1: {
    stage: 1,
    roleKey: 'hod',
    title: 'Head of Department (HOD)',
    badgeClass: 'badge-review',
    badgeText: 'Stage 1: HOD Review',
    nextStep: 'Departmental preliminary inquiry and informal hearing',
    reporterVisibility: false,
    description: 'First qualifying incident report assigned to academic department head.'
  },
  2: {
    stage: 2,
    roleKey: 'dean',
    title: 'Dean of Student Affairs',
    badgeClass: 'badge-escalated',
    badgeText: 'Stage 2: Dean Escalation',
    nextStep: 'Campus-wide inquiry, proctorial intervention & counseling',
    reporterVisibility: false,
    description: 'Second qualifying report for same case group automatically escalated to Dean.'
  },
  3: {
    stage: 3,
    roleKey: 'higher_authority',
    title: 'Higher Authority / Disciplinary Board',
    badgeClass: 'badge-critical',
    badgeText: 'Stage 3: Executive Review',
    nextStep: 'Executive statutory hearing, suspension review & legal counsel',
    reporterVisibility: true,
    description: 'Third repeated incident. Executive disciplinary board intervention required.'
  }
};

// Global Application State
const AppState = {
  currentUser: null,           // null on launch; set upon successful login
  selectedLoginRole: 'student',// 'student' | 'hod' | 'dean' | 'higher_authority'
  activeView: 'login-view',
  activeLang: 'en',            // 'en' | 'ta'
  activeTheme: 'dark',         // 'dark' | 'light'
  fontSize: 'normal',
  formCurrentStep: 1,
  pendingEvidence: null,
  complaints: [],
  notifications: []
};

/* ==========================================================================
   3. SEED DATASET
   ========================================================================== */

const INITIAL_SEED_COMPLAINTS = [
  {
    referenceId: 'CR-2026-1042',
    caseGroup: 'CASE-DEPT-MECH',
    complaintType: 'offline',
    category: 'Unwanted behaviour',
    incidentDate: '2026-10-07',
    incidentTime: '16:30',
    location: 'Mechanical Workshop Corridor B',
    description: 'Group of senior students forced junior students to perform repetitive humiliating physical drills and demanded completed workshop journals before entry.',
    suspectDetails: {
      name: 'Vignesh R. & 2 others',
      department: 'Mechanical 4th Year',
      phone: '+91 98401 23456'
    },
    reporterDetails: {
      name: 'Karthik S.',
      studentId: 'STU-2026-041',
      contact: 'student@campus.edu'
    },
    isAnonymous: false,
    evidenceMetadata: {
      filename: 'workshop_incident_log.pdf',
      filesize: '450 KB',
      filetype: 'application/pdf'
    },
    status: 'Under Review',
    escalationStage: 1,
    assignedAuthority: 'Head of Department (HOD)',
    createdAt: '2026-10-07T17:15:00Z',
    updatedAt: '2026-10-08T09:30:00Z',
    timeline: [
      {
        id: 'TL-101',
        title: 'Report Submitted',
        description: 'Student securely registered offline harassment report.',
        timestamp: 'Oct 07, 2026 • 17:15',
        stage: 1,
        actor: 'Student',
        type: 'submitted'
      },
      {
        id: 'TL-102',
        title: 'Assigned to HOD (Level 1)',
        description: 'First qualifying report assigned to Head of Department (Mechanical). Reporter identifying details restricted.',
        timestamp: 'Oct 07, 2026 • 17:16',
        stage: 1,
        actor: 'Escalation Engine',
        type: 'assigned'
      },
      {
        id: 'TL-103',
        title: 'HOD Review Initiated',
        description: 'Department Head scheduled informal fact-finding inquiry with batch proctors.',
        timestamp: 'Oct 08, 2026 • 09:30',
        stage: 1,
        actor: 'Dr. K. Ramanathan (HOD)',
        type: 'review'
      }
    ]
  },
  {
    referenceId: 'CR-2026-2189',
    caseGroup: 'CASE-CYBER-INSTA',
    complaintType: 'online',
    category: 'Fake accounts',
    incidentDate: '2026-10-06',
    incidentTime: '21:45',
    location: 'Instagram Profile @campus_confessions_unfiltered',
    description: 'Second report regarding an impersonated spoof account circulating morphed private photographs and vulgar comments targeting first-year female hostelites.',
    suspectDetails: {
      name: 'Account Admin (Unknown student IP)',
      department: 'Suspected CS/IT Dept',
      phone: 'N/A'
    },
    reporterDetails: {
      name: 'Pooja M.',
      studentId: 'CSE-2025-112',
      contact: 'pooja.m@student.campus.edu'
    },
    isAnonymous: false,
    evidenceMetadata: {
      filename: 'instagram_story_screenshot.png',
      filesize: '1.8 MB',
      filetype: 'image/png'
    },
    status: 'Escalated',
    escalationStage: 2,
    assignedAuthority: 'Dean of Student Affairs',
    createdAt: '2026-10-06T22:30:00Z',
    updatedAt: '2026-10-07T11:00:00Z',
    timeline: [
      {
        id: 'TL-201',
        title: 'Second Qualifying Report Lodged',
        description: 'Report filed matching prior incident group CASE-CYBER-INSTA.',
        timestamp: 'Oct 06, 2026 • 22:30',
        stage: 2,
        actor: 'Student',
        type: 'submitted'
      },
      {
        id: 'TL-202',
        title: 'AUTOMATIC ESCALATION TO DEAN (Level 2)',
        description: 'Escalation Engine detected repeat cyber offense. Reassigned from HOD to Dean of Student Affairs for proctorial action.',
        timestamp: 'Oct 06, 2026 • 22:31',
        stage: 2,
        actor: 'Escalation Engine',
        type: 'escalated'
      },
      {
        id: 'TL-203',
        title: 'Cyber Cell Notice Dispatched',
        description: 'Dean requested IT cell to trace network access logs and file institutional takedown request.',
        timestamp: 'Oct 07, 2026 • 11:00',
        stage: 2,
        actor: 'Prof. S. Soundararajan (Dean)',
        type: 'review'
      }
    ]
  },
  {
    referenceId: 'CR-2026-3401',
    caseGroup: 'CASE-HOSTEL-NIGHT',
    complaintType: 'offline',
    category: 'Threats or intimidation',
    incidentDate: '2026-10-05',
    incidentTime: '23:15',
    location: 'Boys Hostel 3, Ground Floor Recreation Area',
    description: 'Third incident logged against the same senior cohort. Physical blockades, extortion of mess tokens, and explicit threats of academic blacklisting.',
    suspectDetails: {
      name: 'Ashwin K. & Gang',
      department: 'Civil 4th Year',
      phone: '+91 94432 99887'
    },
    reporterDetails: {
      name: 'Confidential Whistleblower',
      studentId: 'ANON-STU',
      contact: 'N/A'
    },
    isAnonymous: true,
    evidenceMetadata: {
      filename: 'audio_transcript_recreation.pdf',
      filesize: '310 KB',
      filetype: 'application/pdf'
    },
    status: 'Action in Progress',
    escalationStage: 3,
    assignedAuthority: 'Higher Authority / Disciplinary Board',
    createdAt: '2026-10-05T23:50:00Z',
    updatedAt: '2026-10-08T14:00:00Z',
    timeline: [
      {
        id: 'TL-301',
        title: 'Third Repeat Report Lodged',
        description: 'Anonymous complaint filed under CASE-HOSTEL-NIGHT.',
        timestamp: 'Oct 05, 2026 • 23:50',
        stage: 3,
        actor: 'Anonymous Student',
        type: 'submitted'
      },
      {
        id: 'TL-302',
        title: 'CRITICAL ESCALATION TO HIGHER AUTHORITY (Level 3)',
        description: 'Escalation Engine triggered 3rd-tier elevation. Case referred to University Disciplinary Board for statutory action.',
        timestamp: 'Oct 05, 2026 • 23:51',
        stage: 3,
        actor: 'Escalation Engine',
        type: 'critical'
      },
      {
        id: 'TL-303',
        title: 'Disciplinary Committee Hearing Convened',
        description: 'Statutory inquiry panel constituted. Show-cause notices issued to suspects; interim hostel suspension ordered.',
        timestamp: 'Oct 08, 2026 • 14:00',
        stage: 3,
        actor: 'Dr. Malathi Narayanan (VC)',
        type: 'review'
      }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    roleTarget: 'higher_authority',
    type: 'critical',
    title: 'Level 3 Critical Escalation: CR-2026-3401',
    message: 'Third repeated offense detected under CASE-HOSTEL-NIGHT. Case automatically escalated to Higher Authority / Disciplinary Board.',
    timestamp: 'Oct 05, 2026 • 23:51',
    read: false,
    refId: 'CR-2026-3401'
  },
  {
    id: 'NOTIF-02',
    roleTarget: 'dean',
    type: 'escalated',
    title: 'Level 2 Escalation to Dean: CR-2026-2189',
    message: 'Repeat cyber harassment complaint automatically elevated to Dean of Student Affairs.',
    timestamp: 'Oct 06, 2026 • 22:31',
    read: false,
    refId: 'CR-2026-2189'
  },
  {
    id: 'NOTIF-03',
    roleTarget: 'hod',
    type: 'assigned',
    title: 'New Complaint Assigned: CR-2026-1042',
    message: 'First qualifying report assigned to HOD (Mechanical). Reporter identity shielded.',
    timestamp: 'Oct 07, 2026 • 17:16',
    read: false,
    refId: 'CR-2026-1042'
  },
  {
    id: 'NOTIF-04',
    roleTarget: 'student',
    type: 'assigned',
    title: 'Report Registered: CR-2026-1042',
    message: 'Your report CR-2026-1042 has been securely recorded and routed to HOD Mechanical for preliminary review.',
    timestamp: 'Oct 07, 2026 • 17:16',
    read: false,
    refId: 'CR-2026-1042'
  }
];

/* ==========================================================================
   4. LOCALIZATION DICTIONARY (ENGLISH & TAMIL)
   ========================================================================== */

const I18N = {
  en: {
    bannerDisclaimer: 'Simulated Demonstration Environment • No production server connection • Demo records are local only',
    brandTagline: 'Safety & Reporting Portal',
    loginHeroH1: 'A Safer Campus Starts Here.',
    loginHeroDesc: 'A confidential digital reporting and automated authority escalation framework. Select your university member category below to access your dedicated portal.'
  },
  ta: {
    bannerDisclaimer: 'மாதிரி செயல்விளக்க சூழல் • உற்பத்தி சேவையக இணைப்பு இல்லை • உள்ளூர் மாதிரி பதிவுகள் மட்டுமே',
    brandTagline: 'பாதுகாப்பு மற்றும் புகார் தளம்',
    loginHeroH1: 'பாதுகாப்பான வளாகம் இங்கிருந்தே தொடங்குகிறது.',
    loginHeroDesc: 'ரகசிய டிஜிட்டல் புகார் மற்றும் தானியங்கி அதிகார படிநிலை தளம். உங்கள் பல்கலைக்கழக அங்கீகார பிரிவைத் தேர்ந்தெடுத்து உள்நுழையவும்.'
  }
};

/* ==========================================================================
   5. AUTHENTICATION CONTROLLER
   ========================================================================== */

function initAuthentication() {
  const roleCards = document.querySelectorAll('.role-card-select');
  const loginForm = document.getElementById('auth-login-form');
  const btnAutofill = document.getElementById('btn-autofill-creds');
  const btnTogglePw = document.getElementById('btn-toggle-pw');
  const pwInput = document.getElementById('login-password');
  const idInput = document.getElementById('login-identifier');
  const btnForgotPw = document.getElementById('btn-forgot-pw');
  const btnLogout = document.getElementById('btn-logout');

  // Role card selection
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedRole = card.dataset.role;
      selectRole(selectedRole);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const selectedRole = card.dataset.role;
        selectRole(selectedRole);
      }
    });
  });

  function selectRole(roleKey) {
    AppState.selectedLoginRole = roleKey;
    roleCards.forEach(c => {
      const isMatch = c.dataset.role === roleKey;
      c.classList.toggle('selected', isMatch);
      c.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });

    const config = DEMO_CREDENTIALS[roleKey];
    if (!config) return;

    // Adapt login form UI
    document.getElementById('login-role-badge').textContent = config.badgeText;
    document.getElementById('login-form-title').textContent = `Sign In as ${config.roleTitle}`;
    document.getElementById('label-login-id').innerHTML = `${config.idLabel} <span class="req">*</span>`;
    document.getElementById('login-identifier').placeholder = config.idPlaceholder;
    document.getElementById('demo-creds-preview').textContent = `${config.validIdentifiers[0]} • ${config.validPassword}`;

    // Reset error
    document.getElementById('login-error-msg').style.display = 'none';
  }

  // Auto-Fill Demo Credentials
  if (btnAutofill) {
    btnAutofill.addEventListener('click', () => {
      const config = DEMO_CREDENTIALS[AppState.selectedLoginRole];
      if (config) {
        idInput.value = config.validIdentifiers[0];
        pwInput.value = config.validPassword;
        showToast(`Auto-filled ${config.roleTitle} demo credentials!`, 'info');
      }
    });
  }

  // Toggle Password Visibility
  if (btnTogglePw && pwInput) {
    btnTogglePw.addEventListener('click', () => {
      const isPw = pwInput.type === 'password';
      pwInput.type = isPw ? 'text' : 'password';
      btnTogglePw.innerHTML = isPw 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  }

  // Forgot password modal
  if (btnForgotPw) {
    btnForgotPw.addEventListener('click', () => {
      document.getElementById('forgot-pw-modal').classList.add('active');
    });
  }

  const btnCloseForgot = document.getElementById('btn-close-forgot-modal');
  const btnDismissForgot = document.getElementById('btn-dismiss-forgot');
  [btnCloseForgot, btnDismissForgot].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        document.getElementById('forgot-pw-modal').classList.remove('active');
      });
    }
  });

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  // Logout button
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      handleLogout();
    });
  }
}

function handleLogin() {
  const selectedRole = AppState.selectedLoginRole;
  const config = DEMO_CREDENTIALS[selectedRole];
  const idVal = document.getElementById('login-identifier').value.trim().toLowerCase();
  const pwVal = document.getElementById('login-password').value.trim();
  const errEl = document.getElementById('login-error-msg');
  const btnSubmit = document.getElementById('btn-submit-login');

  if (!idVal || !pwVal) {
    errEl.textContent = 'Please enter both your identifier and password.';
    errEl.style.display = 'block';
    return;
  }

  // Check credentials
  const idMatches = config.validIdentifiers.some(validId => validId.toLowerCase() === idVal);
  const pwMatches = config.validPassword === pwVal;

  if (!idMatches || !pwMatches) {
    errEl.textContent = `Invalid credentials for ${config.roleTitle}. Please verify the demo ID and password.`;
    errEl.style.display = 'block';
    showToast('Authentication failed: Invalid credentials.', 'error');
    return;
  }

  // Credentials are valid: show brief loading state
  errEl.style.display = 'none';
  btnSubmit.classList.add('loading');
  btnSubmit.innerHTML = `<span>Verifying credentials...</span>`;

  setTimeout(() => {
    btnSubmit.classList.remove('loading');
    btnSubmit.innerHTML = `<span>Sign In to Dashboard →</span>`;

    // Set authenticated session state
    AppState.currentUser = { ...config.profile };

    // Update Header UI with user identity
    updateAuthenticatedHeader(AppState.currentUser);

    // Route to the appropriate role dashboard
    routeToRoleDashboard(selectedRole);

    showToast(`Welcome, ${config.profile.name}! Signed in as ${config.profile.title}.`, 'success');
  }, 350);
}

function handleLogout() {
  AppState.currentUser = null;

  // Hide authenticated header
  const authHeader = document.getElementById('authenticated-site-header');
  if (authHeader) {
    authHeader.classList.remove('authenticated');
  }

  // Close notifications drawer if open
  const drawer = document.getElementById('notification-drawer');
  if (drawer) drawer.classList.remove('open');

  // Clear credentials
  document.getElementById('login-password').value = '';
  document.getElementById('login-error-msg').style.display = 'none';

  // Navigate back to login view
  showView('login-view');
  showToast('You have been signed out. Demo session ended.', 'info');
}

function updateAuthenticatedHeader(user) {
  const authHeader = document.getElementById('authenticated-site-header');
  if (!authHeader) return;

  authHeader.classList.add('authenticated');

  // Update user chip
  document.getElementById('user-avatar-initial').textContent = user.avatar;
  document.getElementById('user-display-name').textContent = user.name;
  document.getElementById('user-display-role').textContent = user.title;

  // Build role-specific navigation links
  buildRoleNavigation(user.role);

  // Update notification badge counter for this role
  updateNotificationBadge();
}

/* ==========================================================================
   6. ROLE-BASED NAVIGATION & ACCESS CONTROL GUARD
   ========================================================================== */

function buildRoleNavigation(role) {
  const navContainer = document.getElementById('main-nav-links');
  if (!navContainer) return;

  navContainer.innerHTML = '';

  let links = [];

  if (role === 'student') {
    links = [
      { id: 'nav-student-home', label: 'Home', pane: 'student-pane-home' },
      { id: 'nav-student-report', label: 'Report Incident', pane: 'student-pane-report' },
      { id: 'nav-student-track', label: 'Track Complaint', pane: 'student-pane-track' },
      { id: 'nav-student-reports', label: 'My Reports', pane: 'student-pane-myreports' },
      { id: 'nav-student-safety', label: 'Safe Zones', pane: 'student-pane-safety' },
      { id: 'nav-student-profile', label: 'Profile', pane: 'student-pane-profile' }
    ];
  } else if (role === 'hod') {
    links = [
      { id: 'nav-hod-overview', label: 'Overview', pane: 'hod-pane-overview' },
      { id: 'nav-hod-assigned', label: 'Assigned Complaints', pane: 'hod-pane-assigned' },
      { id: 'nav-hod-review', label: 'Under Review', pane: 'hod-pane-review' },
      { id: 'nav-hod-history', label: 'Escalation History', pane: 'hod-pane-history' },
      { id: 'nav-hod-summary', label: 'Safety Summary', pane: 'hod-pane-summary' },
      { id: 'nav-hod-profile', label: 'Profile', pane: 'hod-pane-profile' }
    ];
  } else if (role === 'dean') {
    links = [
      { id: 'nav-dean-overview', label: 'Overview', pane: 'dean-pane-overview' },
      { id: 'nav-dean-escalated', label: 'Escalated Complaints', pane: 'dean-pane-escalated' },
      { id: 'nav-dean-awaiting', label: 'Awaiting Review', pane: 'dean-pane-awaiting' },
      { id: 'nav-dean-active', label: 'Cases Under Review', pane: 'dean-pane-active' },
      { id: 'nav-dean-history', label: 'HOD History', pane: 'dean-pane-history' },
      { id: 'nav-dean-trends', label: 'Reports & Trends', pane: 'dean-pane-trends' },
      { id: 'nav-dean-profile', label: 'Profile', pane: 'dean-pane-profile' }
    ];
  } else if (role === 'higher_authority') {
    links = [
      { id: 'nav-exec-overview', label: 'Executive Overview', pane: 'exec-pane-overview' },
      { id: 'nav-exec-stage3', label: 'Stage 3 Escalations', pane: 'exec-pane-stage3' },
      { id: 'nav-exec-all', label: 'All Cases', pane: 'exec-pane-all' },
      { id: 'nav-exec-pending', label: 'Pending Decisions', pane: 'exec-pane-pending' },
      { id: 'nav-exec-history', label: 'Review History', pane: 'exec-pane-history' },
      { id: 'nav-exec-analytics', label: 'Safety Analytics', pane: 'exec-pane-analytics' },
      { id: 'nav-exec-profile', label: 'Profile', pane: 'exec-pane-profile' }
    ];
  }

  links.forEach((link, idx) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `nav-btn ${idx === 0 ? 'active' : ''}`;
    btn.id = link.id;
    btn.textContent = link.label;
    btn.dataset.pane = link.pane;

    btn.addEventListener('click', () => {
      // Set active nav link
      navContainer.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Switch sub-pane inside active portal
      switchDashboardPane(link.pane);

      // Close mobile menu
      const navLinksContainer = document.getElementById('main-nav-links');
      if (navLinksContainer) navLinksContainer.classList.remove('mobile-open');
    });

    li.appendChild(btn);
    navContainer.appendChild(li);
  });
}

function routeToRoleDashboard(role) {
  if (role === 'student') {
    showView('student-portal-view');
    renderStudentPortal();
  } else if (role === 'hod') {
    showView('hod-portal-view');
    renderHodPortal();
  } else if (role === 'dean') {
    showView('dean-portal-view');
    renderDeanPortal();
  } else if (role === 'higher_authority') {
    showView('higher-authority-portal-view');
    renderHigherAuthorityPortal();
  }
}

function showView(viewId) {
  // Access Guard: If not logged in and not login-view, redirect
  if (!AppState.currentUser && viewId !== 'login-view') {
    viewId = 'login-view';
    showToast('Please sign in to access CampusGuard portals.', 'info');
  }

  // Access Guard: Ensure student cannot open authority portal views
  if (AppState.currentUser) {
    const userRole = AppState.currentUser.role;
    if (viewId === 'hod-portal-view' && userRole !== 'hod') {
      denyAccess('Head of Department portal');
      return;
    }
    if (viewId === 'dean-portal-view' && userRole !== 'dean') {
      denyAccess('Dean of Student Affairs portal');
      return;
    }
    if (viewId === 'higher-authority-portal-view' && userRole !== 'higher_authority') {
      denyAccess('Higher Authority portal');
      return;
    }
    if (viewId === 'student-portal-view' && userRole !== 'student') {
      denyAccess('Student portal');
      return;
    }
  }

  document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active-view'));
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active-view');
    AppState.activeView = viewId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function denyAccess(portalName) {
  showToast(`Access Denied: You do not have permissions to access the ${portalName}.`, 'error');
  // Keep on permitted view
  if (AppState.currentUser) {
    routeToRoleDashboard(AppState.currentUser.role);
  } else {
    showView('login-view');
  }
}

function switchDashboardPane(paneId) {
  // Sync subnav buttons in active portal
  document.querySelectorAll('.subnav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pane === paneId);
  });

  // Sync pane visibility
  document.querySelectorAll('.dashboard-pane').forEach(pane => {
    pane.classList.remove('active-pane');
  });

  const targetPane = document.getElementById(paneId);
  if (targetPane) {
    targetPane.classList.add('active-pane');
    window.scrollTo({ top: targetPane.offsetTop - 80, behavior: 'smooth' });
  }
}

/* ==========================================================================
   7. STUDENT PORTAL CONTROLLER
   ========================================================================== */

function initStudentPortal() {
  // Subnav buttons inside Student Portal
  document.querySelectorAll('#student-portal-view .subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchDashboardPane(btn.dataset.pane);
    });
  });

  // Quick report button on student home
  const btnQuickReport = document.getElementById('btn-student-quick-report');
  if (btnQuickReport) {
    btnQuickReport.addEventListener('click', () => {
      switchDashboardPane('student-pane-report');
    });
  }

  // Quick view zones button
  const btnViewZones = document.getElementById('btn-student-view-zones');
  if (btnViewZones) {
    btnViewZones.addEventListener('click', () => {
      switchDashboardPane('student-pane-safety');
    });
  }

  // Return to home button from success card
  const btnReturnHome = document.getElementById('btn-success-return-home');
  if (btnReturnHome) {
    btnReturnHome.addEventListener('click', () => {
      switchDashboardPane('student-pane-home');
      renderStudentPortal();
    });
  }
}

function renderStudentPortal() {
  if (!AppState.currentUser) return;

  document.getElementById('student-welcome-name').textContent = AppState.currentUser.name;

  // Student profile fields
  document.getElementById('profile-student-name').textContent = AppState.currentUser.name;
  document.getElementById('profile-student-roll').textContent = AppState.currentUser.id;
  document.getElementById('profile-student-email').textContent = AppState.currentUser.email;

  // Calculate metrics from student reports
  const total = AppState.complaints.length;
  const underReview = AppState.complaints.filter(c => c.status === 'Under Review').length;
  const escalated = AppState.complaints.filter(c => c.status === 'Escalated' || c.status === 'Action in Progress').length;
  const resolved = AppState.complaints.filter(c => c.status === 'Resolved').length;

  document.getElementById('student-metric-total').textContent = total;
  document.getElementById('student-metric-review').textContent = underReview;
  document.getElementById('student-metric-escalated').textContent = escalated;
  document.getElementById('student-metric-resolved').textContent = resolved;
  document.getElementById('student-home-active-badge').textContent = `${total} Reports`;

  // Render recent reports list on home
  const homeContainer = document.getElementById('student-home-reports-list');
  const fullContainer = document.getElementById('student-my-reports-list');

  renderStudentReportsList(homeContainer, false);
  renderStudentReportsList(fullContainer, true);
}

function renderStudentReportsList(container, showAll = false) {
  if (!container) return;

  if (AppState.complaints.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h4>No Reports Submitted Yet</h4>
        <p>You have not logged any complaints in this session.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  const list = showAll ? AppState.complaints : AppState.complaints.slice(0, 3);

  list.forEach(complaint => {
    const item = document.createElement('div');
    item.className = 'report-item';

    const stageBadgeClass = complaint.escalationStage === 3 ? 'badge-critical' : (complaint.escalationStage === 2 ? 'badge-escalated' : 'badge-review');

    item.innerHTML = `
      <div class="report-item-left">
        <div class="report-id-row">
          <span class="report-ref-id">${complaint.referenceId}</span>
          <span class="badge ${getStatusBadgeClass(complaint.status)}">${complaint.status}</span>
          <span class="badge ${stageBadgeClass}">Stage ${complaint.escalationStage}</span>
          ${complaint.isAnonymous ? '<span class="badge badge-anonymous">Anonymous</span>' : ''}
        </div>
        <p class="report-desc-preview">${escapeHtml(complaint.description)}</p>
        <div class="report-meta-sub">
          <span>📅 ${complaint.incidentDate}</span>
          <span>📍 ${escapeHtml(complaint.location)}</span>
          <span>🏛️ ${complaint.assignedAuthority}</span>
        </div>
      </div>
      <div class="report-item-right">
        <button type="button" class="btn btn-secondary btn-sm btn-view-report" data-ref="${complaint.referenceId}">
          View Timeline
        </button>
      </div>
    `;

    container.appendChild(item);
  });

  container.querySelectorAll('.btn-view-report').forEach(btn => {
    btn.addEventListener('click', () => {
      showIncidentModal(btn.dataset.ref);
    });
  });
}

/* ==========================================================================
   8. HOD DASHBOARD CONTROLLER (STAGE 1 ASSIGNED CASES)
   ========================================================================== */

function initHodPortal() {
  document.querySelectorAll('#hod-portal-view .subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchDashboardPane(btn.dataset.pane);
    });
  });
}

function renderHodPortal() {
  if (!AppState.currentUser) return;

  // Calculate HOD metrics
  const assigned = AppState.complaints.filter(c => c.escalationStage === 1);
  const awaiting = assigned.filter(c => c.status === 'Submitted' || c.status === 'Under Review');
  const underReview = assigned.filter(c => c.status === 'Under Review');
  const escalatedDean = AppState.complaints.filter(c => c.escalationStage >= 2);

  document.getElementById('hod-metric-assigned').textContent = assigned.length;
  document.getElementById('hod-metric-awaiting').textContent = awaiting.length;
  document.getElementById('hod-metric-under-review').textContent = underReview.length;
  document.getElementById('hod-metric-escalated-dean').textContent = escalatedDean.length;
  document.getElementById('hod-cases-badge').textContent = `${assigned.length} In Queue`;

  // Render cases
  renderHodCases(document.getElementById('hod-cases-container'), assigned);
  renderHodCases(document.getElementById('hod-assigned-list'), assigned);
  renderHodCases(document.getElementById('hod-review-list'), underReview);
  renderHodCases(document.getElementById('hod-history-list'), escalatedDean);
}

function renderHodCases(container, casesList) {
  if (!container) return;

  if (casesList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h4>No Cases Found</h4>
        <p>There are currently no Stage 1 complaints matching this filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  casesList.forEach(c => {
    const card = document.createElement('div');
    card.className = 'authority-case-card';

    card.innerHTML = `
      <div class="case-top-row">
        <div>
          <span style="font-family: var(--font-mono); font-size: 1.05rem; font-weight: 800; color: var(--accent-cyan-light);">${c.referenceId}</span>
          <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 8px;">Case Group: <strong>${c.caseGroup}</strong></span>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge ${getStatusBadgeClass(c.status)}">${c.status}</span>
          <span class="badge badge-review">Stage 1: HOD Level</span>
        </div>
      </div>

      <div class="case-details-grid">
        <div class="field-item">
          <span class="field-label">Category</span>
          <span class="field-val">${c.complaintType === 'offline' ? 'Offline' : 'Online'} • ${c.category}</span>
        </div>
        <div class="field-item">
          <span class="field-label">Date & Location</span>
          <span class="field-val">${c.incidentDate} • ${escapeHtml(c.location)}</span>
        </div>
        <div class="field-item">
          <span class="field-label">Suspect Profile</span>
          <span class="field-val">${escapeHtml(c.suspectDetails.name)} (${escapeHtml(c.suspectDetails.department)})</span>
        </div>

        <!-- Masked Complainant Record (Strict Whistleblower Policy) -->
        <div class="field-item" style="grid-column: span 3; background: var(--bg-secondary); padding: 8px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--status-review);">
          <span class="field-label">Whistleblower Identity (HOD Protected View):</span>
          <span class="field-val masked">🔒 [Confidential - Identity Shielded Under University Anti-Retaliation Policy]</span>
        </div>
      </div>

      <div style="background: var(--bg-secondary); padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-secondary);">
        <strong>Incident Narrative:</strong> "${escapeHtml(c.description)}"
      </div>

      <!-- Internal Department Review Note Input -->
      <div class="internal-note-box">
        <span style="font-size: 0.72rem; color: var(--accent-cyan-light); font-weight: 700; text-transform: uppercase;">Internal HOD Review Note:</span>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="note-input-${c.referenceId}" placeholder="Enter department finding / inquiry note..." style="flex-grow: 1;">
          <button type="button" class="btn btn-secondary btn-sm btn-hod-add-note" data-ref="${c.referenceId}">Save Note</button>
        </div>
      </div>

      <div class="case-actions-row">
        <span style="font-size: 0.8rem; color: var(--text-muted);">
          Evidence: ${c.evidenceMetadata ? `📎 ${c.evidenceMetadata.filename} (${c.evidenceMetadata.filesize})` : 'No file attached'}
        </span>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm btn-auth-view-timeline" data-ref="${c.referenceId}">View Timeline</button>
          <button type="button" class="btn btn-secondary btn-sm btn-hod-mark-review" data-ref="${c.referenceId}">Mark In Review</button>
          <button type="button" class="btn btn-primary btn-sm btn-hod-forward-dean" data-ref="${c.referenceId}">Forward to Dean →</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach listeners
  container.querySelectorAll('.btn-auth-view-timeline').forEach(btn => {
    btn.addEventListener('click', () => showIncidentModal(btn.dataset.ref));
  });

  container.querySelectorAll('.btn-hod-mark-review').forEach(btn => {
    btn.addEventListener('click', () => {
      updateCaseStatus(btn.dataset.ref, 'Under Review', 'HOD initiated departmental inquiry with student proctors.');
    });
  });

  container.querySelectorAll('.btn-hod-forward-dean').forEach(btn => {
    btn.addEventListener('click', () => {
      escalateCaseToStage(btn.dataset.ref, 2, 'Elevated by HOD to Dean of Student Affairs for campus-wide proctorial action.');
    });
  });

  container.querySelectorAll('.btn-hod-add-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.dataset.ref;
      const noteInput = document.getElementById(`note-input-${ref}`);
      if (noteInput && noteInput.value.trim()) {
        addCaseNote(ref, noteInput.value.trim(), 'Dr. K. Ramanathan (HOD)');
        noteInput.value = '';
      }
    });
  });
}

/* ==========================================================================
   9. DEAN DASHBOARD CONTROLLER (STAGE 2 ESCALATED CASES)
   ========================================================================== */

function initDeanPortal() {
  document.querySelectorAll('#dean-portal-view .subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchDashboardPane(btn.dataset.pane);
    });
  });
}

function renderDeanPortal() {
  if (!AppState.currentUser) return;

  const escalatedDean = AppState.complaints.filter(c => c.escalationStage === 2);
  const awaiting = escalatedDean.filter(c => c.status === 'Submitted' || c.status === 'Escalated');
  const inReview = escalatedDean.filter(c => c.status === 'Under Review' || c.status === 'Action in Progress');
  const escalatedHigher = AppState.complaints.filter(c => c.escalationStage === 3);

  document.getElementById('dean-metric-escalated').textContent = escalatedDean.length;
  document.getElementById('dean-metric-awaiting').textContent = awaiting.length;
  document.getElementById('dean-metric-in-review').textContent = inReview.length;
  document.getElementById('dean-metric-escalated-higher').textContent = escalatedHigher.length;
  document.getElementById('dean-cases-badge').textContent = `${escalatedDean.length} Active`;

  renderDeanCases(document.getElementById('dean-cases-container'), escalatedDean);
  renderDeanCases(document.getElementById('dean-escalated-list'), escalatedDean);
  renderDeanCases(document.getElementById('dean-awaiting-list'), awaiting);
  renderDeanCases(document.getElementById('dean-active-list'), inReview);
  renderDeanCases(document.getElementById('dean-history-list'), AppState.complaints.filter(c => c.escalationStage >= 2));
}

function renderDeanCases(container, casesList) {
  if (!container) return;

  if (casesList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h4>No Cases Found</h4>
        <p>No complaints currently require Dean-level action under this filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  casesList.forEach(c => {
    const card = document.createElement('div');
    card.className = 'authority-case-card';

    card.innerHTML = `
      <div class="case-top-row">
        <div>
          <span style="font-family: var(--font-mono); font-size: 1.05rem; font-weight: 800; color: var(--accent-cyan-light);">${c.referenceId}</span>
          <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 8px;">Case Group: <strong>${c.caseGroup}</strong></span>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge ${getStatusBadgeClass(c.status)}">${c.status}</span>
          <span class="badge badge-escalated">Stage 2: Dean Level</span>
        </div>
      </div>

      <div class="case-details-grid">
        <div class="field-item">
          <span class="field-label">Category</span>
          <span class="field-val">${c.complaintType === 'offline' ? 'Offline' : 'Online'} • ${c.category}</span>
        </div>
        <div class="field-item">
          <span class="field-label">Date & Location</span>
          <span class="field-val">${c.incidentDate} • ${escapeHtml(c.location)}</span>
        </div>
        <div class="field-item">
          <span class="field-label">Suspect Profile</span>
          <span class="field-val">${escapeHtml(c.suspectDetails.name)} (${escapeHtml(c.suspectDetails.department)})</span>
        </div>

        <!-- Masked Complainant Record -->
        <div class="field-item" style="grid-column: span 3; background: var(--bg-secondary); padding: 8px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--status-escalated);">
          <span class="field-label">Whistleblower Identity (Dean Protected View):</span>
          <span class="field-val masked">🔒 [Confidential - Restricted at Dean Level to Prevent Retaliation]</span>
        </div>
      </div>

      <div style="background: var(--bg-secondary); padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-secondary);">
        <strong>Incident Narrative:</strong> "${escapeHtml(c.description)}"
      </div>

      <!-- Proctorial Note Input -->
      <div class="internal-note-box">
        <span style="font-size: 0.72rem; color: var(--status-escalated); font-weight: 700; text-transform: uppercase;">Dean Proctorial Finding / Instruction:</span>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="dean-note-input-${c.referenceId}" placeholder="Enter proctorial instruction / patrol directive..." style="flex-grow: 1;">
          <button type="button" class="btn btn-secondary btn-sm btn-dean-add-note" data-ref="${c.referenceId}">Save Note</button>
        </div>
      </div>

      <div class="case-actions-row">
        <span style="font-size: 0.8rem; color: var(--text-muted);">
          Evidence: ${c.evidenceMetadata ? `📎 ${c.evidenceMetadata.filename} (${c.evidenceMetadata.filesize})` : 'No file attached'}
        </span>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm btn-auth-view-timeline" data-ref="${c.referenceId}">View Timeline</button>
          <button type="button" class="btn btn-secondary btn-sm btn-dean-action" data-ref="${c.referenceId}">Initiate Action</button>
          <button type="button" class="btn btn-danger btn-sm btn-dean-escalate-higher" data-ref="${c.referenceId}">Escalate to Higher Authority →</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.btn-auth-view-timeline').forEach(btn => {
    btn.addEventListener('click', () => showIncidentModal(btn.dataset.ref));
  });

  container.querySelectorAll('.btn-dean-action').forEach(btn => {
    btn.addEventListener('click', () => {
      updateCaseStatus(btn.dataset.ref, 'Action in Progress', 'Dean dispatched campus security patrol and issued warning to suspects.');
    });
  });

  container.querySelectorAll('.btn-dean-escalate-higher').forEach(btn => {
    btn.addEventListener('click', () => {
      escalateCaseToStage(btn.dataset.ref, 3, 'Elevated by Dean to Higher Authority / Disciplinary Board due to persistent repeated violations.');
    });
  });

  container.querySelectorAll('.btn-dean-add-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.dataset.ref;
      const noteInput = document.getElementById(`dean-note-input-${ref}`);
      if (noteInput && noteInput.value.trim()) {
        addCaseNote(ref, noteInput.value.trim(), 'Prof. S. Soundararajan (Dean)');
        noteInput.value = '';
      }
    });
  });
}

/* ==========================================================================
   10. HIGHER AUTHORITY EXECUTIVE DASHBOARD (STAGE 3 CASES)
   ========================================================================== */

function initHigherAuthorityPortal() {
  document.querySelectorAll('#higher-authority-portal-view .subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchDashboardPane(btn.dataset.pane);
    });
  });
}

function renderHigherAuthorityPortal() {
  if (!AppState.currentUser) return;

  const stage3Cases = AppState.complaints.filter(c => c.escalationStage === 3);
  const inHearing = stage3Cases.filter(c => c.status === 'Action in Progress');
  const pending = stage3Cases.filter(c => c.status === 'Under Review' || c.status === 'Escalated');
  const resolved = AppState.complaints.filter(c => c.status === 'Resolved');

  document.getElementById('exec-metric-stage3').textContent = stage3Cases.length;
  document.getElementById('exec-metric-hearing').textContent = inHearing.length;
  document.getElementById('exec-metric-pending').textContent = pending.length;
  document.getElementById('exec-metric-resolved').textContent = resolved.length;
  document.getElementById('exec-cases-badge').textContent = `${stage3Cases.length} Critical`;

  renderHigherAuthorityCases(document.getElementById('exec-cases-container'), stage3Cases);
  renderHigherAuthorityCases(document.getElementById('exec-stage3-list'), stage3Cases);
  renderHigherAuthorityCases(document.getElementById('exec-all-list'), AppState.complaints);
  renderHigherAuthorityCases(document.getElementById('exec-pending-list'), pending);
  renderHigherAuthorityCases(document.getElementById('exec-history-list'), resolved);
}

function renderHigherAuthorityCases(container, casesList) {
  if (!container) return;

  if (casesList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h4>No Stage 3 Cases in Queue</h4>
        <p>No cases currently require executive statutory tribunal resolution.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  casesList.forEach(c => {
    const card = document.createElement('div');
    card.className = `authority-case-card ${c.escalationStage === 3 ? 'highlight-stage3' : ''}`;

    // Authorized Disclosure Check
    let reporterHtml = '';
    if (c.isAnonymous) {
      reporterHtml = `
        <span class="field-label">Whistleblower Identity (Statutory Audit):</span>
        <span class="field-val" style="color: var(--text-muted); font-style: italic;">🔒 Anonymous Whistleblower (Identity Sealed by Whistleblower Shield)</span>
      `;
    } else {
      reporterHtml = `
        <span class="field-label">Complainant Identity (Authorized Executive Clearance):</span>
        <div style="display: flex; gap: 16px; margin-top: 4px; flex-wrap: wrap;">
          <span>Name: <strong class="field-val unmasked-alert">👁️ ${escapeHtml(c.reporterDetails.name)}</strong></span>
          <span>ID: <strong class="field-val">${escapeHtml(c.reporterDetails.studentId)}</strong></span>
          <span>Contact: <strong class="field-val">${escapeHtml(c.reporterDetails.contact)}</strong></span>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="case-top-row">
        <div>
          <span style="font-family: var(--font-mono); font-size: 1.05rem; font-weight: 800; color: var(--accent-violet);">${c.referenceId}</span>
          <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 8px;">Case Group: <strong>${c.caseGroup}</strong></span>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge ${getStatusBadgeClass(c.status)}">${c.status}</span>
          <span class="badge ${c.escalationStage === 3 ? 'badge-critical' : (c.escalationStage === 2 ? 'badge-escalated' : 'badge-review')}">
            Stage ${c.escalationStage}: ${c.assignedAuthority}
          </span>
        </div>
      </div>

      <div class="case-details-grid">
        <div class="field-item">
          <span class="field-label">Category</span>
          <span class="field-val">${c.complaintType === 'offline' ? 'Offline' : 'Online'} • ${c.category}</span>
        </div>
        <div class="field-item">
          <span class="field-label">Date & Location</span>
          <span class="field-val">${c.incidentDate} • ${escapeHtml(c.location)}</span>
        </div>
        <div class="field-item">
          <span class="field-label">Suspect Profile</span>
          <span class="field-val">${escapeHtml(c.suspectDetails.name)} (${escapeHtml(c.suspectDetails.department)})</span>
        </div>

        <!-- Authorized Disclosure Record -->
        <div class="field-item" style="grid-column: span 3; background: rgba(139, 92, 246, 0.08); padding: 8px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-violet);">
          ${reporterHtml}
        </div>
      </div>

      <div style="background: var(--bg-secondary); padding: 10px; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-secondary);">
        <strong>Incident Narrative:</strong> "${escapeHtml(c.description)}"
      </div>

      <!-- Tribunal Hearing Note Input -->
      <div class="internal-note-box">
        <span style="font-size: 0.72rem; color: var(--accent-violet); font-weight: 700; text-transform: uppercase;">Statutory Tribunal Order / Finding:</span>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="exec-note-input-${c.referenceId}" placeholder="Enter disciplinary board order or resolution note..." style="flex-grow: 1;">
          <button type="button" class="btn btn-secondary btn-sm btn-exec-add-note" data-ref="${c.referenceId}">Record Order</button>
        </div>
      </div>

      <div class="case-actions-row">
        <span style="font-size: 0.8rem; color: var(--text-muted);">
          Evidence: ${c.evidenceMetadata ? `📎 ${c.evidenceMetadata.filename} (${c.evidenceMetadata.filesize})` : 'No file attached'}
        </span>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm btn-auth-view-timeline" data-ref="${c.referenceId}">View Full Timeline</button>
          <button type="button" class="btn btn-secondary btn-sm btn-exec-hearing" data-ref="${c.referenceId}">Convene Tribunal Hearing</button>
          <button type="button" class="btn btn-primary btn-sm btn-exec-resolve" data-ref="${c.referenceId}">Resolve & Close Case ✓</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.btn-auth-view-timeline').forEach(btn => {
    btn.addEventListener('click', () => showIncidentModal(btn.dataset.ref));
  });

  container.querySelectorAll('.btn-exec-hearing').forEach(btn => {
    btn.addEventListener('click', () => {
      updateCaseStatus(btn.dataset.ref, 'Action in Progress', 'Statutory Tribunal convened. Show-cause notices issued to suspects; interim suspension active.');
    });
  });

  container.querySelectorAll('.btn-exec-resolve').forEach(btn => {
    btn.addEventListener('click', () => {
      updateCaseStatus(btn.dataset.ref, 'Resolved', 'Executive Disciplinary Tribunal concluded. Corrective actions and sanctions executed.');
    });
  });

  container.querySelectorAll('.btn-exec-add-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const ref = btn.dataset.ref;
      const noteInput = document.getElementById(`exec-note-input-${ref}`);
      if (noteInput && noteInput.value.trim()) {
        addCaseNote(ref, noteInput.value.trim(), 'Dr. Malathi Narayanan (VC)');
        noteInput.value = '';
      }
    });
  });
}

/* ==========================================================================
   11. CASE STATUS & TIMELINE ACTIONS
   ========================================================================== */

function addCaseNote(refId, noteText, author) {
  const caseObj = AppState.complaints.find(c => c.referenceId === refId);
  if (!caseObj) return;

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  caseObj.timeline.push({
    id: `TL-NOTE-${Date.now()}`,
    title: `Internal Note Added`,
    description: `"${noteText}"`,
    timestamp: formattedTime,
    stage: caseObj.escalationStage,
    actor: author,
    type: 'review'
  });

  showToast(`Recorded note on case ${refId}`, 'success');

  // Re-render current active dashboard
  if (AppState.currentUser) {
    routeToRoleDashboard(AppState.currentUser.role);
  }
}

function updateCaseStatus(refId, newStatus, reason) {
  const caseObj = AppState.complaints.find(c => c.referenceId === refId);
  if (!caseObj) return;

  caseObj.status = newStatus;
  caseObj.updatedAt = new Date().toISOString();

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  caseObj.timeline.push({
    id: `TL-STATUS-${Date.now()}`,
    title: `Status: ${newStatus}`,
    description: reason,
    timestamp: formattedTime,
    stage: caseObj.escalationStage,
    actor: AppState.currentUser ? AppState.currentUser.name : 'Authority',
    type: 'review'
  });

  // Notify relevant parties
  triggerNotification({
    roleTarget: 'student',
    type: 'assigned',
    title: `Case Status Update: ${refId}`,
    message: `${refId} has been updated to "${newStatus}". ${reason}`,
    refId
  });

  showToast(`Case ${refId} status updated to: ${newStatus}`, 'success');

  if (AppState.currentUser) {
    routeToRoleDashboard(AppState.currentUser.role);
  }
}

function escalateCaseToStage(refId, newStage, reason) {
  const caseObj = AppState.complaints.find(c => c.referenceId === refId);
  if (!caseObj) return;

  caseObj.escalationStage = newStage;
  caseObj.assignedAuthority = ESCALATION_CONFIG[newStage].title;
  caseObj.status = newStage === 3 ? 'Action in Progress' : 'Escalated';
  caseObj.updatedAt = new Date().toISOString();

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  caseObj.timeline.push({
    id: `TL-ESC-${Date.now()}`,
    title: `Escalated to Stage ${newStage}: ${ESCALATION_CONFIG[newStage].title}`,
    description: reason,
    timestamp: formattedTime,
    stage: newStage,
    actor: AppState.currentUser ? AppState.currentUser.name : 'Authority',
    type: newStage === 3 ? 'critical' : 'escalated'
  });

  // Notify target role
  const targetRole = newStage === 3 ? 'higher_authority' : 'dean';
  triggerNotification({
    roleTarget: targetRole,
    type: newStage === 3 ? 'critical' : 'escalated',
    title: `Case Escalated: ${refId}`,
    message: reason,
    refId
  });

  showToast(`Case ${refId} escalated to ${ESCALATION_CONFIG[newStage].title}`, newStage === 3 ? 'error' : 'info');

  if (AppState.currentUser) {
    routeToRoleDashboard(AppState.currentUser.role);
  }
}

/* ==========================================================================
   12. NOTIFICATIONS SYSTEM
   ========================================================================== */

function initNotifications() {
  const btnToggle = document.getElementById('btn-toggle-notifications');
  const drawer = document.getElementById('notification-drawer');
  const btnClose = document.getElementById('btn-close-notifs');
  const btnMarkAll = document.getElementById('btn-mark-all-read');

  if (btnToggle && drawer) {
    btnToggle.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      drawer.classList.toggle('open', !isOpen);
      btnToggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      if (!isOpen) {
        renderNotificationsList();
      }
    });

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        drawer.classList.remove('open');
        btnToggle.setAttribute('aria-expanded', 'false');
      });
    }

    if (btnMarkAll) {
      btnMarkAll.addEventListener('click', () => {
        const userRole = AppState.currentUser ? AppState.currentUser.role : 'all';
        AppState.notifications.forEach(n => {
          if (n.roleTarget === userRole || userRole === 'all') {
            n.read = true;
          }
        });
        renderNotificationsList();
        updateNotificationBadge();
        showToast('All notifications marked as read.', 'info');
      });
    }

    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !btnToggle.contains(e.target)) {
        drawer.classList.remove('open');
        btnToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function triggerNotification(notifData) {
  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newNotif = {
    id: `NOTIF-${Date.now()}`,
    roleTarget: notifData.roleTarget || 'all',
    type: notifData.type || 'assigned',
    title: notifData.title,
    message: notifData.message,
    timestamp: formattedTime,
    read: false,
    refId: notifData.refId
  };

  AppState.notifications.unshift(newNotif);
  updateNotificationBadge();
}

function updateNotificationBadge() {
  const badge = document.getElementById('notification-counter');
  if (!badge) return;

  const currentRole = AppState.currentUser ? AppState.currentUser.role : null;
  const unreadCount = AppState.notifications.filter(n => !n.read && (n.roleTarget === currentRole || n.roleTarget === 'all')).length;

  badge.textContent = unreadCount;
  badge.style.display = unreadCount > 0 ? 'flex' : 'none';
}

function renderNotificationsList() {
  const container = document.getElementById('notification-items-container');
  if (!container) return;

  const currentRole = AppState.currentUser ? AppState.currentUser.role : null;
  const filtered = AppState.notifications.filter(n => n.roleTarget === currentRole || n.roleTarget === 'all');

  if (filtered.length === 0) {
    container.innerHTML = '<div class="notification-empty">No notifications for your active role.</div>';
    return;
  }

  container.innerHTML = '';
  filtered.forEach(n => {
    const item = document.createElement('div');
    item.className = `notification-item ${n.read ? '' : 'unread'} ${n.type === 'critical' ? 'alert-critical' : ''}`;

    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <strong style="font-size: 0.88rem; color: var(--text-primary);">${escapeHtml(n.title)}</strong>
        <span class="notification-time">${n.timestamp}</span>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 2px 0;">${escapeHtml(n.message)}</p>
      ${n.refId ? `
        <div style="display: flex; justify-content: flex-end; margin-top: 4px;">
          <button type="button" class="btn-link-xs btn-notif-view" data-ref="${n.refId}">View Case (${n.refId}) →</button>
        </div>
      ` : ''}
    `;

    item.addEventListener('click', () => {
      if (!n.read) {
        n.read = true;
        item.classList.remove('unread');
        updateNotificationBadge();
      }
    });

    const viewBtn = item.querySelector('.btn-notif-view');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        n.read = true;
        updateNotificationBadge();
        document.getElementById('notification-drawer').classList.remove('open');
        showIncidentModal(n.refId);
      });
    }

    container.appendChild(item);
  });
}

/* ==========================================================================
   13. COMPLAINT FORM WIZARD & SUBMISSION
   ========================================================================== */

function initComplaintForm() {
  const form = document.getElementById('complaint-form');
  const typeOfflineRadio = document.querySelector('input[name="complaintType"][value="offline"]');
  const typeOnlineRadio = document.querySelector('input[name="complaintType"][value="online"]');
  const categorySelect = document.getElementById('incident-category-select');
  const descTextarea = document.getElementById('incident-description');
  const charCounter = document.getElementById('char-counter');
  const dateInput = document.getElementById('incident-date');
  const anonCheckbox = document.getElementById('check-anonymous');
  const reporterFields = document.getElementById('reporter-fields-container');
  const anonBanner = document.getElementById('anonymous-active-banner');

  const todayStr = new Date().toISOString().split('T')[0];
  if (dateInput) {
    dateInput.max = todayStr;
    dateInput.value = todayStr;
  }

  function updateCategoriesForType(type) {
    categorySelect.innerHTML = '<option value="">-- Choose Category --</option>';
    if (type === 'offline') {
      ['Following or stalking', 'Unwanted behaviour', 'Threats or intimidation', 'Other offline incidents'].forEach(opt => {
        const el = document.createElement('option');
        el.value = opt;
        el.textContent = opt;
        categorySelect.appendChild(el);
      });
      document.getElementById('type-opt-offline').classList.add('selected');
      document.getElementById('type-opt-online').classList.remove('selected');
      document.getElementById('label-location').innerHTML = 'Physical Campus Location <span class="req">*</span>';
      document.getElementById('incident-location').placeholder = 'e.g., Central Library Block 3, North Lawn, Hostel Dining Hall';
    } else {
      ['Fake accounts', 'Obscene content', 'Online threats', 'Other cyber incidents'].forEach(opt => {
        const el = document.createElement('option');
        el.value = opt;
        el.textContent = opt;
        categorySelect.appendChild(el);
      });
      document.getElementById('type-opt-online').classList.add('selected');
      document.getElementById('type-opt-offline').classList.remove('selected');
      document.getElementById('label-location').innerHTML = 'Digital Platform / Handle / Group <span class="req">*</span>';
      document.getElementById('incident-location').placeholder = 'e.g., Instagram @handle, WhatsApp Class Group, Telegram';
    }
  }

  if (typeOfflineRadio && typeOnlineRadio) {
    typeOfflineRadio.addEventListener('change', () => updateCategoriesForType('offline'));
    typeOnlineRadio.addEventListener('change', () => updateCategoriesForType('online'));
  }

  if (descTextarea && charCounter) {
    descTextarea.addEventListener('input', () => {
      const len = descTextarea.value.length;
      charCounter.textContent = `${len} / 1000`;
      charCounter.style.color = len > 900 ? 'var(--status-critical)' : 'var(--text-muted)';
    });
  }

  if (anonCheckbox) {
    anonCheckbox.addEventListener('change', () => {
      if (anonCheckbox.checked) {
        reporterFields.style.display = 'none';
        anonBanner.style.display = 'block';
      } else {
        reporterFields.style.display = 'flex';
        anonBanner.style.display = 'none';
      }
    });
  }

  const btnNext = document.getElementById('btn-form-next');
  const btnPrev = document.getElementById('btn-form-prev');

  btnNext.addEventListener('click', () => {
    if (validateStep(AppState.formCurrentStep)) {
      goToStep(AppState.formCurrentStep + 1);
    }
  });

  btnPrev.addEventListener('click', () => {
    if (AppState.formCurrentStep > 1) {
      goToStep(AppState.formCurrentStep - 1);
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateStep(AppState.formCurrentStep)) {
        submitComplaint();
      }
    });
  }

  setupEvidenceUpload();
}

function goToStep(step) {
  AppState.formCurrentStep = step;

  for (let i = 1; i <= 5; i++) {
    const stepContent = document.getElementById(`step-content-${i}`);
    const stepperIndicator = document.getElementById(`stepper-step-${i}`);

    if (i === step) {
      stepContent.classList.add('active');
      stepperIndicator.classList.add('active');
      stepperIndicator.classList.remove('completed');
    } else if (i < step) {
      stepContent.classList.remove('active');
      stepperIndicator.classList.remove('active');
      stepperIndicator.classList.add('completed');
    } else {
      stepContent.classList.remove('active');
      stepperIndicator.classList.remove('active');
      stepperIndicator.classList.remove('completed');
    }
  }

  const btnPrev = document.getElementById('btn-form-prev');
  const btnNext = document.getElementById('btn-form-next');
  const btnSubmit = document.getElementById('btn-form-submit');

  btnPrev.style.visibility = step > 1 ? 'visible' : 'hidden';

  if (step === 5) {
    btnNext.style.display = 'none';
    btnSubmit.style.display = 'inline-flex';
    populateReviewSummary();
  } else {
    btnNext.style.display = 'inline-flex';
    btnSubmit.style.display = 'none';
  }
}

function validateStep(step) {
  let isValid = true;

  if (step === 1) {
    const category = document.getElementById('incident-category-select').value;
    const errCat = document.getElementById('err-category');
    if (!category) {
      errCat.classList.add('visible');
      isValid = false;
    } else {
      errCat.classList.remove('visible');
    }
  } else if (step === 2) {
    const dateVal = document.getElementById('incident-date').value;
    const timeVal = document.getElementById('incident-time').value;
    const locationVal = document.getElementById('incident-location').value.trim();
    const todayStr = new Date().toISOString().split('T')[0];

    const errDate = document.getElementById('err-date');
    const errTime = document.getElementById('err-time');
    const errLoc = document.getElementById('err-location');

    if (!dateVal || dateVal > todayStr) {
      errDate.classList.add('visible');
      isValid = false;
    } else { errDate.classList.remove('visible'); }

    if (!timeVal) {
      errTime.classList.add('visible');
      isValid = false;
    } else { errTime.classList.remove('visible'); }

    if (!locationVal) {
      errLoc.classList.add('visible');
      isValid = false;
    } else { errLoc.classList.remove('visible'); }
  } else if (step === 3) {
    const descVal = document.getElementById('incident-description').value.trim();
    const errDesc = document.getElementById('err-desc');
    if (!descVal || descVal.length < 15) {
      errDesc.classList.add('visible');
      isValid = false;
    } else { errDesc.classList.remove('visible'); }
  }

  return isValid;
}

function setupEvidenceUpload() {
  const dropzone = document.getElementById('evidence-dropzone');
  const fileInput = document.getElementById('evidence-file-input');
  const previewBox = document.getElementById('evidence-preview-box');
  const btnRemove = document.getElementById('btn-remove-evidence');
  const filenameEl = document.getElementById('evidence-filename');
  const filesizeEl = document.getElementById('evidence-filesize');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    dropzone.addEventListener(name, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleEvidenceFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleEvidenceFile(fileInput.files[0]);
    }
  });

  btnRemove.addEventListener('click', () => {
    AppState.pendingEvidence = null;
    fileInput.value = '';
    previewBox.classList.remove('active');
    dropzone.style.display = 'flex';
    showToast('Evidence removed.', 'info');
  });

  function handleEvidenceFile(file) {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      showToast('Unsupported file type. Please upload PNG, JPG, or PDF.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit.', 'error');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024 
      ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : Math.round(file.size / 1024) + ' KB';

    AppState.pendingEvidence = {
      filename: file.name,
      filesize: sizeFormatted,
      filetype: file.type
    };

    filenameEl.textContent = file.name;
    filesizeEl.textContent = sizeFormatted;
    previewBox.classList.add('active');
    dropzone.style.display = 'none';

    showToast(`Attached evidence: ${file.name}`, 'success');
  }
}

function populateReviewSummary() {
  const container = document.getElementById('review-summary-container');
  const type = document.querySelector('input[name="complaintType"]:checked').value;
  const category = document.getElementById('incident-category-select').value;
  const caseGroup = document.getElementById('demo-case-group').value.trim() || 'Auto-assigned New Group';
  const date = document.getElementById('incident-date').value;
  const time = document.getElementById('incident-time').value;
  const location = document.getElementById('incident-location').value;
  const desc = document.getElementById('incident-description').value;
  const suspectName = document.getElementById('suspect-name').value || 'Not specified';
  const isAnonymous = document.getElementById('check-anonymous').checked;

  const escalationPreview = evaluateEscalation(caseGroup);

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
      <div><strong>Nature:</strong> ${type === 'offline' ? 'Offline Ragging' : 'Online Ragging'}</div>
      <div><strong>Category:</strong> ${category}</div>
      <div><strong>Case Group:</strong> <span style="font-family: var(--font-mono); color: var(--accent-cyan-light);">${caseGroup}</span></div>
      <div><strong>Date & Time:</strong> ${date} at ${time}</div>
      <div><strong>Location / Platform:</strong> ${location}</div>
      <div><strong>Suspect:</strong> ${suspectName}</div>
      <div><strong>Privacy Mode:</strong> ${isAnonymous ? '<span class="badge badge-anonymous">Anonymous</span>' : 'Standard'}</div>
    </div>
    <div style="margin-top: 6px;">
      <strong>Description:</strong>
      <p style="color: var(--text-secondary); margin-top: 4px; font-style: italic;">"${escapeHtml(desc)}"</p>
    </div>
    <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid var(--accent-cyan); padding: 8px 12px; border-radius: var(--radius-sm); margin-top: 6px;">
      <span style="font-weight: 700; color: var(--accent-cyan-light);">⚡ Escalation Projection:</span>
      <span style="font-size: 0.82rem; color: var(--text-primary); display: block;">
        Report #${escalationPreview.reportCount} for this case group routes directly to <strong>${escalationPreview.config.title}</strong> (${escalationPreview.config.badgeText}).
      </span>
    </div>
  `;
}

function evaluateEscalation(caseGroup) {
  if (!caseGroup || caseGroup.trim() === '') {
    return {
      stage: 1,
      config: ESCALATION_CONFIG[1],
      reportCount: 1,
      reason: 'First standalone qualifying complaint assigned to local Department Head.'
    };
  }

  const existingMatches = AppState.complaints.filter(
    c => c.caseGroup && c.caseGroup.trim().toLowerCase() === caseGroup.trim().toLowerCase()
  );
  const reportCount = existingMatches.length + 1;

  let stage = 1;
  let reason = '';

  if (reportCount === 1) {
    stage = 1;
    reason = 'First qualifying report for case group. Assigned to HOD for departmental evaluation.';
  } else if (reportCount === 2) {
    stage = 2;
    reason = `AUTOMATIC ESCALATION (2nd Report): Repeat incident detected for [${caseGroup}]. Elevated to Dean of Student Affairs.`;
  } else {
    stage = 3;
    reason = `CRITICAL ESCALATION (Report #${reportCount}): Multiple repeat violations confirmed for [${caseGroup}]. Elevated to Higher Authority / Disciplinary Board for statutory action.`;
  }

  return { stage, config: ESCALATION_CONFIG[stage], reportCount, reason };
}

function submitComplaint() {
  const type = document.querySelector('input[name="complaintType"]:checked').value;
  const category = document.getElementById('incident-category-select').value;
  let caseGroup = document.getElementById('demo-case-group').value.trim();
  const date = document.getElementById('incident-date').value;
  const time = document.getElementById('incident-time').value;
  const location = document.getElementById('incident-location').value.trim();
  const desc = document.getElementById('incident-description').value.trim();
  const suspectName = document.getElementById('suspect-name').value.trim();
  const suspectDept = document.getElementById('suspect-dept').value.trim();
  const suspectPhone = document.getElementById('suspect-phone').value.trim();
  const isAnonymous = document.getElementById('check-anonymous').checked;

  const year = new Date().getFullYear();
  const refId = `CR-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (!caseGroup) {
    caseGroup = `CASE-${Date.now().toString().slice(-4)}`;
  }

  const evalResult = evaluateEscalation(caseGroup);

  const now = new Date();
  const timeFormatted = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + ' • ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newComplaint = {
    referenceId: refId,
    caseGroup,
    complaintType: type,
    category,
    incidentDate: date,
    incidentTime: time,
    location,
    description: desc,
    suspectDetails: {
      name: suspectName || 'Unknown / Not provided',
      department: suspectDept || 'N/A',
      phone: suspectPhone || 'N/A'
    },
    reporterDetails: {
      name: isAnonymous ? 'Anonymous' : (AppState.currentUser ? AppState.currentUser.name : 'Student Reporter'),
      studentId: isAnonymous ? 'ANON' : (AppState.currentUser ? AppState.currentUser.id : 'STU-000'),
      contact: isAnonymous ? 'N/A' : (AppState.currentUser ? AppState.currentUser.email : 'N/A')
    },
    isAnonymous,
    evidenceMetadata: AppState.pendingEvidence,
    status: evalResult.stage === 1 ? 'Under Review' : (evalResult.stage === 2 ? 'Escalated' : 'Action in Progress'),
    escalationStage: evalResult.stage,
    assignedAuthority: evalResult.config.title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        id: `TL-1-${Date.now()}`,
        title: 'Report Lodged',
        description: 'Student securely filed complaint via confidential portal.',
        timestamp: timeFormatted,
        stage: evalResult.stage,
        actor: isAnonymous ? 'Anonymous Whistleblower' : 'Student',
        type: 'submitted'
      },
      {
        id: `TL-2-${Date.now()}`,
        title: `Assigned to ${evalResult.config.title}`,
        description: evalResult.reason,
        timestamp: timeFormatted,
        stage: evalResult.stage,
        actor: 'Escalation Engine',
        type: evalResult.stage > 1 ? 'escalated' : 'assigned'
      }
    ]
  };

  AppState.complaints.unshift(newComplaint);

  // Notify relevant role
  const targetRole = evalResult.stage === 3 ? 'higher_authority' : (evalResult.stage === 2 ? 'dean' : 'hod');
  triggerNotification({
    roleTarget: targetRole,
    type: evalResult.stage === 3 ? 'critical' : (evalResult.stage === 2 ? 'escalated' : 'assigned'),
    title: `New Report: ${refId} (${evalResult.config.badgeText})`,
    message: evalResult.reason,
    refId
  });

  // Display success card
  document.getElementById('complaint-form').style.display = 'none';
  const successCard = document.getElementById('submission-success-card');
  document.getElementById('success-ref-code').textContent = refId;
  successCard.classList.add('active');

  document.getElementById('btn-copy-ref').onclick = () => {
    navigator.clipboard.writeText(refId).then(() => {
      showToast(`Copied ${refId} to clipboard!`, 'success');
    }).catch(() => {
      showToast(`Reference ID: ${refId}`, 'info');
    });
  };

  document.getElementById('btn-success-track').onclick = () => {
    switchDashboardPane('student-pane-track');
    document.getElementById('track-input-ref').value = refId;
    searchComplaint(refId);
  };

  showToast(`Complaint filed successfully (${refId})`, 'success');
}

/* ==========================================================================
   14. TRACKING & LOOKUP
   ========================================================================== */

function initTracking() {
  const btnSearch = document.getElementById('btn-search-tracking');
  const inputRef = document.getElementById('track-input-ref');
  const demoPills = document.querySelectorAll('.demo-pill-btn');

  if (btnSearch && inputRef) {
    btnSearch.addEventListener('click', () => {
      searchComplaint(inputRef.value.trim().toUpperCase());
    });
    inputRef.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchComplaint(inputRef.value.trim().toUpperCase());
    });
  }

  demoPills.forEach(p => {
    p.addEventListener('click', () => {
      inputRef.value = p.dataset.ref;
      searchComplaint(p.dataset.ref);
    });
  });
}

function searchComplaint(refId) {
  const errSearch = document.getElementById('err-tracking-search');
  const resultCard = document.getElementById('tracking-result-card');

  if (!refId) {
    errSearch.textContent = 'Please enter a complaint reference ID.';
    errSearch.classList.add('visible');
    resultCard.classList.remove('active');
    return;
  }

  const found = AppState.complaints.find(c => c.referenceId.toUpperCase() === refId.toUpperCase());
  if (!found) {
    errSearch.textContent = `No complaint found with Reference ID "${refId}".`;
    errSearch.classList.add('visible');
    resultCard.classList.remove('active');
    showToast('Reference ID not found.', 'error');
    return;
  }

  errSearch.classList.remove('visible');

  document.getElementById('track-res-id').textContent = found.referenceId;
  document.getElementById('track-res-type').textContent = `${found.complaintType === 'offline' ? 'Offline Ragging' : 'Cyber Ragging'} • ${found.category}`;

  const statusBadge = document.getElementById('track-res-status-badge');
  statusBadge.textContent = found.status;
  statusBadge.className = 'badge ' + getStatusBadgeClass(found.status);

  const authBadge = document.getElementById('track-res-authority-badge');
  authBadge.textContent = found.assignedAuthority;
  authBadge.className = 'badge badge-authority';

  document.getElementById('track-res-date').textContent = new Date(found.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric'
  });
  document.getElementById('track-res-location').textContent = found.location;
  document.getElementById('track-res-stage').textContent = `Stage ${found.escalationStage}: ${found.assignedAuthority}`;
  document.getElementById('track-res-next-step').textContent = ESCALATION_CONFIG[found.escalationStage].nextStep;

  // Timeline
  const container = document.getElementById('tracking-timeline-container');
  container.innerHTML = '';
  found.timeline.forEach(evt => {
    const el = document.createElement('div');
    el.className = `timeline-event ${evt.type === 'escalated' ? 'event-escalated' : (evt.type === 'critical' ? 'event-critical' : '')}`;
    el.innerHTML = `
      <div class="timeline-dot" aria-hidden="true"></div>
      <span class="timeline-time">${evt.timestamp} • Action by: ${evt.actor}</span>
      <h5 class="timeline-title">${escapeHtml(evt.title)}</h5>
      <div class="timeline-body">${escapeHtml(evt.description)}</div>
    `;
    container.appendChild(el);
  });

  resultCard.classList.add('active');
}

/* ==========================================================================
   15. SAFE ZONE MAP & MODALS
   ========================================================================== */

const CAMPUS_ZONES = {
  gate: {
    title: 'Central Quad Security Post',
    badge: 'Checkpoint 01',
    location: 'Campus Core Intersection (Open 24/7)',
    features: ['24/7 Uniformed Security Warden on duty', 'High-definition CCTV coverage with direct control room feed'],
    officer: 'Officer Rajendran K.',
    phone: 'Ext: #2041'
  },
  library: {
    title: 'Central Library 24x7 Safety Kiosk',
    badge: 'Checkpoint 02',
    location: 'Central Library East Wing Entrance',
    features: ['Well-lit late-night safe escort waiting hub', 'Emergency call intercom linked to dispensary'],
    officer: 'Officer Meenakshi S.',
    phone: 'Ext: #2042'
  },
  hostel: {
    title: "Women's Residential Safety Post",
    badge: 'Checkpoint 03',
    location: "Enclave Gate, Women's Hall of Residence",
    features: ['Biometric access gate with continuous surveillance', 'Female security warden on round-the-clock duty'],
    officer: 'Warden Dr. V. Anitha',
    phone: 'Ext: #2043'
  },
  cyber: {
    title: 'Cyber Safety & Digital Incident Cell',
    badge: 'Checkpoint 04',
    location: 'Computer Center Block 2, Ground Floor',
    features: ['Digital forensic evidence preservation assistance', 'Social media takedown liaison desk'],
    officer: 'Er. S. Balamurugan',
    phone: 'Ext: #2044'
  }
};

function initSafeZoneMap() {
  document.querySelectorAll('.zone-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      const zone = CAMPUS_ZONES[pin.dataset.zone];
      if (!zone) return;

      document.getElementById('zone-title').textContent = zone.title;
      document.getElementById('zone-badge').textContent = zone.badge;
      document.getElementById('zone-location').textContent = `Location: ${zone.location}`;
      document.getElementById('zone-officer').textContent = zone.officer;
      document.getElementById('zone-phone').textContent = zone.phone;

      const fContainer = document.getElementById('zone-features');
      fContainer.innerHTML = '';
      zone.features.forEach(f => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${escapeHtml(f)}</span>`;
        fContainer.appendChild(li);
      });

      showToast(`Selected Safe Zone: ${zone.title}`, 'info');
    });
  });
}

function showIncidentModal(refId) {
  const c = AppState.complaints.find(comp => comp.referenceId === refId);
  if (!c) return;

  const currentRole = AppState.currentUser ? AppState.currentUser.role : 'student';
  const modal = document.getElementById('incident-modal');
  const modalTitle = document.getElementById('modal-incident-title');
  const modalBody = document.getElementById('modal-body-content');

  modalTitle.textContent = `Case Record: ${c.referenceId}`;

  // Privacy formatting
  let reporterDisplay = '🔒 [Confidential - Restricted to Prevent Bias]';
  if (c.isAnonymous) {
    reporterDisplay = '🔒 [Anonymous Whistleblower - Identity Protected]';
  } else if (currentRole === 'higher_authority') {
    reporterDisplay = `👁️ ${escapeHtml(c.reporterDetails.name)} (${escapeHtml(c.reporterDetails.studentId)}) - ${escapeHtml(c.reporterDetails.contact)}`;
  } else if (currentRole === 'student') {
    reporterDisplay = `${escapeHtml(c.reporterDetails.name)} (${escapeHtml(c.reporterDetails.studentId)})`;
  }

  modalBody.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
      <span class="badge ${getStatusBadgeClass(c.status)}">${c.status}</span>
      <span class="badge ${c.escalationStage === 3 ? 'badge-critical' : (c.escalationStage === 2 ? 'badge-escalated' : 'badge-review')}">
        Stage ${c.escalationStage}: ${c.assignedAuthority}
      </span>
      ${c.isAnonymous ? '<span class="badge badge-anonymous">Anonymous</span>' : ''}
    </div>

    <div style="background: var(--bg-secondary); padding: 12px; border-radius: var(--radius-md); display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.85rem;">
      <div><strong>Nature:</strong> ${c.complaintType === 'offline' ? 'Offline Ragging' : 'Online Ragging'}</div>
      <div><strong>Category:</strong> ${c.category}</div>
      <div><strong>Date:</strong> ${c.incidentDate} at ${c.incidentTime}</div>
      <div><strong>Location:</strong> ${escapeHtml(c.location)}</div>
      <div><strong>Case Group:</strong> <span style="font-family: var(--font-mono); color: var(--accent-cyan);">${c.caseGroup}</span></div>
      <div><strong>Suspect:</strong> ${escapeHtml(c.suspectDetails.name)}</div>
    </div>

    <div style="background: rgba(6, 182, 212, 0.06); border: 1px dashed var(--accent-cyan); padding: 10px; border-radius: var(--radius-md); font-size: 0.82rem;">
      <strong>Whistleblower Identity Record:</strong>
      <div style="margin-top: 4px;">${reporterDisplay}</div>
    </div>

    <div>
      <h5 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 4px;">Incident Narrative:</h5>
      <p style="font-size: 0.85rem; color: var(--text-secondary); background: var(--bg-secondary); padding: 10px; border-radius: var(--radius-sm); max-height: 120px; overflow-y: auto;">
        ${escapeHtml(c.description)}
      </p>
    </div>

    ${c.evidenceMetadata ? `
      <div style="background: var(--bg-secondary); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.8rem;">
        📎 Attached Evidence: <strong>${c.evidenceMetadata.filename}</strong> (${c.evidenceMetadata.filesize})
      </div>
    ` : ''}

    <div>
      <h5 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 8px;">Action Timeline:</h5>
      <div class="timeline-container" style="max-height: 180px; overflow-y: auto;">
        ${c.timeline.map(t => `
          <div class="timeline-event">
            <div class="timeline-dot"></div>
            <span class="timeline-time">${t.timestamp} • By: ${t.actor}</span>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">${escapeHtml(t.title)}</div>
            <div class="timeline-body">${escapeHtml(t.description)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.add('active');
}

/* ==========================================================================
   16. ACCESSIBILITY, THEME & TRANSLATION CONTROLS
   ========================================================================== */

function initAccessibilityAndControls() {
  const langBtn = document.getElementById('btn-lang-toggle');
  const langLabel = document.getElementById('current-lang-label');
  const fontBtn = document.getElementById('btn-font-toggle');
  const themeBtn = document.getElementById('btn-theme-toggle');
  const mobileToggle = document.getElementById('btn-mobile-menu');
  const navLinks = document.getElementById('main-nav-links');

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      AppState.activeLang = AppState.activeLang === 'en' ? 'ta' : 'en';
      langLabel.textContent = AppState.activeLang === 'en' ? 'தமிழ் (Tamil)' : 'English (EN)';
      applyTranslations(AppState.activeLang);
      showToast(AppState.activeLang === 'ta' ? 'தமிழ் மொழி மாற்றப்பட்டது' : 'Switched to English', 'info');
    });
  }

  if (fontBtn) {
    fontBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-font-size');
      const next = cur === 'normal' ? 'large' : (cur === 'large' ? 'small' : 'normal');
      document.documentElement.setAttribute('data-font-size', next);
      showToast(`Text scale: ${next.toUpperCase()}`, 'info');
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      showToast(`Switched to ${next} theme`, 'info');
    });
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('mobile-open');
      navLinks.classList.toggle('mobile-open', !isOpen);
      mobileToggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  }

  const modal = document.getElementById('incident-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnDismissModal = document.getElementById('btn-modal-dismiss');
  [btnCloseModal, btnDismissModal].forEach(b => {
    if (b) b.addEventListener('click', () => modal.classList.remove('active'));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      const notifDrawer = document.getElementById('notification-drawer');
      if (notifDrawer) notifDrawer.classList.remove('open');
    }
  });
}

function applyTranslations(lang) {
  const dict = I18N[lang] || I18N.en;
  const disclaimerEl = document.getElementById('banner-disclaimer-text');
  const brandTagline = document.getElementById('brand-tagline');
  const heroH1 = document.getElementById('login-hero-h1');

  if (disclaimerEl) disclaimerEl.textContent = dict.bannerDisclaimer;
  if (brandTagline) brandTagline.textContent = dict.brandTagline;
  if (heroH1) heroH1.innerHTML = dict.loginHeroH1;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 3500);
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Submitted': return 'badge-submitted';
    case 'Under Review': return 'badge-review';
    case 'Escalated': return 'badge-escalated';
    case 'Action in Progress': return 'badge-critical';
    case 'Resolved': return 'badge-resolved';
    default: return 'badge-submitted';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   17. INITIALIZATION BOOTSTRAPPER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Load seed complaints & notifications
  AppState.complaints = [...INITIAL_SEED_COMPLAINTS];
  AppState.notifications = [...INITIAL_NOTIFICATIONS];

  // Initialize interactive components
  initAuthentication();
  initStudentPortal();
  initHodPortal();
  initDeanPortal();
  initHigherAuthorityPortal();
  initComplaintForm();
  initTracking();
  initNotifications();
  initSafeZoneMap();
  initAccessibilityAndControls();

  // Initial state: Start on dedicated Login View
  showView('login-view');
  console.log('CampusGuard Role Authentication & Dedicated Dashboards initialized.');
});
