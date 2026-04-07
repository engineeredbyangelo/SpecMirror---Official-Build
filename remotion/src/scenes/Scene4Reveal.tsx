import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";
const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.08)";
const MUTED = "#71717a";
const DIM = "#a1a1aa";

const BRIEF_LINES = [
  "I want to build a fitness tracking app for",
  "personal trainers and their clients. Trainers",
  "can create custom workout plans, track client",
  "progress, and handle payments. Clients get a",
  "mobile app to log workouts and see their stats.",
];

interface SpecSection {
  heading: string;
  items: { label: string; value: string; accent?: boolean }[];
}

const SPEC_SECTIONS: SpecSection[] = [
  {
    heading: "Executive Summary",
    items: [
      { label: "Product", value: "Client-facing fitness platform with trainer tools" },
    ],
  },
  {
    heading: "Architecture",
    items: [
      { label: "Frontend", value: "React Native (Expo)" },
      { label: "Backend", value: "Supabase (Postgres + Auth + Realtime)" },
      { label: "Payments", value: "Stripe Connect" },
    ],
  },
  {
    heading: "Data Model",
    items: [
      { label: "Tables", value: "trainers, clients, workout_plans, exercises, sessions" },
    ],
  },
  {
    heading: "Auth & Security",
    items: [
      { label: "Method", value: "JWT + Google OAuth + RLS policies" },
    ],
  },
  {
    heading: "Effort Estimate",
    items: [
      { label: "Timeline", value: "~12 days, 2 engineers" },
    ],
  },
  {
    heading: "Acceptance Criteria",
    items: [
      { label: "✓", value: "Trainer can create/assign workout plans" },
      { label: "✓", value: "Client logs workouts with progress photos" },
      { label: "✓", value: "Stripe handles subscription billing" },
      { label: "Confidence", value: "94%", accent: true },
    ],
  },
];

export const Scene4Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Flatten all items for stagger timing
  let itemIndex = 0;

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
          display: "flex",
          gap: 32,
          opacity: panelOpacity,
        }}
      >
        {/* LEFT: Brief (static) */}
        <div
          style={{
            width: 480,
            background: CARD_BG,
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 12,
            padding: "28px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: INDIGO }} />
            <span style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
              Product Brief
            </span>
          </div>
          {BRIEF_LINES.map((line, i) => (
            <div key={i} style={{ fontSize: 16, color: "white", lineHeight: 1.8 }}>
              {line}
            </div>
          ))}
        </div>

        {/* CENTER divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.06)" }} />
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${INDIGO}30, ${EMERALD}30)`,
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* RIGHT: Spec reveal */}
        <div
          style={{
            width: 560,
            background: CARD_BG,
            border: `1px solid ${EMERALD}30`,
            borderRadius: 12,
            padding: "28px 32px",
            maxHeight: 600,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: EMERALD }} />
            <span style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>
              Technical Mirror
            </span>
            <span style={{ fontSize: 11, color: EMERALD, marginLeft: "auto" }}>
              ✓ Complete
            </span>
          </div>

          {SPEC_SECTIONS.map((section, sIdx) => {
            const sectionDelay = 10 + sIdx * 30;
            const headingSpring = spring({ frame: frame - sectionDelay, fps, config: { damping: 20 } });
            const headingOpacity = interpolate(headingSpring, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

            return (
              <div key={sIdx} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    opacity: headingOpacity,
                    fontSize: 13,
                    fontWeight: 700,
                    color: EMERALD,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                    paddingBottom: 4,
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {section.heading}
                </div>
                {section.items.map((item, iIdx) => {
                  const delay = sectionDelay + 8 + iIdx * 8;
                  const s = spring({ frame: frame - delay, fps, config: { damping: 18 } });
                  const opacity = interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
                  const x = interpolate(s, [0, 1], [16, 0]);
                  itemIndex++;

                  return (
                    <div
                      key={iIdx}
                      style={{
                        opacity,
                        transform: `translateX(${x}px)`,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "5px 0",
                      }}
                    >
                      <span style={{ fontSize: 13, color: DIM }}>{item.label}</span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: item.accent ? EMERALD : "white",
                          maxWidth: 340,
                          textAlign: "right",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 15,
          color: MUTED,
          opacity: interpolate(frame, [200, 220], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Your brief, mirrored into a production-ready spec
      </div>
    </AbsoluteFill>
  );
};
