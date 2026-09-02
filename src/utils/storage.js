/**
 * Storage module for user preferences and API credentials.
 *
 * Saves settings in browser localStorage to persist between sessions.
 * Never stores keys on any external server.
 */

const KEY_API = "valo_overlay_api_key";
const KEY_CONFIG = "valo_overlay_config";

/**
 * @typedef {Object} DisplayFields
 * @property {boolean} rank       — Show competitive rank icon
 * @property {boolean} rr         — Show current RR value
 * @property {boolean} season     — Show current Act/Season label
 * @property {boolean} peakRank   — Show peak rank tier
 */

/**
 * @typedef {Object} OverlayConfig
 * @property {string} playerName — Riot ID name
 * @property {string} playerTag  — Riot ID tag (without #)
 * @property {string} region     — Game region (na, eu, ap, kr, latam, br)
 * @property {string} theme      — Visual glass theme
 * @property {string} layout     — Layout design (card, capsule, banner, minimal)
 * @property {string} glassBlur  — Glass blur intensity (high, medium, low)
 * @property {boolean} refraction — Liquid displacement refraction map
 * @property {number} glowOpacity — Ambient glow strength (0.1 - 1.0)
 * @property {string} sheenSpeed  — Sweep sheen animation speed (fast, normal, slow, off)
 * @property {boolean} borderGlow — Illumination border ring
 * @property {DisplayFields} displayFields
 */

const KEY_PUBG_API = "pubg_overlay_api_key";

/** Save API key securely in localStorage */
export function saveApiKey(key) {
  if (typeof key === "string" && key.trim()) {
    localStorage.setItem(KEY_API, key.trim());
  }
}

/** Load saved API key from localStorage */
export function loadApiKey() {
  return localStorage.getItem(KEY_API) || "";
}

/** Remove saved API key */
export function clearApiKey() {
  localStorage.removeItem(KEY_API);
}

/** Save PUBG API key */
export function savePubgApiKey(key) {
  if (typeof key === "string" && key.trim()) {
    localStorage.setItem(KEY_PUBG_API, key.trim());
  }
}

/** Load PUBG API key */
export function loadPubgApiKey() {
  return localStorage.getItem(KEY_PUBG_API) || "";
}

/** Clear PUBG API key */
export function clearPubgApiKey() {
  localStorage.removeItem(KEY_PUBG_API);
}

/** Returns the default configuration object */
export function defaultConfig() {
  return {
    playerName: "",
    playerTag: "",
    region: "na",
    theme: "prism",
    layout: "card",
    glassBlur: "high",
    refraction: true,
    refractionPower: 18,
    displacementScale: 100,
    cornerRadius: 20,
    lensZoom: 1.0,
    glowOpacity: 0.0,
    sheenSpeed: "normal",
    borderGlow: true,
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
  if (!config || typeof config !== "object") return;
  const sanitized = {
    ...config,
    playerName: (config.playerName || "").trim(),
    playerTag: (config.playerTag || "").trim().replace(/^#/, ""),
    region: (config.region || "na").trim().toLowerCase(),
    theme: config.theme || "prism",
    layout: config.layout || "card",
    glassBlur: config.glassBlur || "high",
    refraction: config.refraction !== undefined ? config.refraction : true,
    refractionPower: config.refractionPower !== undefined ? Number(config.refractionPower) : 18,
    // Accept the old fractional `lensZoom` setting when loading legacy configs.
    displacementScale: config.displacementScale !== undefined
      ? Number(config.displacementScale)
      : Math.round((Number(config.lensZoom) || 1) * 100),
    cornerRadius: config.cornerRadius !== undefined ? Number(config.cornerRadius) : 20,
    lensZoom: config.lensZoom !== undefined ? Number(config.lensZoom) : 1.0,
    glowOpacity: config.glowOpacity !== undefined ? Number(config.glowOpacity) : 0.0,
    sheenSpeed: config.sheenSpeed || "normal",
    borderGlow: config.borderGlow !== undefined ? config.borderGlow : true,
  };
  localStorage.setItem(KEY_CONFIG, JSON.stringify(sanitized));
}

/** @returns {OverlayConfig} */
export function loadConfig() {
  try {
    const raw = localStorage.getItem(KEY_CONFIG);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw);
    return {
      ...defaultConfig(),
      ...parsed,
      displayFields: {
        ...defaultConfig().displayFields,
        ...(parsed.displayFields || {}),
      },
    };
  } catch (err) {
    console.error("Failed to load overlay config from localStorage:", err);
    return defaultConfig();
  }
}

/** Reset configuration back to factory defaults */
export function resetConfig() {
  localStorage.removeItem(KEY_CONFIG);
  return defaultConfig();
}
