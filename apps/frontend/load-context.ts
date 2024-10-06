import type { QueryClient } from "@tanstack/react-query";
import { trpc } from "./app/trpc";
import type { AppRouter } from "remix-trpc-fun-trpc";
import { makeQueryClient } from "./app/trpc/query-client";

import type { AppLoadContext } from "@remix-run/cloudflare";
import type { GetLoadContextFunction } from "@remix-run/cloudflare-pages";
import { type TRPCUntypedClient, httpBatchLink, httpLink } from "@trpc/client";
import { createTRPCQueryUtils } from "@trpc/react-query";
import type { CreateQueryUtils } from "@trpc/react-query/shared";

type Cloudflare = Pick<
  Parameters<GetLoadContextFunction<Env>>["0"]["context"]["cloudflare"],
  "caches" | "cf" | "ctx" | "env"
>;



declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    trpc: LoaderTRPC;
    queryClient: QueryClient;
    trpcClient: TRPCUntypedClient<AppRouter>;
  }
}

type SimpleGetLoadContextFunction = (args: {
  request: Request;
  context: { cloudflare: Cloudflare };
}) => AppLoadContext | Promise<AppLoadContext>;


type LoaderTRPC = CreateQueryUtils<AppRouter>;

export const getLoadContext: SimpleGetLoadContextFunction = ({
  request,
  context,
}) => {
  const queryClient = makeQueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpLink({
        url: "https://remix-trpc-fun-apps-backend/trpc",
        fetch: (input, init) => {
          console.log("FETCHING", input, init)
          if(input instanceof URL || typeof input === "string") {
            return context.cloudflare.env.TRPC_BACKEND.fetch(input.toString(), init);
          }
          return context.cloudflare.env.TRPC_BACKEND.fetch(input, init)
        }
      }),
    ],
  });

  const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClient });

  return {
    cloudflare: context.cloudflare,
    trpc: clientUtils,
    queryClient,
    trpcClient,
  };
};
