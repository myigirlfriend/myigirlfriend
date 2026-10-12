import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import Button from './Button'
import IconTile from './IconTile'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  override render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="page flex items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <IconTile icon={TriangleAlert} className="mx-auto mb-4" />
          <h1 className="mb-2 text-2xl font-extrabold text-white">Something went wrong</h1>
          <p className="mb-6 text-sm text-brand-muted">
            Your chats are safe. Refresh the page to carry on.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh page</Button>
        </div>
      </div>
    )
  }
}
