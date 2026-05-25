# Employee Task Tracking System

A simple full-stack project for managing employees and tracking assigned tasks. It uses plain Node.js on the backend, vanilla HTML/CSS/JavaScript on the frontend, and a local JSON file for storage.

## Features

- Dashboard counts for employees, total tasks, pending work, in-progress work, completed work, and high-priority tasks.
- Add, edit, and delete employees.
- Add, edit, delete, and update task status.
- Assign tasks to employees.
- Filter tasks by employee and status.
- Local JSON storage in `data/db.json`.
- Responsive layout for desktop and mobile screens.

## Tech Used

- Backend: Node.js built-in `http`, `fs`, `path`, and `url` modules.
- Frontend: HTML, CSS, and JavaScript.
- Database: JSON file storage.

No advanced frameworks or package installation are required.

## How To Run

```bash
node server.js
```

Then open:

```text
http://localhost:3000
```

If port `3000` is already busy:

```bash
PORT=4000 node server.js
```

On PowerShell:

```powershell
$env:PORT=4000; node server.js
```

## API Routes

- `GET /api/dashboard`
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

## Project Structure

```text
Employee_task_track/
  data/
    db.json
  public/
    index.html
    styles.css
    app.js
  server.js
  package.json
  README.md
```

## Screenshots

Screenshots are saved in the `screenshots` folder after running verification.

## Video Link

Record a short demo showing:

1. Opening the dashboard.
2. Adding a new employee.
3. Adding a task for that employee.
4. Changing the task status.
5. Filtering tasks.

Upload the recording to Google Drive, OneDrive, or YouTube as unlisted, then paste the share link here:

```text
Video link: <paste your uploaded demo link>
```
