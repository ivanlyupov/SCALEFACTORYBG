import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PlansPage from "./PlansPage";
import AdminApp from "./admin/AdminApp";
import ClientPortal from "./client/ClientPortal";
import OnboardingPage from "./onboarding/OnboardingPage";
import { site, enableClientPortal } from "./content";
import CookieBanner from "./components/CookieBanner";
import "./index.css";

// Tiny router (no library needed):
//   /plans      → pricing page (the money offer, separate from the funnel)
//   /admin      → your control panel (leads + clients + onboarding)
//   /client     → a client's private portal (OFF while enableClientPortal = false)
//   /onboarding → the new-client questionnaire
//   else        → the marketing landing page (meeting funnel, no pricing)
const path = window.location.pathname.replace(/\/+$/, "");
let view = <App />;

// The cookie bar (and therefore any marketing tracker) belongs only on the
// public, ad-facing pages. /admin is you and /client is a signed-in customer —
// counting those as ad traffic would pollute the pixel data and audiences.
let isPublicPage = true;

if (path === "/plans") {
  view = <PlansPage />;
} else if (path === "/admin") {
  document.title = "Админ · " + site.brandName;
  view = <AdminApp />;
  isPublicPage = false;
} else if (path === "/client" && enableClientPortal) {
  document.title = "Клиентски портал · " + site.brandName;
  view = <ClientPortal />;
  isPublicPage = false;
} else if (path === "/onboarding") {
  document.title = "Онбординг · " + site.brandName;
  view = <OnboardingPage />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {view}
    {isPublicPage && <CookieBanner />}
  </React.StrictMode>
);
