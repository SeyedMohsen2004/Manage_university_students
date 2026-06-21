# University Student Management System

A full-stack university student management system built with Django REST Framework and Angular.

This project provides a backend API and frontend interface for managing student-related university services such as authentication, student profiles, balance deposits, food reservation, and course reservation.

## Features

- Student registration and authentication
- JWT-based authentication
- Student profile management
- Password change functionality
- Balance deposit system
- Food reservation system
- Course reservation system
- Admin-related backend structure
- Angular frontend dashboard
- Legacy static admin frontend preserved for reference
- API health check endpoint

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- SQLite
- Pytest
- Django CORS Headers

### Frontend

- Angular
- TypeScript
- SCSS
- Tailwind CSS

## Project Structure

```text
.
├── backend/
│   ├── admin_panel/
│   ├── students/
│   ├── uni_pro/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
├── legacy-admin-frontend/
├── README.md
└── .gitignore