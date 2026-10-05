import { ImageResponse } from "next/og";
import { profile, projects } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0c0f",
          backgroundImage: "radial-gradient(circle at 15% 10%, #ff7a5933, transparent 45%)",
          color: "#ecedf0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#9a9fab" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#ff7a59",
              color: "#0b0c0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            sr
          </div>
          srohrer.dev
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, color: "#ff7a59" }}>{profile.role}</div>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>{profile.name}</div>
          <div style={{ fontSize: 36, color: "#c9ccd3", maxWidth: 900 }}>{profile.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {projects.map((p) => (
            <div
              key={p.slug}
              style={{ display: "flex", padding: "10px 18px", borderRadius: 10, border: "1px solid #23262e", fontSize: 24, color: "#9a9fab" }}
            >
              {p.name}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
