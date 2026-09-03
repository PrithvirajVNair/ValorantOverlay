/**
 * ThemeRenderer.jsx — Dynamic Theme Component Switcher.
 *
 * Renders the requested Theme Component (GlassTheme, RetroPixelTheme).
 */
import React from "react";
import GlassTheme from "./GlassTheme";
import RetroPixelTheme from "./RetroPixelTheme";

export default function ThemeRenderer({
  theme,
  config = {},
  playerDetails,
  children,
  ...props
}) {
  const themeId = theme || config.theme || "glass";
  const scopedConfig = {
    ...config,
    ...(config.themeConfigs?.[themeId] || {}),
  };

  switch (themeId) {
    case "retro":
      return (
        <RetroPixelTheme
          preset={scopedConfig.retroPreset || "rank-dynamic"}
          scanlines={scopedConfig.retroScanlines !== false}
          rankColor={props.rankColor || scopedConfig.rankColor || "#ff4655"}
          playerDetails={playerDetails}
          {...props}
        >
          {children}
        </RetroPixelTheme>
      );

    case "glass":
    default:
      const glassPreset =
        scopedConfig.glassPreset ||
        (["clear", "prism", "ruby", "emerald", "sapphire", "gold", "platinum"].includes(themeId)
          ? themeId
          : "prism");

      return (
        <GlassTheme
          preset={glassPreset}
          glassBlur={scopedConfig.glassBlur}
          refraction={scopedConfig.refraction}
          refractionPower={scopedConfig.refractionPower}
          displacementScale={scopedConfig.displacementScale}
          cornerRadius={scopedConfig.cornerRadius}
          sheenSpeed={scopedConfig.sheenSpeed}
          borderGlow={scopedConfig.borderGlow}
          playerDetails={playerDetails}
          {...props}
        >
          {children}
        </GlassTheme>
      );
  }
}
