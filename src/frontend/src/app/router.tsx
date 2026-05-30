import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  matchPath,
  useLocation,
} from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/hooks/useI18n";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { FlipperProfilePage } from "@/pages/FlipperProfilePage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { OwnerListingsPage } from "@/pages/OwnerListingsPage";
import { OwnerDashboardPage } from "@/pages/OwnerDashboardPage";
import { OwnerProfilePage } from "@/pages/OwnerProfilePage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { PropertyCreatePage } from "@/pages/PropertyCreatePage";
import { PropertyDetailPage } from "@/pages/PropertyDetailPage";
import { PropertyEditPage } from "@/pages/PropertyEditPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { TermsOfUsePage } from "@/pages/TermsOfUsePage";
import type { PageType } from "@/types/i18n";

const HOME_PAGE_TYPES: PageType[] = ["home", "search"];
const AUTH_PAGE_TYPES: PageType[] = ["auth"];
const LEGAL_PAGE_TYPES: PageType[] = ["legal"];
const DASHBOARD_PAGE_TYPES: PageType[] = ["dashboard"];
const SEARCH_PAGE_TYPES: PageType[] = ["search"];
const PROPERTY_CREATE_PAGE_TYPES: PageType[] = ["property", "property-create"];
const PROPERTY_EDIT_PAGE_TYPES: PageType[] = ["property", "property-edit"];
const PROPERTY_PAGE_TYPES: PageType[] = ["property"];
const OWNER_LISTINGS_PAGE_TYPES: PageType[] = ["owner-listings"];
const PROFILE_PAGE_TYPES: PageType[] = ["profile"];
const NOT_FOUND_PAGE_TYPES: PageType[] = ["not-found"];

function pageTypesForPath(pathname: string): PageType[] {
  const pageTypes = new Set<PageType>(["common"]);
  const addPageTypes = (types: PageType[]) => {
    for (const pageType of types) {
      pageTypes.add(pageType);
    }
    return Array.from(pageTypes);
  };

  if (pathname === "/" || pathname === "/home") {
    return addPageTypes(HOME_PAGE_TYPES);
  }

  if (pathname === "/login" || pathname === "/register") {
    return addPageTypes(AUTH_PAGE_TYPES);
  }

  if (pathname === "/terms" || pathname === "/privacy") {
    return addPageTypes(LEGAL_PAGE_TYPES);
  }

  if (pathname === "/dashboard") {
    return addPageTypes(DASHBOARD_PAGE_TYPES);
  }

  if (pathname === "/properties/search") {
    return addPageTypes(SEARCH_PAGE_TYPES);
  }

  if (matchPath("/properties/new", pathname)) {
    return addPageTypes(PROPERTY_CREATE_PAGE_TYPES);
  }

  if (matchPath("/properties/:id/edit", pathname)) {
    return addPageTypes(PROPERTY_EDIT_PAGE_TYPES);
  }

  if (matchPath("/properties/:id", pathname)) {
    return addPageTypes(PROPERTY_PAGE_TYPES);
  }

  if (matchPath("/owners/:id/listings", pathname)) {
    return addPageTypes(OWNER_LISTINGS_PAGE_TYPES);
  }

  if (
    matchPath("/owners/:id", pathname) ||
    matchPath("/flippers/:id", pathname)
  ) {
    return addPageTypes(PROFILE_PAGE_TYPES);
  }

  return addPageTypes(NOT_FOUND_PAGE_TYPES);
}

function RouteTranslationLoader() {
  const { pathname } = useLocation();
  const { ensurePageTranslations, language } = useI18n();

  useEffect(() => {
    const pageTypes = pageTypesForPath(pathname);
    void ensurePageTranslations(pageTypes);
  }, [ensurePageTranslations, language, pathname]);

  return null;
}

export function AppRouter() {
  return (
    <>
      <RouteTranslationLoader />
      <Routes>
        <Route
          element={
            <AppShell>
              <Outlet />
            </AppShell>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/flippers/:id" element={<FlipperProfilePage />} />
          <Route path="/owners/:id" element={<OwnerProfilePage />} />
          <Route path="/owners/:id/listings" element={<OwnerListingsPage />} />
          <Route path="/properties/search" element={<SearchResultsPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route element={<ProtectedRoute roles={["OWNER"]} />}>
            <Route path="/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/properties/new" element={<PropertyCreatePage />} />
            <Route path="/properties/:id/edit" element={<PropertyEditPage />} />
          </Route>
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
