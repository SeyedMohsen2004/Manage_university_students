# University Student Management System

A full-stack university student management project built with Django REST Framework and Angular. The system provides student authentication, profile management, account balance deposits, food reservations, course reservations, and administrative API workflows.

## Features

- JWT-based student and admin authentication
- Student registration, login, profile update, and password change
- Balance deposit workflow
- Food and course reservation workflows with capacity checks
- Admin APIs for foods, courses, students, reservations, and dashboard metrics
- Swagger/OpenAPI documentation with drf-spectacular
- Health check endpoint for deployment checks
- Angular frontend and preserved legacy static admin frontend
- Dockerized backend with PostgreSQL for local full-stack development

## Tech Stack

- Backend: Python 3.12, Django 4.2, Django REST Framework, Simple JWT
- API docs: drf-spectacular and Swagger UI
- Database: SQLite for simple local development, PostgreSQL for Docker
- Configuration: python-decouple and environment variables
- Testing and quality: pytest, pytest-django, black, flake8
- Frontend: Angular, TypeScript, SCSS, Tailwind CSS
- Infrastructure: Docker Compose, GitHub Actions CI

## Project Structure

```text
.
|-- backend/
|   |-- admin_panel/
|   |-- students/
|   |-- uni_pro/
|   |-- Dockerfile
|   |-- entrypoint.sh
|   |-- manage.py
|   `-- requirements.txt
|-- frontend/
|-- legacy-admin-frontend/
|-- .env.example
|-- docker-compose.yml
|-- pytest.ini
`-- README.md
```

## Environment Variables

Copy `.env.example` to `.env` for local Docker usage and adjust values as needed. Do not commit `.env`.

| Variable | Description | Local default |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | Django secret key | `change-me-in-production` |
| `DJANGO_DEBUG` | Enables debug mode | `True` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated allowed hosts | `localhost,127.0.0.1,api,docker` |
| `DJANGO_CORS_ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:4200,http://127.0.0.1:4200` |
| `DB_ENGINE` | `sqlite`, `postgresql`, or a Django DB backend path | `sqlite` |
| `DB_NAME` | SQLite path or PostgreSQL database name | `backend/db.sqlite3` when unset |
| `DB_USER` | PostgreSQL username | empty for SQLite |
| `DB_PASSWORD` | PostgreSQL password | empty for SQLite |
| `DB_HOST` | PostgreSQL host | empty for SQLite |
| `DB_PORT` | PostgreSQL port | empty for SQLite |

## Local Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

## Docker Setup

```bash
cp .env.example .env
docker compose up --build
```

Docker Compose starts:

- `db`: PostgreSQL 16 with a named `postgres_data` volume
- `api`: Django API on `http://127.0.0.1:8000/`

The API container waits for PostgreSQL, runs migrations, and starts the Django development server on `0.0.0.0:8000`.
If host port 8000 is already in use, set `API_PORT=8001` before running Compose.

## API Documentation

- Health check: `http://127.0.0.1:8000/api/health/`
- OpenAPI schema: `http://127.0.0.1:8000/api/schema/`
- Swagger UI: `http://127.0.0.1:8000/api/docs/`

## Tests and Code Quality

Run backend tests from the repository root:

```bash
pytest
```

Run Django checks:

```bash
cd backend
python manage.py check
```

Optional quality checks:

```bash
cd backend
black --check .
flake8 .
```

## GitHub Actions

The CI workflow installs backend dependencies, runs `python manage.py check`, and runs `pytest` on every push and pull request. CI uses SQLite and does not require production secrets.

## Current Status

This repository is organized as a resume-ready full-stack project with a Django REST API, Angular frontend, environment-based configuration, Docker/PostgreSQL support, Swagger documentation, and basic automated tests.

## Future Improvements

- Add frontend CI for Angular linting and tests
- Add more endpoint-level tests for reservation edge cases
- Add production deployment settings for static/media storage
- Add seed data or fixtures for demo environments
