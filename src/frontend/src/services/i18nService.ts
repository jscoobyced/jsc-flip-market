import { apiClient } from "./apiClient";
import type { PageType, Translation } from "@/types/i18n";

export type { Translation };

interface I18nPageTranslationsResponse {
  translations: Translation[];
}

export const i18nService = {
  async getTranslations(
    pageType: PageType,
    lang: string,
  ): Promise<Translation[]> {
    const response = await apiClient.get<I18nPageTranslationsResponse>(
      `/i18n/page-translations?pageType=${pageType}&lang=${lang}`,
    );
    return response.translations;
  },

  async getTranslationsBatch(
    pageTypes: PageType[],
    lang: string,
  ): Promise<Translation[]> {
    const pageTypesParam = pageTypes.join(",");
    const response = await apiClient.get<I18nPageTranslationsResponse>(
      `/i18n/page-translations/batch?pageTypes=${pageTypesParam}&lang=${lang}`,
    );
    return response.translations;
  },
};
