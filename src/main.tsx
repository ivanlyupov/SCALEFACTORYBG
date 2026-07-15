import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminDashboard from "./admin/AdminDashboard";
import "./index.css";

// Tiny router: /admin shows the private leads dashboard, everything
// else shows the marketing site. (No router library needed.)
const path = window.location.pathname.replace(/\/+$/, "");
const isAdmin = path === "/admin";
if (isAdmin) document.title = "Админ · ScaleFactoryBG";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isAdmin ? <AdminDashboard /> : <App />}</React.StrictMode>
);
