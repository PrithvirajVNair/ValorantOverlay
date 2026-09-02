/**
 * localStorage Helpers for the VALORANT Overlay
 *
 * Keys used:
 *   - val_overlay_apiKey  — the user's HenrikDev API key (only stored if user opts in)
 *   - val_overlay_config  — player name, tag, region, display field toggles
 *
 * SECURITY: The API key is only stored in the user's own browser localStorage.
 * It is never sent to any server controlled by this application.
 */

const KEY_API = 'val_overlay_apiKey';
const KEY_CONFIG = 'val_overlay_config';

// ---------------------------------------------------------------------------
// API Key
// ---------------------------------------------------------------------------

/** Save the user's HenrikDev API key to localStorage. */
export function saveApiKey(key) {
  if (!key || typeof key !== 'string') return;
  localStorage.setItem(KEY_API, key.trim());
}

/** Load a previously saved API key, or return null. */
export function loadApiKey() {
  return localStorage.getItem(KEY_API) || null;
}

/** Remove the saved API key from localStorage. */
export function clearApiKey() {
  localStorage.removeItem(KEY_API);
}

// ---------------------------------------------------------------------------
// Config (player info + display preferences)
// ---------------------------------------------------------------------------

/**
 * Default config shape.
 * @typedef {Object} OverlayConfig
 * @property {string} playerName
 * @property {string} playerTag
 * @property {string} region
 * @property {Object} displayFields
 * @property {boolean} displayFields.rank
 * @property {boolean} displayFields.rr
 * @property {boolean} displayFields.season
 * @property {boolean} displayFields.peakRank
 */

/** @returns {OverlayConfig} */
export function defaultConfig() {
  return {
    playerName: '',
    playerTag: '',
    region: 'na',
    displayFields: {
      rank: true,
      rr: true,
      season: true,
      peakRank: false,
    },
  };
}

/**
 * Save the overlay configuration to localStorage.
 * @param {OverlayConfig} config
 */
export function saveConfig(config) {
  if (!config || typeof config !== 'object') return;
  // Sanitize text fields
  const sanitized = {
    ...config,
    playerName: (config.playerName || '').trim(),
    playerTag: (config.playerTag || '').trim().replace(/^#/, ''),
    region: (config.region || 'na').trim().toLowerCase(),
  };
  localStorage.setItem(KEY_CONFIG, JSON.stringify(sanitized));
}

/** @returns {OverlayConfig} */
export function loadConfig() {
  try {
    const raw = localStorage.getItem(KEY_CONFIG);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw);
    // Merge with defaults to ensure all keys exist
    return {
      ...defaultConfig(),
      ...parsed,
      displayFields: {
        ...defaultConfig().displayFields,
        ...(parsed.displayFields || {}),
      },
    };
  } catch {
    return defaultConfig();
  }
}

/** Remove saved config from localStorage. */
export function clearConfig() {
  localStorage.removeItem(KEY_CONFIG);
}
