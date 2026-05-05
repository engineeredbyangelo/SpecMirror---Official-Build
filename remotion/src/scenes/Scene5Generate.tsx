import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const VIOLET = "#a855f7";
const EMERALD = "#34d399";

export const Scene5Generate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const pillScale = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });

  const briefIn = spring({ frame: frame - 8, fps, config: { damping: 18 } });
  const briefOp = interpolate(frame, [8, 24], [0, 1], { extrapolateRight: "clamp" });

  const arrowOp = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });

  const mirrorIn = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const mirrorOp = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });

  // shimmer scanning the right card
  const shimmerY = interpolate(frame, [70, 220], [0, 480], { extrapolateRight: "clamp" });

  // particles traveling along arrow
  const particles = [0, 1, 2, 3, 4, 5];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{
        opacity: pillOp, transform: `scale(${Math.min(pillScale, 1)})`,
        padding: "10px 22px", borderRadius: 999,
        background: `${VIOLET}1a`, border: `1px solid ${VIOLET}55`, color: VIOLET,
        fontSize: 16, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 40, position: "absolute", top: 140,
      }}>
        Step 2 — AI mirrors it into a spec
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {/* brief card */}
        <div style={{
          opacity: briefOp, transform: `scale(${Math.min(briefIn, 1) * 0.78})`,
          width: 480, height: 480, background: "rgba(20,20,28,0.7)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 28,
          fontFamily: "monospace", fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, overflow: "hidden",
        }}>
          <div style={{ color: "#71717a", marginBottom: 12, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>brief</div>
          <div>I want to build a fitness</div>
          <div>tracking app for personal</div>
          <div>trainers and their clients...</div>
          <div style={{ marginTop: 18, color: "#52525b" }}>~ 92 words</div>
        </div>

        {/* arrow channel */}
        <div style={{ position: "relative", width: 220, height: 4, opacity: arrowOp }}>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${INDIGO}, ${VIOLET}, ${EMERALD})`, borderRadius: 2 }} />
          {particles.map((p) => {
            const offset = (frame * 4 + p * 40) % 220;
            return (
              <div key={p} style={{
                position: "absolute", top: -3, left: offset, width: 10, height: 10, borderRadius: 5,
                background: "white", boxShadow: `0 0 12px ${VIOLET}`, opacity: 0.9,
              }} />
            );
          })}
          {/* arrowhead */}
          <div style={{
            position: "absolute", right: -14, top: -10,
            width: 0, height: 0, borderLeft: `16px solid ${EMERALD}`,
            borderTop: "12px solid transparent", borderBottom: "12px solid transparent",
          }} />
        </div>

        {/* mirror card */}
        <div style={{
          opacity: mirrorOp, transform: `scale(${Math.min(mirrorIn, 1)})`,
          width: 520, height: 540, background: "rgba(20,20,28,0.85)",
          border: `1px solid ${INDIGO}55`, borderRadius: 16, padding: 32,
          position: "relative", overflow: "hidden",
          boxShadow: `0 30px 80px ${INDIGO}33`,
        }}>
          <div style={{ color: EMERALD, marginBottom: 16, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>generating spec...</div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{
              height: 14, marginBottom: 14, borderRadius: 4,
              background: "rgba(255,255,255,0.06)",
              width: `${60 + ((i * 37) % 35)}%`,
            }} />
          ))}
          {/* shimmer scanline */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: shimmerY, height: 60,
            background: `linear-gradient(180deg, transparent, ${INDIGO}55, transparent)`,
            pointerEvents: "none",
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
