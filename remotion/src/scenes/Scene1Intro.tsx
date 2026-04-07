import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [10, 30], [30, 0], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [25, 45], [20, 0], { extrapolateRight: "clamp" });

  const float = Math.sin(frame * 0.05) * 3;

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
          transform: `scale(${logoScale}) translateY(${float}px)`,
          marginBottom: 32,
          width: 72,
          height: 72,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${INDIGO}, ${EMERALD})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 72,
          fontWeight: 700,
          color: "white",
          letterSpacing: "-0.03em",
        }}
      >
        Spec<span style={{ color: INDIGO }}>Mirror</span>
      </div>

      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontSize: 26,
          color: "#a1a1aa",
          marginTop: 16,
          letterSpacing: "-0.01em",
        }}
      >
        Brief → Spec in seconds
      </div>
    </AbsoluteFill>
  );
};
