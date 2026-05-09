import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-10">
      <div className="page-shell flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-100">FlipMarket</p>
          <p className="mt-2 max-w-xl">The marketplace for owners ready to sell and flippers ready to transform.</p>
        </div>
        <div className="flex gap-4">
          <Link className="transition hover:text-white" to="/terms">
            Terms of Use
          </Link>
          <Link className="transition hover:text-white" to="/privacy">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
