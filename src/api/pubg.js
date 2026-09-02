/**
 * PUBG Official API Service
 *
 * Official Krafton API Endpoints:
 *   - GET https://api.pubg.com/shards/{platform}/players?filter[playerNames]={playerName}
 *   - GET https://api.pubg.com/shards/{platform}/seasons
 *   - GET https://api.pubg.com/shards/{platform}/players/{accountId}/seasons/{seasonId}/ranked
 *
 * Rate Limit Note: Krafton Developer API has a 10 Requests Per Minute (10 RPM) rate limit.
 * All functions here execute a minimal number of HTTP requests (1-2 per fetch) to stay strictly within quota.
 */

const BASE_URL = 'https://api.pubg.com/shards';

let cachedSeasonId = null;

/**
 * Format sub-tiers (1 -> I, 2 -> II, etc.)
 */
function formatSubTier(subTier) {
  const map = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' };
  return map[String(subTier)] || subTier || '';
}

/**
 * Format PUBG API rank tier object into human readable rank string.
 * e.g. { tier: 'Gold', subTier: '1' } -> "Gold I"
 */
function parseRankTier(tierObj) {
  if (!tierObj || !tierObj.tier || tierObj.tier.toLowerCase() === 'unranked') {
    return null;
  }
  const sub = formatSubTier(tierObj.subTier);
  return sub ? `${tierObj.tier} ${sub}` : tierObj.tier;
}

/**
 * Fetch the current active season ID for PUBG.
 */
