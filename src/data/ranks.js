/**
 * VALORANT Competitive Rank Data
 *
 * Maps tier IDs (from the HenrikDev MMR API) to human-readable names and
 * brand colors. Rank icons are loaded from the public valorant-api.com CDN.
 *
 * Tier IDs follow the standard VALORANT competitive schema:
 *   0 = Unranked, 3–5 = Iron 1–3, 6–8 = Bronze 1–3, … 24–26 = Immortal 1–3, 27 = Radiant
 */

// Competitive tier UUID used in the valorant-api.com CDN URL
const COMP_TIER_UUID = '03621f52-342b-cf4e-4f86-9350a49c6d04';

/**
 * Returns the icon URL for a given tier ID from the public valorant-api.com CDN.
 * @param {number} tierId
 * @returns {string}
 */
export function getRankIconUrl(tierId) {
  if (!tierId || tierId < 3) {
    // Unranked / invalid → use tier 0 icon
    return `https://media.valorant-api.com/competitivetiers/${COMP_TIER_UUID}/0/largeicon.png`;
  }
  return `https://media.valorant-api.com/competitivetiers/${COMP_TIER_UUID}/${tierId}/largeicon.png`;
}

/**
 * Rank metadata keyed by tier ID.
 */
export const RANKS = {
  0:  { name: 'Unranked',    color: '#768691' },
  1:  { name: 'Unused',      color: '#768691' },
  2:  { name: 'Unused',      color: '#768691' },
  3:  { name: 'Iron 1',      color: '#3e3e3e' },
  4:  { name: 'Iron 2',      color: '#3e3e3e' },
  5:  { name: 'Iron 3',      color: '#3e3e3e' },
  6:  { name: 'Bronze 1',    color: '#a5855a' },
  7:  { name: 'Bronze 2',    color: '#a5855a' },
  8:  { name: 'Bronze 3',    color: '#a5855a' },
  9:  { name: 'Silver 1',    color: '#b0b0b0' },
  10: { name: 'Silver 2',    color: '#b0b0b0' },
  11: { name: 'Silver 3',    color: '#b0b0b0' },
  12: { name: 'Gold 1',      color: '#dbb830' },
  13: { name: 'Gold 2',      color: '#dbb830' },
  14: { name: 'Gold 3',      color: '#dbb830' },
  15: { name: 'Platinum 1',  color: '#398f93' },
  16: { name: 'Platinum 2',  color: '#398f93' },
  17: { name: 'Platinum 3',  color: '#398f93' },
  18: { name: 'Diamond 1',   color: '#b489c4' },
  19: { name: 'Diamond 2',   color: '#b489c4' },
  20: { name: 'Diamond 3',   color: '#b489c4' },
  21: { name: 'Ascendant 1', color: '#2e9e5e' },
  22: { name: 'Ascendant 2', color: '#2e9e5e' },
  23: { name: 'Ascendant 3', color: '#2e9e5e' },
  24: { name: 'Immortal 1',  color: '#c73e4f' },
  25: { name: 'Immortal 2',  color: '#c73e4f' },
  26: { name: 'Immortal 3',  color: '#c73e4f' },
  27: { name: 'Radiant',     color: '#ffffaa' },
};

/**
 * Get rank metadata for a tier ID, with a safe fallback.
 * @param {number} tierId
 * @returns {{ name: string, color: string }}
 */
export function getRankInfo(tierId) {
  return RANKS[tierId] || RANKS[0];
}
