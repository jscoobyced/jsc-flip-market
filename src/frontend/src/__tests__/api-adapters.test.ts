import { normalizePaginatedProperties } from '@/services/apiAdapters'

test('normalizes backend pagination envelopes that use pagination.limit', () => {
  const result = normalizePaginatedProperties({
    items: [
      {
        id: 'property-1',
        ownerId: 'owner-1',
        title: 'Fixer upper',
        description: 'Great bones in a strong market.',
        address: '1 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        latitude: null,
        longitude: null,
        propertyType: 'single-family',
        squareFootage: 1800,
        yearBuilt: 1985,
        condition: 'needs-work',
        askingPrice: 350000,
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        images: [],
      },
    ],
    pagination: {
      page: 1,
      limit: 6,
      total: 1,
    },
  })

  expect(result.page).toBe(1)
  expect(result.pageSize).toBe(6)
  expect(result.total).toBe(1)
  expect(result.items).toHaveLength(1)
})