async function fetchCurrentSeasonId(apiKey, platform) {
  if (cachedSeasonId) return cachedSeasonId;
  try {
    const res = await fetch(`${BASE_URL}/${platform}/seasons`, {
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const seasons = json.data || [];
    const current =
      seasons.find((s) => s.attributes?.isCurrentSeason && !s.attributes?.isOffseason) ||
      seasons.find((s) => s.attributes?.isCurrentSeason);

    if (current) {
      cachedSeasonId = current.id;
      return current.id;
    }
  } catch {
    // fallback silently
  }
  return null;
}

/**
 * Helper to select the game mode with the highest rounds played.
 * Checks all modes ('squad-fpp', 'squad', 'duo-fpp', 'duo', 'solo-fpp', 'solo')
 */
function getBestModeStats(gameModeStatsObj) {
  if (!gameModeStatsObj) return {};
  const modes = ['squad-fpp', 'squad', 'duo-fpp', 'duo', 'solo-fpp', 'solo'];
  let bestMode = {};
  let maxRounds = -1;

  for (const mode of modes) {
    const stats = gameModeStatsObj[mode];
    if (stats && (stats.roundsPlayed || 0) > maxRounds) {
      maxRounds = stats.roundsPlayed || 0;
      bestMode = stats;
    }
  }

  return bestMode;
}

/**
 * Lookup player account on chosen platform, trying exact input, Titlecase, and UPPERCASE.
 */
async function lookupPlayerAccount(cleanKey, safePlatform, rawName) {
  const trimmed = rawName.trim();
  const candidates = [
    trimmed,
    trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(),
    trimmed.toUpperCase(),
  ];
  const uniqueNames = [...new Set(candidates)];

  for (const name of uniqueNames) {
    const res = await fetch(`${BASE_URL}/${safePlatform}/players?filter[playerNames]=${encodeURIComponent(name)}`, {
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${cleanKey}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      throw new PubgApiError('Invalid or expired Krafton API Key. Check your key at developer.pubg.com.', res.status, 'AUTH_FAILED');
    }

    if (res.status === 429) {
      throw new PubgApiError('Krafton API rate limit reached (10 RPM limit). Please wait 1 minute.', 429, 'RATE_LIMITED');
    }

    if (res.ok) {
      const playerData = await res.json();
      if (playerData.data && playerData.data.length > 0) {
        return playerData.data[0];
      }
    }
  }

  return null;
}

export class PubgApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'PubgApiError';
    this.status = status;
    this.code = code;
  }
}

export async function fetchPubgStats(apiKey, platform = 'steam', playerName) {
  if (!playerName) {
    throw new PubgApiError('Player IGN is required.', 400, 'MISSING_NAME');
  }

  if (!apiKey) {
    throw new PubgApiError('PUBG API Key is required. Please add your Krafton API key in setup.', 401, 'MISSING_API_KEY');
  }

  const safePlatform = encodeURIComponent(platform.trim().toLowerCase());
  const cleanKey = apiKey.trim();

  try {
    // 1. Fetch Player Account ID (tries exact, Titlecase, UPPERCASE on target platform)
    const playerObj = await lookupPlayerAccount(cleanKey, safePlatform, playerName);

    if (!playerObj) {
      throw new PubgApiError(
        `Player "${playerName}" not found on ${platform.toUpperCase()}. Double check your exact in-game PUBG character spelling (e.g. Godpals vs godpals).`,
        404,
        'NOT_FOUND'
      );
    }

    const accountId = playerObj.id;
    const officialName = playerObj.attributes.name;

    // 2. Fetch current season ID
    const seasonId = await fetchCurrentSeasonId(cleanKey, safePlatform);

    // 3. Fetch ranked stats
    let rankedData = null;
    if (seasonId) {
      try {
        const rankedRes = await fetch(
          `${BASE_URL}/${safePlatform}/players/${accountId}/seasons/${seasonId}/ranked`,
          {
            headers: {
              Accept: 'application/vnd.api+json',
              Authorization: `Bearer ${cleanKey}`,
            },
          }
        );
        if (rankedRes.ok) {
          const json = await rankedRes.json();
          const modeStats = json.data?.attributes?.rankedGameModeStats;
          rankedData = getBestModeStats(modeStats);
        }
      } catch {
        // fallback to lifetime stats
      }
    }

    // If real-time ranked stats exist & player has matches in ranked this season:
    if (rankedData && (rankedData.roundsPlayed || 0) > 0) {
      const kills = rankedData.kills || 0;
      const deaths = Math.max(1, (rankedData.roundsPlayed || 1) - (rankedData.wins || 0));
      const wins = rankedData.wins || 0;
      const matches = rankedData.roundsPlayed || 0;
      const damage = rankedData.damageDealt || 0;

      const kd = (kills / deaths).toFixed(2);
      const avgDamage = matches > 0 ? Math.round(damage / matches) : 0;
      const realRank = parseRankTier(rankedData.currentTier);

      return {
        name: officialName,
        platform,
        kd,
        wins,
        matches,
        avgDamage,
        rank: realRank || 'Unranked',
        rankPoint: rankedData.currentRankPoint || null,
      };
    }

    // 4. Fallback to Season Lifetime Stats if unranked in current season
    const statsRes = await fetch(`${BASE_URL}/${safePlatform}/players/${accountId}/seasons/lifetime`, {
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${cleanKey}`,
      },
    });

    if (!statsRes.ok) {
      throw new PubgApiError(`Failed to fetch lifetime stats for "${officialName}"`, statsRes.status, 'STATS_FAILED');
    }

    const statsData = await statsRes.json();
    const gameModeStats = statsData.data?.attributes?.gameModeStats;
    const squadStats = getBestModeStats(gameModeStats);

    const kills = squadStats.kills || 0;
    const losses = squadStats.losses || Math.max(1, (squadStats.roundsPlayed || 1) - (squadStats.wins || 0));
    const wins = squadStats.wins || 0;
    const matches = squadStats.roundsPlayed || 0;
    const damage = squadStats.damageDealt || 0;

    const kd = matches > 0 ? (kills / Math.max(1, losses)).toFixed(2) : '0.00';
    const avgDamage = matches > 0 ? Math.round(damage / matches) : 0;

    return {
      name: officialName,
      platform,
      kd,
      wins,
      matches,
      avgDamage,
      rank: 'Unranked',
    };
  } catch (err) {
    if (err instanceof PubgApiError) throw err;
    throw new PubgApiError(err.message || 'Failed to fetch PUBG stats', 500, 'UNKNOWN');
  }
}
