import { useState, useRef } from "react";
import { useNewStore } from "../../../store/useStore";

export interface DragHandlers {
  handleDragStart: (e: React.DragEvent, nodeId: string) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, targetNodeId?: string) => void;
  handleDragEnter: (e: React.DragEvent, targetNodeId: string) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetNodeId: string) => void;
  currentDropTarget: string | null;
  isValidDropTarget: () => boolean;
  isDropTarget: (nodeId: string) => boolean;
}

export const useNodeDrag = (): DragHandlers => {
  // Track current drop target for visual feedback (highlighting)
  const [currentDropTarget, setCurrentDropTarget] = useState<string | null>(
    null
  );

  const moveNodeByID = useNewStore((s) => s.moveNodeByID);
  const validateMoveByID = useNewStore((s) => s.validateMoveByID);

  // Throttle validation to prevent excessive console logging
  const lastValidationTime = useRef<number>(0);

  // Called when user starts dragging a node
  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    console.log(
      "handleDragStart in useNodeDrag: starting drag for nodeId",
      nodeId
    );

    // Store the dragged node ID in the drag data
    e.dataTransfer.setData("nodeId", nodeId);

    // Set drag effect to indicate this is a move operation
    e.dataTransfer.effectAllowed = "move";

    // Customize the drag image opacity for better visual feedback
    e.dataTransfer.dropEffect = "move";
  };

  // Called when dragging over a potential drop target
  const handleDragOver = (e: React.DragEvent, targetNodeId?: string) => {
    // Must preventDefault to allow drop
    e.preventDefault();

    // Stop propagation when we have a specific target to prevent desktop interference
    if (targetNodeId) {
      e.stopPropagation();
    }

    // Get the dragged node ID from drag data
    const draggedNodeId = e.dataTransfer.getData("nodeId");

    // Update visual feedback if we have a valid target
    if (targetNodeId && draggedNodeId) {
      // Throttle validation to prevent excessive console logging
      const now = Date.now();
      const shouldValidate = now - lastValidationTime.current > 100; // Only validate every 100ms

      let isValid = true; // Default to true to avoid blocking
      if (shouldValidate) {
        isValid = validateMoveByID(draggedNodeId, targetNodeId);
        lastValidationTime.current = now;
      }

      // Set cursor based on validity
      e.dataTransfer.dropEffect = isValid ? "move" : "none";

      // Update current drop target for highlighting
      if (currentDropTarget !== targetNodeId) {
        setCurrentDropTarget(targetNodeId);
      }
    }
  };

  // Called when dragging enters a potential drop target
  const handleDragEnter = (e: React.DragEvent, targetNodeId: string) => {
    console.log(
      "handleDragEnter in useNodeDrag: entering target",
      targetNodeId
    );

    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up
    setCurrentDropTarget(targetNodeId);
  };

  // Called when dragging leaves a potential drop target
  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the target (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setCurrentDropTarget(null);
    }
  };

  // Called when dropping on a valid target
  const handleDrop = (e: React.DragEvent, targetNodeId: string) => {
    console.log("handleDrop in useNodeDrag: dropping on target", targetNodeId);

    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to parent elements

    // Get the dragged node ID
    const draggedNodeId = e.dataTransfer.getData("nodeId");

    if (!draggedNodeId) {
      console.log("handleDrop in useNodeDrag: no dragged node ID found");
      return;
    }

    // Validate and execute the move
    if (validateMoveByID(draggedNodeId, targetNodeId)) {
      console.log(
        "handleDrop in useNodeDrag: executing move from",
        draggedNodeId,
        "to",
        targetNodeId
      );
      const success = moveNodeByID(draggedNodeId, targetNodeId);
      if (!success) {
        console.error("handleDrop in useNodeDrag: move operation failed");
      }
    } else {
      console.log(
        "handleDrop in useNodeDrag: invalid move from",
        draggedNodeId,
        "to",
        targetNodeId
      );
    }

    // Clear drop target highlighting
    setCurrentDropTarget(null);
  };

  // Called when drag operation ends (regardless of success)
  const handleDragEnd = () => {
    console.log("handleDragEnd in useNodeDrag: drag operation ended");

    // Clear any remaining visual feedback
    setCurrentDropTarget(null);
  };

  // Helper to check if a node is currently a valid drop target
  const isValidDropTarget = (): boolean => {
    // Can't determine validity without knowing what's being dragged
    // This is used for static validation (like disabled state)
    return true; // Dynamic validation happens in handleDragOver
  };

  // Helper to check if a target is currently being highlighted
  const isDropTarget = (nodeId: string): boolean => {
    return currentDropTarget === nodeId;
  };

  return {
    // Event handlers for drag source (any Node)
    handleDragStart,
    handleDragEnd,

    // Event handlers for drop targets (directories)
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,

    // State for visual feedback
    currentDropTarget,
    isValidDropTarget,
    isDropTarget,
  };
};
