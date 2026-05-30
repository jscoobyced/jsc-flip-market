import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { i18nService } from "@/services/i18nService";
import type { Translation } from "@/services/i18nService";
import type { PageType } from "@/types/i18n";
import { storage } from "@/utils/storage";

export type SupportedLanguage = "en" | "es";
export const supportedLanguages: SupportedLanguage[] = ["en", "es"];

export interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  ensurePageTranslations: (pageTypes: PageType[]) => Promise<void>;
  t: (key: string) => string;
  ready: boolean;
  languages: SupportedLanguage[];
}

const DEFAULT_LANGUAGE: SupportedLanguage = "en";

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function getValue(
  translations: Translation[],
  key: string,
): string | undefined {
  const translation = translations.find((t) => t.key === key);
  return translation ? translation.value : undefined;
}

export function I18nProvider({ children }: PropsWithChildren) {
  const stored = storage.getLanguage();
  const initialLanguage: SupportedLanguage = supportedLanguages.includes(
    stored as SupportedLanguage,
  )
    ? (stored as SupportedLanguage)
    : DEFAULT_LANGUAGE;

  const [language, setLanguageState] =
    useState<SupportedLanguage>(initialLanguage);
  const initialLoadLanguage = useMemo(() => initialLanguage, []);
  const [translations, setTranslations] = useState<
    Record<string, Translation[]>
  >({});
  const [ready, setReady] = useState(false);

  const ensurePageTranslations = useCallback(
    async (pageTypes: PageType[]) => {
      const uniquePageTypes = Array.from(new Set(pageTypes));

      const missingPageTypes = uniquePageTypes.filter((pageType) => {
        return !Object.prototype.hasOwnProperty.call(translations, pageType);
      });

      if (missingPageTypes.length === 0) {
        if (!ready) {
          setReady(true);
        }
        return;
      }

      try {
        const batchResults = await i18nService.getTranslationsBatch(
          missingPageTypes,
          language,
        );

        // Group results by pageType
        const grouped: Record<string, Translation[]> = {};
        for (const translation of batchResults) {
          const pt = translation.pageType;
          if (!grouped[pt]) {
            grouped[pt] = [];
          }
          grouped[pt].push(translation);
        }
        // Ensure all requested page types are represented (even if empty)
        for (const pageType of missingPageTypes) {
          if (!grouped[pageType]) {
            grouped[pageType] = [];
          }
        }

        setTranslations((previous) => ({ ...previous, ...grouped }));
      } catch {
        // On error mark missing types as empty so we don't retry indefinitely
        setTranslations((previous) => {
          const next = { ...previous };
          for (const pageType of missingPageTypes) {
            if (!next[pageType]) {
              next[pageType] = [];
            }
          }
          return next;
        });
      }

      if (!ready) {
        setReady(true);
      }
    },
    [language, ready, translations],
  );

  const t = useCallback(
    (key: string): string => {
      // Try exact key match first
      for (const pageType of Object.keys(translations)) {
        const translation = getValue(translations[pageType], key);
        if (translation) {
          return translation;
        }
      }
      // Try prefix matching (e.g., key="home.greeting" -> look for key="greeting" in home pageType)
      const firstDotIndex = key.indexOf(".");
      if (firstDotIndex > 0) {
        const pageType = key.substring(0, firstDotIndex) as PageType;
        const localKey = key.substring(firstDotIndex + 1);
        if (translations[pageType]) {
          const translation = getValue(translations[pageType], localKey);
          if (translation) {
            return translation;
          }
        }
      }
      return "";
    },
    [translations],
  );

  const setLanguage = useCallback(async (nextLanguage: SupportedLanguage) => {
    setReady(false);
    setTranslations({});
    setLanguageState(nextLanguage);
    storage.setLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    let mounted = true;
    const initPageTypes: PageType[] = ["home", "common", "errors"];
    i18nService
      .getTranslationsBatch(initPageTypes, initialLoadLanguage)
      .then((batchResults) => {
        if (!mounted) {
          return;
        }
        const grouped: Record<string, Translation[]> = {};
        for (const translation of batchResults) {
          const pt = translation.pageType;
          if (!grouped[pt]) {
            grouped[pt] = [];
          }
          grouped[pt].push(translation);
        }
        for (const pageType of initPageTypes) {
          if (!grouped[pageType]) {
            grouped[pageType] = [];
          }
        }
        setTranslations(grouped);
        setReady(true);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        const grouped: Record<string, Translation[]> = {};
        for (const pageType of initPageTypes) {
          grouped[pageType] = [];
        }
        setTranslations(grouped);
        setReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [initialLoadLanguage]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      ensurePageTranslations,
      t,
      ready,
      languages: supportedLanguages,
    }),
    [ensurePageTranslations, language, ready, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider");
  }
  return context;
}
