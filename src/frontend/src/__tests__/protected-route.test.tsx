import { render, screen, waitFor } from '@testing-library/react'
import { Route, Routes, MemoryRouter } from 'react-router-dom'
import { AppProviders } from '@/app/AppProviders'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

function ProtectedHarness() {
  return (
    <AppProviders>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/properties/new']}>
        <Routes>
          <Route element={<ProtectedRoute roles={['OWNER']} />}>
            <Route element={<div>Protected content</div>} path="/properties/new" />
          </Route>
          <Route element={<div>Login page</div>} path="/login" />
        </Routes>
      </MemoryRouter>
    </AppProviders>
  )
}

test('redirects anonymous users to login', async () => {
  window.localStorage.clear()
  render(<ProtectedHarness />)
  await waitFor(() => expect(screen.getByText('Login page')).toBeInTheDocument())
})
