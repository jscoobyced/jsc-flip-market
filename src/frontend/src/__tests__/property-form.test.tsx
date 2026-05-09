import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PropertyForm } from '@/components/property/PropertyForm'
import { useI18n } from '@/hooks/useI18n'

jest.mock('@/hooks/useI18n')

const mockedUseI18n = jest.mocked(useI18n)

beforeEach(() => {
  mockedUseI18n.mockReturnValue({
    language: 'en',
    setLanguage: jest.fn(),
    t: (key: string) => {
      if (key === 'common.next') {
        return 'Next'
      }
      if (key === 'common.back') {
        return 'Back'
      }
      if (key === 'common.saving') {
        return 'Saving...'
      }
      return key
    },
    ready: true,
    languages: ['en'],
  })
})

test('advances to media step without submitting when next is clicked', async () => {
  const user = userEvent.setup()
  const onSubmit = jest.fn().mockResolvedValue(undefined)

  render(<PropertyForm onSubmit={onSubmit} submitLabel="Save listing" />)

  await user.type(screen.getByLabelText('Listing title'), 'Brooklyn brownstone')
  await user.type(screen.getByLabelText('Description'), 'A full gut rehab opportunity with solid bones and strong resale upside.')
  await user.type(screen.getByLabelText('Address'), '123 Atlantic Avenue')
  await user.type(screen.getByLabelText('City'), 'Brooklyn')
  await user.type(screen.getByLabelText('State'), 'NY')
  await user.type(screen.getByLabelText('ZIP'), '11201')
  await user.click(screen.getByRole('button', { name: 'Next' }))

  expect(onSubmit).not.toHaveBeenCalled()
  expect(screen.getByText('Review')).toBeInTheDocument()
})

test('does not render a save submit action until the media step', async () => {
  const onSubmit = jest.fn().mockResolvedValue(undefined)

  render(<PropertyForm onSubmit={onSubmit} submitLabel="Save listing" />)

  expect(screen.queryByRole('button', { name: 'Save listing' })).not.toBeInTheDocument()
  expect(onSubmit).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Next' })).toHaveAttribute('type', 'button')
})
