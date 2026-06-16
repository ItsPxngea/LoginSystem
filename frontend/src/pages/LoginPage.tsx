import { useState} from 'react'
import type {FormEvent} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/UseAuth'

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const ok = await login({ email, password })
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="login-wrap">
      <div className="login-brand">
        <div className="logo">
          <div className="logo-mark">▲</div>
          <span className="logo-name">Vertex</span>
        </div>
        <div className="brand-copy">
          <h1>Work smarter,<br />not <em>harder.</em></h1>
          <p>Your team's command centre — tasks, docs, and decisions in one focused space.</p>
        </div>
      </div>

      <div className="login-form-panel">
        <h2>Welcome back</h2>
        <p className="sub">Sign in to your account to continue.</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-row">
            <label className="check-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="signup-cta">
          Don't have an account? <a href="#">Sign up free</a>
        </p>
      </div>
    </div>
  )
}