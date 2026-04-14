import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/useAuth.js'
import ChatPage from './pages/ChatPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth()

  if (loading) {
    return <div className="center-note">Checking login session...</div>
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
