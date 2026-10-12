import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '@components/common/Navbar'
import AdminLayout from '@components/operator/AdminLayout'
import AuthCallbackPage from '@pages/AuthCallbackPage'
import ChatListPage from '@pages/ChatListPage'
import ChatPage from '@pages/ChatPage'
import ForgotPasswordPage from '@pages/ForgotPasswordPage'
import LandingPage from '@pages/LandingPage'
import LoginPage from '@pages/LoginPage'
import NotFoundPage from '@pages/NotFoundPage'
import PersonaSelectPage from '@pages/PersonaSelectPage'
import PrivacyPage from '@pages/PrivacyPage'
import ProfilePage from '@pages/ProfilePage'
import RegisterPage from '@pages/RegisterPage'
import ResetPasswordPage from '@pages/ResetPasswordPage'
import SubscriptionPage from '@pages/SubscriptionPage'
import TermsPage from '@pages/TermsPage'
import AdminHoursPage from '@pages/operator/AdminHoursPage'
import ConversationsPage from '@pages/operator/ConversationsPage'
import ModelsPage from '@pages/operator/ModelsPage'
import OperatorLoginPage from '@pages/operator/OperatorLoginPage'
import OverviewPage from '@pages/operator/OverviewPage'
import { useAuthStore } from '@store/index'

interface GuardProps {
  children: ReactNode
}

// Route guards
function PrivateRoute({ children }: GuardProps) {
  const user = useAuthStore((s) => s.user)
  return user ? children : <Navigate to="/login" replace />
}

function OperatorRoute({ children }: GuardProps) {
  const operator = useAuthStore((s) => s.operator)
  return operator ? children : <Navigate to="/operator/login" replace />
}

function PublicRoute({ children }: GuardProps) {
  const user = useAuthStore((s) => s.user)
  return !user ? children : <Navigate to="/personas" replace />
}

// Admins land on the overview; agents go straight to their conversations
function OperatorHome() {
  const operator = useAuthStore((s) => s.operator)
  return operator?.role === 'admin' ? <OverviewPage /> : <Navigate to="/operator/chats" replace />
}

export default function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Protected user routes */}
        <Route path="/personas" element={<PrivateRoute><PersonaSelectPage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatListPage /></PrivateRoute>} />
        <Route path="/chat/:conversationId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/subscription" element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        {/* Operator routes */}
        <Route path="/operator/login" element={<OperatorLoginPage />} />
        <Route path="/operator" element={<OperatorRoute><AdminLayout /></OperatorRoute>}>
          <Route index element={<OperatorHome />} />
          <Route path="models" element={<ModelsPage />} />
          <Route path="chats" element={<ConversationsPage />} />
          <Route path="hours" element={<AdminHoursPage />} />
          <Route path="dashboard" element={<Navigate to="/operator" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Navbar />
    </>
  )
}
