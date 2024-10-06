import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext, _appRouter } from 'remix-trpc-fun-trpc';


export default {
  async fetch(request: Request): Promise<Response> {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: _appRouter,
      createContext,
    });
  },
};