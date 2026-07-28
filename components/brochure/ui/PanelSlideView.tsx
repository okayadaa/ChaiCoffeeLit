import { AnimatePresence, motion } from "motion/react";
import { panelSlideTransition } from "../constants";
import type { SlideDirection } from "../types";

const panelSlideVariants = {
  enter: (direction: SlideDirection) => ({
    y: direction === 1 ? "100%" : "-100%",
  }),
  center: { y: 0 },
  exit: (direction: SlideDirection) => ({
    y: direction === 1 ? "-100%" : "100%",
  }),
};

export function PanelSlideView<K extends string>({
  view,
  direction,
  views,
}: {
  view: K;
  direction: SlideDirection;
  views: Record<K, React.ReactNode>;
}) {
  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={view}
          custom={direction}
          variants={panelSlideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={panelSlideTransition}
          className="absolute inset-0"
        >
          {views[view]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
