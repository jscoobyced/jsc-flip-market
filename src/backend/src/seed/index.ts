import { query } from '../db/index'
import { seedTranslations as seedTranslationsInternal } from './translations'

export const seedTranslations = async (): Promise<void> => {
  try {
    await seedTranslationsInternal()
    console.log('Translations seeded successfully')
  } catch (error) {
    console.error('Failed to seed translations:', error)
    throw error
  }
}

export const seedDatabase = async (): Promise<void> => {
  try {
    await seedTranslations()
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Failed to seed database:', error)
    throw error
  }
}

export const cleanDatabase = async (): Promise<void> => {
  try {
    await query('DELETE FROM page_translations')
    console.log('Database cleaned successfully')
  } catch (error) {
    console.error('Failed to clean database:', error)
    throw error
  }
}
