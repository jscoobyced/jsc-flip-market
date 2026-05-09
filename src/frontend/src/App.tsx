import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { AppRouter } from '@/app/router'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRouter />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
