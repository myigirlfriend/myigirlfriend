import { useAuth } from '@hooks/useAuth'
import { useSubStore } from '@store/index'
import Button from '@components/common/Button'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { plan } = useSubStore()

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-12">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-extrabold gradient-text mb-8">My Profile</h1>
        <div className="card space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Name</span>
            <span className="text-white font-semibold">{user?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Email</span>
            <span className="text-white font-semibold">{user?.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-muted">Plan</span>
            <span className="gradient-text font-bold capitalize">{plan}</span>
          </div>
        </div>
        <Button variant="ghost" fullWidth onClick={logout}>Sign Out</Button>
      </div>
    </div>
  )
}
