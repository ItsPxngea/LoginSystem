import { useState } from "react"
import type{ FormEvent } from "react"

export default function SignUpPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [profileName, setProfileName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        if (!firstName || !lastName || !profileName || !email || !password || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password length must be at least 6 characters")
            return
        }

        setError('')

        setLoading(true)
        setTimeout(() => setLoading(false), 1500)
    }

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-logo">
                    <div className="signup-logo-mark">▲</div>
                    <span className="signup-logo-name">Vertex</span>
                </div>

                <h1 className="signup-heading">Create your account</h1>
                {error && <div className="signup-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="signup-field-row">
                        <div className="signup-field">
                            <label className="signup-field">First name</label>
                            <input id="firstName"
                                type="text"
                                placeholder="First Name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)} />
                        </div>

                        <div className="signup-field">
                            <label htmlFor="lastName">Last name</label>
                            <input id="lastName"
                                type="text"
                                placeholder="Last Name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)} />
                        </div>
                    </div>

                    <div className="signup-field">
                        <label htmlFor="profileName">Username</label>
                        <input id="profileName"
                            type="text"
                            placeholder="Username"
                            autoComplete="username"
                            value={profileName}
                            onChange={e => setProfileName(e.target.value)} />
                    </div>

                    <div className="signup-field">
                        <label htmlFor="email">Email</label>
                        <input id="email"
                            type="text"
                            placeholder="you@example.com"
                            autoComplete="email"
                            onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className="signup-field">
                        <label htmlFor="password">Password</label>
                        <input id="password"
                            type="text"
                            placeholder="********"
                            autoComplete="new-password"
                            value={password}
                            onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className="signup-field">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input id="confirmPassword"
                            type="text"
                            placeholder="********"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)} />
                    </div>

                    <button type="submit" className="signup-btn-primary" disabled={loading}>
                        {loading ? "Creating account" : "Create account"}
                    </button>

                </form>

                <div className="signup-divider"><span>or</span></div>

                <button className="signup-btn-google" type="button">
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.2 30.2 0 24 0 14.8 0 6.9 5.4 3 13.2l7.9 6.1C12.7 13.2 17.9 9.5 24 9.5z" />
                        <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.9 37.3 46.5 31.3 46.5 24.5z" />
                        <path fill="#FBBC05" d="M10.9 28.7A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7L2.4 13.2A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.4 10.6l8.5-5.9z" />
                        <path fill="#4285F4" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.7 2.2-7.7 2.2-6.1 0-11.3-4.1-13.1-9.6l-8.5 6.6C6.9 42.6 14.8 48 24 48z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="signup-login-link">
                    Already have an account? <a href="#">Sign in</a>
                </p>

            </div>
        </div>
    )
}