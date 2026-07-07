import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import './index.css'
import SignUpPage from './pages/SignUp'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProtectedRoute from './Components/ProtectedRoute'
import PublicRoute from './Components/PublicRoute'
import ProfilePage from './pages/ProfilePage'
import ErrorBoundary from './Components/ErrorBoundary'
import "./Styles/ErrorHandling.css"
import OfflineBanner from './Components/OfflineBanner'
import Layout from './Components/Layout'
import ToDoPage from './pages/TodoPage'

function ProtectedLayout({children}:{children:React.ReactNode}){
  return(
    <ProtectedRoute>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <OfflineBanner />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><SignUpPage /></PublicRoute>} />

          <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
          <Route path="/todos" element={<ProtectedLayout><ToDoPage /></ProtectedLayout>} />

          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

          <Route path='*' element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App