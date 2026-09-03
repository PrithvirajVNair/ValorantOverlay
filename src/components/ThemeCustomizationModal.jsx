/**
 * ThemeCustomizationModal.jsx — Modal Dialog for Fine-Tuning Theme Components.
 *
 * Provides a theme-specific settings modal with presets, HUD layouts, glass optics,
 * laser glow intensity, tactical armor options, and corner radius tuning.
 */

import React from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, CreditCard, Layout, Shield, Gem, Gamepad2, Eye } from "lucide-react";
import { VALORANT_LAYOUTS, VALORANT_THEMES, THEME_COMPONENTS } from "../data/themeRegistry";
import { RETRO_PRESETS } from "./themes/RetroPixelTheme";
import ThemeRenderer from "./themes/ThemeRenderer";

const LAYOUT_ICONS = {
  card: CreditCard,
  capsule: Layout,
  banner: Layout,
  minimal: Sparkles,
};

export default function ThemeCustomizationModal({
  isOpen,
  themeId = "glass",
  config = {},
  onConfigChange,
  onClose,
}) {
  if (!isOpen) return null;

  const currentThemeObj =
    THEME_COMPONENTS.find((tc) => tc.id === themeId) || THEME_COMPONENTS[0];

  const activeScopedConfig = {
    ...config,
    theme: themeId,
    ...(config.themeConfigs?.[themeId] || {}),
  };

  const handleFieldChange = (field, value) => {
    onConfigChange({
      ...config,
      themeConfigs: {
        ...(config.themeConfigs || {}),
        [themeId]: {
          ...(config.themeConfigs?.[themeId] || {}),
          [field]: value,
        },
      },
    });
  };

  return createPortal(
    <div style={s.overlay} className="site-ui fade-in" id="theme-customization-modal-overlay">
      <div style={s.modal} id="theme-customization-modal">
        {/* Modal Header */}
        <div style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={s.iconWrapper}>
              <Gem size={20} color="#ff4655" aria-hidden="true" />
            </div>
            <div>
              <h3 style={s.title}>{currentThemeObj.name} Customization</h3>
              <p style={s.subtitle}>{currentThemeObj.desc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={s.closeBtn}
            title="Close modal"
            id="close-theme-modal-btn"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* PINNED FIXED LIVE PREVIEW STAGE (Does not scroll) */}
        <div style={s.pinnedPreviewSection} id="modal-pinned-preview">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "14px 16px",
              borderRadius: "0px",
              background: "radial-gradient(circle at center, rgba(16, 26, 42, 0.95) 0%, rgba(8, 12, 20, 0.98) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              boxShadow: "inset 0 0 24px rgba(0,0,0,0.6)",
            }}
            id="modal-live-preview-box"
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Eye size={14} color="#38bdf8" />
                <span style={{ fontSize: 11, fontWeight: 800, color: "#38bdf8", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  Live Theme Preview
                </span>
              </div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                Fixed Interactive Stage
              </span>
            </div>

            {/* Live Component Stage */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "6px 0" }}>
              <ThemeRenderer theme={themeId} config={activeScopedConfig} rankColor="#b489c4">
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 14px" }}>
                  <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img
                      src="https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/20/largeicon.png"
                      alt="Diamond 3"
                      style={{ width: 44, height: 44, filter: "drop-shadow(0 0 8px rgba(180,137,196,0.6))" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Streamer</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>#LIVE</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#b489c4" }}>Diamond 3</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)", padding: "1px 6px", borderRadius: "0px" }}>
                        78 RR
                      </span>
                    </div>
                  </div>
                </div>
              </ThemeRenderer>
            </div>
          </div>
        </div>

        {/* Modal Body (Scrollable Controls Area) */}
        <div style={s.body}>
          {/* ============================================================ */}
          {/* 1. GLASS THEME CUSTOMIZATION                                 */}
          {/* ============================================================ */}
          {themeId === "glass" && (
            <>
              {/* Presets */}
              <div style={s.section}>
                <h4 style={s.sectionHeader}>Visual Color Presets</h4>
                <div style={s.themeGrid}>
                  {VALORANT_THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleFieldChange("glassPreset", t.id)}
                      style={{
                        ...s.presetCard,
                        ...(activeScopedConfig.glassPreset === t.id ||
                        (!activeScopedConfig.glassPreset && t.id === "prism")
                          ? s.presetCardActive
                          : {}),
                      }}
                      id={`preset-btn-${t.id}`}
                    >
                      <div style={{ ...s.swatch, background: t.color }} />
                      <div style={{ textAlign: "left" }}>
                        <strong style={{ display: "block", fontSize: 13, color: "#fff" }}>
                          {t.name}
                        </strong>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                          {t.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* HUD Layouts */}
              <div style={s.section}>
                <h4 style={s.sectionHeader}>HUD Layout Designs</h4>
                <div style={s.layoutGrid}>
                  {VALORANT_LAYOUTS.map((layoutItem) => (
                    <button
                      key={layoutItem.id}
                      type="button"
                      onClick={() => handleFieldChange("layout", layoutItem.id)}
                      style={{
                        ...s.layoutCard,
                        ...(activeScopedConfig.layout === layoutItem.id ||
                        (!activeScopedConfig.layout && layoutItem.id === "card")
                          ? s.layoutCardActive
                          : {}),
                      }}
                      id={`layout-btn-${layoutItem.id}`}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <strong style={{ fontSize: 13, color: "#fff" }}>
                          {layoutItem.name}
                        </strong>
                        <span style={s.badgePill}>{layoutItem.badge}</span>
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          color: "rgba(255,255,255,0.65)",
                          textAlign: "left",
                          marginTop: 4,
                        }}
                      >
                        {layoutItem.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine-Tuning Optics Controls */}
              <div style={s.section}>
                <h4 style={s.sectionHeader}>Optics & Refraction Controls</h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <div style={s.inputGroup}>
                    <label style={s.label}>Frosted Glass Blur</label>
                    <select
                      value={activeScopedConfig.glassBlur || "high"}
                      onChange={(e) => handleFieldChange("glassBlur", e.target.value)}
                      style={s.select}
                      id="modal-blur-select"
                    >
                      <option value="high">Max Blur (14px)</option>
                      <option value="medium">Medium Blur (8px)</option>
                      <option value="low">Subtle Blur (4px)</option>
                    </select>
                  </div>

                  <div style={s.inputGroup}>
                    <label style={s.label}>Border Lens Distortion</label>
                    <button
                      type="button"
                      onClick={() => handleFieldChange("refraction", !activeScopedConfig.refraction)}
                      style={{
                        ...s.toggleChip,
                        background:
                          activeScopedConfig.refraction !== false
                            ? "rgba(45, 212, 168, 0.2)"
                            : "rgba(255,255,255,0.06)",
                        borderColor:
                          activeScopedConfig.refraction !== false
                            ? "var(--val-success)"
                            : "var(--val-border)",
                      }}
                      id="modal-toggle-refraction-btn"
                    >
                      {activeScopedConfig.refraction !== false ? (
                        <>
                          <Sparkles size={14} aria-hidden="true" /> Glass Lens ON
                        </>
                      ) : (
                        "Off"
                      )}
                    </button>
                  </div>

                  <div style={s.inputGroup}>
                    <label style={s.label}>
                      Distortion Strength ({activeScopedConfig.refractionPower ?? 18})
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={activeScopedConfig.refractionPower ?? 18}
                      disabled={activeScopedConfig.refraction === false}
                      onChange={(e) =>
                        handleFieldChange("refractionPower", parseInt(e.target.value, 10))
                      }
                      style={s.slider}
                      id="modal-refraction-power-slider"
                    />
                  </div>

                  <div style={s.inputGroup}>
                    <label style={s.label}>
                      Displacement Scale ({activeScopedConfig.displacementScale ?? 100})
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="200"
                      step="1"
                      value={activeScopedConfig.displacementScale ?? 100}
                      disabled={activeScopedConfig.refraction === false}
                      onChange={(e) =>
                        handleFieldChange("displacementScale", parseInt(e.target.value, 10))
                      }
                      style={s.slider}
                      id="modal-displacement-scale-slider"
                    />
                  </div>

                  <div style={s.inputGroup}>
                    <label style={s.label}>
                      Corner Radius ({activeScopedConfig.cornerRadius ?? 20}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={activeScopedConfig.cornerRadius ?? 20}
                      onChange={(e) =>
                        handleFieldChange("cornerRadius", parseInt(e.target.value, 10))
                      }
                      style={s.slider}
                      id="modal-radius-slider"
                    />
                  </div>

                  <div style={s.inputGroup}>
                    <label style={s.label}>Light Sheen Speed</label>
                    <select
                      value={activeScopedConfig.sheenSpeed || "normal"}
                      onChange={(e) => handleFieldChange("sheenSpeed", e.target.value)}
                      style={s.select}
                      id="modal-sheen-select"
                    >
                      <option value="fast">Fast (3s)</option>
                      <option value="normal">Normal (6s)</option>
                      <option value="slow">Slow (10s)</option>
                      <option value="off">Off</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* 2. NEON CYBER THEME CUSTOMIZATION                            */}
          {/* ============================================================ */}
          {themeId === "neon" && (
            <>
              <div style={s.section}>
                <h4 style={s.sectionHeader}>Neon Color Channels</h4>
                <div style={s.themeGrid}>
                  {NEON_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleFieldChange("neonPreset", p.id)}
                      style={{
                        ...s.presetCard,
                        ...(activeScopedConfig.neonPreset === p.id ||
                        (!activeScopedConfig.neonPreset && p.id === "cyber-pink")
                          ? s.presetCardActive
                          : {}),
                      }}
                      id={`neon-preset-${p.id}`}
                    >
                      <div
                        style={{
                          ...s.swatch,
                          background: p.color,
                          boxShadow: `0 0 10px ${p.glow}`,
                        }}
                      />
                      <strong style={{ fontSize: 13, color: "#fff" }}>{p.name}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.section}>
                <h4 style={s.sectionHeader}>Laser Glow Controls</h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  <div style={s.inputGroup}>
                    <label style={s.label}>Glow Intensity</label>
                    <select
                      value={activeScopedConfig.glowIntensity || "high"}
                      onChange={(e) => handleFieldChange("glowIntensity", e.target.value)}
                      style={s.select}
                    >
                      <option value="high">Max Glow (36px)</option>
                      <option value="medium">Medium Glow (24px)</option>
                      <option value="low">Soft Glow (12px)</option>
                    </select>
                  </div>

                  <div style={s.inputGroup}>
                    <label style={s.label}>
                      Corner Radius ({activeScopedConfig.cornerRadius ?? 12}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={activeScopedConfig.cornerRadius ?? 12}
                      onChange={(e) =>
                        handleFieldChange("cornerRadius", parseInt(e.target.value, 10))
                      }
                      style={s.slider}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* 3. TACTICAL MILITARY THEME CUSTOMIZATION                     */}
          {/* ============================================================ */}
          {themeId === "tactical" && (
            <>
              <div style={s.section}>
                <h4 style={s.sectionHeader}>Tactical Armor Camo Presets</h4>
                <div style={s.themeGrid}>
                  {TACTICAL_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleFieldChange("tacticalPreset", p.id)}
                      style={{
                        ...s.presetCard,
                        ...(activeScopedConfig.tacticalPreset === p.id ||
                        (!activeScopedConfig.tacticalPreset && p.id === "pubg-amber")
                          ? s.presetCardActive
                          : {}),
                      }}
                      id={`tactical-preset-${p.id}`}
                    >
                      <div style={{ ...s.swatch, background: p.primary }} />
                      <strong style={{ fontSize: 13, color: "#fff" }}>{p.name}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.section}>
                <h4 style={s.sectionHeader}>Armor Edits</h4>
                <div style={s.inputGroup}>
                  <label style={s.label}>
                    Corner Radius ({activeScopedConfig.cornerRadius ?? 8}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="1"
                    value={activeScopedConfig.cornerRadius ?? 8}
                    onChange={(e) =>
                      handleFieldChange("cornerRadius", parseInt(e.target.value, 10))
                    }
                    style={s.slider}
                  />
                </div>
              </div>
            </>
          )}

          {/* ============================================================ */}
          {/* 4. RETRO ARCADE THEME CUSTOMIZATION                          */}
          {/* ============================================================ */}
          {themeId === "retro" && (
            <>
              <div style={s.section}>
                <h4 style={s.sectionHeader}>Retro Pixel Arcade Presets</h4>
                <div style={s.themeGrid}>
                  {RETRO_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleFieldChange("retroPreset", p.id)}
                      style={{
                        ...s.presetCard,
                        ...(activeScopedConfig.retroPreset === p.id ||
                        (!activeScopedConfig.retroPreset && p.id === "rank-dynamic")
                          ? s.presetCardActive
                          : {}),
                      }}
                      id={`retro-preset-${p.id}`}
                    >
                      <div style={{ ...s.swatch, background: p.border }} />
                      <strong style={{ fontSize: 13, color: "#fff" }}>{p.name}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.section}>
                <h4 style={s.sectionHeader}>Arcade Screen Effects</h4>
                <div style={s.inputGroup}>
                  <label style={s.label}>CRT Arcade Scanlines</label>
                  <button
                    type="button"
                    onClick={() =>
                      handleFieldChange(
                        "retroScanlines",
                        activeScopedConfig.retroScanlines === false
                      )
                    }
                    style={{
                      ...s.toggleChip,
                      background:
                        activeScopedConfig.retroScanlines !== false
                          ? "rgba(45, 212, 168, 0.2)"
                          : "rgba(255,255,255,0.06)",
                      borderColor:
                        activeScopedConfig.retroScanlines !== false
                          ? "var(--val-success)"
                          : "var(--val-border)",
                    }}
                    id="retro-toggle-scanlines-btn"
                  >
                    {activeScopedConfig.retroScanlines !== false
                      ? "CRT Scanlines ON"
                      : "Off (Clean Pixel)"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div style={s.footer}>
          <button
            type="button"
            onClick={onClose}
            style={s.doneBtn}
            id="done-theme-modal-btn"
          >
            Done Customizing
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const s = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(4, 7, 12, 0.85)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    zIndex: 999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: 640,
    maxHeight: "85vh",
    margin: "auto",
    background: "rgba(16, 23, 34, 0.96)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "0px",
    boxShadow: "0 24px 72px rgba(0,0,0,0.9)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
  },
  pinnedPreviewSection: {
    padding: "14px 24px",
    background: "rgba(10, 16, 26, 0.98)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
    flexShrink: 0,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: "0px",
    background: "rgba(255, 70, 85, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: 800,
    color: "#fff",
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    margin: 0,
  },
  closeBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.8)",
    width: 32,
    height: 32,
    borderRadius: "0px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.9)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: 0,
  },
  themeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "10px",
  },
  presetCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "0px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    textAlign: "left",
  },
  presetCardActive: {
    background: "rgba(255, 70, 85, 0.18)",
    borderColor: "#ff4655",
  },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: "0px",
    flexShrink: 0,
  },
  layoutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  layoutCard: {
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    borderRadius: "0px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
  },
  layoutCardActive: {
    background: "rgba(255, 70, 85, 0.18)",
    borderColor: "#ff4655",
  },
  badgePill: {
    fontSize: 10,
    fontWeight: 700,
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "0px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.75)",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "0px",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: 13,
    outline: "none",
  },
  slider: {
    accentColor: "#ff4655",
    width: "100%",
    cursor: "pointer",
  },
  toggleChip: {
    padding: "8px 12px",
    borderRadius: "0px",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.2)",
    display: "flex",
    justifyContent: "flex-end",
  },
  doneBtn: {
    padding: "10px 24px",
    borderRadius: "0px",
    background: "linear-gradient(135deg, #ff4655, #ff2a4b)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(255, 70, 85, 0.4)",
  },
};
