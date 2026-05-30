export type PageType =
  | 'home'
  | 'auth'
  | 'common'
  | 'search'
  | 'property'
  | 'profile'
  | 'legal'
  | 'errors'
  | 'dashboard'
  | 'owner-listings'
  | 'empty-state'
  | 'not-found'
  | 'property-create'
  | 'property-edit'

export interface Translation {
  pageType: PageType
  lang: string
  key: string
  value: string
}

export interface PageTranslations {
  pageType: PageType
  lang: string
  translations: Record<string, string>
}
