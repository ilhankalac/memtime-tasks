# Time Entry Management Application

A Vue 3 application for managing time entries with hierarchical client, project, and task organization.

## Features

**1. Hierarchical Tree View**
- Displays clients, projects, and tasks in a nested tree structure
- Lazy-loads data on expansion with pagination support
- Uses `GET /clients`, `GET /clients/:id/projects`, `GET /projects/:id/tasks`

**2. Time Entries List**
- Displays time entries in a table (ID, Task ID, Comment, Start, End, Created At)
- Pagination support
- Uses `GET /time-entries`

**3. Create and Update Time Entries**
- Form for creating and updating time entries
- Required fields: taskId, comment, start (ISO 8601), end (ISO 8601)
- Uses `POST /time-entries` and `PUT /time-entries/:id`

## Technology Stack

- Vue 3 (Composition API)
- TypeScript (for better static typing and type safety)
- Vite
- Vuetify
- Axios

## Setup

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Environment variables are stored in a `.env` file and not included in the codebase.

Required variable:
- `VITE_API_KEY` - API authentication token

## Error Handling

- Displays error messages for API failures
- Form validation with inline errors
- Handles 404 and 400 errors appropriately
