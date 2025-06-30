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
  // ─────────── store actions & state ───────────
  const selectOneNode = useNewStore((s) => s.selectOneNode);
  const isSelected = useNewStore((s) => s.selectedNodeId === id);
  const moveNodeById = useNewStore((s) => s.moveNodeByID);
  const deleteNode = useNewStore((s) => s.deleteNodeByID);
  const isNodeInTrash = useNewStore((s) => s.isNodeInTrash);
  const unlockPortfolioDeletedAchievement = useNewStore(
    (s) => s.unlockPortfolioDeletedAchievement
  );
  const screenDimensions = useNewStore((s) => s.screenDimensions);

  // ─────────── drag & drop functionality ───────────
  const dragHandlers = useNodeDrag();
  const canBeDropTarget = nodeType === "directory";
  const isDropTarget = canBeDropTarget ? dragHandlers.isDropTarget(id) : false;

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
    // On touch devices (mobile + tablet), single click activates immediately
    // On desktop with mouse/trackpad, single click selects (double click to activate)
    if (screenDimensions.isMobile || screenDimensions.isTablet) {
      log("single-click-activate-touch");
      selectOneNode(id);
      onActivate?.();
    } else {
      log("single-click-select-desktop");
      selectOneNode(id);
    }
  }, [
    id,
    selectOneNode,
    log,
    onActivate,
    screenDimensions.isMobile,
    screenDimensions.isTablet,
  ]);

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
      return dragHandlers.handleDragStart(e, id);
    },
    onDragEnd: () => {
      return dragHandlers.handleDragEnd();
    },
  };

  // ─────────── drop target handlers (only for directories) ───────────
  const dropTargetHandlers = canBeDropTarget
    ? {
        onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
          return dragHandlers.handleDragOver(e, id);
        },
        onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
          return dragHandlers.handleDragEnter(e, id);
        },
        onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
          return dragHandlers.handleDragLeave(e);
        },
        onDrop: (e: React.DragEvent<HTMLDivElement>) => {
          return dragHandlers.handleDrop(e, id);
        },
      }
    : {};

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
