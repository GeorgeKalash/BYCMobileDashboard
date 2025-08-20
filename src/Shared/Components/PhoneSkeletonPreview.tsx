"use client";

import React from "react";

type Palette = Record<string, string>;

const PhoneSkeletonPreview: React.FC<{
  height?: number | string;
  palette: Palette;
}> = ({ height = "60vh", palette }) => {
  const pick = (k: string, fb: string) =>
    palette?.[k] ? String(palette[k]) : fb;

  const bg = pick("ColorOne", "#F4F4F4");
  const card = pick("surface", "#FFFFFF");
  const border = pick("ColorFiftyThree", "#E6E6E6");
  const bar = pick("ColorThirtySix", "#EDEDED");
  const header = pick("ColorThirteen", "#334155");
  const accent = pick("ColorNine", "#0EA5B7");

  return (
    <div>
      <style>{`
      @keyframes shimmer {
        0% { background-position: -480px 0; }
        100% { background-position: 480px 0; }
      }
      .skel {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        background: ${bar};
      }
      .skel:after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.6), rgba(255,255,255,0));
        background-size: 480px 100%;
        animation: shimmer 1.6s infinite;
        mix-blend-mode: screen;
      }
    `}</style>

      <div
        style={{
          width: 290,
          height,
          borderRadius: 36,
          background:
            "linear-gradient(145deg, rgba(20,20,20,.95), rgba(38,38,38,.98))",
          boxShadow:
            "0 12px 28px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.06)",
          padding: 10,
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 28,
            background: bg,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 22,
              background: "#0F0F10",
              borderBottomLeftRadius: 14,
              borderBottomRightRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: "rgba(255,255,255,.25)",
              }}
            />
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "rgba(0,153,255,.5)",
              }}
            />
          </div>

          <div
            style={{
              height: 180,
              background: `linear-gradient(180deg, ${header}, ${accent})`,
              borderBottomRightRadius: 28,
              position: "relative",
              paddingTop: 40,
              paddingInline: 16,
              color: "#fff",
            }}
          >
            <div
              className="skel"
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                width: 36,
                height: 36,
                borderRadius: 999,
                background: "rgba(255,255,255,.15)",
              }}
            />
            <div
              className="skel"
              style={{
                position: "absolute",
                top: 22,
                right: 18,
                width: 80,
                height: 24,
                borderRadius: 16,
                background: "rgba(255,255,255,.22)",
              }}
            />
            <div style={{ marginTop: 48, display: "flex", gap: 10 }}>
              <div className="skel" style={{ width: 120, height: 12 }} />
              <div className="skel" style={{ width: 60, height: 12 }} />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              background: `linear-gradient(180deg, ${accent}, ${accent})`,
              borderBottomRightRadius: 150,
              borderBottomLeftRadius: 150,
              borderTopRightRadius: 150,
              borderTopLeftRadius: 0,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 18,
                height: 80,
                background: card,
                border: `1px solid ${border}`,
                boxShadow: "0 6px 16px rgba(0,0,0,.08)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    background: bg,
                    borderRadius: 14,
                    padding: 10,
                    height: 60,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div
                    className="skel"
                    style={{ width: "100%", height: 40, borderRadius: 12 }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              marginInline: 14,
              borderRadius: 16,
              overflow: "hidden",
              background: card,
              border: `1px solid ${border}`,
            }}
          >
            <div className="skel" style={{ height: 90, borderRadius: 0 }} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                padding: 8,
              }}
            >
              {[0, 1, 2, 3].map((d) => (
                <div
                  key={d}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: d === 1 ? accent : border,
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 8,
              marginInline: 14,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="skel" style={{ width: 40, height: 12 }} />
            <div className="skel" style={{ width: 80, height: 12 }} />
          </div>
          <div
            style={{ marginTop: 8, marginInline: 14, display: "grid", gap: 10 }}
          >
            {[0, 1, 2].map((r) => (
              <div
                key={r}
                style={{
                  background: card,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div>
                  <div className="skel" style={{ width: "55%", height: 12 }} />
                  <div
                    className="skel"
                    style={{ width: "35%", height: 10, marginTop: 8 }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    className="skel"
                    style={{ width: 70, height: 10, borderRadius: 8 }}
                  />
                  <div
                    className="skel"
                    style={{
                      width: 66,
                      height: 22,
                      borderRadius: 999,
                      background: pick("ColorFifteen", "#FBF1DD"),
                    }}
                  />
                  <div
                    className="skel"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "#eee",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              marginInline: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  background: card,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  padding: 12,
                }}
              >
                <div className="skel" style={{ width: "40%", height: 10 }} />
                <div
                  className="skel"
                  style={{ width: "100%", height: 12, marginTop: 10 }}
                />
                <div
                  className="skel"
                  style={{ width: "70%", height: 8, marginTop: 8 }}
                />
              </div>
            ))}
          </div>

          <div style={{ position: "absolute", left: 0, right: 0, bottom: 14 }}>
            <div
              style={{
                marginInline: 14,
                background: card,
                border: `1px solid ${border}`,
                borderRadius: 18,
                padding: 10,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                alignItems: "center",
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{ display: "grid", placeItems: "center", gap: 6 }}
                >
                  <div
                    className="skel"
                    style={{ width: 18, height: 18, borderRadius: 6 }}
                  />
                  <div className="skel" style={{ width: "60%", height: 8 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSkeletonPreview;
