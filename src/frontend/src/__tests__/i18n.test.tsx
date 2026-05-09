import { render, screen, waitFor } from '@testing-library/react'
import { AppProviders } from '@/app/AppProviders'
import { useI18n } from '@/hooks/useI18n'

function Probe() {
  const { ready, t } = useI18n()
  if (!ready) {
    return <span>loading</span>
  }
  return <span>{t('home.stats.closedDeals', 'Deals closed')}</span>
}

test('falls back to english text when a translation key is missing', async () => {
  window.localStorage.setItem('flipmarket.language', JSON.stringify('es'))

  render(
    <AppProviders>
      <Probe />
    </AppProviders>,
  )

  await waitFor(() => expect(screen.getByText('Deals closed')).toBeInTheDocument())
})
