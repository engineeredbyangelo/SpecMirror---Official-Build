import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const VIOLET = "#a855f7";
const EMERALD = "#34d399";

export const Scene9Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bloom = spring({ frame, fps, config: { damping: 30 } });
  const logoScale = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 140 } });
  const logoBlur = interpolate(frame, [6, 24], [12, 0], { extrapolateRight: "clamp" });

  const headlineOp = interpolate(frame, [22, 44], [0, 1], { extrapolateRight: "clamp" });
  const headlineY = interpolate(frame, [22, 44], [16, 0], { extrapolateRight: "clamp" });

  const subOp = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });

  const pulse = 1 + Math.sin(frame * 0.06) * 0.015;
  const fadeOut = interpolate(frame, [200, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif", opacity: fadeOut }}>
      <div style={{
        position: "absolute", width: 1200, height: 1200, borderRadius: "50%",
        background: `radial-gradient(circle, ${INDIGO}33 0%, ${VIOLET}11 40%, transparent 70%)`,
        transform: `scale(${bloom})`, filter: "blur(20px)",
      }} />

      <div style={{
        width: 130, height: 130, borderRadius: 28,
        background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: `scale(${logoScale * pulse})`, filter: `blur(${logoBlur}px)`,
        boxShadow: `0 40px 100px ${INDIGO}66`, marginBottom: 40,
      }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <div style={{
        opacity: headlineOp, transform: `translateY(${headlineY}px)`,
        fontSize: 96, fontWeight: 800, color: "white", letterSpacing: "-0.04em", textAlign: "center",
      }}>
        Your idea. <span style={{ background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET}, ${EMERALD})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Specced.</span> Today.
      </div>

      <div style={{ opacity: subOp, marginTop: 36, fontSize: 28, color: "#a1a1aa", letterSpacing: "0.02em" }}>
        specmirror.one
      </div>
    </AbsoluteFill>
  );
};
