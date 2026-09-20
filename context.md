# RatinoCare --- Project Context / Source of Truth

## 1. Project Identity

**Application Name:** RatinoCare

**Primary Application Type:**\
**Diabetes Retinopathy Screening Appointment System**

RatinoCare is primarily a healthcare appointment and
screening-management platform focused on diabetes-related retinal
screening. The core purpose of the application is to connect patients
with doctors, manage screening appointments, provide doctor/clinic
workflows, and maintain relevant screening records.

### Important Product Positioning

The AI medical-report analysis feature is an **additional supporting
feature** of RatinoCare. It is **not** the primary identity of the
application.

The project must continue to be described as:

> **RatinoCare --- Diabetes Retinopathy Screening Appointment System**

Do **not** rename or reposition the application as: - Medical Report
Analyzer - AI Report Analyzer - AI Healthcare Report Platform - Report
Analysis System

The AI report-analysis functionality is an extension that adds
intelligence to the existing diabetes retinopathy screening and
appointment workflow.

------------------------------------------------------------------------

# 2. Core Product Vision

RatinoCare is designed to provide a structured digital workflow for
diabetes retinopathy screening appointments.

The primary workflow is:

``` text
Patient
   ↓
Register / Login
   ↓
Explore Doctors / Screening Services
   ↓
Choose Doctor / Available Slot
   ↓
Book Screening Appointment
   ↓
Appointment Management
   ↓
Doctor Consultation / Screening
   ↓
Screening / Report
   ↓
Patient Report History
   ↓
Follow-up / Future Appointments
```

The platform can additionally support:

``` text
Medical Report
   ↓
Patient Uploads Report
   ↓
AI-Assisted Report Understanding
   ↓
Patient-Friendly Explanation
   ↓
Report Stored in History
   ↓
Future Reports Compared
   ↓
Possible Changes / Trends Highlighted
   ↓
Doctor Review When Configured Rules Require It
```

The second flow is an **additional AI capability inside the main
screening appointment system**.

------------------------------------------------------------------------

# 3. Main Objective

The main objective of RatinoCare is to make diabetes retinopathy
screening appointments and related healthcare workflows easier to manage
for:

-   Patients
-   Doctors
-   Administrators

The platform should support:

-   Patient registration and authentication
-   Doctor discovery
-   Doctor information
-   Appointment booking
-   Slot management
-   Appointment status management
-   Patient appointment history
-   Doctor appointment management
-   Screening-related reports
-   Patient report history
-   Doctor review workflows
-   Secure role-based access
-   Additional AI-assisted report understanding

------------------------------------------------------------------------

# 4. Secondary AI Feature

RatinoCare includes an additional AI feature for uploaded medical
reports.

### AI Feature Definition

> **RatinoCare can use AI to understand patients' uploaded medical
> reports, explain their results in accessible language, track changes
> across reports over time, and support a rule-based workflow that can
> flag cases for doctor review.**

This feature should complement the screening appointment system rather
than replace it.

### AI Responsibilities

The AI may:

-   Read uploaded medical report PDFs
-   Extract relevant information from reports
-   Identify test names
-   Extract values
-   Extract units when available
-   Extract report dates when available
-   Extract reference ranges when available
-   Convert report information into structured data
-   Explain report information in patient-friendly language
-   Summarize a report
-   Compare compatible values between reports
-   Highlight changes and trends
-   Prepare a structured summary for doctor review

### AI Must Not

The AI must not:

-   Independently diagnose a patient
-   Claim to replace a doctor
-   Prescribe medicines
-   Recommend medication changes without professional oversight
-   Make final clinical decisions
-   Present uncertain information as certain
-   Invent missing values
-   Invent reference ranges
-   Fabricate medical information
-   Claim guaranteed accuracy
-   Automatically make a final doctor-review decision without explicit
    rules

------------------------------------------------------------------------

# 5. AI + Doctor Responsibility

The AI feature is an assistance layer.

The intended responsibility model is:

