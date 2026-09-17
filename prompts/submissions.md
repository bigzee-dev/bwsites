### Implement the submissions feature

Implement the submissions feature whereby a user can submit a site. A submitted site will then be displayed in the admin area . Each submission is stored in the database using prisma Follow all project conventions in CLAUDE.md

Implement all functionality described below.

---

# Submissions schema

A submission will consist of:

- name (the name of the user submitting the site) - String - Required
- email (the email of the user submitting the site) - String - Required
- url (the url of the the site to be submitted) - String - Required
- description (a short description of the site) - String - NOT Required

Create the prisma schema and push the migration

## Client Area "Submit a Site" Button

In the navbar net to the "About" Link create the button to submit a site. When clicked it will open up the shadcn dialog where the user will submit a site

## Input Form

The input form will be in the dialog that pops up when the client clicks the "Submit a site" button. It will consist of the 4 inputs outlined in the schema for a submission as well as a cancel button and a submit button

## Admin Dashboard

In the left panel of the admin dashboard add a "Submissions" link, when clicked it will display in the main content area the list of submissions received from the client. Each submission in the list should have a "Delete" action. Each submission should should be clickable and when clicked it will display all the information for the submission

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
