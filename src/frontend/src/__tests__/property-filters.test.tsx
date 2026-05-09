import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { renderWithProviders } from '@/test/test-utils'

test('submits selected property filters', async () => {
  const user = userEvent.setup()
  const onSearch = jest.fn()

  renderWithProviders(<PropertyFilters onSearch={onSearch} />)

  await user.type(screen.getByLabelText('Keyword'), 'Brooklyn')
  await user.selectOptions(screen.getByLabelText('Property type'), 'single-family')
  await user.click(screen.getByRole('button', { name: 'Search' }))

  expect(onSearch).toHaveBeenCalledWith(expect.objectContaining({ query: 'Brooklyn', propertyType: 'single-family' }))
})
