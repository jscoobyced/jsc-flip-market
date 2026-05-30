import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LinkButton } from "@/components/common/Button";
import { PageSection } from "@/components/common/PageSection";
import { EmptyState } from "@/components/feedback/EmptyState";
import { InlineNotice } from "@/components/feedback/InlineNotice";
import { LoadingCard } from "@/components/feedback/LoadingCard";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { usePageTitle } from "@/hooks/usePageTitle";
import { propertyService } from "@/services/propertyService";
import { userService } from "@/services/userService";

export function OwnerListingsPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const ownerQuery = useAsyncData(() => userService.getOwner(id), [id]);
  const listingsQuery = useAsyncData(
    () => propertyService.getOwnerListings(id, page, 6),
    [id, page],
  );
  usePageTitle(t("owner-listings.pageTitle"));

  const isOwn = user?.id === id && user.role === "OWNER";
  const totalPages = useMemo(() => {
    if (!listingsQuery.data) {
      return 1;
    }
    return Math.max(
      1,
      Math.ceil(listingsQuery.data.total / listingsQuery.data.pageSize),
    );
  }, [listingsQuery.data]);

  if (ownerQuery.loading || listingsQuery.loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  if (!ownerQuery.data || ownerQuery.error || listingsQuery.error) {
    return (
      <InlineNotice
        message={
          ownerQuery.error ??
          listingsQuery.error ??
          t("owner-listings.unableToLoad")
        }
        tone="error"
      />
    );
  }

  const listings = listingsQuery.data;

  if (!listings) {
    return (
      <InlineNotice message={t("owner-listings.unableToLoad")} tone="error" />
    );
  }

  return (
    <div className="space-y-8">
      <PageSection
        aside={
          isOwn ? (
            <LinkButton to="/properties/new">
              {t("owner-listings.createNewListing")}
            </LinkButton>
          ) : undefined
        }
        description={t("owner-listings.description")}
        eyebrow={t("owner-listings.inventoryEyebrow")}
        title={ownerQuery.data.name}
      >
        {listings.items.length ? (
          <div className="space-y-5">
            {listings.items.map((property) => (
              <PropertyCard
                key={property.id}
                editable={isOwn}
                layout="list"
                property={property}
                showOwnerLink={false}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description={t("owner-listings.noListingsDescription")}
            title={t("owner-listings.noListings")}
          />
        )}
        <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 px-5 py-4 text-sm text-slate-300">
          <span>
            {t("search.page")} {page} {t("search.of")} {totalPages}
          </span>
          <div className="flex gap-3">
            <button
              className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
              type="button"
            >
              {t("common.previous")}
            </button>
            <button
              className="rounded-full border border-white/10 px-4 py-2 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              {t("common.next")}
            </button>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
