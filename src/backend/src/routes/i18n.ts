import { Router, type Request, type Response } from "express";
import { i18nService, type PageType } from "../services/i18nService";

const router = Router();

const validPageTypes: PageType[] = [
  "home",
  "auth",
  "common",
  "search",
  "property",
  "profile",
  "legal",
  "errors",
  "dashboard",
  "owner-listings",
  "empty-state",
  "not-found",
  "property-create",
  "property-edit",
];

function isValidPageType(value: string): value is PageType {
  return validPageTypes.includes(value as PageType);
}

router.get("/page-translations/batch", async (req: Request, res: Response) => {
  try {
    const rawPageTypes = req.query.pageTypes as string;
    const lang = req.query.lang as string;

    if (!rawPageTypes || !lang) {
      return res.status(400).json({
        error: "Missing required query parameters: pageTypes and lang",
      });
    }

    const pageTypes = rawPageTypes
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const invalid = pageTypes.filter((p) => !isValidPageType(p));
    if (invalid.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid page types: ${invalid.join(", ")}` });
    }

    const translations = await i18nService.getTranslationsBatch(
      pageTypes as PageType[],
      lang,
    );

    res.json({ translations });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch translations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/page-translations", async (req: Request, res: Response) => {
  try {
    const pageType = req.query.pageType as PageType;
    const lang = req.query.lang as string;

    if (!pageType || !lang) {
      return res.status(400).json({
        error: "Missing required query parameters: pageType and lang",
      });
    }

    const translations = await i18nService.getTranslations(pageType, lang);

    if (!translations || translations.length === 0) {
      return res.status(404).json({
        error: "No translations found for the specified page type and language",
      });
    }

    res.json({ translations });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch translations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
