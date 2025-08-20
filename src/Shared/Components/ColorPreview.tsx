"use client";

import React from "react";
import { useAppSelector } from "@/Redux/Hooks";
import { useTranslation } from "@/app/i18n/client";

type Palette = Record<string, string>;

const isDarkColor = (hex: string): boolean => {
  if (
    !hex ||
    typeof hex !== "string" ||
    !hex.startsWith("#") ||
    (hex.length !== 7 && hex.length !== 4)
  )
    return false;
  const parse = (h: string) =>
    h.length === 4
      ? parseInt(h[1] + h[1] + h[2] + h[2] + h[3] + h[3], 16)
      : parseInt(h.slice(1), 16);
  const n = parse(hex);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 150;
};

const normalizeHex = (hex: string): string | null => {
  if (!hex || typeof hex !== "string") return null;
  const h = hex.trim().toLowerCase();
  if (!h.startsWith("#")) return null;
  if (h.length === 4 && /^#[0-9a-f]{3}$/.test(h))
    return "#" + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  if (h.length === 7 && /^#[0-9a-f]{6}$/.test(h)) return h;
  return null;
};

const hexToRgb = (hex: string) => {
  const n = normalizeHex(hex);
  if (!n) return null;
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  return { r, g, b };
};

const rgbToHsl = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
};

const sortByColor = (aHex: string, bHex: string) => {
  const aRgb = hexToRgb(aHex);
  const bRgb = hexToRgb(bHex);
  if (!aRgb && !bRgb) return 0;
  if (!aRgb) return 1;
  if (!bRgb) return -1;

  const a = rgbToHsl(aRgb);
  const b = rgbToHsl(bRgb);

  const aGray = a.s < 0.05;
  const bGray = b.s < 0.05;
  if (aGray !== bGray) return aGray ? 1 : -1;
  if (a.h !== b.h) return a.h - b.h;
  if (a.s !== b.s) return b.s - a.s;
  if (a.l !== b.l) return a.l - b.l;
  return 0;
};

const ColorPreview: React.FC<{ palette: Palette }> = ({ palette }) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { t } = useTranslation(i18LangStatus);

  const entries = Object.entries(palette || {});
  const sorted = React.useMemo(
    () => entries.slice().sort((a, b) => sortByColor(a[1], b[1])),
    [entries]
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        maxHeight: "60vh",
        overflowY: "auto",
        paddingRight: 12,
      }}
    >
      {sorted.length === 0 ? (
        <div>{t("No colors found in API payload.")}</div>
      ) : (
        sorted.map(([key, hex]) => {
          const darkBackground = isDarkColor(hex);
          return (
            <div
              key={key}
              title={`${key}: ${hex}`}
              style={{
                backgroundColor: hex,
                height: 40,
                width: "calc(33.333% - 8px)",
                borderRadius: 8,
                padding: 4,
                border: "1px solid #dcdcdc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: darkBackground ? "#fff" : "#000",
                fontSize: 12,
                fontWeight: 500,
                minWidth: 100,
                flexGrow: 1,
              }}
            >
              {hex}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ColorPreview;
