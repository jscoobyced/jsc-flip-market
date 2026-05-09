import { screen, waitFor } from '@testing-library/react'
import { useAsyncData } from '@/hooks/useAsyncData'
import { renderWithProviders } from '@/test/test-utils'

function AsyncProbe({ loader }: { loader: () => Promise<string> }) {
  const { data, loading } = useAsyncData(loader, [])

  return <div>{loading ? 'loading' : data}</div>
}

test('does not refetch after a successful state update rerender', async () => {
  const loader = jest.fn().mockResolvedValue('loaded')

  renderWithProviders(<AsyncProbe loader={() => loader()} />)

  await screen.findByText('loaded')

  await waitFor(() => {
    expect(loader).toHaveBeenCalledTimes(1)
  })
})
