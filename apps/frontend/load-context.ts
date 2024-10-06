import type { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "./app/trpc";
import { makeQueryClient } from "./app/trpc/query-client";
import { appRouter } from "./app/trpc/router";

import { createServerSideHelpers } from "@trpc/react-query/server";
import {  createContextFromFetch } from "./app/trpc/context";

import type { GetLoadContextFunction } from "@remix-run/cloudflare-pages";
import type { AppLoadContext } from "@remix-run/cloudflare";

type Cloudflare = Pick<Parameters<GetLoadContextFunction<Env>>["0"]["context"]["cloudflare"], "caches" | "cf" | "ctx">;


declare module "@remix-run/server-runtime" {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    trpc: LoaderTRPC;
    queryClient: QueryClient;
  }
}

type SimpleGetLoadContextFunction = (args: { request: Request, context: { cloudflare: Cloudflare } }) => AppLoadContext | Promise<AppLoadContext>;


// type GetLoadContextFunction = (args: {
//   request: Request;
//   context: { cloudflare: Cloudflare }; // load context _before_ augmentation
// }) => Promise<AppLoadContext>;

type LoaderTRPC = Omit<
  ReturnType<typeof createServerSideHelpers<AppRouter>>,
  "dehydrate" | "queryClient"
>;

export const getLoadContext: SimpleGetLoadContextFunction = (
  {
    request,
    context,
  }
) => {
  const queryClient = makeQueryClient();

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createContextFromFetch({
      req: request
    }),
    queryClient: queryClient,
  });

  return {
    cloudflare: context.cloudflare,
    trpc: helpers,
    queryClient,
  };
};