``` text
AI
 ↓
Extracts information
 ↓
Explains information
 ↓
Identifies possible changes
 ↓
Creates structured summary
 ↓
Rule-based monitoring
 ↓
Doctor Review
 ↓
Doctor makes professional interpretation / decision
```

AI should support doctors and patients, not replace clinical
professionals.

The application should clearly communicate that AI-generated information
is supportive and should be interpreted by an appropriate healthcare
professional.

------------------------------------------------------------------------

# 6. Rule-Based Doctor Review

Doctor escalation should not depend only on an LLM's judgment.

The architecture should use explicit, understandable rules for cases
that require review.

Example conceptual workflow:

``` text
Report uploaded
      ↓
AI extracts structured values
      ↓
Values validated
      ↓
Rule engine checks configured conditions
      ↓
Condition met?
   ↙          ↘
 YES           NO
  ↓             ↓
Flag for       Continue
doctor review  normal workflow
```

Rules should be:

-   Explicit
-   Auditable
-   Understandable
-   Configurable
-   Separate from free-form AI reasoning

The AI can help identify changes, but the final clinical interpretation
remains with the doctor.

------------------------------------------------------------------------

# 7. Primary User Roles

RatinoCare has three major user roles.

## 7.1 Patient

Patients should be able to:

-   Register
-   Login
-   Manage profile
-   View doctors
-   View doctor information
-   View available appointment slots
-   Book appointments
-   View upcoming appointments
-   View appointment history
-   Cancel appointments when permitted
-   Upload medical reports
-   View uploaded reports
-   View AI-generated explanations
-   View report history
-   View changes across reports where supported
-   View doctor-review status where appropriate

------------------------------------------------------------------------

## 7.2 Doctor

Doctors should be able to:

-   Login
-   Manage professional profile
-   View appointments
-   View patient-related appointment information
-   Accept/update appointment status where permitted
-   Review patient reports
-   View report history
-   View AI-generated summaries
-   Review flagged cases
-   Provide professional advice
-   Manage available slots where supported

The doctor remains responsible for clinical interpretation.

### Doctor Credential Verification (Solution 1)

To prevent unauthorized clinical access:
- Doctor registrations explicitly require **Medical License Number** and **Specialization / Practice Area**.
- Doctor accounts are assigned `isApproved: false` upon registration.
- Administrators review and approve doctor credentials before clinical features (slot management, patient screening reviews) are activated.

------------------------------------------------------------------------

## 7.3 Administrator

Administrators should be able to:

-   Manage users
-   Manage doctors
-   Manage system-level data
-   Monitor appointments
-   Manage slots/workflows
-   View relevant platform information
-   Perform administrative operations according to backend authorization
    rules

------------------------------------------------------------------------

# 8. Current Technology Stack

## Frontend

-   React
-   Vite
-   JavaScript
-   Tailwind CSS v4
-   shadcn/ui
-   Base UI
-   Nova
-   React Router DOM
-   Axios
-   Framer Motion
-   Redux Toolkit
-   Lucide React
-   ESLint

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT
-   bcrypt
-   dotenv
-   Winston / logging utilities

## Development Tools

-   Git
-   GitHub
-   VS Code
-   npm

------------------------------------------------------------------------

# 9. Backend Architecture

The backend is already considered functionally complete.

Current structure:

``` text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
└── validators/
```

There is no separate `app.js`.

The Express application is created in the server entry file.

------------------------------------------------------------------------

# 10. Main Backend API Groups

Current route groups:

``` text
/api/auth
/api/appointments
/api/reports
/api/slots
/api/doctors
/api/dashboard
```

These APIs support the main appointment and screening workflow.

------------------------------------------------------------------------

# 11. Appointment System

Appointment management is a **core feature**, not an optional feature.

The appointment workflow includes:

``` text
Doctor
 ↓
Available Slots
 ↓
Patient selects slot
 ↓
Appointment created
 ↓
Appointment status
 ↓
Doctor / Patient views appointment
 ↓
Appointment completed / cancelled / updated
```

