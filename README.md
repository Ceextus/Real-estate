# Andream Homes Platform

A modern, high-performance real estate platform built with Next.js, React, Tailwind CSS, and Supabase. Designed to provide a premium user experience for clients browsing properties, booking inspections, and contacting agents, while offering an incredibly powerful, fully-featured Admin Dashboard for real estate administrators.

## 🚀 Tech Stack

- **Frontend Framework:** Next.js 14 (App Router)
- **UI Library:** React.js
- **Styling:** Tailwind CSS (Custom themes, responsive design, modern UI patterns)
- **Animations:** Framer Motion (Smooth page transitions, micro-interactions, floating action buttons)
- **Icons:** React Icons (Bootstrap and Heroicons)
- **Backend & Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Admin login/session management)
- **Storage:** Supabase Storage Bucket (Property images, gallery assets, agent headshots)
- **Deployment:** Vercel (Recommended)

---

## ✨ Features & Functionality

### Public Client-Facing Portal
A sleek, responsive, and engaging interface for potential buyers and renters.

- **Dynamic Homepage:** Beautiful hero sections, featured properties carousel, and dynamic data pulled straight from the database.
- **Property Listings & Search:** Browse properties with real-time filtering, clean grid layouts, and pagination.
- **Detailed Property Pages:** View high-resolution image galleries, property features (beds, baths, size), rich descriptions, and embedded **YouTube video tours** directly in the listing.
- **Interactive Image Viewer:** Built-in dual gallery views on properties to browse auxiliary images natively.
- **Location Context:** Integrated **Google Maps iframes** to show the exact location and neighborhood context for each property.
- **Book Inspection Flow:** Interactive modals and a floating action button (FAB) allowing users to easily request property tours based on their preferred dates. The button automatically docks above the footer to avoid blocking content on mobile devices.
- **Public Image Gallery:** A categorized portfolio showcasing Exterior, Interior, and Amenities photography with fullscreen lightboxes.
- **Team & Agents Page:** Meet the real estate professionals with their contact details and bios.
- **Contact Center:** Direct messaging system that instantly routes inquiries to the admin dashboard.
- **Dynamic Site Settings:** The Navbar, Footer, Contact info, and Theme colors are completely dynamic and managed via the Admin panel.
- **Custom Loading States:** All data-fetching moments use a custom, animated `LogoLoader` that pulses and dims the screen for a premium waiting experience.

### Secure Admin Dashboard (`/admin`)
A deeply integrated, secure, and modern administration panel with custom glassmorphism, responsive grids, and global toast notifications.

- **Admin Layout & Navigation:** A responsive sidebar, mobile-friendly overlay menus, and breadcrumb structures that are locked behind Supabase Email/Password authentication.
- **Dashboard Overview:** Live system status, an animated statistics grid with floating background effects, a vertical timeline feed of recent messages/inspections, and high-priority quick action cards.
- **Properties Management (CRUD):** 
  - List new properties and manage existing ones.
  - Add native **YouTube video links** to embed property walkthroughs.
  - Insert raw **Google Maps iframes** to provide exact mapping coordinates.
  - Upload primary and auxiliary images directly to Supabase storage.
  - Automatically calculates features and updates live on the public site instantly.
- **Gallery Organizer:** Upload, categorize (All, Exterior, Interior, Amenities), and delete images for the public portfolio. Features touch-friendly image action buttons on mobile devices.
- **Team Management:** Add and manage real estate agents, including uploading their headshots, roles, and direct contact profiles.
- **Inspections Manager:** Review client tour bookings. Automatically wrap long requests on mobile, and update statuses seamlessly (`Pending` -> `Confirmed` -> `Completed` -> `Cancelled`).
- **Messages Inbox:** Read, archive, and delete direct inquiries from clients via the public contact form.
- **Global Settings Control:** Change the website's configuration without touching a line of code. Update the hero headline, contact phone numbers, emails, social media links, and embedded map iframes directly from the dashboard.
- **Global Toast Notifications:** Sleek, animated success (green) and error (red) popups that appear on the bottom-right corner for all database insert/update/delete operations across the admin panel.

---

## 🛠️ Setup & Installation

Follow these steps to run the platform locally on your machine.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd andream-homes
```

### 2. Install Dependencies
Make sure you have Node.js installed.
```bash
npm install
# or
yarn install
```

### 3. Setup Supabase Configuration
Create a `.env.local` file in the root of your project and add your Supabase project credentials. You will need a Supabase project created at [supabase.com](https://supabase.com).
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Database Structure
You will need to run the respective SQL or create the following tables in your Supabase database:
- `properties` (Stores property listings, images, and features)
- `team_members` (Stores agent profiles and photos)
- `gallery` (Stores categorized public images)
- `messages` (Stores public contact form submissions)
- `inspections` (Stores client tour booking requests)
- `site_settings` (Stores global website configurations on a single row ID=1)

*Storage Buckets:* You will also need to create a public storage bucket named **`property-images`** for asset uploads. Everything (properties, team members, gallery) uses this singular bucket by default.

### 5. Run the Local Server
```bash
npm run dev
# or
yarn dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser to see the public site.
- Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the backend management system.

---

## 🎨 Design Philosophy
Andream Homes prioritizes visual excellence.
- **Glassmorphic Design:** The admin panel utilizes extensive blur effects (`backdrop-blur-sm`, `bg-white/90`), subtle background decorations, and modern clean lines to look ultra-premium.
- **Responsiveness First:** Every single interaction, grid, and navigation menu gracefully wraps from giant 4K monitors down to small iPhones, including precise touch-targets specifically designed for thumbs.
- **Immediate Feedback:** Fast component loading backed by framer-motion micro-animations and global toast contexts ensures the user never has to guess if an action was successful.

---

*Built for Andream Homes Real Estate.*
