import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/hooks/useI18n";
import { PropertyEditPage } from "@/pages/PropertyEditPage";
import { propertyService } from "@/services/propertyService";
import type { OwnerProfile, Property } from "@/types/models";

jest.mock("@/hooks/useAsyncData");
jest.mock("@/hooks/useAuth");
jest.mock("@/hooks/useI18n");

const mockedUseAsyncData = jest.mocked(useAsyncData);
const mockedUseAuth = jest.mocked(useAuth);
const mockedUseI18n = jest.mocked(useI18n);

const owner: OwnerProfile = {
  id: "owner-1",
  email: "owner@example.com",
  name: "Owner One",
  phone: "555-111-2222",
  role: "OWNER",
  bio: "Experienced seller",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const property: Property = {
  id: "property-1",
  ownerId: owner.id,
  title: "Bed-Stuy brownstone",
  description: "Full renovation opportunity with strong comps nearby.",
  location: {
    address: "100 Halsey Street",
    city: "Brooklyn",
    state: "NY",
    zip: "11216",
  },
  propertyType: "single-family",
  squareFootage: 2400,
  yearBuilt: 1920,
  condition: "needs-work",
  askingPrice: 850000,
  images: [],
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderEditPage() {
  return render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      initialEntries={[`/properties/${property.id}/edit`]}
    >
      <Routes>
        <Route path="/properties/:id/edit" element={<PropertyEditPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockedUseAuth.mockReturnValue({
    user: owner,
    token: "token",
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateUser: jest.fn(),
    refreshSession: jest.fn(),
    isAuthenticated: true,
  });
  mockedUseAsyncData.mockReturnValue({
    data: property,
    loading: false,
    error: null,
    refetch: jest.fn(),
  });
  mockedUseI18n.mockReturnValue({
    language: "en",
    setLanguage: jest.fn(),
    ensurePageTranslations: jest.fn().mockResolvedValue(undefined),
    t: (key: string) => {
      if (key === "common.next") {
        return "Next";
      }
      if (key === "common.back") {
        return "Back";
      }
      if (key === "common.saving") {
        return "Saving...";
      }
      if (key === "property.updated") {
        return "Property updated";
      }
      if (key === "property.ownerOnly") {
        return "Owner only";
      }
      return key;
    },
    ready: true,
    languages: ["en"],
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("clicking next on the edit page advances to review without saving the property", async () => {
  const user = userEvent.setup();
  const updateProperty = jest
    .spyOn(propertyService, "updateProperty")
    .mockResolvedValue(property);

  renderEditPage();

  expect(
    screen.queryByRole("button", {
      name: /Save listing|property-edit\.updateListing/i,
    }),
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /Next|common\.next/i }));

  expect(updateProperty).not.toHaveBeenCalled();
  expect(screen.getByText("Review")).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: /Save listing|property-edit\.updateListing/i,
    }),
  ).toBeInTheDocument();
});
