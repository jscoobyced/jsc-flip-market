import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useAuth } from '@/hooks/useAuth'
import { OwnerDashboardPage } from '@/pages/OwnerDashboardPage'
import type { Enquiry, OwnerProfile } from '@/types/models'

jest.mock('@/hooks/useAsyncData')
jest.mock('@/hooks/useAuth')

const mockedUseAsyncData = jest.mocked(useAsyncData)
const mockedUseAuth = jest.mocked(useAuth)

const owner: OwnerProfile = {
  id: 'owner-1',
  email: 'owner@example.com',
  name: 'Owner One',
  phone: '555-111-2222',
  role: 'OWNER',
  bio: 'Experienced seller',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const enquiries: Enquiry[] = [
  {
    id: 'enquiry-1',
    propertyId: 'property-1',
    propertyOwnerId: owner.id,
    propertyTitle: 'Bed-Stuy brownstone',
    flipperId: 'flipper-1',
    flipperName: 'Jordan Brooks',
    flipperEmail: 'flipper@example.com',
    message: 'I can tour this week and move fast with proof of funds.',
    contactName: 'Jordan Brooks',
    contactEmail: 'flipper@example.com',
    contactPhone: '555-222-3333',
    status: 'pending',
    emailDeliveryStatus: 'sent',
    emailDeliveryDetails: null,
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'enquiry-2',
    propertyId: 'property-2',
    propertyOwnerId: owner.id,
    propertyTitle: 'Queens duplex',
    flipperId: 'flipper-2',
    flipperName: 'Ava Patel',
    flipperEmail: 'ava@example.com',
    message: 'Can you share renovation history and current carrying costs?',
    contactName: 'Ava Patel',
    contactEmail: 'ava@example.com',
    contactPhone: null,
    status: 'contacted',
    emailDeliveryStatus: 'sent',
    emailDeliveryDetails: null,
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
]

beforeEach(() => {
  mockedUseAuth.mockReturnValue({
    user: owner,
    token: 'token',
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    refreshSession: jest.fn(),
    isAuthenticated: true,
  })
  mockedUseAsyncData.mockReturnValue({
    data: enquiries,
    loading: false,
    error: null,
    refetch: jest.fn(),
  })
})

test('shows owner enquiry counts and enquiry details', () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<OwnerDashboardPage />} path="/dashboard" />
      </Routes>
    </MemoryRouter>,
  )

  expect(screen.getByText('Track enquiries across your listings')).toBeInTheDocument()
  expect(screen.getByText('Total enquiries received')).toBeInTheDocument()
  expect(screen.getByText('Pending follow-ups')).toBeInTheDocument()
  expect(screen.getByText('Listings with enquiries')).toBeInTheDocument()
  expect(screen.getAllByText('2')).toHaveLength(2)
  expect(screen.getAllByText('1')).toHaveLength(1)
  expect(screen.getByText('Bed-Stuy brownstone')).toBeInTheDocument()
  expect(screen.getAllByText('Jordan Brooks')).toHaveLength(2)
  expect(screen.getByText('Can you share renovation history and current carrying costs?')).toBeInTheDocument()
})
