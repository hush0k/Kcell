# TaskFlow

Таск-менеджер с авторизацией. FastAPI + React + PostgreSQL.

## Стек

**Backend** — FastAPI, SQLAlchemy (async), Alembic, PostgreSQL, JWT  
**Frontend** — React 19, TypeScript, Tailwind CSS, Recharts, Vite  
**Инфраструктура** — Docker, Docker Compose, Nginx

## Запуск

```bash
cp .example.env .env
docker-compose up --build
```

Приложение доступно на `http://localhost`.  
API доступно на `http://localhost:8000`.

## Переменные окружения

| Переменная | Описание |
|---|---|
| `DB_NAME` | Имя базы данных |
| `DB_USER` | Пользователь БД |
| `DB_PASSWORD` | Пароль БД |
| `DB_HOST` | Хост БД (`db` в Docker) |
| `DB_PORT` | Порт БД |
| `JWT_SECRET_KEY` | Секретный ключ для подписи токенов |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни access-токена (мин) |
| `JWT_REFRESH_TOKEN_EXPIRE_DAYS` | Время жизни refresh-токена (дни) |

## Структура

```
├── backend/
│   ├── app/
│   │   ├── api/          # Роуты
│   │   ├── auth/         # JWT логика
│   │   ├── models/       # SQLAlchemy модели
│   │   ├── schemas/      # Pydantic схемы
│   │   └── service/      # Бизнес-логика
│   ├── alembic/          # Миграции
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── hooks/        # useAuth, useTasks, useToast
│   │   ├── lib/          # API клиент
│   │   └── types/        # TypeScript типы
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

## API

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/api/auth/register` | Регистрация |
| `POST` | `/api/auth/login` | Вход, возвращает JWT |
| `POST` | `/api/auth/refresh` | Обновление токена |
| `GET` | `/tasks/` | Список задач |
| `POST` | `/tasks/` | Создать задачу |
| `PATCH` | `/tasks/{id}` | Обновить статус |
| `DELETE` | `/tasks/{id}` | Удалить задачу |

## Локальная разработка

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload
```

```bash
cd frontend
npm install
npm run dev
```
