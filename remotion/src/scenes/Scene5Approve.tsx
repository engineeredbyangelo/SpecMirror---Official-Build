import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";

export const Scene5Approve: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btnScale = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 200 } });
  const btnPress = frame >= 30 && frame < 35 ? 0.95 : 1;

  const checkSpring = spring({ frame: frame - 35, fps, config: { damping: 10 } });
  const checkScale = interpolate(checkSpring, [0, 1], [0, 1]);
  const checkOpacity = interpolate(checkSpring, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  const approvedOpacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" });
  const approvedY = interpolate(frame, [45, 60], [15, 0], { extrapolateRight: "clamp" });

  const shareOpacity = interpolate(frame, [65, 80], [0, 1], { extrapolateRight: "clamp" });

  const tagOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: "clamp" });
  const brandOpacity = interpolate(frame, [110, 130], [0, 1], { extrapolateRight: "clamp" });

  const float = Math.sin(frame * 0.04) * 2;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          transform: `scale(${Math.min(btnScale, 1) * btnPress}) translateY(${float}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            padding: "14px 48px",
            borderRadius: 8,
            background: frame < 35 ? EMERALD : "transparent",
            border: frame >= 35 ? `2px solid ${EMERALD}` : "none",
            fontSize: 18,
            fontWeight: 600,
            color: frame < 35 ? "#08090f" : EMERALD,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {frame >= 35 && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={EMERALD}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: `scale(${checkScale})`,
                opacity: checkOpacity,
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {frame < 35 ? "Approve Spec" : "Approved"}
        </div>

        <div
          style={{
            opacity: approvedOpacity,
            transform: `translateY(${approvedY}px)`,
            fontSize: 28,
            fontWeight: 700,
            color: EMERALD,
            letterSpacing: "-0.02em",
          }}
        >
          Spec Approved & Ready to Share
        </div>

        <div
          style={{
            opacity: shareOpacity,
            display: "flex",
            gap: 16,
            marginTop: 8,
          }}
        >
          {["Create Encrypted Link", "Share via Slack"].map((label, i) => (
            <div
              key={i}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: `1px solid ${i === 0 ? INDIGO : "rgba(255,255,255,0.1)"}`,
                background: i === 0 ? `${INDIGO}15` : "transparent",
                fontSize: 14,
                fontWeight: 500,
                color: i === 0 ? INDIGO : "#a1a1aa",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          opacity: tagOpacity,
          fontSize: 20,
          color: "#71717a",
          letterSpacing: "-0.01em",
        }}
      >
        Ship specs, not confusion.
      </div>

      {/* Brand */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          opacity: brandOpacity,
          fontSize: 28,
          fontWeight: 700,
          color: "white",
          letterSpacing: "-0.02em",
        }}
      >
        specmirror<span style={{ color: INDIGO }}>.one</span>
      </div>
    </AbsoluteFill>
  );
};
