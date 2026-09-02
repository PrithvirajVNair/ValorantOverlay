/**
 * App.jsx — Main Application Routing & OBS URL Generator.
 *
 * Supports game routing:
 *   - /                 — Multi-game Hub
 *   - /valorant         — VALORANT Sidebar Studio (Dashboard, Themes, Layouts, Preview)
 *   - /pubg             — PUBG Setup Screen
 *   - /overlay/valorant — VALORANT OBS Browser Source View
 *   - /overlay/pubg     — PUBG OBS Browser Source View
 */

import { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import GameSelector from "./components/GameSelector";
import SetupScreen from "./components/SetupScreen";
import PubgSetupScreen from "./components/PubgSetupScreen";
import Overlay from "./components/Overlay";
import PubgOverlay from "./components/PubgOverlay";
import {
  loadApiKey,
  saveApiKey,
  loadConfig,
  saveConfig,
  loadPubgApiKey,
  savePubgApiKey,
} from "./utils/storage";

/**
 * Build an OBS-ready URL for VALORANT.
 */
export function buildObsUrl(apiKey, config) {
  const params = new URLSearchParams();
  if (apiKey) params.set("key", apiKey);
  params.set("name", config.playerName);
  params.set("tag", config.playerTag);
  params.set("region", config.region);
  if (config.theme) params.set("theme", config.theme);
  if (config.layout) params.set("layout", config.layout);
  if (config.glassBlur) params.set("glassBlur", config.glassBlur);
  if (config.refraction !== undefined)
    params.set("refract", config.refraction ? "1" : "0");
  if (config.refractionPower !== undefined)
    params.set("power", String(config.refractionPower));
  if (config.displacementScale !== undefined)
    params.set("scale", String(config.displacementScale));
  else if (config.lensZoom !== undefined)
    params.set("zoom", String(config.lensZoom));
  if (config.cornerRadius !== undefined)
    params.set("radius", String(config.cornerRadius));
  if (config.glowOpacity !== undefined)
    params.set("glow", String(config.glowOpacity));
  if (config.sheenSpeed) params.set("sheen", config.sheenSpeed);
  if (config.borderGlow !== undefined)
    params.set("border", config.borderGlow ? "1" : "0");

  const enabledFields = Object.entries(config.displayFields || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  params.set("show", enabledFields.join(","));

  return `${window.location.origin}${window.location.pathname}#/overlay/valorant?${params.toString()}`;
}

/**
 * Build an OBS-ready URL for PUBG.
 */
export function buildPubgObsUrl(apiKey, config) {
  const params = new URLSearchParams();
  if (apiKey) params.set("key", apiKey);
  params.set("name", config.playerName || "Player");
  params.set("platform", config.platform || "steam");

  const fields = config.displayFields || {
    rank: true,
    kd: true,
    wins: true,
    damage: true,
    matches: true,
  };
  const enabled = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k]) => k);
  params.set("show", enabled.join(","));

  return `${window.location.origin}${window.location.pathname}#/overlay/pubg?${params.toString()}`;
}

/** Helper component to set html class in overlay mode */
function RouteWatcher() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/overlay")) {
      document.documentElement.classList.add("overlay-mode");
    } else {
      document.documentElement.classList.remove("overlay-mode");
    }
  }, [location.pathname]);

  return null;
}

/** Game Selection / Hub Page (/) */
function GameSelectionPage() {
  const navigate = useNavigate();
  return (
    <GameSelector
      onSelectGame={(gameId) => {
        if (gameId === "valorant") navigate("/valorant");
        else if (gameId === "pubg") navigate("/pubg");
      }}
    />
  );
}

/** VALORANT Setup Page (/valorant) */
function ValorantSetupPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(() => loadApiKey() || "");
  const [config, setConfig] = useState(() => loadConfig());

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleApiKeyChange = (newKey) => {
    setApiKey(newKey);
    if (newKey) saveApiKey(newKey);
  };

  const handleLaunch = () => {
    const obsUrl = buildObsUrl(apiKey, config);
    window.location.hash = obsUrl.split("#")[1];
  };

  return (
    <SetupScreen
      apiKey={apiKey}
      onApiKeyChange={handleApiKeyChange}
      config={config}
      onConfigChange={handleConfigChange}
      onLaunch={handleLaunch}
      onChangeGame={() => navigate("/")}
    />
  );
}

/** PUBG Setup Page (/pubg) */
function PubgSetupPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(() => loadPubgApiKey() || "");
  const [config, setConfig] = useState(() => {
    const saved = loadConfig();
    return {
      playerName: saved.playerName || "",
      platform: saved.platform || "steam",
      displayFields: saved.displayFields || {
        rank: true,
        kd: true,
        wins: true,
        damage: true,
        matches: true,
      },
    };
  });

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleApiKeyChange = (newKey) => {
    setApiKey(newKey);
    if (newKey) savePubgApiKey(newKey);
  };

  const handleLaunch = () => {
    const params = new URLSearchParams();
    if (apiKey) params.set("key", apiKey);
    if (config.playerName) params.set("name", config.playerName);
    if (config.platform) params.set("platform", config.platform);
    navigate(`/overlay/pubg?${params.toString()}`);
  };

  return (
    <PubgSetupScreen
      apiKey={apiKey}
      onApiKeyChange={handleApiKeyChange}
      config={config}
      onConfigChange={handleConfigChange}
      onLaunch={handleLaunch}
      onChangeGame={() => navigate("/")}
    />
  );
}

