import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const VIOLET = "#a855f7";
const EMERALD = "#34d399";

const QUOTES = [
  { quote: "Saved us an entire sprint of spec writing.", name: "Maya R.", role: "Senior PM, fintech", color: INDIGO },
  { quote: "It's like having a staff engineer in your pocket.", name: "Devon K.", role: "Founder, B2B SaaS", color: VIOLET },
  { quote: "Our eng team finally has briefs they can build from.", name: "Priya S.", role: "Head of Product", color: EMERALD },
];

export const Scene8Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", gap: 32 }}>
        {QUOTES.map((q, i) => {
          const start = i * 16;
          const sp = spring({ frame: frame - start, fps, config: { damping: 16, stiffness: 140 } });
          const op = interpolate(frame, [start, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const float = Math.sin((frame + i * 30) * 0.04) * 6;
          return (
            <div key={i} style={{
              opacity: op,
              transform: `translateY(${(1 - Math.min(sp, 1)) * 40 + float}px) scale(${Math.min(sp, 1)})`,
              width: 460, padding: "36px 32px",
              background: "rgba(20,20,28,0.8)",
              border: `1px solid ${q.color}44`, borderRadius: 18,
              boxShadow: `0 24px 60px ${q.color}22`,
            }}>
              <div style={{ fontSize: 56, color: q.color, lineHeight: 0.6, marginBottom: 12 }}>"</div>
              <div style={{ fontSize: 22, color: "white", lineHeight: 1.45, fontWeight: 500, marginBottom: 24, letterSpacing: "-0.01em" }}>{q.quote}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg, ${q.color}, ${q.color}88)` }} />
                <div>
                  <div style={{ color: "white", fontSize: 15, fontWeight: 600 }}>{q.name}</div>
                  <div style={{ color: "#71717a", fontSize: 13 }}>{q.role}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
