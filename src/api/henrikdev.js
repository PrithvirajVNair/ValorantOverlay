/**
 * HenrikDev VALORANT API Service
 *
 * All requests go directly from the browser to api.henrikdev.xyz.
 * The user's API key is attached as an Authorization header and is
 * NEVER logged, stored on a server, or sent anywhere else.
 *
 * Endpoints used:
 *   - GET /valorant/v1/account/{name}/{tag}
 *   - GET /valorant/v3/mmr/{affinity}/pc/{name}/{tag}
 *
 * @see https://docs.henrikdev.xyz
 */

const BASE_URL = 'https://api.henrikdev.xyz';

// ---------------------------------------------------------------------------
// Custom error types
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export class RateLimitError extends ApiError {
  constructor(retryAfter) {
    super('Rate limit exceeded. Please wait before retrying.', 429, 'RATE_LIMITED');
    this.name = 'RateLimitError';
    /** Seconds to wait before retrying */
    this.retryAfter = retryAfter || 30;
  }
}

export class AuthError extends ApiError {
  constructor() {
    super('Invalid or missing API key.', 401, 'AUTH_FAILED');
    this.name = 'AuthError';
  }
}

export class NotFoundError extends ApiError {
  constructor(msg) {
    super(msg || 'Player not found. Check the Riot ID and region.', 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

// ---------------------------------------------------------------------------
// Internal fetch helper
// ---------------------------------------------------------------------------

/**
 * Internal helper — makes an authenticated GET request to the HenrikDev API.
 * @param {string} path  — API path (e.g. "/valorant/v1/account/Name/Tag")
 * @param {string} apiKey — user-provided HenrikDev API key
 * @returns {Promise<object>} parsed JSON response body
 */
async function apiFetch(path, apiKey) {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: apiKey,
    },
  });

  // --- Rate limit ---
  if (res.status === 429) {
    const retryAfter =
      parseInt(res.headers.get('Retry-After'), 10) ||
      parseInt(res.headers.get('X-RateLimit-Reset'), 10) ||
      30;
    throw new RateLimitError(retryAfter);
  }

  // --- Auth errors ---
  if (res.status === 401 || res.status === 403) {
    throw new AuthError();
  }

  // --- Parse body (before 404 check so we get API's specific message) ---
  const body = await res.json();

  // HenrikDev returns { errors: [...] } on failure (including 404s)
  if (body.errors && body.errors.length > 0) {
    const first = body.errors[0];
    const msg = first.message || 'Unknown API error';
    if (res.status === 404 || first.status === 404) {
      throw new NotFoundError(msg);
    }
    throw new ApiError(msg, first.status || res.status, first.code);
  }

  // --- Not found (no error body) ---
  if (res.status === 404) {
    throw new NotFoundError();
  }

  // --- Generic non-2xx ---
  if (!res.ok) {
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }

  return body;
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

/**
 * Fetch a VALORANT account by Riot ID.
 *
 * @param {string} apiKey — user's HenrikDev API key
 * @param {string} name   — Riot ID name (e.g. "TenZ")
 * @param {string} tag    — Riot ID tag  (e.g. "1")
 * @returns {Promise<object>} account data ({ name, tag, puuid, account_level, card, region, ... })
 */
export async function fetchAccount(apiKey, name, tag) {
  const safeName = encodeURIComponent(name.trim());
  const safeTag = encodeURIComponent(tag.trim().replace(/^#/, ''));
  const data = await apiFetch(`/valorant/v1/account/${safeName}/${safeTag}`, apiKey);
  return data.data;
}

/**
 * Fetch competitive MMR data for a player.
 *
 * @param {string} apiKey  — user's HenrikDev API key
 * @param {string} region  — region/affinity ("na", "eu", "ap", "kr", "latam", "br")
 * @param {string} name    — Riot ID name
 * @param {string} tag     — Riot ID tag
 * @returns {Promise<object>} MMR data ({ current, seasonal, peak, account })
 */
export async function fetchMMR(apiKey, region, name, tag) {
  const safeRegion = encodeURIComponent(region.trim().toLowerCase());
  const safeName = encodeURIComponent(name.trim());
  const safeTag = encodeURIComponent(tag.trim().replace(/^#/, ''));
  const data = await apiFetch(
    `/valorant/v3/mmr/${safeRegion}/pc/${safeName}/${safeTag}`,
    apiKey
  );
  return data.data;
}