Important appointment capabilities include:

-   Create appointment
-   Book slot
-   View appointments
-   View patient appointments
-   View doctor appointments
-   View individual appointment
-   Update appointment status
-   Cancel appointment

Existing route concepts include:

``` text
POST /api/appointments/create
GET  /api/appointments
POST /api/appointments/book-slot
GET  /api/appointments/my-appointments
GET  /api/appointments/patient/:patientId
GET  /api/appointments/doctor/:doctorId
GET  /api/appointments/:id
PATCH /api/appointments/:id/status
PATCH /api/appointments/:id/cancel
```

Do not invent alternative API paths when existing backend routes already
support the required functionality.

------------------------------------------------------------------------

# 12. Authentication and Authorization

RatinoCare uses:

-   JWT authentication
-   bcrypt password hashing
-   Protected routes
-   Role-based authorization

The application should distinguish between:

``` text
Patient
Doctor
Admin
```

The frontend should use the authenticated user information to display
role-appropriate content.

Prefer a shared protected dashboard route:

``` text
/dashboard
```

rather than creating unnecessary separate dashboard route systems such
as:

``` text
/admin/dashboard
/doctor/dashboard
/patient/dashboard
```

Role-specific dashboard content can be rendered inside the shared
dashboard.

------------------------------------------------------------------------

# 13. Frontend Architecture

Current recommended structure:

``` text
frontend/
└── src/
    ├── app/
    ├── assets/
    │   └── animations/
    ├── components/
    ├── config/
    ├── features/
    ├── hooks/
    ├── layouts/
    ├── lib/
    ├── pages/
    ├── routes/
    ├── services/
    ├── store/
    └── styles/
```

Use feature-oriented organization where practical.

Example:

``` text
src/features/landing/
├── components/
├── data/
└── LandingPage.jsx
```

Do not perform large folder refactors unless there is a concrete
technical reason.

------------------------------------------------------------------------

# 14. Main Frontend Routes

## Public

``` text
/
 /login
 /register
```

## Protected

``` text
/dashboard
/doctors
/appointments
/reports
/slots
/profile
```

## Future AI-related page

The AI feature can use a route such as:

``` text
/report-analysis
```

or:

``` text
/ai-insights
```

This route should be understood as an AI-support feature within
RatinoCare, not as the identity of the whole application.

------------------------------------------------------------------------

# 15. Landing Page

The landing page is primarily for the **Diabetes Retinopathy Screening
Appointment System**.

The landing page should communicate:

-   Diabetes retinopathy screening
-   Appointment booking
-   Doctors
-   Patients
-   Screening workflow
-   Secure healthcare platform
-   Appointment management
-   Reports and follow-up
-   AI-assisted capabilities as an additional feature

The landing page should NOT make the application look like a standalone
AI report analyzer.

------------------------------------------------------------------------

# 16. Landing Page Structure

Current intended structure:

``` text
Intro Animation
↓
Navbar
↓
Hero
↓
Trusted By / Platform Capabilities
↓
Features
↓
How It Works
↓
AI-Assisted Report Insights
↓
Why RatinoCare
↓
Statistics / Platform Capabilities
↓
User Perspectives
↓
FAQ
↓
CTA
↓
Footer
```

------------------------------------------------------------------------

# 17. Landing Page Components

Current components:

``` text
src/features/landing/components/
├── IntroAnimation/
├── Navbar/
├── Hero/
├── TrustedBy/
├── Features/
├── HowItWorks/
├── AIInsights/
├── WhyChooseUs/
├── Statistics/
├── UserPerspectives/
├── FAQ/
├── CTA/
└── Footer/
```

The component previously named `AIDetection` has been updated to `AIInsights/` (`AIInsights.jsx`) to accurately reflect AI-assisted report insights.

The purpose of the section should be clearly shown as an **additional
AI-assisted capability**.

Avoid unnecessary refactoring until the section actually needs to be
changed.

