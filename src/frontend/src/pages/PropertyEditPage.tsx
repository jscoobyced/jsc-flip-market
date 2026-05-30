import { useNavigate, useParams } from "react-router-dom";
import { InlineNotice } from "@/components/feedback/InlineNotice";
import { LoadingCard } from "@/components/feedback/LoadingCard";
import { PropertyForm } from "@/components/property/PropertyForm";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { usePageTitle } from "@/hooks/usePageTitle";
import { propertyService } from "@/services/propertyService";

export function PropertyEditPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  usePageTitle(t("property-edit.title"));
  const { data, loading, error } = useAsyncData(
    () => propertyService.getProperty(id),
    [id],
  );

  if (loading) {
    return <LoadingCard className="h-[420px]" />;
  }

  if (!data || error) {
    return (
      <InlineNotice
        message={error ?? t("property.unableToLoad")}
        tone="error"
      />
    );
  }

  if (!user || user.role !== "OWNER" || data.ownerId !== user.id) {
    return <InlineNotice message={t("common.ownerOnly")} tone="error" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
          {t("property.editListing")}
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-white">
          {t("property-edit.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          {t("property-edit.description")}
        </p>
      </div>
      <PropertyForm
        initialValues={{
          title: data.title,
          description: data.description,
          propertyType: data.propertyType,
          address: data.location.address,
          city: data.location.city,
          state: data.location.state,
          zip: data.location.zip,
          squareFootage: data.squareFootage ?? 0,
          yearBuilt: data.yearBuilt ?? new Date().getFullYear(),
          condition: data.condition,
          askingPrice: data.askingPrice,
          status: data.status,
          images: data.images,
        }}
        onSubmit={async (values) => {
          const property = await propertyService.updateProperty(
            data.id,
            values,
          );
          void navigate(`/properties/${property.id}`, {
            state: { message: t("property.updated") },
          });
        }}
        submitLabel={t("property-edit.updateListing")}
      />
    </div>
  );
}
