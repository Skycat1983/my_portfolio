import { useNewStore } from "../../hooks/useNewStore";
import type { IconEntry } from "../../types/nodeTypes";
import {
  containerClasses,
  imageSize,
  labelClasses,
  tileFrame,
  tileWrapper,
  titleBase,
} from "./node.styles";

type Props = { icon: IconEntry };

export const LinkNode = ({ icon }: Props) => {
  const selectNode = useNewStore((s) => s.selectNode);
  const isSelected = useNewStore((s) => s.selectedNodeId === icon.id);

  const handleClick = () => {
    selectNode(icon.id);
  };

  const handleDoubleClick = () => {
    console.log("Link double-click:", icon.id);
  };

  const isDropTarget = false;

  return (
    <div className={tileFrame}>
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`${tileWrapper} ${containerClasses({
          selected: isSelected,
          drop: isDropTarget,
        })}`}
      >
        <img src={icon.image} alt={icon.label} className={imageSize} />
      </div>

      <h2 className={`${titleBase} ${labelClasses(isSelected)}`}>
        {icon.label}
      </h2>
    </div>
  );
};
