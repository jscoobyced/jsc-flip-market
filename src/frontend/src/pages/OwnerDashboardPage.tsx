import { Link } from "react-router-dom";
import { LinkButton } from "@/components/common/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import { InlineNotice } from "@/components/feedback/InlineNotice";
import { LoadingCard } from "@/components/feedback/LoadingCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { usePageTitle } from "@/hooks/usePageTitle";
import { enquiryService } from "@/services/enquiryService";
import type { Enquiry, EnquiryStatus } from "@/types/models";
import { formatDate } from "@/utils/formatters";

const statusTone: Record<EnquiryStatus, string> = {
  pending: "bg-amber-400/20 text-amber-200",
  contacted: "bg-cyan-400/20 text-cyan-200",
  accepted: "bg-emerald-400/20 text-emerald-200",
  rejected: "bg-rose-400/20 text-rose-200",
};

export function OwnerDashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  usePageTitle(t("dashboard.pageTitle"));

  const ownerId = user?.role === "OWNER" ? user.id : "";
  const { data, loading, error } = useAsyncData(
    () => enquiryService.getOwnerEnquiries(ownerId),
    [ownerId],
  );

  if (!user || user.role !== "OWNER") {
    return <InlineNotice message={t("dashboard.ownerOnly")} tone="error" />;
  }

  if (loading) {
    return <LoadingCard className="h-[420px]" />;
  }

  if (error || !data) {
    return (
      <InlineNotice
        message={error ?? t("dashboard.unableToLoad")}
        tone="error"
      />
    );
  }

  const totalEnquiries = data.length;
  const pendingEnquiries = data.filter(
    (entry) => entry.status === "pending",
  ).length;
  const listingsWithEnquiries = new Set(data.map((entry) => entry.propertyId))
    .size;

  return (
    <div className="space-y-8">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {t("dashboard.pageTitle")}
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-white">
              {t("dashboard.trackEnquiries")}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              {t("dashboard.dashboardDescription")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton to={`/owners/${user.id}/listings`} variant="secondary">
              {t("dashboard.viewListings")}
            </LinkButton>
            <LinkButton to="/properties/new">
              {t("dashboard.listProperty")}
            </LinkButton>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          label={t("dashboard.totalEnquiries")}
          value={String(totalEnquiries)}
        />
        <SummaryCard
          label={t("dashboard.pendingFollowUps")}
          value={String(pendingEnquiries)}
        />
        <SummaryCard
          label={t("dashboard.listingsWithEnquiries")}
          value={String(listingsWithEnquiries)}
        />
      </div>

      {data.length ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {t("dashboard.recentEnquiries")}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {t("dashboard.reviewEnquiries")}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {data.map((enquiry) => (
              <EnquiryCard enquiry={enquiry} key={enquiry.id} />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          description={t("common.noEnquiriesDescription")}
          title={t("common.noEnquiriesYet")}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const { t } = useI18n();

  const statusLabel = {
    pending: t("dashboard.statusPending"),
    contacted: t("dashboard.statusContacted"),
    accepted: t("dashboard.statusAccepted"),
    rejected: t("dashboard.statusRejected"),
  }[enquiry.status];

  return (
    <article className="glass-panel rounded-3xl p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="text-xl font-semibold text-white transition hover:text-cyan-300"
              to={`/properties/${enquiry.propertyId}`}
            >
              {enquiry.propertyTitle}
            </Link>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusTone[enquiry.status]}`}
            >
              {statusLabel}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {t("dashboard.receivedLabel")} {formatDate(enquiry.createdAt)}{" "}
            {t("dashboard.fromLabel")}{" "}
            <Link
              className="text-cyan-300 transition hover:text-cyan-200"
              to={`/flippers/${enquiry.flipperId}`}
            >
              {enquiry.flipperName}
            </Link>
          </p>
        </div>
        <div className="text-sm text-slate-300">
          <p>{enquiry.contactName}</p>
          <p>{enquiry.contactEmail}</p>
          {enquiry.contactPhone ? <p>{enquiry.contactPhone}</p> : null}
        </div>
      </div>
      <p className="mt-5 text-slate-200">{enquiry.message}</p>
    </article>
  );
}
