import { render, screen, waitFor } from "@testing-library/react";
import { AppProviders } from "@/app/AppProviders";
import { useI18n } from "@/hooks/useI18n";
import { i18nService } from "@/services/i18nService";

jest.mock("@/services/i18nService", () => ({
  i18nService: {
    getTranslationsBatch: jest.fn(),
  },
}));

const mockedGetTranslationsBatch = jest.mocked(
  i18nService.getTranslationsBatch,
);

function Probe() {
  const { ready, t } = useI18n();
  if (!ready) {
    return <span>loading</span>;
  }
  return <span>{t("home.heroTitle")}</span>;
}

test("loads translations from the backend batch response", async () => {
  window.localStorage.setItem("flipmarket.language", JSON.stringify("es"));
  mockedGetTranslationsBatch.mockResolvedValue([
    {
      pageType: "home",
      lang: "es",
      key: "heroTitle",
      value: "Encuentra propiedades listas para su próxima transformación.",
    },
  ]);

  render(
    <AppProviders>
      <Probe />
    </AppProviders>,
  );

  await waitFor(() =>
    expect(
      screen.getByText(
        "Encuentra propiedades listas para su próxima transformación.",
      ),
    ).toBeInTheDocument(),
  );
});
