import { StrictMode, type ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from '@components/common/ErrorBoundary'
import App from './App'

// The whole React tree, shared by the browser (main.tsx) and the build-time prerender (entry-server.tsx).
// Prerendered pages are hydrated, so both must render exactly the same tree; only the router differs.

interface RootProps {
  /** BrowserRouter in the browser, StaticRouter at build time */
  router: (children: ReactNode) => ReactNode
}

export default function Root({ router }: RootProps) {
  return (
    <StrictMode>
      <ErrorBoundary>
        {/* Animations are skipped for people who ask their device to reduce motion */}
        <MotionConfig reducedMotion="user">
          {router(
            <>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'rgb(var(--color-brand-card))',
                    color: 'rgb(var(--color-brand-text))',
                    border: '1px solid rgb(var(--color-brand-border))',
                    fontFamily: 'var(--font-sans)',
                  },
                  success: { iconTheme: { primary: 'rgb(var(--color-brand-purple))', secondary: '#fff' } },
                  error: { iconTheme: { primary: 'rgb(var(--color-brand-pink))', secondary: '#fff' } },
                }}
              />
            </>,
          )}
        </MotionConfig>
      </ErrorBoundary>
    </StrictMode>
  )
}
