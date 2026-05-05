import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";
const VIOLET = "#a855f7";

const BENEFITS = [
  { title: "Ship 10× faster", sub: "Days of spec work, done in a coffee break.", color: INDIGO, icon: "rocket" },
  { title: "Zero ambiguity", sub: "Every edge case named, every story scoped.", color: EMERALD, icon: "check" },
  { title: "Stakeholder-ready", sub: "Hand it to design, eng, or your CEO.", color: VIOLET, icon: "share" },
];

const Icon: React.FC<{ name: string; color: string; frame: number }> = ({ name, color, frame }) => {
  const pulse = 1 + Math.sin(frame * 0.08) * 0.05;
  return (
    <div style={{
      width: 64, height: 64, borderRadius: 16,
      background: `linear-gradient(135deg, ${color}, ${color}99)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      transform: `scale(${pulse})`, marginBottom: 24,
      boxShadow: `0 12px 30px ${color}55`,
    }}>
      {name === "rocket" && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>}
      {name === "check" && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
      {name === "share" && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>}
    </div>
  );
};

export const Scene7Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 18], [16, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, fontSize: 56, fontWeight: 700, color: "white", letterSpacing: "-0.03em", marginBottom: 56 }}>
        Why teams love SpecMirror
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, width: 1500 }}>
        {BENEFITS.map((b, i) => {
          const start = 30 + i * 18;
          const sp = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 140 } });
          const op = interpolate(frame, [start, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={b.title} style={{
              opacity: op, transform: `translateY(${(1 - Math.min(sp, 1)) * 40}px) scale(${Math.min(sp, 1)})`,
              padding: "40px 36px",
              background: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))`,
              border: `1px solid ${b.color}33`, borderRadius: 20,
              boxShadow: `0 30px 70px ${b.color}1a`,
            }}>
              <Icon name={b.icon} color={b.color} frame={frame - start} />
              <div style={{ fontSize: 34, fontWeight: 700, color: "white", letterSpacing: "-0.02em", marginBottom: 12 }}>{b.title}</div>
              <div style={{ fontSize: 19, color: "#a1a1aa", lineHeight: 1.5 }}>{b.sub}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
