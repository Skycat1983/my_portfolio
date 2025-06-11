import { useNewStore } from "../../../hooks/useNewStore";
import type { EasterEggEntry } from "../../../types/nodeTypes";
import {
  containerClasses,
  labelClasses,
  tileWrapper,
  tileFrame,
  imageSize,
  titleBase,
} from "./EasterEgg.styles";

type Props = { egg: EasterEggEntry };

export const EasterEgg = ({ egg }: Props) => {
  // ────────────────────── store selectors ─────────────────────
  const cycleEgg = useNewStore((s) => s.cycleEasterEgg);
  const selectNode = useNewStore((s) => s.selectNode);
  const breakEgg = useNewStore((s) => s.breakEasterEgg);

  const currentImg = useNewStore((s) => s.getEasterEggCurrentImage(egg.id));
  const isSelected = useNewStore((s) => s.selectedNodeId === egg.id);

  // ────────────────────── handlers ────────────────────────────
  const handleClick = () => {
    selectNode(egg.id);
    cycleEgg(egg.id);
  };

  // drop-target state could come from DnD context later
  const isDropTarget = false;

  // ────────────────────── render ──────────────────────────────
  return (
    <div className={tileFrame}>
      <div
        onClick={handleClick}
        onDoubleClick={() => breakEgg(egg.id)}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={currentImg} alt={egg.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {egg.label}
      </h2>
    </div>
  );
};
