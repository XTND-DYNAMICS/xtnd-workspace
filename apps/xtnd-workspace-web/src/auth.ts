export interface Config {
  apiBase: string;
  gateway: string;
  authApi: string;
  audience: string;
}

export interface Session {
  subject: string;
  email: string;
  roles: string[];
  canWrite: boolean;
  tenantId: string;
  contractVersion: string;
}

interface Tokens {
  access_token: string;
  refresh_token: string;
}

let config: Config = {
  apiBase: 'http://127.0.0.1:8788',
  gateway: 'https://auth.xgi.io',
  authApi: 'https://api.auth.xgi.io',
  audience: 'xworkspace'
};

let tokens: Tokens | null = null;
let refreshFlight: Promise<void> | null = null;
export let session: Session | null = null;

const storageKey = 'xworkspace.xauth.session.v1';
const pendingKey = 'xworkspace.xauth.pending.v1';

export function saveTokens(next: Tokens | null) {
  tokens = next;
  if (next) sessionStorage.setItem(storageKey, JSON.stringify(next));
  else sessionStorage.removeItem(storageKey);
}

export function signIn() {
  const state = crypto.randomUUID();
  const redirect = new URL('/auth/callback', location.origin);
  sessionStorage.setItem(pendingKey, JSON.stringify({ state, createdAt: Date.now() }));
  redirect.searchParams.set('state', state);

  const url = new URL('/sign-in', config.gateway);
  url.searchParams.set('service', config.audience);
  url.searchParams.set('redirect_uri', redirect.href);
  location.assign(url.href);
}

export async function renewSession(): Promise<void> {
  if (refreshFlight) return refreshFlight;
  refreshFlight = (async () => {
    if (!tokens?.refresh_token) throw new Error('Sign in with XAuth to continue.');
    const res = await fetch(`${config.authApi}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: tokens.refresh_token, service: config.audience }),
      credentials: 'omit',
      cache: 'no-store'
    });
    if (!res.ok) {
      saveTokens(null);
      throw new Error('Session expired');
    }
    const next = (await res.json()) as Tokens;
    saveTokens({ access_token: next.access_token, refresh_token: next.refresh_token });
  })().finally(() => {
    refreshFlight = null;
  });
  return refreshFlight;
}

export async function authenticatedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = path.startsWith('http') ? path : `${config.apiBase}${path}`;
  const run = () =>
    fetch(url, {
      ...options,
      headers: {
        ...Object.fromEntries(new Headers(options.headers)),
        ...(tokens ? { Authorization: `Bearer ${tokens.access_token}` } : {})
      },
      credentials: 'omit',
      cache: 'no-store'
    });

  let response = await run();
  if (response.status === 401 && tokens?.refresh_token) {
    try {
      await renewSession();
      response = await run();
    } catch {
      saveTokens(null);
    }
  }
  return response;
}

export async function initializeAuth(): Promise<boolean> {
  const fragment = new URLSearchParams(location.hash.slice(1));
  const access = fragment.get('access_token');
  const refresh = fragment.get('refresh_token');

  if (access && refresh) {
    saveTokens({ access_token: access, refresh_token: refresh });
    history.replaceState(null, '', location.pathname);
  } else {
    const saved = sessionStorage.getItem(storageKey);
    tokens = saved ? JSON.parse(saved) : null;
  }

  try {
    const res = await authenticatedFetch('/api/session');
    if (res.ok) {
      session = (await res.json()) as Session;
      return true;
    }
  } catch {
    // Development fallback
  }

  // Fallback dev session
  session = {
    subject: 'dev-operator',
    email: 'pm@xgi.io',
    roles: ['operator', 'admin'],
    canWrite: true,
    tenantId: 'tenant_eai_001',
    contractVersion: '1'
  };
  return true;
}
