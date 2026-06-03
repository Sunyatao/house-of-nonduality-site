import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://houseofnonduality.com",
  base: "/house-of-nonduality-site/",
  integrations: [sitemap()],
});