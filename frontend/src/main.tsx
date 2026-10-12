import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from '@components/common/ErrorBoundary'
import App from './App'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element in index.html')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* Animations are skipped for people who ask their device to reduce motion */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
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
        </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  </React.StrictMode>
)
