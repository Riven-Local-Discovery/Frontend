/**
 * The single place the frontend talks to the Riven API.
 *
 * The API returns one error shape on every failure — `{ code, message }` where
 * `message` is a string, or an array of strings for validation errors — so this
 * normalises both into an ApiError carrying the machine-readable `code` that
 * screens can branch on.
 */

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    /** Structured context the API attaches to some errors, e.g. failed cart lines. */
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Access token for authenticated routes. */
  token?: string | null;
  signal?: AbortSignal;
};

/**
 * Access tokens last 15 minutes, so an authenticated request will eventually
 * come back 401 in any session left open. This hook lets auth.ts supply a
 * "get me a fresh token" function without api.ts importing it, which would be
 * a cycle. Set once, at module load.
 */
type RefreshHandler = () => Promise<string | null>;
let refreshHandler: RefreshHandler | null = null;

export function setRefreshHandler(handler: RefreshHandler): void {
  refreshHandler = handler;
}

/** Collapses concurrent 401s into a single refresh instead of one per call. */
let inFlightRefresh: Promise<string | null> | null = null;

function refreshOnce(): Promise<string | null> {
  if (!refreshHandler) return Promise.resolve(null);
  inFlightRefresh ??= refreshHandler().finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}

function errorFrom(status: number, payload: unknown): ApiError {
  if (payload && typeof payload === 'object' && 'code' in payload) {
    const { code, message, details } = payload as {
      code: string;
      message: string | string[];
      details?: unknown;
    };
    // Validation failures arrive as an array of human-readable rules.
    const text = Array.isArray(message) ? message.join(' ') : message;
    return new ApiError(status, code, text, details);
  }

  // A proxy error, an HTML page, or a network-level failure the API never saw.
  return new ApiError(status, 'UNEXPECTED_RESPONSE', `Request failed with status ${status}.`);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return attempt<T>(path, options, true);
}

async function attempt<T>(path: string, options: RequestOptions, mayRefresh: boolean): Promise<T> {
  if (!BASE_URL) {
    throw new ApiError(0, 'API_URL_NOT_CONFIGURED', 'VITE_API_URL is not set. Copy .env.example to .env.local.');
  }

  const { method = 'GET', body, token, signal } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    // DNS failure, offline, or a CORS rejection — the browser gives us no detail.
    throw new ApiError(0, 'NETWORK_ERROR', 'Could not reach the server. Check your connection and try again.', cause);
  }

  // An expired access token: swap it for a fresh one and replay the request
  // once. Only for calls that actually carried a token — a 401 from
  // /auth/login means bad credentials, not an expired session.
  if (response.status === 401 && token && mayRefresh) {
    const renewed = await refreshOnce();
    if (renewed) {
      return attempt<T>(path, { ...options, token: renewed }, false);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    // The free tier sleeps; a cold start can look like a timeout to the user.
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      throw new ApiError(
        429,
        'RATE_LIMITED',
        retryAfter ? `Too many attempts. Try again in ${retryAfter}s.` : 'Too many attempts. Try again shortly.',
      );
    }
    throw errorFrom(response.status, payload);
  }

  return payload as T;
}
