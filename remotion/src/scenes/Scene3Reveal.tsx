import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const VIOLET = "#a855f7";
const EMERALD = "#34d399";

export const Scene3Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const logoBlur = interpolate(frame, [0, 18], [16, 0], { extrapolateRight: "clamp" });

  const wordmarkOp = interpolate(frame, [10, 28], [0, 1], { extrapolateRight: "clamp" });
  const wordmarkY = interpolate(frame, [10, 28], [20, 0], { extrapolateRight: "clamp" });

  const sweep = interpolate(frame, [20, 60], [-100, 200], { extrapolateRight: "clamp" });

  const tagOp = interpolate(frame, [40, 58], [0, 1], { extrapolateRight: "clamp" });
  const tagY = interpolate(frame, [40, 58], [16, 0], { extrapolateRight: "clamp" });

  const float = Math.sin(frame * 0.05) * 3;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      {/* burst */}
      <div style={{
        position: "absolute", width: 900, height: 900, borderRadius: "50%",
        background: `radial-gradient(circle, ${INDIGO}33 0%, transparent 60%)`,
        transform: `scale(${spring({ frame, fps, config: { damping: 20 } })})`,
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 28, transform: `translateY(${float}px)` }}>
        <div style={{
          width: 110, height: 110, borderRadius: 24,
          background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: `scale(${logoScale})`, filter: `blur(${logoBlur}px)`,
          boxShadow: `0 30px 80px ${INDIGO}55`,
        }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <div style={{
          position: "relative", overflow: "hidden",
          opacity: wordmarkOp, transform: `translateY(${wordmarkY}px)`,
          fontSize: 110, fontWeight: 800, letterSpacing: "-0.04em",
          background: `linear-gradient(90deg, white, white)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Spec<span style={{ background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mirror</span>
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: 120,
            left: `${sweep}%`, background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)`,
            transform: "skewX(-20deg)",
          }} />
        </div>
      </div>

      <div style={{
        marginTop: 36, fontSize: 32, color: EMERALD,
        opacity: tagOp, transform: `translateY(${tagY}px)`,
        letterSpacing: "-0.01em", fontWeight: 500,
      }}>
        Brief → Spec in seconds.
      </div>
    </AbsoluteFill>
  );
};
