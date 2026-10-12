import { Suspense, lazy, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from '@components/common/Navbar'
import LandingPage from '@pages/LandingPage'
import Spinner from '@components/common/Spinner'
import { useAuthStore } from '@store/index'

// Every screen except the landing page is loaded on demand, so a visitor only downloads what they open.
// The operator dashboard in particular never reaches members.
const AdminLayout = lazy(() => import('@components/operator/AdminLayout'))
const AuthCallbackPage = lazy(() => import('@pages/AuthCallbackPage'))
const ChatListPage = lazy(() => import('@pages/ChatListPage'))
const ChatPage = lazy(() => import('@pages/ChatPage'))
const ForgotPasswordPage = lazy(() => import('@pages/ForgotPasswordPage'))
const LoginPage = lazy(() => import('@pages/LoginPage'))
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'))
const PersonaSelectPage = lazy(() => import('@pages/PersonaSelectPage'))
const PrivacyPage = lazy(() => import('@pages/PrivacyPage'))
const ProfilePage = lazy(() => import('@pages/ProfilePage'))
const RegisterPage = lazy(() => import('@pages/RegisterPage'))
const ResetPasswordPage = lazy(() => import('@pages/ResetPasswordPage'))
const SubscriptionPage = lazy(() => import('@pages/SubscriptionPage'))
const TermsPage = lazy(() => import('@pages/TermsPage'))
const AdminHoursPage = lazy(() => import('@pages/operator/AdminHoursPage'))
const ConversationsPage = lazy(() => import('@pages/operator/ConversationsPage'))
const ModelsPage = lazy(() => import('@pages/operator/ModelsPage'))
const OperatorLoginPage = lazy(() => import('@pages/operator/OperatorLoginPage'))
const OverviewPage = lazy(() => import('@pages/operator/OverviewPage'))

interface GuardProps {
  children: ReactNode
}

// Shown for the moment a screen's code is being fetched
function PageLoading() {
  return (
    <div className="page flex items-center justify-center" role="status">
      <Spinner size="lg" />
      <span className="sr-only">Loading</span>
    </div>
  )
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
      <Suspense fallback={<PageLoading />}>
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
      </Suspense>

      <Navbar />
    </>
  )
}
