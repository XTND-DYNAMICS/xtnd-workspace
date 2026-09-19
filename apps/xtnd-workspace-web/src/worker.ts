export interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

export interface Env {
  ASSETS: Fetcher;
  API_BASE_URL?: string;
  AUTH_GATEWAY?: string;
  AUTH_API?: string;
  AUTH_AUDIENCE?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/config.json') {
      return new Response(
        JSON.stringify({
          apiBase: env.API_BASE_URL || 'https://api.workspace.xgi.io',
          gateway: env.AUTH_GATEWAY || 'https://auth.xgi.io',
          authApi: env.AUTH_API || 'https://api.auth.xgi.io',
          audience: env.AUTH_AUDIENCE || 'xworkspace'
        }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return env.ASSETS.fetch(request);
  }
};
