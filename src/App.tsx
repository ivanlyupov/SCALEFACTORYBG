import { useEffect } from "react";
import { site } from "./content";
import { useReveal } from "./useReveal";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import VideoReel from "./components/VideoReel";
import Results from "./components/Results";
import WithWithout from "./components/WithWithout";
import Proof from "./components/Proof";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/* The main landing page — the meeting funnel. No pricing here:
   portfolio → what we offer → real results → why us → book a meeting
   (+ 2 free videos). The money lives on /plans (see PlansPage.tsx). */

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
        <Services />
        <VideoReel />
        <Results />
        <WithWithout />
        <Proof />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
