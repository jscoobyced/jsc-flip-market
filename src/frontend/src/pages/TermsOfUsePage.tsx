import { useI18n } from "@/hooks/useI18n";
import { usePageTitle } from "@/hooks/usePageTitle";

export function TermsOfUsePage() {
  const { t } = useI18n();
  usePageTitle(t("legal.termsTitle"));

  const sections = [
    {
      id: "marketplace-access",
      title: t("legal.marketplaceAccess"),
      body: t("legal.marketplaceAccessBody"),
    },
    {
      id: "listing-responsibilities",
      title: t("legal.listingResponsibilities"),
      body: t("legal.listingResponsibilitiesBody"),
    },
    {
      id: "enquiry-conduct",
      title: t("legal.enquiryConduct"),
      body: t("legal.enquiryConductBody"),
    },
    {
      id: "future-updates",
      title: t("legal.futureUpdates"),
      body: t("legal.futureUpdatesBody"),
    },
  ];

  return (
    <article className="glass-panel mx-auto max-w-4xl rounded-[2rem] p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
        {t("legal.eyebrow")}
      </p>
      <h1 className="mt-3 text-4xl font-semibold text-white">
        {t("legal.termsTitle")}
      </h1>
      <p className="mt-4 text-slate-300">{t("legal.termsSubtitle")}</p>
      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section
            key={section.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <h2 className="text-xl font-semibold text-white">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
