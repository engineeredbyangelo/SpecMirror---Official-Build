import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";

const BRIEF_LINES = [
  "Build a mobile-first task manager",
  "with team collaboration features,",
  "real-time sync, and offline support.",
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
      {/* Label */}
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

      {/* Card */}
      <div
        style={{
          transform: `scale(${Math.min(cardScale, 1)})`,
          width: 700,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "40px 48px",
        }}
      >
        {/* Fake title input */}
        <div
          style={{
            fontSize: 13,
            color: "#71717a",
            marginBottom: 8,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Project Brief
        </div>

        {/* Typing lines */}
        {BRIEF_LINES.map((line, i) => {
          const lineStart = 20 + i * 18;
          const progress = interpolate(frame, [lineStart, lineStart + 25], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                fontSize: 22,
                color: "white",
                lineHeight: 1.7,
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ opacity: progress }}>
                {line.slice(0, Math.floor(line.length * progress))}
              </span>
              {/* Cursor */}
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
