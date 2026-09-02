/**
 * usePubgData — Custom hook for PUBG PC data fetching.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPubgStats } from '../api/pubg';

export default function usePubgData({ apiKey, playerName, platform = 'steam' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(playerName));
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const isMounted = useRef(true);
  const intervalRef = useRef(null);
  const isInitialFetch = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      clearInterval(intervalRef.current);
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!playerName) {
      if (isMounted.current) {
        setLoading(false);
        setError({ message: 'Player IGN is required.' });
      }
      return;
    }

    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }

    try {
      const fetchPromise = fetchPubgStats(apiKey, platform, playerName);

      if (isInitialFetch.current) {
        await Promise.all([
          fetchPromise,
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]);
        isInitialFetch.current = false;
      }

      const res = await fetchPromise;
      if (!isMounted.current) return;
      setData(res);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      if (!isMounted.current) return;
      if (err.code === 'NOT_FOUND') {
        setData({
          name: playerName,
          platform: (platform || 'STEAM').toUpperCase(),
          kd: '0.00',
          wins: 0,
          matches: 0,
          avgDamage: 0,
          rank: 'Unranked',
          isFallback: true,
        });
        setError(null);
        setLastUpdated(new Date());
      } else {
        setData(null);
        setError({ message: err.message || 'Failed to fetch PUBG stats' });
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [apiKey, platform, playerName]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 180_000);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData,
  };
}
