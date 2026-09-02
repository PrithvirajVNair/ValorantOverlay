/**
 * usePlayerData — Custom hook for periodic VALORANT player data fetching.
 *
 * Fetches account info + MMR on mount and at a configurable interval (default 120s).
 * Handles rate-limit errors by pausing the polling cycle and resuming after the
 * Retry-After period. Auth errors are surfaced immediately so the UI can prompt
 * the user to re-enter their key.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchAccount, fetchMMR, RateLimitError, AuthError } from '../api/henrikdev';

/** Default polling interval in milliseconds (2 minutes). */
const DEFAULT_INTERVAL_MS = 120_000;

/**
 * @param {Object} params
 * @param {string} params.apiKey     — HenrikDev API key
 * @param {string} params.playerName — Riot ID name
 * @param {string} params.playerTag  — Riot ID tag
 * @param {string} params.region     — Region/affinity (na, eu, ap, kr, latam, br)
 * @param {number} [params.intervalMs] — Polling interval in ms (default 120000)
 *
 * @returns {{
 *   playerData: object|null,
 *   loading: boolean,
 *   error: { type: string, message: string }|null,
 *   lastUpdated: Date|null,
 *   refresh: () => void,
 *   rateLimited: boolean,
 *   retryIn: number
 * }}
 */
export default function usePlayerData({
  apiKey,
  playerName,
  playerTag,
  region,
  intervalMs = DEFAULT_INTERVAL_MS,
}) {
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [retryIn, setRetryIn] = useState(0);

  const intervalRef = useRef(null);
  const retryTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const isMounted = useRef(true);

  // Track mount state for safe async updates
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  /**
   * Core fetch function — calls both API endpoints and merges results.
   */
  const fetchData = useCallback(async () => {
    if (!apiKey || !playerName || !playerTag || !region) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch account first (region-independent) to validate the player exists
      const account = await fetchAccount(apiKey, playerName, playerTag);
      if (!isMounted.current) return;

      // 2. Use the account's returned region for MMR, fall back to user-selected region
      const mmrRegion = account.region || region;

      let mmr = null;
      try {
        mmr = await fetchMMR(apiKey, mmrRegion, playerName, playerTag);
      } catch (mmrErr) {
        // If MMR fails (e.g. unranked player), still show account data
        // but surface a non-blocking warning
        if (isMounted.current) {
          setError({
            type: 'generic',
            message: mmrErr.message || 'Could not load rank data.',
          });
        }
      }

      if (!isMounted.current) return;

      setPlayerData({ account, mmr });
      setLastUpdated(new Date());
      setRateLimited(false);
      setRetryIn(0);
    } catch (err) {
      if (!isMounted.current) return;

      if (err instanceof RateLimitError) {
        setRateLimited(true);
        const waitSec = err.retryAfter;
        setRetryIn(waitSec);

        // Stop regular polling during rate-limit cooldown
        clearInterval(intervalRef.current);

        // Countdown timer
        let remaining = waitSec;
        countdownRef.current = setInterval(() => {
          remaining -= 1;
          if (isMounted.current) setRetryIn(Math.max(0, remaining));
          if (remaining <= 0) clearInterval(countdownRef.current);
        }, 1000);

        // Resume polling after cooldown
        retryTimerRef.current = setTimeout(() => {
          if (!isMounted.current) return;
          setRateLimited(false);
          setRetryIn(0);
          fetchData();              // retry immediately
          startPolling();            // restart interval
        }, waitSec * 1000);

        setError({
          type: 'rate_limit',
          message: `Rate limited — retrying in ${waitSec}s`,
        });
      } else if (err instanceof AuthError) {
        setError({ type: 'auth', message: err.message });
      } else {
        setError({
          type: 'generic',
          message: err.message || 'Failed to fetch player data.',
        });
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [apiKey, playerName, playerTag, region]);

  /**
   * Start the periodic polling interval.
   */
  const startPolling = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchData, intervalMs);
  }, [fetchData, intervalMs]);

  // Initial fetch + start polling when params change
  useEffect(() => {
    if (!apiKey || !playerName || !playerTag || !region) return;

    fetchData();
    startPolling();

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(retryTimerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [apiKey, playerName, playerTag, region, fetchData, startPolling]);

  /** Manual refresh trigger */
  const refresh = useCallback(() => {
    if (rateLimited) return; // don't allow refresh during cooldown
    fetchData();
  }, [fetchData, rateLimited]);

  return { playerData, loading, error, lastUpdated, refresh, rateLimited, retryIn };
}
