import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy, } from "@remix-run/dev";
import { getLoadContext } from "./load-context";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/server-runtime" {
  // or cloudflare, deno, etc.
  interface Future {
    unstable_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy<Env, IncomingRequestCfProperties>({ getLoadContext }),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});