------------------------------------------------------------------------

# 18. Landing Page Hero Positioning

The hero should make the primary product immediately clear.

Recommended conceptual messaging:

**Primary identity:**

> Diabetes Retinopathy Screening & Appointment System

Possible supporting message:

> Simplify screening appointments, manage healthcare workflows, and keep
> your screening records organized --- with additional AI-assisted
> insights for uploaded reports.

The exact marketing copy can be refined later, but the hierarchy must
remain:

``` text
Diabetes Retinopathy Screening
        +
Appointment System
        ↓
Additional AI Assistance
```

Not:

``` text
AI Report Analyzer
        ↓
Appointments
```

------------------------------------------------------------------------

# 19. How It Works --- Main Workflow

The main How It Works section should focus on the appointment system.

Recommended conceptual flow:

``` text
1. Create an account
        ↓
2. Find a doctor / screening service
        ↓
3. Choose an available appointment slot
        ↓
4. Book your screening appointment
        ↓
5. Attend screening / consultation
        ↓
6. Manage reports and follow-up
```

The AI report feature can be shown separately as an additional
capability.

------------------------------------------------------------------------

# 20. AI-Assisted Insights Section

The AI section should communicate the secondary feature clearly.

Suggested flow:

``` text
Upload Report
      ↓
AI Understands
      ↓
AI Explains
      ↓
AI Tracks Changes
      ↓
Doctor Review When Needed
```

This section should be visually distinct but should not dominate the
landing page over the appointment system.

Do not claim that the AI is already fully integrated unless the actual
AI service has been implemented and tested.

Use wording such as:

-   AI-assisted
-   AI-powered insights
-   report understanding
-   patient-friendly explanation
-   trend monitoring
-   doctor review support

Avoid unsupported claims such as:

-   100% accurate
-   guaranteed diagnosis
-   instant diagnosis
-   replaces doctors
-   clinically proven, unless verified
-   detects every case

------------------------------------------------------------------------

# 21. Intro Animation

Current animation asset:

``` text
src/assets/animations/ratinocare-intro.mp4
```

Component:

``` text
src/features/landing/components/IntroAnimation/IntroAnimation.jsx
```

Current concept:

``` text
Closed eye
 ↓
Eye drop
 ↓
Eye opens
 ↓
AI scan
 ↓
RatinoCare branding
```

Implementation uses Framer Motion.

The intro video plays **once per browser session** (persisted in `sessionStorage` as `ratinocare_has_seen_intro`). When navigating back to the home page from other routes, the animation is bypassed to ensure a fast, frictionless user experience.

The intro should remain visually connected to the diabetes retinopathy
screening identity.

------------------------------------------------------------------------

# 22. Reports Feature

Reports are a core supporting feature of the screening workflow.

The report system should eventually support:

-   Report upload
-   Report storage
-   Report metadata
-   Report history
-   Patient access
-   Doctor access according to authorization
-   AI-assisted analysis
-   AI-generated explanation
-   Trend comparison
-   Review status

Potential report record concepts:

``` text
patient
reportFile
reportType
reportDate
uploadDate
extractedParameters
aiSummary
patientExplanation
analysisStatus
trendInformation
reviewStatus
doctorReview
createdAt
updatedAt
```

The exact database schema should be finalized only after the report
workflow and API requirements are clearly defined.

------------------------------------------------------------------------

# 23. AI Report Processing Architecture

Potential architecture:

``` text
React Frontend
      ↓
Node / Express API
      ↓
Document Processing
      ↓
AI Service / LLM
      ↓
Structured JSON
      ↓
Node Backend
      ↓
MongoDB
      ↓
Frontend
```

The AI service should return structured information rather than only
free-form text.

Example conceptual response:

``` json
{
  "summary": "",
  "observations": [],
  "trends": [],
  "itemsForReview": [],
  "patientExplanation": "",
  "doctorSummary": "",
  "disclaimer": ""
}
```

This is a conceptual structure and should not be treated as the final
API contract until the implementation is designed.

