"use client";

import { useEffect, useState } from "react";

/** Strips the white PNG background via canvas so the real logo colours show. */
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
          const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
          if (avg > 215) {
            d[i + 3] = Math.max(0, Math.round((1 - (avg - 215) / 40) * d[i + 3]));
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setDataUrl(canvas.toDataURL("image/png"));
      } catch { /* keep original */ }
    };
    img.src = src;
  }, [src]);

  return dataUrl;
}

interface Props {
  userName: string;
  onComplete: () => void;
}

export default function AdminLoginAnimation({ userName, onComplete }: Props) {
  const [exiting, setExiting] = useState(false);
  const logoSrc = useTransparentLogo("/logo.png");

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 4400);
    const doneTimer = setTimeout(() => onComplete(), 5100);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div className={`admin-anim-overlay ${exiting ? "admin-anim-exit" : ""}`}>
      {/* Grid background */}
      <div className="admin-anim-grid" />

      {/* Corner brackets */}
      <div className="admin-anim-corners">
        <span /><span /><span /><span />
      </div>

      {/* Concentric rings + logo */}
      <div className="admin-anim-ring-wrap">
        <div className="admin-anim-ring-outer" />
        <div className="admin-anim-ring-mid" />
        <div className="admin-anim-ring-inner" />
        <div className="admin-anim-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="TRIport"
            width={56}
            height={16}
            className="admin-anim-logo-img"
          />
        </div>
      </div>

      {/* Text lines */}
      <p className="admin-anim-verified">Identity Verified</p>
      <p className="admin-anim-name">Welcome, {userName}</p>

      {/* Loading bar */}
      <div className="admin-anim-bar-wrap">
        <div className="admin-anim-bar-fill" />
      </div>

      <p className="admin-anim-status">Entering Admin Portal</p>
    </div>
  );
}
