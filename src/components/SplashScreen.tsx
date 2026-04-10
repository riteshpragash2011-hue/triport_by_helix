"use client";

import { useEffect, useState } from "react";

/** Loads the logo PNG and erases near-white pixels so the PNG background
 *  becomes transparent — preserving the actual logo colours. */
function useTransparentLogo(src: string) {
  const [dataUrl, setDataUrl] = useState<string>(src);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const avg = (r + g + b) / 3;
          // Fade to transparent for near-white pixels (the PNG white background)
          // Fully opaque below 215, linearly transparent between 215 → 255
          if (avg > 215) {
            d[i + 3] = Math.max(0, Math.round((1 - (avg - 215) / 40) * d[i + 3]));
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setDataUrl(canvas.toDataURL("image/png"));
      } catch {
        // canvas tainted or unavailable — keep original
      }
    };
    img.src = src;
  }, [src]);

  return dataUrl;
}

export default function SplashScreen() {
  const [visible, setVisible]   = useState(false);
  const [exiting, setExiting]   = useState(false);
  const logoSrc = useTransparentLogo("/logo.png");

  useEffect(() => {
    setVisible(true);
    const exitTimer = setTimeout(() => setExiting(true), 4500);
    const hideTimer = setTimeout(() => setVisible(false), 5400);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-overlay ${exiting ? "splash-exit" : ""}`}>

      {/* Subtle gold grid */}
      <div className="splash-grid" />

      {/* Corner brackets */}
      <div className="splash-corners">
        <span /><span /><span /><span />
      </div>

      {/* Wide light beam sweep */}
      <div className="splash-beam-wrap">
        <div className="splash-beam" />
      </div>

      {/* Horizontal scan line */}
      <div className="splash-scanline" />

      {/* ── Centre content ── */}
      <div className="splash-content">

        <div className="splash-logo-wrap">

          {/* Ambient radial glow that pulses behind the logo */}
          <div className="splash-logo-glow" />

          {/* Logo — 3D-print reveal (clip top→bottom) + slow camera zoom-in */}
          <div className="splash-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="TRIport by Helix"
              className="splash-logo-img"
              width={240}
              height={68}
            />
          </div>

          {/* Glowing nozzle line that travels down as logo is "printed" */}
          <div className="splash-print-line" />

          {/* Metallic shine that sweeps once after reveal */}
          <div className="splash-shine" />

        </div>

        <div className="splash-divider" />
        <p className="splash-tagline">Manufacturing · On Request</p>
        <p className="splash-sub">Helix Project 0002</p>

      </div>

      {/* Bottom progress bar */}
      <div className="splash-progress-bar" />
    </div>
  );
}
