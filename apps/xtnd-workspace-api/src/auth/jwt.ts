import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Session } from '@xtnd-dynamics/xworkspace-core';
import type { Env } from '../env.js';

let remoteJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;
let currentJwksUrl: string | null = null;

function getJWKS(url: string) {
  if (!remoteJWKS || currentJwksUrl !== url) {
    currentJwksUrl = url;
    remoteJWKS = createRemoteJWKSet(new URL(url));
  }
  return remoteJWKS;
}

export async function verifyToken(authHeader: string | null, env: Env): Promise<Session> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or malformed Authorization header');
  }

  const token = authHeader.slice(7);

  // If JWKS URL is provided, verify using remote JWKS
  if (env.XAUTH_JWKS_URL) {
    const JWKS = getJWKS(env.XAUTH_JWKS_URL);
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: env.XAUTH_ISSUER,
      audience: env.XAUTH_AUDIENCE || 'xworkspace'
    });

    const roles = Array.isArray(payload.roles)
      ? (payload.roles as string[])
      : typeof payload.roles === 'string'
      ? (payload.roles as string).split(',').map(r => r.trim())
      : ['user'];

    const canWrite = roles.some(r => ['operator', 'admin', 'editor'].includes(r.toLowerCase()));

    return {
      subject: payload.sub || '',
      email: (payload.email as string) || (payload.sub as string) || '',
      roles,
      canWrite,
      tenantId: (payload.tenant_id as string) || 'tenant_eai_001',
      contractVersion: '1'
    };
  }

  // Fallback for local development or mock environments
  return {
    subject: 'dev-operator',
    email: 'pm@xgi.io',
    roles: ['operator', 'admin'],
    canWrite: true,
    tenantId: 'tenant_eai_001',
    contractVersion: '1'
  };
}
