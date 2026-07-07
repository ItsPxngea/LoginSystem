import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import type { LayoutProps } from "../types/Layout";
import "../Styles/LayoutStyles.css"
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Layout({ children }: LayoutProps) {
    const { logout, getCurrentUser } = useAuth();
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    }

    const closeSidebar = () => setIsSidebarOpen(false);

    const initial = user?.userProfileName.match(/[A-Z]/)?.[0] ?? user?.userProfileName.trim().charAt(0).toUpperCase() ?? "";

    /*return (
        <div className="layout-shell">
            {/*navigation bar}
            <aside className="layout-sidebar">
                <div className="layout-logo">
                    <div className="layout-logo-mark">▲</div>
                    <span className="layout-logo-name">Vertex</span>
                </div>

                <nav className="layout-nav">
                    <NavLink to="/dashboard"
                        className={({ isActive }) => `layout-nav-item ${isActive ? "layout-nav-item--active" : ""}`}>
                        {/*<span className="layout-nav-icon">⊞</span>}
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

            {/*main page content}
            <main className="layout-content">{children}</main>

        </div>
    )*/

    return (
        <div className="layout-shell">
            {/* mobile-only top bar with hamburger toggle */}
            <div className="layout-topbar">
                <button
                    className="layout-hamburger-btn"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>
                <div className="layout-logo">
                    <div className="layout-logo-mark">▲</div>
                    <span className="layout-logo-name">Vertex</span>
                </div>
            </div>

            {/* dark backdrop, closes sidebar on click (mobile only) */}
            <div
                className={`layout-overlay ${isSidebarOpen ? 'layout-overlay--visible' : ''}`}
                onClick={closeSidebar}
            />

            {/*navigation bar*/}
            <aside className={`layout-sidebar ${isSidebarOpen ? 'layout-sidebar--open' : ''}`}>
                <div className="layout-logo layout-logo--desktop">
                    <div className="layout-logo-mark">▲</div>
                    <span className="layout-logo-name">Vertex</span>
                </div>

                <button
                    className="layout-close-btn"
                    onClick={closeSidebar}
                    aria-label="Close menu"
                >
                    <X size={20} />
                </button>

                <nav className="layout-nav">
                    <NavLink
                        to="/dashboard"
                        onClick={closeSidebar}
                        className={({ isActive }) => `layout-nav-item ${isActive ? "layout-nav-item--active" : ""}`}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/todos"
                        onClick={closeSidebar}
                        className={({ isActive }) => `layout-nav-item ${isActive ? 'layout-nav-item--active' : ''}`}
                    >
                        To-Dos
                    </NavLink>

                    <NavLink
                        to="/profile"
                        onClick={closeSidebar}
                        className={({ isActive }) => `layout-nav-item ${isActive ? 'layout-nav-item--active' : ''}`}
                    >
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