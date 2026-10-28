import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Poppins is served with the app (no request to Google Fonts before the first paint), in the weights the UI uses
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import './index.css'
import { setImageMap, setLivePersonas } from '@config/personas'
import { PRERENDERED } from '@utils/env'
import type { PersonaRow } from '@/types'
import Root from './Root'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element in index.html')

// Prerendered pages carry the companion list they were built with, so the first render matches the HTML
declare global {
  interface Window { __PERSONAS__?: PersonaRow[]; __IMAGES__?: Record<string, string> }
}
if (window.__IMAGES__) setImageMap(window.__IMAGES__)
if (window.__PERSONAS__?.length) setLivePersonas(window.__PERSONAS__)

const app = (
  <Root
    router={(children) => (
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{children}</BrowserRouter>
    )}
  />
)

// A prerendered public page keeps its HTML and React takes it over (hydration), so nothing is painted twice.
// The signed-in app arrives as an empty shell and renders from scratch.
if (PRERENDERED) ReactDOM.hydrateRoot(container, app)
else ReactDOM.createRoot(container).render(app)
