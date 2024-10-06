// biome-ignore lint/complexity/noBannedTypes: haven't got anything to pass into TPC as context yet
type TRPCContext = {};

export function createContextFromFetch({ req }: { req: Request }): TRPCContext {
  return {};
}

export type Context = TRPCContext;
