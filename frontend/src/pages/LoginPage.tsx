import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/UseAuth'
import "../Styles/LoginPageStyle.css"

export default function LoginPage() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setFormError('Please enter email or password')
      return
    }

    setFormError('')

    const ok = await login({ email, password })
    if (ok) navigate('/dashboard')
  }

  /*return (
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
  )*/
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-mark">▲</div>
          <span className="login-logo-name">Vertex</span>
        </div>

        <h1 className="login-heading">Welcome back</h1>
        <p className="login-subheading">Sign in to your account to continue.</p>

        {(formError || error) && (
          <div className="login-error">{formError || error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input id="email"
              type='email'
              placeholder='you@example.com'
              autoComplete='email'
              value={email}
              onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input id='password'
              type='password'
              placeholder='********'
              autoComplete='current-password'
              value={password}
              onChange={e => setPassword(e.target.value)} />
          </div>

          <div className='login-row'>
            <label className="login-check-label">
              <input type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a href="#" className='login-forgot'>Forgot password?</a>
          </div>

          <button type='submit' className='login-btn-primary' disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <button className="login-btn-google" type="button">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.2 30.2 0 24 0 14.8 0 6.9 5.4 3 13.2l7.9 6.1C12.7 13.2 17.9 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.9 37.3 46.5 31.3 46.5 24.5z" />
              <path fill="#FBBC05" d="M10.9 28.7A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7L2.4 13.2A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.4 10.6l8.5-5.9z" />
              <path fill="#4285F4" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.7 2.2-7.7 2.2-6.1 0-11.3-4.1-13.1-9.6l-8.5 6.6C6.9 42.6 14.8 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          <p className='login-signup'>
            Don't have an account? <a href="#">Signup now</a>
          </p>
        </form>
      </div>
    </div>
  )
}