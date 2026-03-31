import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Mirror } from "./scenes/Scene2Mirror";
import { Scene4Approve } from "./scenes/Scene4Approve";

const BG = "#08090f";
const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";

const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift1 = Math.sin(frame * 0.008) * 40;
  const drift2 = Math.cos(frame * 0.006) * 30;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${INDIGO}15 0%, transparent 70%)`,
          top: -100 + drift1,
          left: -100 + drift2,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${EMERALD}10 0%, transparent 70%)`,
          bottom: -150 - drift1,
          right: -50 - drift2,
          filter: "blur(100px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <Scene1Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={240}>
          <Scene2Mirror />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={155}>
          <Scene4Approve />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
