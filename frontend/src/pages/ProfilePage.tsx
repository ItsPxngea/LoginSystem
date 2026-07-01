import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { profileApi } from '../API/ProfileApi'
import type { ProfileResponse } from '../types/Profile'
import '../Styles/ProfilePage.css'
import { useNavigate, useLocation } from "react-router-dom"

type PasswordStep = "idle" | "verifying" | "changing"

export default function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [profile, setProfile] = useState<ProfileResponse | null>(null)
    const [loadingProfile, setLoadingProfile] = useState(true);

    //Username info
    const [newUserName, setNewUserName] = useState("")
    const [editingUsername, setEditingUsername] = useState(false)
    const [usernameLoading, setUsernameLoading] = useState(false)
    const [usernameError, setUsernameError] = useState("")
    const [usernameSuccess, setUsernameSuccess] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [verifyError, setVerifyError] = useState("")
    const [passwordStep, setPasswordStep] = useState<PasswordStep>("idle")

    useEffect(() => {
        setPasswordStep("idle")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
        setVerifyError("")
        setPasswordError("")
        setEditingUsername(false)
        setUsernameError("")
        setUsernameSuccess("")
    }, [location.key])

    useEffect(() => {
        let cancelled = false;
        //collecting cached data for user profile
        const cached = localStorage.getItem("user") ?? sessionStorage.getItem("user")
        if (cached) {
            const user = JSON.parse(cached);
            setProfile(user);
            setNewUserName(user.userProfileName);
            setLoadingProfile(false);
        }

        //finding user info in database

        const loadProfile = async () => {
            setLoadingProfile(true);

            try {
                const data = await profileApi.getProfile();
                if (!cancelled) {
                    setProfile(data);
                    setNewUserName(data.userProfileName);

                    //update storage with data
                    const storage = localStorage.getItem("token") ? localStorage : sessionStorage
                    storage.setItem("user", JSON.stringify(data))
                }
            } catch {

            } finally {
                if (!cancelled) setLoadingProfile(false)
            }
        }
        loadProfile();
        return () => { cancelled = true }

    }, [])






    const extractMessage = (err: unknown, fallback: string): string => {

        if (err && typeof err === "object" && "message" in err) {
            return String((err as { message: unknown }).message)
        }

        return fallback;
    }

    //handling the updated data when updating username
    const handleUsernameSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setUsernameError("");
        setUsernameSuccess("");

        if (!newUserName.trim()) {
            setUsernameError("Username cannot be empty");
            return
        }

        setUsernameLoading(true);

        try {

            const res = await profileApi.updateUsername({ newUsername: newUserName });
            setUsernameSuccess(res.message);
            setProfile(prev => prev ? { ...prev, userProfileName: res.userProfileName } : prev);
            setEditingUsername(false);

        } catch (err) {
            setUsernameError(extractMessage(err, "Could not update username"))

        } finally {
            setUsernameLoading(false);
        }

    }

    //verify password
    const handleVerifyPassword = async (e: FormEvent) => {
        e.preventDefault();
        setVerifyError("");

        if (!currentPassword) {
            setVerifyError("Please enter your password");
            return;
        }
        setVerifyLoading(true);

        try {

            await profileApi.verifyPassword(currentPassword);
            navigate(location.pathname, { replace: false });
            setPasswordStep("changing");

        } catch (err) {
            setVerifyError(extractMessage(err, "Password is incorrect"));
        } finally {
            setVerifyLoading(false);
        }
    }

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!newPassword || !confirmNewPassword) {
            setPasswordError("Please fill in all password fields");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        setPasswordLoading(true);

        try {
            const res = await profileApi.updatePassword({
                currentPassword,
                newPassword,
                confirmNewPassword
            })

            setPasswordSuccess(res.message);

            setTimeout(() => {
                setPasswordStep("idle")
                setCurrentPassword("");
                setConfirmNewPassword("");
                setNewPassword("");
                setPasswordSuccess("");
            }, 2000)
        } catch (err) {
            setPasswordError(extractMessage(err, "Could not update password. Please try again later"))
        } finally {
            setPasswordLoading(false);
        }

    }

    //render
    if (loadingProfile) {
        return <div className='profile-page'><p className='profile-loading'>Loading profile...</p></div>
    }
    if (!profile) {
        return <div className='profile-page'><p className='profile-loading'>Unable to load your profile</p></div>
    }


    if (passwordStep === "changing") {

    }


    /*return (
        <div className='profile-page'>
            <div className='profile-card-title'>
                <div className='profile-info-row'>
                    <span className='profile-info-label'>Name</span>
                    <span className='profile-info-value'>{profile.userFirstName}{profile.userLastName}</span>
                </div>
                <div className='profile-info-row'>
                    <span className='profile-info-label'>Email</span>
                    <span className='profile-info-value'>{profile.email}</span>
                </div>
            </div>

            <div className='profile-card'>
                <h2 className='profile-card-title'>Username</h2>

                {usernameError && <div className='profile-error'>{usernameError}</div>}
                {usernameSuccess && <div className='profile-success'>{usernameSuccess}</div>}

                <form onSubmit={handleUsernameSubmit}>
                    <div className='profile-field'>
                        <label htmlFor="newUsername">Username</label>
                        <input type="text"
                            id='newUsername'
                            value={newUserName}
                            onChange={e => setNewUserName(e.target.value)} />
                    </div>

                    <button type='submit' className='profile-btn-primary' disabled={usernameLoading}>
                        {usernameLoading ? "Saving..." : "Update username"}
                    </button>
                </form>
            </div>

            <div className='profile-card'>
                <h2 className='profile-card-title'>Change Password</h2>

                {passwordError && <div className='profile-error'>{passwordError}</div>}
                {passwordSuccess && <div className='profile-success'>{passwordSuccess}</div>}

                <form onSubmit={handlePasswordSubmit}>
                    <div className='profile-field'>
                        <label htmlFor="currentPassword">Current Password</label>
                        <input type="password"
                            id='currentPassword'
                            value={currentPassword}
                            placeholder='********'
                            autoComplete='current-password'
                            onChange={e => setCurrentPassword(e.target.value)} />
                    </div>

                    <div className='profile-field'>
                        <label htmlFor="newPassword">New Password</label>
                        <input type="password"
                            id='newPassword'
                            value={newPassword}
                            placeholder='********'
                            autoComplete='new-password'
                            onChange={e => setNewPassword(e.target.value)} />
                    </div>

                    <div className='profile-field'>
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input type="password"
                            id='confirmNewPassword'
                            placeholder='********'
                            autoComplete='new-password'
                            value={confirmNewPassword}
                            onChange={e => setConfirmNewPassword(e.target.value)} />
                    </div>

                    <button type='submit' className='profile-btn-primary' disabled={passwordLoading}>
                        {passwordLoading ? "Updating..." : "Update password"}
                    </button>
                </form>
            </div>
        </div>
    )
        */


    return (
        <div className='profile-page'>
            <div className='profile-header'>
                <h1 className='profile-title'>My Profile</h1>
                <p className='profile-subtitle'>View and manage your account details.</p>
            </div>

            {/*Account Information*/}
            <div className='profile-card'>
                <h2 className='profile-card-title'>Account Info</h2>

                <div className='profile-info-row'>
                    <span className='profile-info-label'>First name</span>
                    <span className='profile-info-value'>{profile.userFirstName}</span>
                </div>

                <div className='profile-info-row'>
                    <span className='profile-info-label'>Last name</span>
                    <span className='profile-info-value'>{profile.userLastName}</span>
                </div>

                <div className='profile-info-row'>
                    <span className='profile-info-label'>Email</span>
                    <span className='profile-info-value'>{profile.email}</span>
                </div>

                <div className='profile-info-row profile-info-row--editable'>
                    <div>
                        <span className='profile-info-label'>Username</span>
                        {!editingUsername && (
                            <span className='profile-info-value'>{profile.userProfileName}</span>
                        )}
                    </div>
                    {!editingUsername && (
                        <button className='profile-btn-link'
                            onClick={() => {
                                setEditingUsername(true)
                                setNewUserName(profile.userProfileName)
                                setUsernameError("")
                                setUsernameSuccess("")
                            }}>Update username</button>
                    )}
                </div>

                {/*Username update section*/}
                {editingUsername && (
                    <form className='profile-inline-form' onSubmit={handleUsernameSubmit}>
                        {usernameError && <div className='profile-error'>{usernameError}</div>}
                        {usernameSuccess && <div className='profile-success'>{usernameSuccess}</div>}
                        <div className='profile-field'>
                            <label htmlFor="newUsername">New username</label>
                            <input type="text"
                                id='newUsername'
                                value={newUserName}
                                onChange={e => setNewUserName(e.target.value)}
                                autoFocus />
                        </div>
                        <div className='profile-actions'>
                            <button type='submit' className='profile-btn-primary' disabled={usernameLoading}>
                                {usernameLoading ? "Saving..." : "Save"}
                            </button>
                            <button type='button'
                                className='profile-btn-ghost'
                                onClick={() => {
                                    setEditingUsername(false)
                                    setUsernameError("")
                                    setUsernameSuccess("")
                                }}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/*Password card section*/}
            <div className='profile-card'>
                <h2 className='profile-card-title'>Password</h2>
                {passwordStep === "idle" && (
                    <div className='profile-info-row profile-info-row--editable'>
                        <div>
                            <span className='profile-info-label'>Password</span>
                            <span className='profile-info-value'>********</span>
                        </div>
                        <button className='profile-btn-link' type='submit' onSubmit={handlePasswordSubmit}
                            onClick={() => {
                                setPasswordStep("verifying")
                                setVerifyError("")
                            }}>Update password</button>
                    </div>
                )}

                {passwordStep === "verifying" && (
                    <form onSubmit={handleVerifyPassword}>
                        {verifyError && <div className='profile-error'>{verifyError}</div>}
                        <div className='profile-field'>
                            <label htmlFor="currentPassword">Enter password to continue</label>
                            <input type="password"
                                id='currenyPassword'
                                placeholder='********'
                                autoComplete='current-password'
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                autoFocus />
                        </div>
                        <div className='profile-actions'>
                            <button className="profile-btn-primary" type='submit' disabled={verifyLoading}>
                                {verifyLoading ? "Verifying..." : "Verify"}
                            </button>
                            <button type='button'
                                className='profile-btn-ghost'
                                onClick={() => {
                                    setPasswordStep("idle")
                                    setCurrentPassword("")
                                    setVerifyError("")
                                }}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}