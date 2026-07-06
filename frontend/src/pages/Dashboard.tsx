/*export default function Dashboard() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h1>Dashboard</h1>
      <p>You're logged in. Build your app here.</p>
    </div>
  )
}*/

import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/UseAuth'
import { useEffect, useState } from "react";
import type { UserDTO } from "../types/Auth";
import { http } from '../API/Client'
import "../Styles/Dashboard.css"


interface StatCard {
  label: string
  value: string
  delta: string
  trend: "up" | "down" | "neutral"
}

export default function Dashboard() {

  const [user, setUser] = useState<UserDTO | null>(null);
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)


  /*(const getUser = async(): Promise<UserDTO> =>{
    /*const response = await fetch(`http://localhost:5157/api/user/profile`)
    console.log(JSON.stringify(response))
    if(!response.ok){
      throw new Error("failed to fetch user")
    }
    return await response.json();
    return http.get<UserDTO>("user/profile")

    


  }*/
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout()
    setLoading(true);
    //setTimeout(() => navigate("/login"), 2500)
    navigate("/login")



  }


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await http.get<UserDTO>("/user/profile")
        setUser(data);


      } catch (err) {
        setFormError("Failed to fetch user")
      }

    }
    fetchUser();
  }, [])

  //const initial = user?.userProfileName.match(/[A-Z]/)?.[0] ?? user?.userProfileName.trim().charAt(0).toUpperCase() ?? "";

  return (
    /*<div className="dash-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">▲</div>
          Vertex
        </div>

        <nav className="nav-bar">
          <a className="nav-bar-item" href="/dashboard">Dashboard</a>
          <a className="nav-bar-item" href="/profile">Profile</a>
          <a className="nav-bar-item" href="#">Data</a>
          <a className="nav-bar-item" href="#">Settings</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-avatar-row">
            <div className="avatar">{initial}</div>
            <span className="avatar-name">{user?.userProfileName}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
*/<>
      {/*Main content*/}
      <main className="dash-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Welcome {user?.userProfileName}</h1>
            <p className="page-sub-title">Here's the latest</p>
          </div>
          <button className="dash-btn-primary">+ New Item</button>
        </div>

        {/* fill in the body of the dashboard */}

        <div className="dash-card">
          <div className="dash-card-title"><span>This week</span></div>
        </div>

      </main>
</>

    //</div>
  )


}