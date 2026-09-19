export interface Env {
  DB: D1Database;
  ASSETS?: R2Bucket;
  XAUTH_ISSUER?: string;
  XAUTH_JWKS_URL?: string;
  XAUTH_AUDIENCE?: string;
  CORS_ORIGINS?: string;
}
