import type { GetLoadContextFunction } from "@remix-run/express";
import type { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "~/trpc";
import { makeQueryClient } from "~/trpc/query-client";
import { appRouter } from "~/trpc/router";

import { createServerSideHelpers } from "@trpc/react-query/server";
import { createContextFromExpress } from "~/trpc/context";

type LoaderTRPC = Omit<
  ReturnType<typeof createServerSideHelpers<AppRouter>>,
  "dehydrate" | "queryClient"
>;

declare module "@remix-run/server-runtime" {
  export interface AppLoadContext {
    trpc: LoaderTRPC;
    queryClient: QueryClient;
  }
}

export const getLoadContext: GetLoadContextFunction = async (
  request,
  response,
) => {
  const queryClient = makeQueryClient();

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createContextFromExpress(request, response),
    queryClient: queryClient,
  });

  return {
    trpc: helpers,
    queryClient,
  };
};
