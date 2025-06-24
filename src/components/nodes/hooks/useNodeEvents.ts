import { useCallback } from "react";
import { useNewStore } from "../../../hooks/useStore";
import { useNodeDrag } from "./useNodeDrag";

type NodeBehaviorConfig = {
  id: string;
  nodeType: string;
  enableLogging?: boolean;
  onActivate?: () => void;
};

export const useNodeEvents = ({
  id,
  nodeType,
  enableLogging = false,
  onActivate,
}: NodeBehaviorConfig) => {
  console.log("NODE_EVENTS_01: useNodeEvents called", {
    id,
    nodeType,
    enableLogging,
  });

  // ─────────── store actions & state ───────────
  const selectOneNode = useNewStore((s) => s.selectOneNode);
  const isSelected = useNewStore((s) => s.selectedNodeId === id);
  const moveNodeById = useNewStore((s) => s.moveNodeByID);
  const deleteNode = useNewStore((s) => s.deleteNodeByID);
  const isNodeInTrash = useNewStore((s) => s.isNodeInTrash);
  const unlockPortfolioDeletedAchievement = useNewStore(
    (s) => s.unlockPortfolioDeletedAchievement
  );

  // ─────────── drag & drop functionality ───────────
  console.log("NODE_EVENTS_02: creating dragHandlers via useNodeDrag", {
    id,
    nodeType,
  });
  const dragHandlers = useNodeDrag();
  const canBeDropTarget = nodeType === "directory";
  const isDropTarget = canBeDropTarget ? dragHandlers.isDropTarget(id) : false;

  console.log("NODE_EVENTS_03: drag configuration", {
    id,
    nodeType,
    canBeDropTarget,
    isDropTarget,
    currentDropTarget: dragHandlers.currentDropTarget,
  });

  // ─────────── logging helper ───────────
  const log = useCallback(
    (action: string) => {
      if (enableLogging) {
        console.log(`${nodeType} ${action} in useNodeBehavior:`, id);
      }
    },
    [enableLogging, nodeType, id]
  );

  // ─────────── base click handler ───────────
  const handleClick = useCallback(() => {
    log("single-click");
    selectOneNode(id);
  }, [id, selectOneNode, log]);

  // ─────────── activation handler (double-click and Enter) ───────────
  const handleDoubleClick = useCallback(() => {
    log("double-click");
    onActivate?.();
  }, [log, onActivate]);

  // ─────────── delete/trash handler ───────────
  const handleDelete = useCallback(() => {
    if (isNodeInTrash(id)) {
      deleteNode(id);
      if (id === "portfolio") {
        unlockPortfolioDeletedAchievement();
      }
    } else {
      moveNodeById(id, "trash");
    }
  }, [
    id,
    isNodeInTrash,
    deleteNode,
    moveNodeById,
    unlockPortfolioDeletedAchievement,
  ]);

  // ─────────── keyboard handler ───────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && isSelected) {
        e.preventDefault();
        log("Enter-press");
        onActivate?.();
      }
      if (e.key === "Delete" && isSelected) {
        e.preventDefault();
        handleDelete();
      }
    },
    [isSelected, log, onActivate, handleDelete]
  );

  // ─────────── drag source handlers ───────────
  const dragSourceHandlers = {
    draggable: "true" as const,
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
      console.log("NODE_EVENTS_04: onDragStart called", { id, nodeType });
      return dragHandlers.handleDragStart(e, id);
    },
    onDragEnd: () => {
      console.log("NODE_EVENTS_05: onDragEnd called", { id, nodeType });
      return dragHandlers.handleDragEnd();
    },
  };

  // ─────────── drop target handlers (only for directories) ───────────
  const dropTargetHandlers = canBeDropTarget
    ? {
        onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
          console.log("NODE_EVENTS_06: onDragOver called on directory", {
            id,
            nodeType,
          });
          return dragHandlers.handleDragOver(e, id);
        },
        onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
          console.log("NODE_EVENTS_07: onDragEnter called on directory", {
            id,
            nodeType,
          });
          return dragHandlers.handleDragEnter(e, id);
        },
        onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
          console.log("NODE_EVENTS_08: onDragLeave called on directory", {
            id,
            nodeType,
          });
          return dragHandlers.handleDragLeave(e);
        },
        onDrop: (e: React.DragEvent<HTMLDivElement>) => {
          console.log("NODE_EVENTS_09: onDrop called on directory", {
            id,
            nodeType,
          });
          return dragHandlers.handleDrop(e, id);
        },
      }
    : {};

  console.log("NODE_EVENTS_10: returning handlers", {
    id,
    nodeType,
    hasDragSourceHandlers: !!dragSourceHandlers,
    hasDropTargetHandlers: Object.keys(dropTargetHandlers).length > 0,
    isSelected,
    isDropTarget,
    canBeDropTarget,
  });

  // ─────────── accessibility props ───────────
  const accessibilityProps = {
    role: "button" as const,
    tabIndex: 0,
    "aria-selected": isSelected,
  };

  return {
    // State
    isSelected,
    isDropTarget,
    canBeDropTarget,

    // Handlers
    handleClick,
    handleDoubleClick,
    handleKeyDown,
    handleDelete,

    // Event handler objects
    dragSourceHandlers,
    dropTargetHandlers,
    accessibilityProps,

    // Utilities
    log,
  };
};
