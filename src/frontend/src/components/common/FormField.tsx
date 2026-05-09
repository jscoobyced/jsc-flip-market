import type { PropsWithChildren } from 'react'

interface FormFieldProps extends PropsWithChildren {
  label: string
  hint?: string
  error?: string
}

export function FormField({ label, hint, error, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-200">
      <span className="font-medium">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  )
}
