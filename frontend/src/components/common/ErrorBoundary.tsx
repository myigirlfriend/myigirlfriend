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
          <IconTile icon={TriangleAlert} className="mx-auto mb-5" />
          <h1 className="heading mb-3 text-4xl">Something went wrong</h1>
          <p className="mb-7 text-base text-brand-muted">
            Your chats are safe. Refresh the page to carry on.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh page</Button>
        </div>
      </div>
    )
  }
}
