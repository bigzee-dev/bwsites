## Creating the admin page signup/sign in

The admin page will be at /admin

Use Better Auth to create the admin page signup/signin functionality. You will implement using name/email/password to signup and email/password to login. There should only be one admin user.

When the admin page loads, the system should check whether an admin user already exists. If no admin user exists, an option should be provided to register the first admin user.

Once an admin user has been created, the page should only display a login form unless an admin user is already authenticated. If the admin user is logged in, the admin dashboard should be displayed.

Use your frontend skills to create a modern and clean login forms. Since we are only implementing the auth logic when the admin has been created and logged in just have a message saying "admin logged in", we havent built the dashboard yet. Make sure you handle loading and error states and their logic

Use shadcn for your web components

---

### Create the Admin Dashboard

The current admin page only displays the logged-in administrator and a logout button. Replace it with a complete, production-quality admin dashboard. Follow all project conventions in CLAUDE.md

Implement all functionality described below.

---

# Dashboard Overview

The admin dashboard will be used to manage:

- Sites
- Categories

Use the existing authentication system. Only authenticated administrators should be able to access this dashboard.

---

# Site Model

Each site contains:

- Name
- URL
- Image
- Description
- Categories (one or more)
- Tags
- Facebook URL (optional)

A site can belong to multiple categories.

For example:

- Hotel
  - Tourism
  - Hospitality

Categories are created separately and selected when creating or editing a site.

---

# Category Model

The administrator must be able to create and manage the list of available categories.

Each category should be reusable by multiple sites.

---

# UI & Design

Create a polished, modern SaaS-style dashboard using **shadcn/ui** components.

Take design inspiration from products such as:

- Vercel
- Cloudflare
- Netlify
- Dokploy

Requirements:

- Fully responsive
- Support both light and dark mode
- Clean spacing and typography
- Modern cards, tables, dialogs, and forms
- Professional production-ready appearance

Use your frontend judgment to create an excellent user experience.

---

# Layout

The dashboard should consist of:

- Left navigation sidebar
- Main content area

---

# Left Sidebar

Include the following navigation items:

- Home
- Sites
- Categories

At the bottom of the sidebar display:

- Admin avatar (initials)
- Admin email
- Logout button

---

# Home Page

The Home page should display useful dashboard statistics.

At minimum include:

- Total number of sites
- Total number of categories

Feel free to add any other useful summary cards or statistics.

---

# Sites Page

Display every site stored in the database.

Use a modern table or data grid.

Each row should include actions to:

- Edit
- Delete

Include search, sorting, or filtering if appropriate.

---

# Categories Page

Display every available category.

Each category should include actions to:

- Edit
- Delete

---

# Global Actions

At the top of the main content area display two primary buttons:

- Add Site
- Add Category

These buttons should always be easily accessible.

---

# Add Site

Clicking **Add Site** should open a dialog containing a form.

Implement the complete functionality.

Fields:

- Name
- URL
- Image upload
- Description
- Categories (multi-select from existing categories)
- Tags
- Facebook URL (optional)

## Image Upload

The administrator should be able to upload an image.

Images must be uploaded to a Cloudflare R2 bucket.

Store the resulting image URL in the database.

Implement the Cloudflare functionality, you can use placeholders for the credentials, I will replace them with the proper ones later

## Categories

Categories must be selected from the existing categories.

Allow selecting multiple categories.

---

# Edit Site

Implement editing using the same dialog and form used for creating a site.

All existing values should be pre-filled.

---

# Delete Site

Implement site deletion.

Display a confirmation dialog before permanently deleting a site.

---

# Add Category

Clicking **Add Category** should open a dialog containing a form.

Implement the complete functionality.

---

# Edit Category

Allow categories to be edited.

---

# Delete Category

Allow categories to be deleted.

Display a confirmation dialog before deletion.

Prevent deletion if doing so would leave the database in an invalid state.

---

# UX Requirements

Handle every UI state properly, including:

- Loading states
- Empty states
- Error states
- Success feedback
- Disabled buttons while submitting
- Form validation
- Confirmation dialogs for destructive actions

The interface should feel polished and responsive.

---

# Code Quality

Write clean, maintainable code that follows the existing project architecture.

Reuse existing components where appropriate.

Keep components modular and avoid duplication.

Use best practices for:

- React
- Next.js
- TypeScript
- shadcn/ui
- Prisma
- Better Auth

The finished result should feel like a professional SaaS administration dashboard rather than a basic CRUD interface.
