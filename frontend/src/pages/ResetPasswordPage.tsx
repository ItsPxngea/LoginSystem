import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../Styles/LoginPageStyle.css";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get("token") ?? "";

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!token) {
            setFormError("This reset link is invalid or broken.")
            return
        }

        if (!newPassword || !confirmPassword) {
            setFormError("Please ensure both fields are filled in correctly.")
            return
        }

        if (newPassword !== confirmPassword) {
            setFormError("Password does not match.")
            return
        }

        if (newPassword.length < 6) {
            setFormError("Your password must contain at least 6 characters")
            return
        }

        setFormError("")
        setLoading(true)

        try {
            const res = await fetch("/api/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword, confirmPassword })

            })

            const data = await res.json().catch(() => null)

            if (!res.ok) { throw new Error(data?.message ?? "This link is invalid or expired.") }

            setSuccess(true)
            setTimeout(() => navigate("/login"), 2500)

        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-mark">▲</div>
                    <span className="login-logo-name">Vertex</span>
                </div>

                {success ? (
                    <>
                        <h1 className="login-heading">Password reset</h1>
                        <p className="login-subheading">Your password has been updated. You may close this window if you are not redirected...</p>
                    </>
                ) : (
                    <>
                        <h1 className="login-heading">Reset your password</h1>
                        <p className="login-subheading">Enter a new password for your account</p>

                        {formError && <div className="login-error">{formError}</div>}

                        {!token && (
                            <div className="login-error">Not a valid URL</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="login-field">
                                <label htmlFor="newPassword">New password</label>
                                <input type="password"
                                    id="newPassword"
                                    placeholder="********"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)} />
                            </div>

                            <div className="login-field">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <input type="password"
                                id="confirmPassword"
                                placeholder="********"
                                autoComplete="confirm-password"
                                value={confirmPassword}
                                onChange={e=>setConfirmPassword(e.target.value)} />
                            </div>

                            <button type="submit" className="login-btn-primary" disabled={loading}>
                                {loading ? "Resetting password..." : "Password reset"}
                            </button>

                        </form>

                        <p className="login-signup">
                            <Link to="/login">Back to sign in page</Link>
                        </p>

                    </>
                )}
            </div>
        </div>
    )
}