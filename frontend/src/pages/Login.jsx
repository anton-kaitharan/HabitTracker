import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('wrong username or password')
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>habit tracker</h1>
        <p className="auth-sub">log back in and keep the streak alive</p>

        <label>username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">log in</button>
        <p className="auth-switch">
          no account yet? <Link to="/register">register</Link>
        </p>
      </form>
    </div>
  )
}
