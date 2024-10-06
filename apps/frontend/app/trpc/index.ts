import { createTRPCReact } from "@trpc/react-query";
import type { appRouter } from "./router";

export type AppRouter = typeof appRouter;

export const trpc = createTRPCReact<AppRouter>();
