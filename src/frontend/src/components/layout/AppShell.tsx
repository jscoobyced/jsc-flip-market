import type { PropsWithChildren } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 sm:py-10">
        <div className="page-shell">{children ?? <Outlet />}</div>
      </main>
      <Footer />
    </div>
  )
}
