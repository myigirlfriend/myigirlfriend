import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/index'

// Pages
import LandingPage from '@pages/LandingPage'
import LoginPage from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'
import PersonaSelectPage from '@pages/PersonaSelectPage'
import ChatPage from '@pages/ChatPage'
import SubscriptionPage from '@pages/SubscriptionPage'
import ProfilePage from '@pages/ProfilePage'
import OperatorLoginPage from '@pages/operator/OperatorLoginPage'
import OperatorDashboardPage from '@pages/operator/OperatorDashboardPage'

// Route guards
function PrivateRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  return user ? children : <Navigate to="/login" replace />
}

function OperatorRoute({ children }) {
  const operator = useAuthStore((s) => s.operator)
  return operator ? children : <Navigate to="/operator/login" replace />
}

function PublicRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  return !user ? children : <Navigate to="/chat" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected user routes */}
      <Route path="/personas" element={<PrivateRoute><PersonaSelectPage /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/chat/:conversationId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
      <Route path="/subscription" element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

      {/* Operator routes */}
      <Route path="/operator/login" element={<OperatorLoginPage />} />
      <Route path="/operator/dashboard" element={<OperatorRoute><OperatorDashboardPage /></OperatorRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
