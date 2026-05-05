import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const RED = "#f87171";
const AMBER = "#fbbf24";

const FRAGMENTS = [
  { text: "// TODO: define user roles", x: -480, y: -260, rot: -8, delay: 0 },
  { text: "stakeholder feedback v12", x: 380, y: -200, rot: 6, delay: 6 },
  { text: "?? edge cases ??", x: -380, y: 180, rot: 4, delay: 12 },
  { text: "rewrite section 4 again", x: 420, y: 160, rot: -5, delay: 18 },
  { text: "missing acceptance criteria", x: 0, y: -340, rot: 2, delay: 24 },
  { text: "API: TBD", x: 540, y: 0, rot: -3, delay: 30 },
];

const STAMPS = [
  { text: "12 hrs lost", color: RED, x: -380, y: 0, delay: 50 },
  { text: "47 revisions", color: AMBER, x: 0, y: 60, delay: 62 },
  { text: "3 stakeholders", color: RED, x: 360, y: -40, delay: 74 },
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ending = frame > 110;
  const fadeOut = ending ? interpolate(frame, [110, 130], [1, 0], { extrapolateRight: "clamp" }) : 1;

  const endIn = interpolate(frame, [120, 145], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ position: "relative", width: 1400, height: 700, opacity: fadeOut }}>
        {FRAGMENTS.map((f, i) => {
          const s = spring({ frame: frame - f.delay, fps, config: { damping: 14, stiffness: 100 } });
          const drift = Math.sin((frame + i * 20) * 0.04) * 6;
          return (
            <div key={i} style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(-50%, -50%) translate(${f.x}px, ${f.y + drift}px) rotate(${f.rot}deg) scale(${s})`,
              padding: "14px 22px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#a1a1aa", fontSize: 18, fontFamily: "monospace", whiteSpace: "nowrap",
              opacity: 0.7,
            }}>{f.text}</div>
          );
        })}
        {STAMPS.map((s, i) => {
          const sp = spring({ frame: frame - s.delay, fps, config: { damping: 8, stiffness: 200 } });
          const opacity = interpolate(frame, [s.delay, s.delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              position: "absolute", left: "50%", top: "50%",
              transform: `translate(-50%,-50%) translate(${s.x}px, ${s.y}px) rotate(${-6 + i * 5}deg) scale(${sp})`,
              opacity, padding: "20px 36px", border: `4px solid ${s.color}`, color: s.color,
              fontSize: 38, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase",
              background: "rgba(0,0,0,0.4)", borderRadius: 4,
            }}>{s.text}</div>
          );
        })}
      </div>
      <div style={{
        position: "absolute", opacity: endIn,
        fontSize: 64, fontWeight: 700, color: "white", letterSpacing: "-0.03em",
        transform: `translateY(${(1 - endIn) * 20}px)`,
      }}>
        There's a faster way.
      </div>
    </AbsoluteFill>
  );
};
