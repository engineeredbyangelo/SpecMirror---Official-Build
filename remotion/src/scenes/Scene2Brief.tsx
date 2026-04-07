import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";

const BRIEF_LINES = [
  "I want to build a fitness tracking app for",
  "personal trainers and their clients. Trainers",
  "can create custom workout plans, track client",
  "progress, and handle payments. Clients get a",
  "mobile app to log workouts and see their stats.",
];

export const Scene2Brief: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const cardScale = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 150 } });

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
          opacity: labelOpacity,
          fontSize: 14,
          fontWeight: 600,
          color: INDIGO,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginBottom: 24,
        }}
      >
        Step 1 — Write your brief
      </div>

      <div
        style={{
          transform: `scale(${Math.min(cardScale, 1)})`,
          width: 780,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "40px 48px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#71717a",
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Product Brief
        </div>

        {BRIEF_LINES.map((line, i) => {
          const lineStart = 20 + i * 28;
          const progress = interpolate(frame, [lineStart, lineStart + 35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const chars = Math.floor(line.length * progress);
          return (
            <div
              key={i}
              style={{
                fontSize: 22,
                color: "white",
                lineHeight: 1.8,
                minHeight: 40,
              }}
            >
              <span style={{ opacity: progress > 0 ? 1 : 0 }}>
                {line.slice(0, chars)}
              </span>
              {progress > 0 && progress < 1 && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 22,
                    background: INDIGO,
                    marginLeft: 2,
                    verticalAlign: "text-bottom",
                    opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
