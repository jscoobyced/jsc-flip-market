export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-panel animate-pulse rounded-3xl p-6 ${className}`.trim()}>
      <div className="h-52 rounded-2xl bg-white/10" />
      <div className="mt-5 h-4 w-1/3 rounded-full bg-white/10" />
      <div className="mt-3 h-8 w-2/3 rounded-full bg-white/10" />
      <div className="mt-3 h-4 w-full rounded-full bg-white/10" />
      <div className="mt-2 h-4 w-4/5 rounded-full bg-white/10" />
    </div>
  )
}
