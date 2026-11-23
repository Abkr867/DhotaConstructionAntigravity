# Dhota Construction — Web Platform

Modern, full-stack web application for **Dhota Construction**, a premier construction and renovation firm in Jharkhand, India.

---

## Features

- **Public Website**:
  - **Homepage**: Hero showcase, stats counter, service highlights, verified client testimonials.
  - **About Us**: Company background, vision, milestone timeline, core values.
  - **Services**: Detailed service breakdown (Residential, Commercial, Renovation, Interior Design, Project Management) with dynamic cost estimation triggers.
  - **Construction Cost Estimator**: Interactive calculator with quality tiers, floor levels, material options, and instant breakdown.
  - **Project Gallery**: Categorized portfolio showcase with multi-image project carousels and smooth filtering.
  - **Client Reviews**: Public customer feedback submission and verified reviews display.
  - **Contact & Inquiries**: Consultation request forms with real-time validation.

- **Admin Management Portal** (`/#/admin`):
  - **Dashboard**: Live overview of total projects, customer inquiries, and submitted reviews.
  - **Inquiry Management**: Review incoming leads, status updates, and customer requests.
  - **Project Gallery Manager**: Add, edit, remove projects with multi-image file selection and direct synchronization to Supabase Storage.
  - **Review Moderation**: Approve or reject user-submitted customer reviews.

- **Performance & Usability**:
  - Automatic **Scroll-to-Top** on navigation across all pages.
  - **Route-level code splitting** with `React.lazy` and `Suspense` for fast initial loads.
  - **Image optimization** (`loading="lazy"`, `decoding="async"`, layout dimensions).
  - Preconnected Google Fonts and CDN endpoints.

---

## Tech Stack

- **Frontend**:
  - React 18
  - React Router DOM v6 (`HashRouter` for zero-configuration GitHub Pages hosting)
  - Tailwind CSS & Framer Motion
  - Lucide React Icons & Shadcn UI
  - `@supabase/supabase-js`

- **Backend**:
  - FastAPI (Python 3.10+)
  - Uvicorn ASGI Server
  - Pydantic v2
  - PyJWT & Bcrypt
  - Supabase Python Client

- **Database & Storage**:
  - Supabase PostgreSQL (Tables: `projects`, `inquiries`, `reviews`, `admin_credentials`, `estimator_rates`)
  - Supabase Storage Bucket: `dhota-construction` (project galleries & review attachments)

---

## Project Structure

```text
Dhota_Construction/
├── backend/                  # FastAPI backend
│   ├── .env.example          # Environment variable template
│   ├── main.py               # Production entrypoint
│   ├── server.py             # FastAPI routes, Supabase integration & auth
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React frontend
│   ├── public/               # Public assets & index.html
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ScrollToTop, UI primitives
│   │   ├── lib/              # Supabase client & utilities
│   │   ├── pages/            # Public & Admin page views
│   │   ├── App.js            # Router configuration & code-splitting
│   │   └── index.js          # React DOM root
│   └── package.json          # Node dependencies & scripts
├── docs/                     # Static production build for GitHub Pages
├── tests/                    # Backend configuration tests
├── 404.html                  # GitHub Pages SPA redirect fallback
└── index.html                # Root production entrypoint
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+
- A configured **Supabase** project

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The development server will run at `http://localhost:3000`.

To create an optimized production build:
```bash
cd frontend
npm run build
```

### 3. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```
The API documentation will be available at `http://localhost:8001/docs`.

---

## Deployment

- **Frontend**: Hosted on GitHub Pages via the `docs/` folder or root build.
- **Backend**: Containerized / deployed via Railway, Render, or any standard ASGI Python host.
