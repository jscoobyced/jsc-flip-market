import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { loadDictionary, supportedLanguages, type Dictionary, type SupportedLanguage } from '@/i18n/loader'
import { storage } from '@/utils/storage'

interface I18nContextValue {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => Promise<void>
  t: (key: string, fallback?: string) => string
  ready: boolean
  languages: SupportedLanguage[]
}

const DEFAULT_LANGUAGE: SupportedLanguage = 'en'
const I18nContext = createContext<I18nContextValue | undefined>(undefined)

function getValue(dictionary: Dictionary, key: string) {
  return key.split('.').reduce<Dictionary[string] | undefined>((current, part) => {
    if (!current || typeof current === 'string') {
      return undefined
    }
    return current[part]
  }, dictionary)
}

export function I18nProvider({ children }: PropsWithChildren) {
  const stored = storage.getLanguage()
  const initialLanguage = supportedLanguages.includes(stored as SupportedLanguage)
    ? (stored as SupportedLanguage)
    : DEFAULT_LANGUAGE

  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage)
  const [activeDictionary, setActiveDictionary] = useState<Dictionary>({})
  const [fallbackDictionary, setFallbackDictionary] = useState<Dictionary>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    Promise.all([loadDictionary(DEFAULT_LANGUAGE), loadDictionary(initialLanguage)])
      .then(([fallback, current]) => {
        if (!mounted) {
          return
        }
        setFallbackDictionary(fallback)
        setActiveDictionary(current)
        setReady(true)
      })
      .catch(() => {
        if (mounted) {
          setReady(true)
        }
      })

    return () => {
      mounted = false
    }
  }, [initialLanguage])

  const setLanguage = useCallback(async (nextLanguage: SupportedLanguage) => {
    const dictionary = await loadDictionary(nextLanguage)
    setLanguageState(nextLanguage)
    setActiveDictionary(dictionary)
    storage.setLanguage(nextLanguage)
  }, [])

  const t = useCallback(
    (key: string, fallback?: string) => {
      const primary = getValue(activeDictionary, key)
      if (typeof primary === 'string') {
        return primary
      }

      const secondary = getValue(fallbackDictionary, key)
      if (typeof secondary === 'string') {
        return secondary
      }

      return fallback ?? key
    },
    [activeDictionary, fallbackDictionary],
  )

  const value = useMemo(
    () => ({ language, setLanguage, t, ready, languages: supportedLanguages }),
    [language, ready, setLanguage, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18nContext() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18nContext must be used within I18nProvider')
  }
  return context
}
