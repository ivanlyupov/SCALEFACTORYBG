import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PlansPage from "./PlansPage";
import AdminApp from "./admin/AdminApp";
import ClientPortal from "./client/ClientPortal";
import OnboardingPage from "./onboarding/OnboardingPage";
import "./index.css";

// Tiny router (no library needed):
//   /plans      → pricing page (the money offer, separate from the funnel)
//   /admin      → your control panel (leads + clients + onboarding)
//   /client     → a client's private portal
//   /onboarding → the new-client questionnaire
//   else        → the marketing landing page (meeting funnel, no pricing)
const path = window.location.pathname.replace(/\/+$/, "");
let view = <App />;
if (path === "/plans") {
  view = <PlansPage />;
} else if (path === "/admin") {
  document.title = "Админ · ScaleFactoryBG";
  view = <AdminApp />;
} else if (path === "/client") {
  document.title = "Клиентски портал · ScaleFactoryBG";
  view = <ClientPortal />;
} else if (path === "/onboarding") {
  document.title = "Онбординг · ScaleFactoryBG";
  view = <OnboardingPage />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{view}</React.StrictMode>
);
