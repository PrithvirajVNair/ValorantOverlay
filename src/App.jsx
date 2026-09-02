/**
 * App — Root component for the VALORANT Stream Overlay.
 *
 * Routes between two views:
 *   1. SetupScreen — config panel (API key, player, region, display toggles)
 *   2. Overlay     — transparent OBS Browser Source view
 *
 * URL-based config for OBS:
 *   When the URL contains hash params (e.g. #overlay?key=...&name=...&tag=...),
 *   the overlay reads ALL config from the URL. This is how OBS Browser Source
 *   gets its config — it doesn't share localStorage with your regular browser.
 *
 *   The hash fragment is never sent to any server (it stays client-side).
 */

import { useState, useEffect, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import Overlay from './components/Overlay';
import { loadApiKey } from './utils/storage';
import { loadConfig, saveConfig } from './utils/storage';

// ---------------------------------------------------------------------------
// URL hash helpers — encode/decode config for OBS Browser Source
// ---------------------------------------------------------------------------

/**
 * Build an OBS-ready URL with all config encoded in the hash.
 * The hash fragment never leaves the browser (not sent to servers).
 */
export function buildObsUrl(apiKey, config) {
  const params = new URLSearchParams();
  params.set('key', apiKey);
  params.set('name', config.playerName);
  params.set('tag', config.playerTag);
  params.set('region', config.region);

  // Encode display fields as comma-separated list of enabled fields
  const enabledFields = Object.entries(config.displayFields)
    .filter(([, v]) => v)
    .map(([k]) => k);
  params.set('show', enabledFields.join(','));

  return `${window.location.origin}${window.location.pathname}#overlay?${params.toString()}`;
}

/**
 * Parse config from the URL hash (e.g. #overlay?key=...&name=...).
 * Returns null if no hash params are present.
 */
function parseHashParams() {
  const hash = window.location.hash; // e.g. "#overlay?key=abc&name=PALS&tag=PRO"
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return null;

  const paramStr = hash.substring(qIndex + 1);
  const params = new URLSearchParams(paramStr);

  const key = params.get('key');
  const name = params.get('name');
  const tag = params.get('tag');
  if (!key || !name || !tag) return null;

  const showRaw = params.get('show') || 'rank,rr,season';
  const showFields = showRaw.split(',');

  return {
    apiKey: key,
    config: {
      playerName: name,
      playerTag: tag,
      region: params.get('region') || 'na',
      displayFields: {
        rank: showFields.includes('rank'),
        rr: showFields.includes('rr'),
        season: showFields.includes('season'),
        peakRank: showFields.includes('peakRank'),
      },
    },
  };
}

// ---------------------------------------------------------------------------
// App component
// ---------------------------------------------------------------------------

export default function App() {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [view, setView] = useState('setup');
  const [apiKey, setApiKey] = useState(() => loadApiKey() || '');
  const [config, setConfig] = useState(loadConfig());

  // ---------------------------------------------------------------------------
  // Initialization — parse URL params or localStorage, set view
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const hash = window.location.hash;

    if (hash.startsWith('#overlay')) {
      setView('overlay');

      // If URL has params (OBS mode), override state from URL
      const fromUrl = parseHashParams();
      if (fromUrl) {
        setApiKey(fromUrl.apiKey);
        setConfig(fromUrl.config);
      }
    }

    const onHashChange = () => {
      if (window.location.hash.startsWith('#overlay')) {
        setView('overlay');
        const fromUrl = parseHashParams();
        if (fromUrl) {
          setApiKey(fromUrl.apiKey);
          setConfig(fromUrl.config);
        }
      } else {
        setView('setup');
        document.documentElement.classList.remove('overlay-mode');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ---------------------------------------------------------------------------
  // Toggle <html> class for transparent background in overlay mode
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (view === 'overlay') {
      document.documentElement.classList.add('overlay-mode');
    } else {
      document.documentElement.classList.remove('overlay-mode');
    }
  }, [view]);

  // ---------------------------------------------------------------------------
  // Persist config on every change (for local browser use)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleApiKeyChange = useCallback((newKey) => {
    setApiKey(newKey);
  }, []);

  const handleConfigChange = useCallback((newConfig) => {
    setConfig(newConfig);
  }, []);

  const handleLaunch = useCallback(() => {
    window.location.hash = 'overlay';
    setView('overlay');
  }, []);

  const handleBack = useCallback(() => {
    window.location.hash = '';
    setView('setup');
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (view === 'overlay') {
    return (
      <Overlay
        apiKey={apiKey}
        config={config}
        onBack={handleBack}
      />
    );
  }

  return (
    <SetupScreen
      apiKey={apiKey}
      onApiKeyChange={handleApiKeyChange}
      config={config}
      onConfigChange={handleConfigChange}
      onLaunch={handleLaunch}
    />
  );
}
