# TalkAstrologer Project Navigation Hub

This guide provides direct, clickable links to every part of the application categorized into **Backend (Node.js)**, **Frontend UI/UX**, and the **Admin Dashboard**.

---

## ⚙️ 1. Backend Files (Node.js)

These files handle database operations, form processing, rate-limiting, and server security.

| Component / Layer | File Path | Description |
| :--- | :--- | :--- |
| **Standalone Node.js API** | [`backend/server.js`](file:///d:/astro/backend/server.js) | Standalone Node.js HTTP REST backend (Appointments, Contact, Reviews, Admin updates). |
| **Backend Mailer Service** | [`backend/mailer.js`](file:///d:/astro/backend/mailer.js) | Dedicated Hostinger Nodemailer dispatch module with self-diagnostic test runner (`node backend/mailer.js test`). |
| **Server Actions (Forms)** | [`src/app/actions/inbox.ts`](file:///d:/astro/src/app/actions/inbox.ts) | Backend handlers for appointments & contact messages, honeypot spam protection, and duplicate debouncing. |
| **Server Actions (Admin)** | [`src/app/admin/actions.ts`](file:///d:/astro/src/app/admin/actions.ts) | Backend actions for status transitions, scheduling appointments, review moderation, and admin sign-out. |
| **Inbox Data Layer** | [`src/lib/inbox.ts`](file:///d:/astro/src/lib/inbox.ts) | Supabase queries for retrieving appointments, messages, and unread badge counters. |
| **Reviews Data Layer** | [`src/lib/reviews.ts`](file:///d:/astro/src/lib/reviews.ts) | Queries for fetching accepted and pinned testimonials. |
| **Security Middleware** | [`src/middleware.ts`](file:///d:/astro/src/middleware.ts) | Edge security router protecting administrative routes and injecting HTTP defense headers. |
| **Session Authentication** | [`src/app/admin/session.ts`](file:///d:/astro/src/app/admin/session.ts) | Server-side `requireAdmin()` gatekeeper verifying active Supabase user sessions. |
| **Anti-Abuse Rate Limiter** | [`src/lib/rate-limiter.ts`](file:///d:/astro/src/lib/rate-limiter.ts) | Token-bucket rate limiter defending against form flood spam and credential brute-force attacks. |
| **Phone Validator** | [`src/lib/phone.ts`](file:///d:/astro/src/lib/phone.ts) | Validates and formats US and international phone numbers. |
| **Database Server Client** | [`src/lib/supabase/server.ts`](file:///d:/astro/src/lib/supabase/server.ts) | Server-side Supabase client with cookie-based session management. |

---

## 🛡️ 2. Admin Dashboard Files

Everything for managing consultations, customer enquiries, and testimonials.

| Component | File Path | Description |
| :--- | :--- | :--- |
| **Admin Shell / Sidebar** | [`src/app/admin/layout.tsx`](file:///d:/astro/src/app/admin/layout.tsx) | Administrative layout with sidebar, navigation links, and live notification badges. |
| **Admin Navigation** | [`src/app/admin/AdminNav.tsx`](file:///d:/astro/src/app/admin/AdminNav.tsx) | Navigation tabs with unread counters for appointments and messages. |
| **Appointment Requests Board** | [`src/app/admin/appointments/page.tsx`](file:///d:/astro/src/app/admin/appointments/page.tsx) | Page listing all consultation bookings. |
| **Interactive Appointments Board** | [`src/app/admin/appointments/AppointmentsBoard.tsx`](file:///d:/astro/src/app/admin/appointments/AppointmentsBoard.tsx) | Filterable status columns (New, Contacted, Scheduled, Completed, Cancelled) with notes and scheduling. |
| **Support & Enquiries Page** | [`src/app/admin/messages/page.tsx`](file:///d:/astro/src/app/admin/messages/page.tsx) | Page listing all contact submissions. |
| **Interactive Messages Board** | [`src/app/admin/messages/MessagesBoard.tsx`](file:///d:/astro/src/app/admin/messages/MessagesBoard.tsx) | Interactive enquiry card viewer with quick status updates and direct mail replies. |
| **Reviews Moderation Page** | [`src/app/admin/page.tsx`](file:///d:/astro/src/app/admin/page.tsx) | Page for managing client testimonials. |
| **Review Moderation Component** | [`src/app/admin/ReviewModeration.tsx`](file:///d:/astro/src/app/admin/ReviewModeration.tsx) | Interface for approving, rejecting, or featuring reviews in the top announcement bar. |
| **Admin Login Page** | [`src/app/admin/login/page.tsx`](file:///d:/astro/src/app/admin/login/page.tsx) | Administrative entrance portal. |
| **Admin Login Form** | [`src/app/admin/login/LoginForm.tsx`](file:///d:/astro/src/app/admin/login/LoginForm.tsx) | Secure authentication form with IP brute-force protection. |

---

## 🎨 3. Frontend UI / UX Files (Visitor Facing)

All public-facing pages, sections, and responsive components.

### Core Layout & Structure
- [`src/app/layout.tsx`](file:///d:/astro/src/app/layout.tsx) &mdash; Master HTML document, fonts, metadata, and JSON-LD schema.
- [`src/components/layout/Navbar.tsx`](file:///d:/astro/src/components/layout/Navbar.tsx) &mdash; Desktop & mobile navigation with responsive services mega-menu.
- [`src/components/layout/Footer.tsx`](file:///d:/astro/src/components/layout/Footer.tsx) &mdash; Mobile 2-column and desktop 4-column footer with contact details and legal links.
- [`src/components/layout/PinnedReviewBar.tsx`](file:///d:/astro/src/components/layout/PinnedReviewBar.tsx) &mdash; Header announcement ticker rotating featured client reviews.
- [`src/components/layout/SiteChrome.tsx`](file:///d:/astro/src/components/layout/SiteChrome.tsx) &mdash; Wrapper providing header/footer on public pages while isolating admin routes.

### Homepage Sections (`src/app/page.tsx`)
- [`src/components/home/HeroSection.tsx`](file:///d:/astro/src/components/home/HeroSection.tsx) &mdash; Hero video background, Shivaraja title, trust metrics, CTA buttons.
- [`src/components/home/WelcomeSection.tsx`](file:///d:/astro/src/components/home/WelcomeSection.tsx) &mdash; Six generations ancestral heritage story.
- [`src/components/home/ServicesSection.tsx`](file:///d:/astro/src/components/home/ServicesSection.tsx) &mdash; Core Vedic astrology offerings grid.
- [`src/components/home/GlobalSanctuariesSection.tsx`](file:///d:/astro/src/components/home/GlobalSanctuariesSection.tsx) &mdash; Texas locations grid (Frisco, Dallas, Plano, etc.).
- [`src/components/home/TestimonialsSection.tsx`](file:///d:/astro/src/components/home/TestimonialsSection.tsx) &mdash; Client review cards carousel with Vedic emblems.
- [`src/components/home/WhyChooseUsSection.tsx`](file:///d:/astro/src/components/home/WhyChooseUsSection.tsx) &mdash; Ancestral wisdom and strict privacy guarantees.
- [`src/components/home/CtaBannerSection.tsx`](file:///d:/astro/src/components/home/CtaBannerSection.tsx) &mdash; Bottom consultation call-to-action banner.
- [`src/components/home/FloatingActions.tsx`](file:///d:/astro/src/components/home/FloatingActions.tsx) &mdash; Floating WhatsApp and Phone quick-action dials.

### Interactive Public Pages
- [`src/app/book-appointment/page.tsx`](file:///d:/astro/src/app/book-appointment/page.tsx) &mdash; Consultation booking form.
- [`src/app/contact/page.tsx`](file:///d:/astro/src/app/contact/page.tsx) &mdash; Contact Us page with direct support form.
- [`src/app/services/page.tsx`](file:///d:/astro/src/app/services/page.tsx) &mdash; All services catalog index.
- [`src/app/services/[id]/page.tsx`](file:///d:/astro/src/app/services/[id]/page.tsx) &mdash; Dynamic detailed pages for each of the 16 astrology services.
- [`src/app/review/page.tsx`](file:///d:/astro/src/app/review/page.tsx) &mdash; Client testimonial submission form.
- [`src/app/about/page.tsx`](file:///d:/astro/src/app/about/page.tsx) &mdash; About the Guruji and lineage page.
- [`src/app/faq/page.tsx`](file:///d:/astro/src/app/faq/page.tsx) &mdash; Frequently asked questions accordion.
- [`src/app/terms/page.tsx`](file:///d:/astro/src/app/terms/page.tsx) &mdash; Terms and conditions.
- [`src/app/privacy-policy/page.tsx`](file:///d:/astro/src/app/privacy-policy/page.tsx) &mdash; Privacy policy and client data handling.
- [`src/app/disclaimer/page.tsx`](file:///d:/astro/src/app/disclaimer/page.tsx) &mdash; Astrology guidance disclaimer.

---

## 🔒 Integrity Notice
All existing Next.js Server Actions, buttons, database insertions, rate limiters, and mailing services remain **100% active and untouched**.
