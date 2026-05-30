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

function pageTypesForPath(pathname: string): PageType[] {
  const pageTypes = new Set<PageType>(["common"]);

  if (pathname === "/" || pathname === "/home") {
    pageTypes.add("home");
    return Array.from(pageTypes);
  }

  if (pathname === "/login" || pathname === "/register") {
    pageTypes.add("auth");
    return Array.from(pageTypes);
  }

  if (pathname === "/terms" || pathname === "/privacy") {
    pageTypes.add("legal");
    return Array.from(pageTypes);
  }

  if (pathname === "/dashboard") {
    pageTypes.add("dashboard");
    return Array.from(pageTypes);
  }

  if (pathname === "/properties/search") {
    pageTypes.add("search");
    return Array.from(pageTypes);
  }

  if (matchPath("/properties/new", pathname)) {
    pageTypes.add("property");
    pageTypes.add("property-create");
    return Array.from(pageTypes);
  }

  if (matchPath("/properties/:id/edit", pathname)) {
    pageTypes.add("property");
    pageTypes.add("property-edit");
    return Array.from(pageTypes);
  }

  if (matchPath("/properties/:id", pathname)) {
    pageTypes.add("property");
    return Array.from(pageTypes);
  }

  if (matchPath("/owners/:id/listings", pathname)) {
    pageTypes.add("owner-listings");
    return Array.from(pageTypes);
  }

  if (
    matchPath("/owners/:id", pathname) ||
    matchPath("/flippers/:id", pathname)
  ) {
    pageTypes.add("profile");
    return Array.from(pageTypes);
  }

  pageTypes.add("not-found");
  return Array.from(pageTypes);
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
