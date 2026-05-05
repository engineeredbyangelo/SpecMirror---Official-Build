import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Reveal } from "./scenes/Scene3Reveal";
import { Scene4Brief } from "./scenes/Scene4Brief";
import { Scene5Generate } from "./scenes/Scene5Generate";
import { Scene6Spec } from "./scenes/Scene6Spec";
import { Scene7Benefits } from "./scenes/Scene7Benefits";
import { Scene8Proof } from "./scenes/Scene8Proof";
import { Scene9Close } from "./scenes/Scene9Close";

const BG = "#08090f";
const INDIGO = "#4a6cf7";
const EMERALD = "#34d399";
const VIOLET = "#a855f7";
const CYAN = "#22d3ee";

const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame * 0.006) * 60;
  const d2 = Math.cos(frame * 0.004) * 50;
  const d3 = Math.sin(frame * 0.005 + 1) * 40;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, ${INDIGO}22 0%, transparent 70%)`, top: -200 + d1, left: -200 + d2, filter: "blur(90px)" }} />
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${VIOLET}1c 0%, transparent 70%)`, top: 200 + d3, right: -150 - d1, filter: "blur(110px)" }} />
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${EMERALD}18 0%, transparent 70%)`, bottom: -200 - d2, left: 300 + d3, filter: "blur(100px)" }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${CYAN}14 0%, transparent 70%)`, bottom: 100 + d1, right: 200 - d3, filter: "blur(120px)" }} />
      {/* vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

const fadeT = (frames = 12) => ({ presentation: fade(), timing: linearTiming({ durationInFrames: frames }) });
const slideT = (dir: "from-right" | "from-left" | "from-top" | "from-bottom", frames = 18) => ({ presentation: slide({ direction: dir }), timing: springTiming({ config: { damping: 200 }, durationInFrames: frames }) });
const wipeT = (dir: "from-left" | "from-right" | "from-top-left" = "from-left", frames = 20) => ({ presentation: wipe({ direction: dir }), timing: springTiming({ config: { damping: 200 }, durationInFrames: frames }) });

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}><Scene1Hook /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(15)} />
        <TransitionSeries.Sequence durationInFrames={150}><Scene2Problem /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...wipeT("from-top-left", 22)} />
        <TransitionSeries.Sequence durationInFrames={120}><Scene3Reveal /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...slideT("from-right", 18)} />
        <TransitionSeries.Sequence durationInFrames={240}><Scene4Brief /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(15)} />
        <TransitionSeries.Sequence durationInFrames={240}><Scene5Generate /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(15)} />
        <TransitionSeries.Sequence durationInFrames={300}><Scene6Spec /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...slideT("from-bottom", 20)} />
        <TransitionSeries.Sequence durationInFrames={240}><Scene7Benefits /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(15)} />
        <TransitionSeries.Sequence durationInFrames={150}><Scene8Proof /></TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fadeT(20)} />
        <TransitionSeries.Sequence durationInFrames={240}><Scene9Close /></TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
