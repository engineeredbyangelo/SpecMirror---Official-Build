import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const EMERALD = "#34d399";
const INDIGO = "#4a6cf7";
const VIOLET = "#a855f7";
const CYAN = "#22d3ee";
const AMBER = "#fbbf24";

const SECTIONS = [
  { title: "User Stories", color: INDIGO, lines: ["As a trainer, I can create plans", "As a client, I can log workouts", "As an admin, I can review usage"] },
  { title: "Tech Stack", color: VIOLET, lines: ["React Native + Expo", "Postgres + Row-Level Security", "Stripe Connect for payouts"] },
  { title: "Data Model", color: CYAN, lines: ["users, trainers, clients", "workout_plans, sessions, exercises", "payments, subscriptions"] },
  { title: "Acceptance Criteria", color: EMERALD, lines: ["Onboarding ≤ 3 minutes", "Workout sync < 2s", "99.9% uptime"] },
  { title: "Edge Cases", color: AMBER, lines: ["Offline workout logging", "Trainer-client unlink flow", "Refund + dispute handling"] },
];

export const Scene6Spec: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const pillScale = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", fontFamily: "Inter, sans-serif", paddingTop: 80 }}>
      <div style={{
        opacity: pillOp, transform: `scale(${Math.min(pillScale, 1)})`,
        padding: "10px 22px", borderRadius: 999,
        background: `${EMERALD}1a`, border: `1px solid ${EMERALD}55`, color: EMERALD,
        fontSize: 16, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
        marginBottom: 32,
      }}>
        Step 3 — Production-ready in 30 seconds
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, width: 1500 }}>
        {SECTIONS.map((s, i) => {
          const start = 20 + i * 32;
          const sp = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 140 } });
          const op = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const checkScale = spring({ frame: frame - (start + 18), fps, config: { damping: 8, stiffness: 200 } });
          return (
            <div key={s.title} style={{
              opacity: op, transform: `translateY(${(1 - Math.min(sp, 1)) * 30}px) scale(${Math.min(sp, 1)})`,
              background: "rgba(20,20,28,0.7)", border: `1px solid ${s.color}44`,
              borderRadius: 14, padding: "24px 28px",
              boxShadow: `0 16px 40px ${s.color}1a`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ color: s.color, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em" }}>{s.title}</div>
                <div style={{
                  width: 28, height: 28, borderRadius: 14, background: EMERALD,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `scale(${Math.min(checkScale, 1)})`,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
              </div>
              {s.lines.map((l, j) => (
                <div key={j} style={{ color: "#d4d4d8", fontSize: 16, lineHeight: 1.7, marginBottom: 4 }}>• {l}</div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Counter */}
      <div style={{ marginTop: 50, fontSize: 22, color: "#71717a" }}>
        <span style={{ color: "white", fontSize: 56, fontWeight: 800, letterSpacing: "-0.03em", marginRight: 12 }}>
          {Math.min(30, Math.max(0, Math.floor(interpolate(frame, [180, 260], [0, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))))}s
        </span>
        from idea to spec.
      </div>
    </AbsoluteFill>
  );
};
