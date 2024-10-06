export const onRequest: PagesFunction<Env> = (context) => {
  return context.env.TRPC_BACKEND.fetch(context.request)
}
