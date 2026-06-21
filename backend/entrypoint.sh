#!/bin/sh
set -e

if [ "$DB_ENGINE" = "postgresql" ] || [ "$DB_ENGINE" = "postgres" ] || [ "$DB_ENGINE" = "django.db.backends.postgresql" ]; then
  echo "Waiting for PostgreSQL at ${DB_HOST:-db}:${DB_PORT:-5432}..."
  while ! nc -z "${DB_HOST:-db}" "${DB_PORT:-5432}"; do
    sleep 1
  done
fi

python manage.py migrate --noinput
python manage.py runserver 0.0.0.0:8000
