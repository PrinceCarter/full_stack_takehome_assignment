# Lume AI Full-Stack Takehome Assignment

This project implements a data review interface using Next.js, React, and ShadCN + Tailwind CSS, meeting all the specified requirements. It provides a user-friendly table interface for reviewing JSON data, highlighting validation errors, displaying error messages interactively on hover, and exporting data in CSV format.

## Installation

- Clone the repository.
- `cd data-review-assignment`
- Install dependencies using `npm install`.
- Run the project using `npm run dev`.
- Access the application at `http://localhost:3000`.

## Features
### Data Query from API

- A Next.js API route is implemented to return mock JSON data as specified in the requirements. The data is correctly served to the frontend for display and interaction.

### Data Review Table

- Data is presented in a tabular format.
- Each column is color-coded based on validation severity:
  - Red: Critical errors that must be fixed.
  - Yellow: Warnings that should be reviewed.
  - Green: Valid fields.

### Hoverable Error Messages

- Cells with validation errors include tooltips that show error messages when hovered over, providing an intuitive way for users to understand issues at a glance.

### Error Summary Modal

- Each row includes an "View Errors" button in the Error Summary column that opens a modal. The modal displays detailed information about all validation errors for that specific record, enhancing error traceability and review.

### CSV Export

- Users can export the data to a CSV format. The export respects any active filters, ensuring that only the currently visible data is exported.

## Design Considerations
- No Provided Figma: Without strict design guidelines, I chose a minimalist and clean layout (as lots of data can be an eye-sore to look at), using ShadCN Tailwind CSS for styling and [this mock table](https://next-shadcn-ui-table.vercel.app/) for design inspiration.
- Color Scheme: Colors for errors (red, yellow, green) are chosen for clear visual distinction, enhancing usability and allowing for quick identification of data issues.
- Pagination: The table includes pagination to manage large datasets, and filtering resets to the first page for a consistent user experience.

## Tech Stack
- Next.js: Used for creating the API route and server-side rendering.
- React: Frontend components for data interaction, filtering, and export.
- Tailwind CSS: Used for styling the table, tooltips, modals, and overall interface.

## Usage
- Filtering: Users can filter data by name and status. The table automatically updates to reflect the filters applied.
- Pagination: Pagination controls allow navigation through large datasets.
- Error Review: Hover over cells to view error messages, or click "View Errors" to open a detailed modal.
- CSV Export: Click "Export CSV" to download the current view of the data in CSV format.

## Assumptions
- The data model is static and follows the given format.
  - Reduces the complexity of handling dynamic or changing data structures.
- Error color-coding (red, yellow, green) is based on predefined severity levels.
  - Avoids the need to handle unknown or custom error severities dynamically.
- The export functionality only considers filtered data at the time of export.
  - Simplifies the export logic to handle just the filtered data, reflecting what the user sees, rather than managing separate data sets or applying additional export-specific filters.

## Improvements I Would've Made
- Enhance filtering capabilities (e.g., by city, email) for more flexible data review (much like [this mock table](https://next-shadcn-ui-table.vercel.app/)).
- Add column sorting to allow users to organize data as needed (much like [this mock table](https://next-shadcn-ui-table.vercel.app/)).
- Implement inline editing for quick fixes to validation errors directly in the table (Would require POST endpoint to persist the data changes).
- Put the pagination logic in the backend. At scale, fetching all records at once could lead to higher memory usage, longer loading times, and increased network costs. Implementing pagination on the backend would involve modifying the API endpoint to accept parameters for `page` and `limit`. The server would then return only the necessary subset of data based on these parameters.
