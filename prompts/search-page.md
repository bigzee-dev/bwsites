### Create the search page

Create the search page at /search. This search page will display the sites returned by the search query. It will also display the sites returned when a user selects a certain category. Follow all project conventions in CLAUDE.md

Implement all functionality described below.

---

# Dashboard Overview

The search page will have:

- left sidebar
- Main content area

**Left sidebar**
The left sidebar will have a list of categories displayed. The list of categories should be fetched from the database. When a user clicks on a category then all the sites in that category will be displayed in the main content area

**Main content area**
The main content area will output the sites returned from either a search query or when a user clicks on a category

## Routes

- The search page will be at root_url/search - this will display all the sites in the database
- A search query will use root_url/search?q={search_query} e.g root_url/search?q=finance
- A category will be at root_url/search/[category] e.g root_url/search/ecommerce

## Searching

When a user search for a query return all sites that match that query in their name, tags or categories. The search input in the navbar will be used for all searches.

## Categories

When a user clicks on a category return all sites that have that category

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
