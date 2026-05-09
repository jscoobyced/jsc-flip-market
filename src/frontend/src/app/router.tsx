import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { FlipperProfilePage } from '@/pages/FlipperProfilePage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OwnerListingsPage } from '@/pages/OwnerListingsPage'
import { OwnerDashboardPage } from '@/pages/OwnerDashboardPage'
import { OwnerProfilePage } from '@/pages/OwnerProfilePage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage'
import { PropertyCreatePage } from '@/pages/PropertyCreatePage'
import { PropertyDetailPage } from '@/pages/PropertyDetailPage'
import { PropertyEditPage } from '@/pages/PropertyEditPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { SearchResultsPage } from '@/pages/SearchResultsPage'
import { TermsOfUsePage } from '@/pages/TermsOfUsePage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell><Outlet /></AppShell>}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/flippers/:id" element={<FlipperProfilePage />} />
        <Route path="/owners/:id" element={<OwnerProfilePage />} />
        <Route path="/owners/:id/listings" element={<OwnerListingsPage />} />
        <Route path="/properties/search" element={<SearchResultsPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/terms" element={<TermsOfUsePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route element={<ProtectedRoute roles={['OWNER']} />}>
          <Route path="/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/properties/new" element={<PropertyCreatePage />} />
          <Route path="/properties/:id/edit" element={<PropertyEditPage />} />
        </Route>
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
