import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/register/', { username, password })
      navigate('/login')
    } catch (err) {
      setError('could not create that account, try a different username')
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>create an account</h1>
        <p className="auth-sub">one login, fifteen tiny apps</p>

        <label>username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">sign up</button>
        <p className="auth-switch">
          already have one? <Link to="/login">log in</Link>
        </p>
      </form>
    </div>
  )
}
