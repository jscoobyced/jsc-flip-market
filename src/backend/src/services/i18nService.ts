import { query } from "../db/index";
import { englishFallbackTranslations } from "../i18n/fallbackTranslations";

export type PageType =
  | "home"
  | "auth"
  | "common"
  | "search"
  | "property"
  | "profile"
  | "legal"
  | "errors"
  | "dashboard"
  | "owner-listings"
  | "empty-state"
  | "not-found"
  | "property-create"
  | "property-edit";

export interface Translation {
  pageType: PageType;
  lang: string;
  key: string;
  value: string;
}

function mapRows(
  rows: Array<{
    page_type: string;
    lang: string;
    key: string;
    value: string;
  }>,
): Translation[] {
  return rows.map((row) => ({
    pageType: row.page_type as PageType,
    lang: row.lang,
    key: row.key,
    value: row.value,
  }));
}

function getFallbackPageTranslations(pageType: PageType): Translation[] {
  const translations = englishFallbackTranslations[pageType] ?? {};

  return Object.entries(translations).map(([key, value]) => ({
    pageType,
    lang: "en",
    key,
    value,
  }));
}

export const i18nService = {
  async getTranslations(
    pageType: PageType,
    lang: string,
  ): Promise<Translation[]> {
    try {
      const result = await query<{
        page_type: string;
        lang: string;
        key: string;
        value: string;
      }>(
        `
          SELECT page_type, lang, key, value
          FROM page_translations
          WHERE page_type = $1 AND lang = $2
          ORDER BY key
        `,
        [pageType, lang],
      );
      const rows = result.rows ?? [];
      return rows.length > 0
        ? mapRows(rows)
        : getFallbackPageTranslations(pageType);
    } catch {
      return getFallbackPageTranslations(pageType);
    }
  },

  async getTranslation(
    pageType: PageType,
    key: string,
    lang: string,
  ): Promise<string | null> {
    try {
      const result = await query<{ value: string }>(
        `
          SELECT value
          FROM page_translations
          WHERE page_type = $1 AND key = $2 AND lang = $3
        `,
        [pageType, key, lang],
      );
      const rows = result.rows ?? [];
      if (rows.length > 0) {
        return rows[0].value;
      }
    } catch {
      // Fall through to the file-backed English fallback.
    }

    return englishFallbackTranslations[pageType]?.[key] ?? null;
  },

  async getTranslationsBatch(
    pageTypes: PageType[],
    lang: string,
  ): Promise<Translation[]> {
    if (pageTypes.length === 0) {
      return [];
    }
    try {
      const result = await query<{
        page_type: string;
        lang: string;
        key: string;
        value: string;
      }>(
        `
          SELECT page_type, lang, key, value
          FROM page_translations
          WHERE page_type = ANY($1) AND lang = $2
          ORDER BY page_type, key
        `,
        [pageTypes, lang],
      );
      const rows = result.rows ?? [];
      if (rows.length === 0) {
        return pageTypes.flatMap((pageType) =>
          getFallbackPageTranslations(pageType),
        );
      }

      const translationsByPageType = new Map<PageType, Translation[]>();
      for (const translation of mapRows(rows)) {
        const current = translationsByPageType.get(translation.pageType) ?? [];
        current.push(translation);
        translationsByPageType.set(translation.pageType, current);
      }

      return pageTypes.flatMap((pageType) => {
        const translations = translationsByPageType.get(pageType);
        return translations && translations.length > 0
          ? translations
          : getFallbackPageTranslations(pageType);
      });
    } catch {
      return pageTypes.flatMap((pageType) =>
        getFallbackPageTranslations(pageType),
      );
    }
  },

  async getAllTranslations(lang: string): Promise<Translation[]> {
    try {
      const result = await query<{
        page_type: string;
        lang: string;
        key: string;
        value: string;
      }>(
        `
          SELECT page_type, lang, key, value
          FROM page_translations
          WHERE lang = $1
          ORDER BY page_type, key
        `,
        [lang],
      );
      const rows = result.rows ?? [];
      if (rows.length > 0) {
        return mapRows(rows);
      }
    } catch {
      // Fall through to the file-backed English fallback.
    }

    return Object.keys(englishFallbackTranslations).flatMap((pageType) =>
      getFallbackPageTranslations(pageType as PageType),
    );
  },
};
