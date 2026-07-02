import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import type { LayoutProps } from "../types/Layout";
//import "../Styles/Layout.css"

export default function Layout({ children }: LayoutProps) {
    const { logout, getCurrentUser } = useAuth();
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    }

    const initial = user?.userProfileName.match(/[A-Z]/)?.[0] ?? user?.userProfileName.trim().charAt(0).toUpperCase() ?? "";

    return (
        <div className="layout-shell">
            {/*navigation bar*/}
            <aside className="layout-sidebar">
                <div className="layout-logo">
                    <div className="layout-logo-mark">▲</div>
                    <span className="layout-logo-name">Vertex</span>
                </div>

                <nav className="layout-nav">
                    <NavLink to="/dashboard"
                        className={({ isActive }) => `layout-nav-item ${isActive ? "layout-nav-item--active" : ""}`}>
                        {/*<span className="layout-nav-icon">⊞</span>*/}
                        Dashboard
                    </NavLink>

                    <NavLink to="/todos" className={({ isActive }) => `layout-nav-item ${isActive ? 'layout-nav-item--active' : ''}`}>
                        To-Dos
                    </NavLink>

                    <NavLink to="/profile" className={({ isActive }) => `layout-nav-item ${isActive ? 'layout-nav-item--active' : ''}`}>
                        Profile
                    </NavLink>
                </nav>

                <div className="sidebar-bottom">
                    <div className="avatar-row">
                        <div className="avatar">{initial}</div>
                        <span className="avatar-name">{user?.userProfileName}</span>
                    </div>

                    <button className="logout-btn" onClick={handleLogout}>Log out</button>
                </div>
            </aside>

            {/*main page content*/}
            <main className="layout-content">{children}</main>

        </div>
    )
}