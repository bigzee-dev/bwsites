### Implementing "Collections" functionality in the admin area

Implement the collections functionality in the admin area. Follow all project conventions in CLAUDE.md

## description of a collection

A collection will be used to store a number of sites from 0-6. The collections will named like "Top Sites" or "Best Finance Sites". The collections will be called by the site-grid in the homepage to show sites in certain groupings. Each Collection will have a name and a list of sites that belong in the collection. A collection can be created while not having any sites but the maximum number of sites in each collection can only be six. A site can be added to multiple collections but 1 site cannot be added more than once to the same collection.

## Collection model

Each collection contains:

- Name
- Sites (one or more)

## Functionality

In the admin area add a "Collections" link in the sidebar, when clicked the list of collections should appear in the main content area.
Each collection should include actions to:

- Edit
- Delete

When clicking the Edit button it should bring up a dialog that the admin should be able to edit the name and add or delete a site from the collection. The admin can only pick a site from the list of available sites in the database. Since the list of sites ig going to be more than a 100, the admin should also be able to search for a site to be added to the collection, a dropdown is going to be difficult to work with when there are more than a 100 sites.

A "Create Collection" button should be placed on top of the collections list in the main content area do not place it Globals Actions area next to the categories and site buttons.

# UX Requirements

Handle every UI state properly, including:

- Loading states
- Empty states
- Error states
- Success feedback
- Disabled buttons while submitting
- Form validation
- Confirmation dialogs for destructive actions
- use shadcn for the dialog and web components, do not add your own styling.

The interface should feel polished and responsive.
