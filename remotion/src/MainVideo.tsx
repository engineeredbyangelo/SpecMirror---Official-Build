import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Brief } from "./scenes/Scene2Brief";
import { Scene3Generation } from "./scenes/Scene3Spec";
import { Scene4Reveal } from "./scenes/Scene4Reveal";
import { Scene5Approve } from "./scenes/Scene5Approve";

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
        <TransitionSeries.Sequence durationInFrames={80}>
          <Scene1Intro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={210}>
          <Scene2Brief />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene3Generation />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={270}>
          <Scene4Reveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={160}>
          <Scene5Approve />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
