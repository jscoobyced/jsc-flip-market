import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import '@/index.css'

declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiBaseUrl?: string
      useMockData?: boolean
    }
  }
}

window.__APP_CONFIG__ = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
  useMockData: import.meta.env.VITE_USE_MOCKS === 'true',
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
