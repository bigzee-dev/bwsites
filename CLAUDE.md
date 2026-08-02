# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a high-performance, server-rendered Next.js 16 application built with the App Router. It showcases Botswana’s top websites.

The homepage displays selected categories of websites, while the /search route allows users to search for specific types of websites or browse websites by category.

The top websites will be managed and added by the administrator through the /admin dashboard.

This web app will display to users the sites in Botswana that we find usefull. Our team has compiled a list of more than 100 websites in Botswana that are always online, look good, are maintained, offer valuable information, offer good services and are run by competent companies.

A site will be added to our database by the admin using the admin dashboard. Each site will have a name, url, image, description, categories, tags, facebook link(optional). When adding a new site the admin will fill in all this information except the categories. For the categories input the admin will select from a list of categories available and each site can have more than category e.g a Hotel can belong to the "Tourism" and "Hospitalty" categories. The admin will use the admin dashboard to add the categories to the list of available categories.

**Tech Stack:**

- Next.js 16 with App Router
- React 19with Server Components
- TypeScript (strict mode enabled)
- Tailwind CSS with custom configuration
- Prisma ORM with Postgresql database
- Better Auth for authentication and authorization
- Shadcn for ui components
- pnpm as package manager

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Design and Styling

**Colors**
The primary color is blue and there are 4 shades I will provide you with to use.
#014a75 - darkest shade of blue
#165472 - slightly brighter than the darkest shade
#2b6378 - mid shade of blue
#3c7481 - brighter blue

The accent color is yellow and there are 2 shades i will provide you wwith to use
#d89a00 - dark yellow
#f3b200 - light yellow

**Responsiveness**
The site and all the components should be fully responsive and work perfectly on both large and small screens

**Dark and Light Mode**
The site should support both light and dark modes. The value will be obtained from system settings, the user should not be able to set the mode on the site.

**Styling**
Use tailwwind css to style the site

## Admin Area

There should only be one admin user.

When the admin page loads, the system should check whether an admin user already exists. If no admin user exists, an option should be provided to register the first admin user.

Once an admin user has been created, the page should only display a login form unless an admin user is already authenticated. If the admin user is logged in, the admin dashboard should be displayed.

### Data Fetching Patterns

When fetching or sending data to the database:

1. Place functions in `lib/admin/*` for calls in the admin page
2. Place functions in `lib/client/*` for calls in the client facing pages

### Key Architectural Patterns

**1. Postgresql Database and Prisma ORM**

The sites data is stored in a postgresql db using Prisma ORM

**2. Server Components & Server Actions**

The app heavily uses React Server Components:

- Pages and layouts are Server Components by default
- Server Actions handle cart mutations (add, remove, update) and cookie management
- Client components are marked with `'use client'`
