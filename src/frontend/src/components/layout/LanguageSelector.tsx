import { useI18n } from '@/hooks/useI18n'

export function LanguageSelector() {
  const { language, languages, setLanguage } = useI18n()

  return (
    <select
      aria-label="Select language"
      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
      onChange={(event) => {
        void setLanguage(event.target.value as 'en' | 'es')
      }}
      value={language}
    >
      {languages.map((option) => (
        <option key={option} className="bg-slate-900" value={option}>
          {option.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
