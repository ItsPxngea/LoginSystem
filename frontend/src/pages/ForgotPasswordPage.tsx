import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import "../Styles/LoginPageStyle.css";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            setFormError("Please enter your email address")
            return;
        }

        setFormError("");
        setLoading(true);

        try {
            const res = await fetch("/api/passwordreset/forgot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.message ?? "Something went wrong. Please try again.2")
            }

            const data = await res.json();
            setSuccessMessage(data.message);
            setSubmitted(true);

        } catch (err) {
            setFormError(err instanceof Error ? err.message : "Something went wrong.")
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

                {submitted ? (
                    <>
                        <h1 className="login-heading">Check your email</h1>
                        <p className="login-subheading">
                            {successMessage || "A password reset link has been sent to your account"}
                        </p>

                        <Link to="/login" className="login-btn-primary login-btn-link">Back to sign in</Link>
                    </>
                ) : (

                    <>
                        <h1 className="login-heading">Forgot password?</h1>
                        <p className="login-subheading">Please enter your email</p>

                        {formError && <div className="login-error">{formError}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="login-field">
                                <label htmlFor="email">Email</label>
                                <input type="email"
                                    id="email"
                                    placeholder="youremail@example.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} />
                            </div>

                            <button type="submit" className="login-btn-primary" disabled={loading}>{loading ? "Sending email" : "Send reset link"}</button>
                        </form>

                        <p className="login-signup">
                            Remembered it? <Link to="/login">Back to sign in</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}