------------------------------------------------------------------------

# 24. Longitudinal Report Monitoring

One of the additional AI capabilities is comparing compatible
information across reports.

Conceptually:

``` text
Previous Report
      +
Current Report
      ↓
Compatible Values
      ↓
Compare
      ↓
Identify Changes
      ↓
Present Trend
      ↓
Doctor Review if configured
```

The system should only compare values when:

-   The values are actually present
-   The values are compatible
-   Units are known or safely normalized
-   Dates are available when needed
-   The comparison is meaningful

The AI must not invent a trend when the data is insufficient.

------------------------------------------------------------------------

# 25. Medical Safety

RatinoCare is a software project and should not currently be presented
as a verified medical diagnostic product.

The system should use careful language:

Preferred:

-   AI-assisted report analysis
-   screening support
-   health insights
-   report explanation
-   trend monitoring
-   doctor review
-   clinical workflow support
-   decision support

Avoid:

-   definitive diagnosis
-   guaranteed detection
-   guaranteed accuracy
-   replacement for doctors
-   automatic treatment decisions
-   unsupported medical claims

------------------------------------------------------------------------

# 26. Privacy and Security

Healthcare information is sensitive.

The application should prioritize:

-   Authentication
-   Authorization
-   Role-based access
-   Secure API endpoints
-   Secure file handling
-   Protected patient reports
-   Password hashing
-   JWT security
-   Environment variables for secrets
-   Validation
-   Error handling
-   Logging
-   Access control

Patient reports should only be accessible to authorized users.

Do not expose medical reports publicly.

Do not hard-code secrets, API keys, database credentials, or AI provider
credentials.

------------------------------------------------------------------------

# 27. Backend Status

The backend is considered functionally complete.

Known completed areas include:

-   CORS configuration
-   API response handling
-   API error handling
-   Query feature handling
-   Environment validation
-   Logger
-   Dashboard service/export fixes
-   Authentication behavior
-   Duplicate registration handling
-   Appointment APIs
-   Role authorization

The backend root currently returns:

``` text
DR Screening Backend Running
```

There is no `/api/health` endpoint unless it is added intentionally
later.

------------------------------------------------------------------------

# 28. Development Order

The project should be developed in this order:

``` text
1. Landing Page
      ↓
2. Login
      ↓
3. Register
      ↓
4. Authentication / JWT
      ↓
5. Protected Routes
      ↓
6. Dashboard
      ↓
7. Doctor Listing
      ↓
8. Appointment Booking
      ↓
9. Slot Management
      ↓
10. Appointment History / Management
      ↓
11. Reports
      ↓
12. AI-Assisted Report Analysis
      ↓
13. Longitudinal Report Comparison
      ↓
14. Rule-Based Doctor Review Flags
      ↓
15. Doctor Review Workflow
      ↓
16. Final Testing / Security / Deployment
```

The AI feature is intentionally placed **after the core appointment and
screening workflow** because it is an additional capability.

------------------------------------------------------------------------

# 29. Development Rules

Follow these rules during implementation.

## Rule 1 --- Preserve the Main Product Identity

Always treat RatinoCare as:

> **Diabetes Retinopathy Screening Appointment System**

AI report analysis is secondary.

------------------------------------------------------------------------

## Rule 2 --- Build One Feature at a Time

Complete a page or functionality before moving to the next one.

Preferred workflow:

``` text
Understand
↓
Inspect existing architecture
↓
Inspect relevant backend API
↓
Define data flow
↓
Implement
↓
Connect API
↓
Loading state
↓
Error state
↓
Empty state
↓
Responsive testing
↓
Build
↓
Fix errors
↓
Move to next feature
```

------------------------------------------------------------------------

## Rule 3 --- Do Not Refactor Without Reason

Preserve the current folder structure.

Do not move files, rename large sections, or introduce unnecessary
abstractions unless there is a concrete reason.

------------------------------------------------------------------------

## Rule 4 --- Use Existing Backend APIs

