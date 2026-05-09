export interface Dictionary {
  [key: string]: string | Dictionary
}

export type SupportedLanguage = 'en' | 'es'

const loaders: Record<SupportedLanguage, () => Promise<{ default: Dictionary }>> = {
  en: () => import('@/i18n/dictionaries/en'),
  es: () => import('@/i18n/dictionaries/es'),
}

export async function loadDictionary(language: string) {
  const normalized = (language in loaders ? language : 'en') as SupportedLanguage
  const dictionary = await loaders[normalized]()
  return dictionary.default
}

export const supportedLanguages: SupportedLanguage[] = ['en', 'es']
