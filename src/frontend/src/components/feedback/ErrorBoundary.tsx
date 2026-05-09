import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react'
import { Component } from 'react'
import { LinkButton } from '@/components/common/Button'

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="page-shell flex min-h-screen items-center justify-center py-16">
          <div className="glass-panel max-w-xl rounded-3xl p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">FlipMarket</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">A page error interrupted the experience.</h1>
            <p className="mt-4 text-slate-300">Refresh the browser or head back to the home page.</p>
            <div className="mt-8 flex justify-center">
              <LinkButton to="/">Return home</LinkButton>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
