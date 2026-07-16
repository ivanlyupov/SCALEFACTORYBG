import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import ClientPortal from "./client/ClientPortal";
import "./index.css";

// Tiny router (no library needed):
//   /admin  → your control panel (leads + clients)
//   /client → a client's private portal
//   else    → the marketing site
const path = window.location.pathname.replace(/\/+$/, "");
let view = <App />;
if (path === "/admin") {
  document.title = "Админ · ScaleFactoryBG";
  view = <AdminApp />;
} else if (path === "/client") {
  document.title = "Клиентски портал · ScaleFactoryBG";
  view = <ClientPortal />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{view}</React.StrictMode>
);
