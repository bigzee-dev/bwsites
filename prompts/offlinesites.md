## Implement the offline functionality

I am facing an issue whereby some sites I have listed in the directory are no longer online/ have no ssl certs/are down for maintenance e.t.c. I dont want these sites to be shown in the directory but i also dont want to delete them so that when they come back online I can also show them in my directory again. Follow all project conventions in CLAUDE.md

---

### Create Online/Offline functionality in the Admin Dashboard for each site

All sites are listed at /admin/sites. Each site currently displays the tags that it has, remove this and replace it with a selector for Online/Offline. By default all sites are online. If i want to set a site to offline i click on the selectory and then confirm my choice and then save.

---

# Displaying sites

In the client side search results page we will now only display sites that have been set to online, sites that are set to offline should not appear in the search results

---

# Site Model

You will have to update the Site model to now include this field for Online/Offline

---

# Sites Count

## There is a function that counts and displays the total number of sites in the directory, update this function to only count sites that are online. Sites that have been set to offline should not be counted as part of the total number sites available in the directory

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
