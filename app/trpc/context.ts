import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type express from "express";

// biome-ignore lint/complexity/noBannedTypes: haven't got anything to pass into TPC as context yet
type TRPCContext = {};

export function createContextFromFetch({
  req,
  resHeaders,
}: FetchCreateContextFnOptions): TRPCContext {
  return {};
}

export function createContextFromExpress(
  req: express.Request,
  res: express.Response,
): TRPCContext {
  return {};
}

export type Context = TRPCContext;