Before creating a frontend API call:

1.  Inspect the backend route.
2.  Inspect controller behavior.
3.  Inspect request body.
4.  Inspect response structure.
5.  Inspect authentication requirements.
6.  Then connect the frontend.

Do not invent API contracts.

------------------------------------------------------------------------

## Rule 5 --- Production-Oriented Implementation

Every feature should consider:

-   Loading states
-   Error states
-   Empty states
-   Validation
-   Authentication
-   Authorization
-   Responsive design
-   Accessibility
-   Security
-   API failure handling

------------------------------------------------------------------------

# 30. UI / UX Direction

RatinoCare should feel:

-   Professional
-   Clean
-   Modern
-   Healthcare-oriented
-   Trustworthy
-   Human
-   Calm
-   Accessible

Avoid making the interface look like:

-   A generic AI chatbot
-   A research demo
-   A pure medical AI experiment
-   A report-analysis-only application

The appointment and screening workflow should remain visually central.

------------------------------------------------------------------------

# 31. Current User Experience

### Patient Journey

``` text
Landing Page
   ↓
Register
   ↓
Login
   ↓
Dashboard
   ↓
Find Doctor
   ↓
View Slots
   ↓
Book Appointment
   ↓
Appointment Confirmation
   ↓
Upcoming Appointment
   ↓
Screening / Consultation
   ↓
Reports
   ↓
Optional AI-Assisted Report Insights
   ↓
Follow-up Appointment
```

### Doctor Journey

``` text
Login
 ↓
Dashboard
 ↓
View Appointments
 ↓
View Patient Information
 ↓
View Reports
 ↓
Review AI Summary if available
 ↓
Review flagged cases
 ↓
Provide professional advice
```

### Admin Journey

``` text
Login
 ↓
Admin Dashboard
 ↓
Manage Users / Doctors
 ↓
Monitor Appointments
 ↓
Manage Platform Data
```

------------------------------------------------------------------------

# 32. Current Landing Page Features

The landing page currently contains or is planned to contain:

-   Intro animation
-   Navbar
-   Hero
-   Platform capabilities
-   Features
-   How It Works
-   AI-assisted insights
-   Why RatinoCare
-   Statistics / capability section
-   User perspectives
-   FAQ
-   CTA
-   Footer

Avoid fake testimonials and unsupported usage statistics.

------------------------------------------------------------------------

# 33. Content Guidelines

Do not invent:

-   Number of patients
-   Number of doctors
-   Hospitals using the platform
-   Accuracy percentages
-   Clinical validation
-   Medical outcomes
-   Research statistics
-   Testimonials
-   Partnerships

unless real verified information is provided.

Use capability-based statements instead.

Example:

Instead of:

> Trusted by 10,000+ patients

Use:

> Built to support structured patient screening workflows.

------------------------------------------------------------------------

# 34. Error Handling

Frontend should provide understandable messages.

Avoid exposing:

-   Stack traces
-   Database errors
-   Internal server details
-   Secret information
-   Raw AI provider errors

Backend should use standardized error responses.

------------------------------------------------------------------------

# 35. AI Output Safety

AI-generated output should be treated as untrusted generated content.

The application should:

-   Validate structured AI responses
-   Handle malformed output
-   Handle missing values
-   Show uncertainty where appropriate
-   Avoid hallucinated values
-   Store analysis status
-   Allow retry where appropriate
-   Keep doctor review available

Possible analysis states:

``` text
pending
processing
completed
failed
needs_review
```

These are conceptual and can be refined during implementation.

------------------------------------------------------------------------

# 36. AI Feature Development Stages

The AI feature should be developed incrementally.

## Stage 1 --- Report Upload

``` text
Patient
 ↓
Upload PDF
 ↓
Backend validates file
 ↓
File stored securely
 ↓
Report record created
```

## Stage 2 --- Text Extraction

``` text
PDF
 ↓
Text extraction
 ↓
Extracted report text
```

