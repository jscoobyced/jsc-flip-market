import { LinkButton } from "@/components/common/Button";
import { useI18n } from "@/hooks/useI18n";
import { usePageTitle } from "@/hooks/usePageTitle";

export function NotFoundPage() {
  const { t } = useI18n();
  usePageTitle(t("not-found.pageTitle"));

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="glass-panel rounded-[2rem] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          {t("not-found.notFoundTitle")}
        </h1>
        <p className="mt-4 text-slate-300">{t("not-found.notFoundSubtitle")}</p>
        <div className="mt-8 flex justify-center">
          <LinkButton to="/">{t("not-found.notFoundReturnHome")}</LinkButton>
        </div>
      </div>
    </div>
  );
}
