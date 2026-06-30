import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { profileApi } from '../API/ProfileApi'
import type { ProfileResponse } from '../types/Profile'
//import '../profile.css'

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null)
    const [loadingProfile, setLoadingProfile] = useState(true);

    //User info
    const [userName, setUserName] = useState("")
    const [usernameLoading, setUsernameLoading] = useState(false)
    const [usernameError, setUsernameError] = useState("")
    const [usernameSuccess, setUsernameSuccess] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("")

    useEffect(() => {
        loadProfile();
    },[])

    const loadProfile = async () => {
        setLoadingProfile(true);

        try {
            const data = await profileApi.getProfile();
            setProfile(data);
            setUserName(data.userProfileName);
        } catch {

        } finally {
            setLoadingProfile(false)
        }
    }

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

        if (!userName.trim()) {
            setUsernameError("Username cannot be empty");
            return
        }

        setUsernameLoading(true);

        try {

            const res = await profileApi.updateUsername({ newUsername: userName });
            setUsernameSuccess(res.message);
            setProfile(prev => prev ? { ...prev, userProfileName: res.userProfileName } : prev);

        } catch (err) {
            setUsernameError(extractMessage(err, "Could not update username"))

        } finally {
            setUsernameLoading(false);
        }

    }

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (!currentPassword || !newPassword || !confirmNewPassword) {
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
            setCurrentPassword("");
            setConfirmNewPassword("");
            setNewPassword("");

        } catch (err) {

        } finally {
            setPasswordLoading(false);
        }

    }

    if (loadingProfile) {
        return <div className='profile-page'><p className='profile-loading'>Loading profile...</p></div>
    }
    if (!profile) {
        return <div className='profile-page'><p className='profile-loading'>Unable to load your profile</p></div>
    }


    return (
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
                            value={userName}
                            onChange={e => setUserName(e.target.value)} />
                    </div>

                    <button type='submit' className='profile-btn-primary' disabled={usernameLoading}>
                        {usernameLoading ? "Saving..." : "Update username"}
                    </button>
                </form>
            </div>

        </div>
    )

}