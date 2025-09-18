import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      const page = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.ASSETS,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST,
          cacheControl: {
            browserTTL: 300,
            edgeTTL: 86400,
            bypassCache: false,
          },
        }
      );
      return page;
    } catch (e) {
      return new Response(`"${e.message}"`, {
        status: 500,
        headers: { 'content-type': 'text/plain' },
      });
    }
  },
};
