# Habit Tracker

Django REST + React (JWT auth) practice project.

## Backend

```
cd backend
python -m venv venv
source venv/bin/activate      # venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

API runs at http://127.0.0.1:8000

## Frontend

```
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173

## Flow

1. Go to `/register`, create a username + password.
2. Log in at `/login`.
3. Add habits, click a day's cell to mark it done for that day.
4. Access token refreshes itself automatically when it expires (see `src/api/axios.js`).

## Notes

- Each `Habit` belongs to a user (`owner`), and `HabitViewSet.get_queryset` only returns the logged-in user's own habits.
- `POST /api/habits/<id>/toggle/` with `{ "date": "YYYY-MM-DD" }` flips that day's log for a habit.
- The week shown is always the current Mon-Sun; nothing stops you from extending it to show history later.
