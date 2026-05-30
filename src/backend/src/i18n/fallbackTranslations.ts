import type { PageType } from "../services/i18nService";
import { translationGroups } from "../seed/translations";

export const englishFallbackTranslations = Object.fromEntries(
  Object.entries(translationGroups).map(([pageType, keys]) => [
    pageType,
    Object.fromEntries(
      Object.entries(keys).map(([key, values]) => [key, values.en]),
    ),
  ]),
) as Record<PageType, Record<string, string>>;
