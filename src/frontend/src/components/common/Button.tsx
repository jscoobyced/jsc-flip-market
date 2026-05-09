import { Link } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

const baseClass =
  'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 disabled:cursor-not-allowed disabled:opacity-60'

interface ButtonProps extends PropsWithChildren {
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  onClick?: () => void
}

interface LinkButtonProps extends PropsWithChildren {
  to: string
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

function tone(variant: 'primary' | 'secondary' | 'ghost') {
  if (variant === 'secondary') {
    return 'bg-white/10 text-slate-100 hover:bg-white/15'
  }
  if (variant === 'ghost') {
    return 'bg-transparent text-cyan-300 hover:bg-cyan-400/10'
  }
  return 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
}

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled,
  className = '',
  onClick,
}: ButtonProps) {
  return (
    <button className={`${baseClass} ${tone(variant)} ${className}`.trim()} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export function LinkButton({ children, to, variant = 'primary', className = '' }: LinkButtonProps) {
  return (
    <Link className={`${baseClass} ${tone(variant)} ${className}`.trim()} to={to}>
      {children}
    </Link>
  )
}
