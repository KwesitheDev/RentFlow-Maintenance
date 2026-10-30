import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { publicPages, SITE_ORIGIN } from "../content/site";
const appTitles = {
  "/app/home": "Overview",
  "/app/requests": "Maintenance requests",
  "/app/properties": "Properties",
  "/app/users": "People & access",
  "/app/settings": "Account settings",
  "/demo": "Interactive four-role demo",
  "/login": "Sign in",
  "/register": "Account access",
  "/forgot-password": "Account recovery",
};
export function metadataFor(pathname) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const page = publicPages[path];
  return {
    title: page?.title || `${appTitles[path] || "Page not found"} | RentFlow`,
    description:
      page?.description ||
      "Access your RentFlow maintenance workspace or explore the product with a private, fictional demo session.",
    robots: page ? "index, follow" : "noindex, nofollow",
    canonical: page ? `${SITE_ORIGIN}${path === "/" ? "/" : path}` : null,
  };
}
export default function RouteMeta() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    const meta = metadataFor(pathname);
    document.title = meta.title;
    const set = (key, content, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    set("description", meta.description);
    set("robots", meta.robots);
    set("og:title", meta.title, true);
    set("og:description", meta.description, true);
    set("og:url", meta.canonical || `${SITE_ORIGIN}${pathname}`, true);
    set("og:type", "website", true);
    set("og:site_name", "RentFlow", true);
    set("og:image", `${SITE_ORIGIN}/social-preview.png`, true);
    set("twitter:card", "summary_large_image");
    set("twitter:title", meta.title);
    set("twitter:description", meta.description);
    set("twitter:image", `${SITE_ORIGIN}/social-preview.png`);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (meta.canonical) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = meta.canonical;
    } else canonical?.remove();
    let structured = document.getElementById("site-structured-data");
    if (meta.canonical) {
      if (!structured) {
        structured = document.createElement("script");
        structured.type = "application/ld+json";
        structured.id = "site-structured-data";
        document.head.appendChild(structured);
      }
      structured.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "RentFlow",
        url: `${SITE_ORIGIN}/`,
        description: publicPages["/"].description,
      });
    } else structured?.remove();
    if (previousPath.current !== pathname) {
      window.scrollTo?.(0, 0);
      const heading = document.querySelector("main h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname]);
  return null;
}