/** VALORANT Overlay Page (/overlay/valorant) */
function ValorantOverlayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const savedConfig = loadConfig();

  const apiKey = searchParams.get("key") || loadApiKey() || "";
  const name = searchParams.get("name") || savedConfig.playerName || "";
  const tag = searchParams.get("tag") || savedConfig.playerTag || "";
  const region = searchParams.get("region") || savedConfig.region || "na";
  const theme = searchParams.get("theme") || savedConfig.theme || "prism";
  const layout = searchParams.get("layout") || savedConfig.layout || "card";
  const glassBlur =
    searchParams.get("glassBlur") || savedConfig.glassBlur || "high";
  const refractRaw = searchParams.get("refract");
  const refraction =
    refractRaw !== null
      ? refractRaw === "1"
      : savedConfig.refraction !== undefined
      ? savedConfig.refraction
      : true;

  const powerRaw = searchParams.get("power");
  const refractionPower = powerRaw !== null ? parseInt(powerRaw, 10) : (savedConfig.refractionPower ?? 18);

  const scaleRaw = searchParams.get("scale");
  const zoomRaw = searchParams.get("zoom");
  const displacementScale = scaleRaw !== null
    ? parseInt(scaleRaw, 10)
    : (savedConfig.displacementScale ?? Math.round((savedConfig.lensZoom ?? 1.0) * 100));
  // Kept only so old shared OBS URLs using `zoom` keep their exact behavior.
  const lensZoom = zoomRaw !== null ? parseFloat(zoomRaw) : (savedConfig.lensZoom ?? 1.0);
  const radiusRaw = searchParams.get("radius");
  const cornerRadius = radiusRaw !== null ? parseInt(radiusRaw, 10) : (savedConfig.cornerRadius ?? 20);

  const glowRaw = searchParams.get("glow");
  const glowOpacity = glowRaw !== null ? parseFloat(glowRaw) : (savedConfig.glowOpacity ?? 0.0);
  const sheenSpeed = searchParams.get("sheen") || savedConfig.sheenSpeed || "normal";
  const borderRaw = searchParams.get("border");
  const borderGlow = borderRaw !== null ? borderRaw === "1" : (savedConfig.borderGlow !== undefined ? savedConfig.borderGlow : true);

  const showRaw = searchParams.get("show") || "rank,rr,season,peakRank";
  const showFields = showRaw.split(",");

  const config = {
    playerName: name,
    playerTag: tag,
    region,
    theme,
    layout,
    glassBlur,
    refraction,
    refractionPower,
    displacementScale,
    cornerRadius,
    lensZoom,
    glowOpacity,
    sheenSpeed,
    borderGlow,
    displayFields: {
      rank: showFields.includes("rank"),
      rr: showFields.includes("rr"),
      season: showFields.includes("season"),
      peakRank: showFields.includes("peakRank"),
    },
  };

  return (
    <Overlay
      apiKey={apiKey}
      config={config}
      onBack={() => navigate("/valorant")}
    />
  );
}

/** PUBG Overlay Page (/overlay/pubg) */
function PubgOverlayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const savedConfig = loadConfig();

  const apiKey = searchParams.get("key") || loadPubgApiKey() || "";
  const name = searchParams.get("name") || savedConfig.playerName || "";
  const platform =
    searchParams.get("platform") || savedConfig.platform || "steam";
  const showRaw = searchParams.get("show") || "rank,kd,wins,damage,matches";
  const showFields = showRaw.split(",");

  const config = {
    playerName: name,
    platform,
    displayFields: {
      rank: showFields.includes("rank"),
      kd: showFields.includes("kd"),
      wins: showFields.includes("wins"),
      damage: showFields.includes("damage"),
      matches: showFields.includes("matches"),
    },
  };

  return (
    <PubgOverlay
      apiKey={apiKey}
      config={config}
      onBack={() => navigate("/pubg")}
    />
  );
}

/** Generic Fallback Overlay Page (/overlay) */
function GenericOverlayPage() {
  const [searchParams] = useSearchParams();
  const game = searchParams.get("game");

  if (game === "pubg") {
    return <PubgOverlayPage />;
  }

  return <ValorantOverlayPage />;
}

export default function App() {
  return (
    <HashRouter>
      <RouteWatcher />
      <Routes>
        <Route path="/" element={<GameSelectionPage />} />
        <Route path="/valorant" element={<ValorantSetupPage />} />
        <Route path="/pubg" element={<PubgSetupPage />} />
        <Route path="/overlay/valorant" element={<ValorantOverlayPage />} />
        <Route path="/overlay/pubg" element={<PubgOverlayPage />} />
        <Route path="/overlay" element={<GenericOverlayPage />} />
        <Route path="*" element={<GameSelectionPage />} />
      </Routes>
    </HashRouter>
  );
}
