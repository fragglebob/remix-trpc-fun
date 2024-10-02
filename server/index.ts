import { createRequestHandler } from "@remix-run/express";
import { type ServerBuild, installGlobals } from "@remix-run/node";
import express, { type Request, type Response } from "express";
import { getLoadContext } from "./getLoadContext";

installGlobals({ nativeFetch: true });

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const app = express();

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", {
      immutable: true,
      maxAge: "1y",
    }),
  );
}
app.use(express.static("build/client", { maxAge: "1h" }));

// needs to handle all verbs (GET, POST, etc.)
app.all(
  "*",
  createRequestHandler({
    build: viteDevServer
      ? () =>
          viteDevServer.ssrLoadModule(
            "virtual:remix/server-build",
          ) as Promise<ServerBuild>
      : ((await import("../build/server/index.js")) as unknown as ServerBuild),
    getLoadContext: getLoadContext,
  }),
);

const port = 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
