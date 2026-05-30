import { useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { FormField } from "@/components/common/FormField";
import { propertyService } from "@/services/propertyService";
import type { SearchFilters } from "@/types/models";
import { useI18n } from "@/hooks/useI18n";

interface PropertyFiltersProps {
  initialValues?: SearchFilters;
  compact?: boolean;
  onSearch: (filters: SearchFilters) => void;
}

export function PropertyFilters({
  initialValues,
  compact = false,
  onSearch,
}: PropertyFiltersProps) {
  const { t } = useI18n();
  const [form, setForm] = useState<SearchFilters>({ ...initialValues });
  const propertyTypes = useMemo(() => propertyService.propertyTypes, []);
  const conditions = useMemo(() => propertyService.conditions, []);

  const update = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const gridClass = compact
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-8"
    : "grid grid-cols-1 md:grid-cols-2 gap-4";

  const propertyTypeLabel = (value: string) => {
    switch (value) {
      case "single-family":
        return t("search.propertyTypeSingleFamily");
      case "multi-family":
        return t("search.propertyTypeMultiFamily");
      case "commercial":
        return t("search.propertyTypeCommercial");
      case "land":
        return t("search.propertyTypeLand");
      default:
        return value;
    }
  };

  const conditionLabel = (value: string) => {
    switch (value) {
      case "poor":
        return t("search.conditionPoor");
      case "fair":
        return t("search.conditionFair");
      case "needs-work":
        return t("search.conditionNeedsWork");
      case "good":
        return t("search.conditionGoodBones");
      default:
        return value;
    }
  };

  return (
    <form
      className={`glass-panel rounded-3xl p-4 sm:p-5 lg:p-6 ${compact ? "" : ""}`.trim()}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(form);
      }}
    >
      <div className={gridClass}>
        {/* Row 1: City, State */}
        <FormField label={t("search.city")}>
          <input
            className="form-control"
            onChange={(event) => update("city", event.target.value)}
            value={form.city ?? ""}
          />
        </FormField>
        <FormField label={t("search.state")}>
          <input
            className="form-control"
            onChange={(event) => update("state", event.target.value)}
            value={form.state ?? ""}
          />
        </FormField>
        {/* Row 2: Property Type, Condition */}
        <FormField label={t("search.propertyType")}>
          <select
            className="form-control"
            onChange={(event) =>
              update(
                "propertyType",
                event.target.value as SearchFilters["propertyType"],
              )
            }
            value={form.propertyType ?? ""}
          >
            <option value="">{t("search.anyType")}</option>
            {propertyTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {propertyTypeLabel(option.value)}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t("search.condition")}>
          <select
            className="form-control"
            onChange={(event) =>
              update(
                "condition",
                event.target.value as SearchFilters["condition"],
              )
            }
            value={form.condition ?? ""}
          >
            <option value="">{t("search.anyCondition")}</option>
            {conditions.map((option) => (
              <option key={option.value} value={option.value}>
                {conditionLabel(option.value)}
              </option>
            ))}
          </select>
        </FormField>
        {/* Row 3: Min Price, Max Price */}
        <FormField label={t("search.minPrice")}>
          <input
            className="form-control"
            min={0}
            onChange={(event) =>
              update(
                "minPrice",
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            type="number"
            value={form.minPrice ?? ""}
          />
        </FormField>
        <FormField label={t("search.maxPrice")}>
          <input
            className="form-control"
            min={0}
            onChange={(event) =>
              update(
                "maxPrice",
                event.target.value ? Number(event.target.value) : undefined,
              )
            }
            type="number"
            value={form.maxPrice ?? ""}
          />
        </FormField>
        {/* Row 4: Keyword, Search button */}
        <FormField
          label={t("search.keyword")}
          className="sm:col-span-2 lg:col-span-2"
        >
          <input
            className="form-control"
            onChange={(event) => update("query", event.target.value)}
            placeholder={t("search.anyConditionPlaceholder")}
            value={form.query ?? ""}
          />
        </FormField>
        <div className="flex items-end">
          <Button className="w-full" type="submit">
            {t("common.search")}
          </Button>
        </div>
      </div>
    </form>
  );
}
