# SpecMirror MVP — Implementation Plan

## 1. Design System & Dark Theme

- Override CSS variables for pure dark mode: zinc-950 background, indigo-500/emerald-400 accents
- Set Inter as the default font via Google Fonts
- No light mode toggle — dark class always applied

## 2. Landing Page

Convert the HTML mockup into a polished React page with these sections:

- **Nav** — Logo, section links, Login/Sign Up buttons (linked to auth pages)
- **Hero** — Beta badge, headline, tagline, dual CTA buttons, trust logos
- **Mission statement** — Full-width text block
- **Features grid** — 3  staggeredcards: Mirror View, AI Generation, Collaboration
- **Preview section** — Mock split-screen screenshot/visual
- **How it helps** — 3 persona cards (PM, Engineer, Leadership)
- **FAQ** — Accordion-style expandable questions
- **Footer** — Logo, social links, copyright

## 3. Authentication (Supabase)

- Enable Lovable Cloud for Supabase backend
- Create **Login** and **Sign Up** pages with email/password
- Password reset flow with dedicated `/reset-password` page
- Create `profiles` table (id, user_id, full_name, avatar_url) with RLS
- Auto-create profile on signup via DB trigger
- Protected routes: redirect unauthenticated users away from the app

## 4. Dashboard / Projects List

- After login, show a minimal Linear-style project list
- Create/delete brief projects
- Each project links to the Mirror View

## 5. Mirror View (Core Feature)

- **Split-screen layout**: left = rich text product brief editor, right = AI-generated technical spec
- Resizable panels with drag handle
- Rich text editing using Tiptap or similar
- Placeholder for AI-generated content on the right panel
- **Confidence meter** — progress ring in the top-right corner
- Mobile responsive: panels stack vertically on small screens

## 6. AI Spec Generation

- "Generate Mirror" button with sparkle animation + skeleton loader
- Connect to an AI API (via Supabase Edge Function) to generate tech specs from brief text
- Output: architecture notes, effort estimates, acceptance criteria, risks
- Store generated specs in Supabase

## 7. Version History

- Auto-save every edit to a versions table
- Timeline sidebar showing change history
- Basic visual diff between versions

## 8. Routing Structure

- `/` — Landing page
- `/login` — Login
- `/signup` — Sign up
- `/reset-password` — Password reset
- `/dashboard` — Projects list (protected)
- `/project/:id` — Mirror View (protected)