## Stage 3 --- AI Understanding

``` text
Extracted text
 ↓
AI model
 ↓
Structured report information
```

## Stage 4 --- Patient Explanation

``` text
Structured information
 ↓
Patient-friendly explanation
```

## Stage 5 --- Report History

``` text
Current Report
 +
Previous Reports
 ↓
Patient history
```

## Stage 6 --- Trend Monitoring

``` text
Compatible values
 ↓
Comparison
 ↓
Possible changes
```

## Stage 7 --- Rule-Based Review

``` text
Structured data
 ↓
Explicit rules
 ↓
Review flag
 ↓
Doctor
```

Do not attempt all stages simultaneously.

------------------------------------------------------------------------

# 37. Important Terminology

Use:

-   Diabetes retinopathy screening
-   Screening appointment
-   Screening workflow
-   Doctor
-   Patient
-   Appointment
-   Available slot
-   Report
-   AI-assisted insights
-   AI-assisted report analysis
-   Report explanation
-   Trend monitoring
-   Doctor review

Avoid using "AI report analyzer" as the primary name for the product.

------------------------------------------------------------------------

# 38. Current Project Philosophy

RatinoCare combines:

``` text
Healthcare Appointment Management
          +
Diabetes Retinopathy Screening Workflow
          +
Patient / Doctor / Admin Management
          +
Reports
          +
Additional AI-Assisted Insights
```

The relationship is:

``` text
                RATINOCARE
                    |
        Diabetes Retinopathy
       Screening Appointment
             System
                    |
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Patients      Doctors       Admin
       |
       ↓
 Appointments
       |
       ↓
 Screening
       |
       ↓
 Reports
       |
       ↓
 Optional AI-Assisted
 Report Insights
```

The AI feature strengthens the platform but does not redefine the
platform.

------------------------------------------------------------------------

# 39. Current Priority

The immediate development priority should remain the core application.

Priority order:

``` text
1. Landing Page refinement (COMPLETED)
2. State & Auth Infrastructure (Redux Toolkit & Axios API) (COMPLETED)
3. Login Page UI & Authentication (COMPLETED)
4. Register Page UI (Patient & Doctor) (COMPLETED)
5. Protected Routing & Auth Guard (COMPLETED)
6. Shared Dashboard Layout & Role-Based Views (IN PROGRESS / NEXT)
7. Doctors
8. Appointments
9. Slots
10. Reports
11. AI-assisted report analysis
12. Longitudinal monitoring
13. Doctor review workflow
```

------------------------------------------------------------------------

# 40. Instructions for Future AI Coding Assistance

When helping with RatinoCare:

1.  Treat this document as the project source of truth.
2.  Remember that the application is primarily a **Diabetes Retinopathy
    Screening Appointment System**.
3.  Treat AI report analysis as an additional feature.
4.  Do not rename the application around the AI feature.
5.  Preserve the existing folder structure.
6.  Avoid unnecessary refactoring.
7.  Give exact file paths.
8.  Give complete code snippets when code changes are required.
9.  Inspect existing files before proposing structural changes.
10. Inspect backend APIs before integrating frontend API calls.
11. Do not invent backend endpoints.
12. Keep authentication and authorization secure.
13. Include loading, error, and empty states.
14. Keep the UI responsive.
15. Run a production build after significant changes.
16. Fix the actual error before making unrelated improvements.
17. Do not claim AI functionality is implemented until it is actually
    connected and tested.
18. Keep AI output medically cautious.
19. Keep doctors in the professional decision-making loop.
20. Do not fabricate medical accuracy, clinical validation, statistics,
    testimonials, or partnerships.

------------------------------------------------------------------------

# 41. One-Sentence Project Definition

> **RatinoCare is a Diabetes Retinopathy Screening Appointment System
> that helps patients, doctors, and administrators manage screening
> appointments and related healthcare workflows, with an additional
> AI-assisted feature for understanding medical reports, explaining
> results, tracking changes over time, and supporting doctor review.**
