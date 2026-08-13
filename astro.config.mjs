import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://houseofnonduality.com",
  integrations: [
    sitemap({
      filter: (page) =>
        !page.endsWith("/nl/sporen-van-inzicht/ozymandias/") &&
        !page.endsWith("/en/traces-of-insight/ozymandias/"),
    }),
  ],
});
