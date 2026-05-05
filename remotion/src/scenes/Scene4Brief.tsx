import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";

const BRIEF_LINES = [
  "I want to build a fitness tracking app for",
  "personal trainers and their clients. Trainers",
  "create custom workout plans, track progress,",
  "and handle payments. Clients log workouts",
  "from a mobile app and see their stats.",
];

export const Scene4Brief: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillIn = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const pillOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  const cardScale = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 140 } });
  const cardOp = interpolate(frame, [8, 24], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{
        opacity: pillOp, transform: `scale(${Math.min(pillIn, 1)})`,
        padding: "10px 22px", borderRadius: 999,
        background: `${INDIGO}1a`, border: `1px solid ${INDIGO}55`, color: INDIGO,
        fontSize: 16, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 32,
      }}>
        Step 1 — Write a one-paragraph brief
      </div>

      <div style={{
        opacity: cardOp, transform: `scale(${Math.min(cardScale, 1)})`,
        width: 920, background: "rgba(20,20,28,0.7)",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
        padding: "44px 56px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#52525b" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#52525b" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#52525b" }} />
          <div style={{ marginLeft: 16, fontSize: 13, color: "#71717a", fontFamily: "monospace" }}>brief.md</div>
        </div>

        {BRIEF_LINES.map((line, i) => {
          const lineStart = 30 + i * 32;
          const charDur = 32;
          const progress = interpolate(frame, [lineStart, lineStart + charDur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const chars = Math.floor(line.length * progress);
          const showCaret = progress > 0 && progress < 1;
          return (
            <div key={i} style={{ fontSize: 26, color: "white", lineHeight: 1.7, minHeight: 44, fontWeight: 400 }}>
              <span>{line.slice(0, chars)}</span>
              {showCaret && (
                <span style={{
                  display: "inline-block", width: 3, height: 26, marginLeft: 2,
                  background: INDIGO, verticalAlign: "text-bottom",
                  opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
