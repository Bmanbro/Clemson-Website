// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://brysonn.people.clemson.edu",
  devToolbar: { enabled: false },
  server: { port: 4321 },
  vite: { server: { strictPort: true } },
});
