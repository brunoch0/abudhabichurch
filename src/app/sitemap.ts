import type { MetadataRoute } from "next";

const BASE = "https://adkmc.ae";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/about/people",
    "/about/worship",
    "/about/location",
    "/about/newcomer",
    "/faq",
    "/en",
    "/sermons",
    "/bulletins",
    "/news",
    "/calendar",
    "/contact",
  ];
  return routes.map((r) => ({
    url: `${BASE}${r}`,
    changeFrequency: r === "" ? "daily" : "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
