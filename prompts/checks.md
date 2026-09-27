### Implement a "Checks" feature in the admin

Implement the checks feature in the admin area. The purpose of this feature is to check whether a site is online or not. Follow all project conventions in CLAUDE.md

Implement all functionality described below.

---

## Admin Dashboard

In the left panel of the admin dashboard add a "Checks" link, when clicked it will display in the main content area the functionality to run a check.

- Main content Area, here will be the functionality to run checks on websites to see if they are online or not. There should be an input dropdown that will provide the list of all categories available. The admin will choose 1 category to run a check on all the sites in this category. Under the input dropdown there should be a button "Check Sites" that when clicked will start the process on running the checks

-- How the checks are performed - for each site in the category selected run a check server side to see if the site is online or not. Under the "Check Sites" button output a list of all the sites checked and their status. When a check is running on a site have "Checking" as the status and after a check is complete the status will change to "Online" or "Not available"

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
