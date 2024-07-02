version: '3.8'

services:
  web:
    build: .
    command: gunicorn --bind 0.0.0.0:5000 app:app
    volumes:
      - .:/app
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
      - DATABASE_URL=postgresql://user:password@db/dev_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis
    networks:
      - app-network

  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=dev_db
    networks:
      - app-network

  redis:
    image: "redis:alpine"
    networks:
      - app-network

  celery_worker:
    build: .
    command: celery -A app.celery worker --loglevel=info
    volumes:
      - .:/app
    environment:
      - FLASK_ENV=development
      - DATABASE_URL=postgresql://user:password@db/dev_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - web
      - db
      - redis
    networks:
      - app-network

  celery_beat:
    build: .
    command: celery -A app.celery beat --loglevel=info
    volumes:
      - .:/app
    environment:
      - FLASK_ENV=development
      - DATABASE_URL=postgresql://user:password@db/dev_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - web
      - db
      - redis
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge