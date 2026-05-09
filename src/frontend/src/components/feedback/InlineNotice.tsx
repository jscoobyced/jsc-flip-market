interface InlineNoticeProps {
  tone?: 'info' | 'success' | 'error'
  message: string
}

export function InlineNotice({ tone = 'info', message }: InlineNoticeProps) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-400/35 bg-emerald-400/10 text-emerald-100'
      : tone === 'error'
        ? 'border-rose-400/35 bg-rose-400/10 text-rose-100'
        : 'border-cyan-400/35 bg-cyan-400/10 text-cyan-100'

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>{message}</div>
}
