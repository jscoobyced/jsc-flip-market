import { useNavigate } from "react-router-dom";
import { InlineNotice } from "@/components/feedback/InlineNotice";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { usePageTitle } from "@/hooks/usePageTitle";
import { propertyService } from "@/services/propertyService";

export function PropertyCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  usePageTitle(t("property-create.title"));

  if (!user || user.role !== "OWNER") {
    return <InlineNotice message={t("common.ownerOnly")} tone="error" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
          {t("property-create.newListingEyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-white">
          {t("property-create.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          {t("property-create.description")}
        </p>
      </div>
      <PropertyForm
        onSubmit={async (values) => {
          const property = await propertyService.createProperty(values);
          void navigate(`/properties/${property.id}`, {
            state: { message: t("property.created") },
          });
        }}
        submitLabel={t("property-create.createListing")}
      />
    </div>
  );
}
