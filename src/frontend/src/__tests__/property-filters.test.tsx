import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { useI18n } from "@/hooks/useI18n";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { renderWithProviders } from "@/test/test-utils";

jest.mock("@/hooks/useI18n");

const mockedUseI18n = jest.mocked(useI18n);

beforeEach(() => {
  mockedUseI18n.mockReturnValue({
    language: "en",
    setLanguage: jest.fn(),
    ensurePageTranslations: jest.fn().mockResolvedValue(undefined),
    t: (key: string) => {
      const labels: Record<string, string> = {
        "search.city": "City",
        "search.state": "State",
        "search.keyword": "Keyword",
        "search.propertyType": "Property type",
        "search.anyPropertyType": "Any type",
        "search.condition": "Condition",
        "search.anyCondition": "Any condition",
        "search.minPrice": "Min price",
        "search.maxPrice": "Max price",
        "search.anyConditionPlaceholder": "City, asset, or opportunity",
        "common.search": "Search",
      };
      return labels[key] ?? key;
    },
    ready: true,
    languages: ["en"],
  });
});

test("submits selected property filters", async () => {
  const user = userEvent.setup();
  const onSearch = jest.fn();

  renderWithProviders(<PropertyFilters onSearch={onSearch} />);

  await user.type(screen.getByLabelText("Keyword"), "Brooklyn");
  await user.selectOptions(
    screen.getByLabelText("Property type"),
    "single-family",
  );
  await user.click(screen.getByRole("button", { name: "Search" }));

  expect(onSearch).toHaveBeenCalledWith(
    expect.objectContaining({
      query: "Brooklyn",
      propertyType: "single-family",
    }),
  );
});
