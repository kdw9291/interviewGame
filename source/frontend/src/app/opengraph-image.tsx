import { ImageResponse } from "next/og";

export const alt = "억까 면접관 살아남기 — 진실의 면접실";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c140d",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(201,162,39,0.12) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(201,162,39,0.1) 0%, transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "56px 80px",
            border: "3px solid #c9a227",
            borderRadius: 4,
            backgroundColor: "rgba(43,29,20,0.55)",
          }}
        >
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#e8c766",
              marginBottom: 20,
            }}
          >
            진실의 면접실 · TRUTH INTERVIEW ROOM
          </span>
          <span
            style={{
              fontSize: 78,
              fontWeight: 800,
              color: "#f4ecd8",
              marginBottom: 24,
            }}
          >
            억까 면접관 살아남기
          </span>
          <span style={{ fontSize: 28, color: "rgba(244,236,216,0.75)" }}>
            상식이 통하지 않는 AI 면접관과의 생존 게임
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
