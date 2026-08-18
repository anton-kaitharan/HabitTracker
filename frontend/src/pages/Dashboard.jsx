import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getWeekDates() {
  const now = new Date()
  const day = now.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMonday)

  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const weekDates = getWeekDates()
  const today = new Date().toISOString().slice(0, 10)

  const loadHabits = async () => {
    const res = await api.get('/habits/')
    setHabits(res.data)
    setLoading(false)
  }

  useEffect(() => {
    loadHabits()
  }, [])

  const addHabit = async (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return
    await api.post('/habits/', { name: newHabit.trim() })
    setNewHabit('')
    loadHabits()
  }

  const removeHabit = async (id) => {
    await api.delete(`/habits/${id}/`)
    loadHabits()
  }

  const toggleCell = async (habitId, date) => {
    const res = await api.post(`/habits/${habitId}/toggle/`, { date })
    setHabits((prev) => prev.map((h) => (h.id === habitId ? res.data : h)))
  }

  const isDone = (habit, date) => {
    const log = habit.logs.find((l) => l.date === date)
    return log ? log.is_done : false
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>habit tracker</h1>
        <div>
          <span className="whoami">{user}</span>
          <button className="ghost" onClick={logout}>log out</button>
        </div>
      </header>

      <form className="add-row" onSubmit={addHabit}>
        <input
          placeholder="new habit, e.g. drink water"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button type="submit">add</button>
      </form>

      {loading ? (
        <p>loading...</p>
      ) : habits.length === 0 ? (
        <p className="empty">no habits yet, add your first one above</p>
      ) : (
        <table className="habit-grid">
          <thead>
            <tr>
              <th></th>
              {weekDates.map((date, i) => (
                <th key={date} className={date === today ? 'today-col' : ''}>
                  {DAY_LABELS[i]}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td className="habit-name">{habit.name}</td>
                {weekDates.map((date) => (
                  <td
                    key={date}
                    className={`cell ${isDone(habit, date) ? 'done' : ''} ${date === today ? 'today-col' : ''}`}
                    onClick={() => toggleCell(habit.id, date)}
                  >
                    {isDone(habit, date) ? '✓' : ''}
                  </td>
                ))}
                <td>
                  <button className="ghost small" onClick={() => removeHabit(habit.id)}>remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
