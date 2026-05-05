import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const VIOLET = "#a855f7";

const WORDS = ["an idea.", "a vision.", "a product."];

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const lineY = interpolate(frame, [0, 18], [20, 0], { extrapolateRight: "clamp" });
  const blur = interpolate(frame, [0, 18], [12, 0], { extrapolateRight: "clamp" });

  // word morph — each word visible for ~24f
  const wordIdx = Math.min(2, Math.floor((frame - 12) / 24));
  const wordLocal = (frame - 12) - wordIdx * 24;
  const wordOpacity = wordIdx < 0 ? 0 : interpolate(wordLocal, [0, 6, 18, 24], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordScale = wordIdx < 0 ? 0.95 : interpolate(wordLocal, [0, 8], [0.94, 1], { extrapolateRight: "clamp" });

  // ending tag
  const tagIn = spring({ frame: frame - 92, fps, config: { damping: 18, stiffness: 160 } });
  const tagOpacity = interpolate(frame, [92, 105], [0, 1], { extrapolateRight: "clamp" });

  const pushIn = interpolate(frame, [0, 120], [1, 1.05]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif", transform: `scale(${pushIn})` }}>
      <div style={{ opacity: lineOpacity, transform: `translateY(${lineY}px)`, filter: `blur(${blur}px)`, fontSize: 96, fontWeight: 700, color: "white", letterSpacing: "-0.04em", display: "flex", gap: 24, alignItems: "baseline" }}>
        <span>You have</span>
        <span style={{ position: "relative", minWidth: 520, display: "inline-block", textAlign: "left" }}>
          <span style={{ opacity: wordOpacity, transform: `scale(${wordScale})`, display: "inline-block", background: `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {WORDS[Math.max(0, wordIdx)]}
          </span>
        </span>
      </div>
      <div style={{ opacity: tagOpacity, transform: `translateY(${(1 - tagIn) * 20}px)`, marginTop: 40, fontSize: 28, color: "#a1a1aa", letterSpacing: "-0.01em" }}>
        But specs slow you down.
      </div>
    </AbsoluteFill>
  );
};
