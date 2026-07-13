import { useEffect } from "react";
import { site } from "./content";
import { useReveal } from "./useReveal";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import CostTable from "./components/CostTable";
import WithWithout from "./components/WithWithout";
import VideoReel from "./components/VideoReel";
import Proof from "./components/Proof";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  useReveal();

  // Keep the browser-tab title + meta description in sync with content.ts
  useEffect(() => {
    document.title = site.pageTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", site.metaDescription);
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pricing />
        <CostTable />
        <WithWithout />
        <VideoReel />
        <Proof />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
