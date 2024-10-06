import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "remix-trpc-fun-trpc";

export const trpc = createTRPCReact<AppRouter>();
