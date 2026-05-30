import { useParams } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { PageSection } from "@/components/common/PageSection";
import { InlineNotice } from "@/components/feedback/InlineNotice";
import { LoadingCard } from "@/components/feedback/LoadingCard";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { usePageTitle } from "@/hooks/usePageTitle";
import { userService } from "@/services/userService";
import type { FlipperProfile } from "@/types/models";
import { formatNumber } from "@/utils/formatters";
import { useState } from "react";

export function FlipperProfilePage() {
  const { id = "" } = useParams();
  const { user, updateUser } = useAuth();
  const { t } = useI18n();
  const { data, loading, error, refetch } = useAsyncData(
    () => userService.getFlipper(id),
    [id],
  );
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  usePageTitle(t("profile.flipperProfile"));

  if (loading) {
    return <LoadingCard className="h-[420px]" />;
  }

  if (error || !data) {
    return (
      <InlineNotice
        message={error ?? t("profile.unableToLoadFlipper")}
        tone="error"
      />
    );
  }

  const isOwnProfile = user?.id === data.id;

  return (
    <div className="space-y-8">
      <ProfileHero profile={data} />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr]">
        <PageSection title={t("profile.buyerProfile")} description={data.bio}>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              label={t("profile.portfolioProjects")}
              value={formatNumber(data.portfolioProjects)}
            />
            <StatCard
              label={t("profile.averageRating")}
              value={data.rating.toFixed(1)}
            />
            <StatCard
              label={t("profile.specializationCount")}
              value={String(data.specializations.length)}
            />
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white">
              {t("profile.specialties")}
            </h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {data.specializations.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </PageSection>
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white">
              {t("profile.contact")}
            </h3>
            <p className="mt-4 text-sm text-slate-300">
              {t("common.email")}: {data.email}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              {t("common.phone")}: {data.phone}
            </p>
          </div>
          {isOwnProfile ? (
            <ProfileEditor
              message={message}
              onSave={async (profile) => {
                setSaving(true);
                setMessage(null);
                try {
                  await updateUser(profile);
                  setMessage(t("profile.profileUpdated"));
                  refetch();
                } finally {
                  setSaving(false);
                }
              }}
              profile={data}
              saving={saving}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProfileHero({ profile }: { profile: FlipperProfile }) {
  const { t } = useI18n();

  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <img
          alt={profile.name}
          className="h-28 w-28 rounded-3xl object-cover"
          src={profile.profilePicture}
        />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            {t("profile.flipperProfile")}
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            {profile.name}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">{profile.bio}</p>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function ProfileEditor({
  profile,
  onSave,
  saving,
  message,
}: {
  profile: FlipperProfile;
  onSave: (profile: {
    bio: string;
    phone: string;
    specializations: string[];
    name: string;
  }) => Promise<void>;
  saving: boolean;
  message: string | null;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [specializations, setSpecializations] = useState(
    profile.specializations.join(", "),
  );

  return (
    <form
      className="glass-panel rounded-3xl p-6"
      onSubmit={(event) => {
        event.preventDefault();
        void onSave({
          name,
          phone,
          bio,
          specializations: specializations
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        });
      }}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">
          {t("profile.editProfileTitleFlipper")}
        </h3>
        {message ? <InlineNotice message={message} tone="success" /> : null}
        <FormField label={t("common.name")}>
          <input
            className="form-control"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </FormField>
        <FormField label={t("common.phone")}>
          <input
            className="form-control"
            onChange={(event) => setPhone(event.target.value)}
            value={phone}
          />
        </FormField>
        <FormField label={t("common.bio")}>
          <textarea
            className="form-control min-h-28"
            onChange={(event) => setBio(event.target.value)}
            value={bio}
          />
        </FormField>
        <FormField
          hint={t("profile.specializationHintFlipper")}
          label={t("profile.specialties")}
        >
          <input
            className="form-control"
            onChange={(event) => setSpecializations(event.target.value)}
            value={specializations}
          />
        </FormField>
        <Button disabled={saving} type="submit">
          {saving ? t("common.savingProfile") : t("common.saveProfile")}
        </Button>
      </div>
    </form>
  );
}
