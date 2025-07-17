import { useState, useRef, useCallback } from "react";
import { useNewStore } from "@/hooks/useStore";

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

  // Subscribe to nodeMap to ensure our callbacks update when data changes
  // const nodeMap = useNewStore((s) => s.nodeMap);
  const moveNodeByID = useNewStore((s) => s.moveNodeByID);
  const validateMoveByID = useNewStore((s) => s.validateMoveByID);

  // Throttle validation to prevent excessive console logging
  const lastValidationTime = useRef<number>(0);

  // Called when user starts dragging a node
  const handleDragStart = useCallback((e: React.DragEvent, nodeId: string) => {
    // Store the dragged node ID in the drag data
    e.dataTransfer.setData("nodeId", nodeId);

    // Set drag effect to indicate this is a move operation
    e.dataTransfer.effectAllowed = "move";

    // Customize the drag image opacity for better visual feedback
    e.dataTransfer.dropEffect = "move";
  }, []); // No dependencies needed - drag start doesn't depend on store state

  // Called when dragging over a potential drop target
  const handleDragOver = useCallback(
    (e: React.DragEvent, targetNodeId?: string) => {
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
        } else {
          console.log(
            "DRAG_OVER_08: skipping validation (throttled), using default isValid=true"
          );
        }

        // Set cursor based on validity
        e.dataTransfer.dropEffect = isValid ? "move" : "none";

        // Update current drop target for highlighting
        if (currentDropTarget !== targetNodeId) {
          setCurrentDropTarget(targetNodeId);
        } else {
          console.log(
            "DRAG_OVER_11: currentDropTarget unchanged",
            currentDropTarget
          );
        }
      } else {
        console.log("DRAG_OVER_12: missing draggedNodeId or targetNodeId", {
          draggedNodeId,
          targetNodeId,
        });
      }
    },
    [validateMoveByID, currentDropTarget]
  ); // Depend on validateMoveByID and currentDropTarget

  // Called when dragging enters a potential drop target
  const handleDragEnter = useCallback(
    (e: React.DragEvent, targetNodeId: string) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up

      setCurrentDropTarget(targetNodeId);
    },
    []
  ); // No dependencies needed - just sets state

  // Called when dragging leaves a potential drop target
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    console.log("DRAG_LEAVE_01: dragLeave event", {
      currentTarget: e.currentTarget,
      relatedTarget: e.relatedTarget,
    });

    // Only clear if we're actually leaving the target (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      console.log(
        "DRAG_LEAVE_02: actually leaving target, clearing currentDropTarget"
      );
      setCurrentDropTarget(null);
    } else {
      console.log(
        "DRAG_LEAVE_03: entering child element, keeping currentDropTarget"
      );
    }
  }, []); // No dependencies needed - just checks DOM and sets state

  // Called when dropping on a valid target
  const handleDrop = useCallback(
    (e: React.DragEvent, targetNodeId: string) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up to parent elements

      // Get the dragged node ID
      const draggedNodeId = e.dataTransfer.getData("nodeId");

      console.log("MOVENODEDEBUG: handleDrop", draggedNodeId, targetNodeId);

      if (!draggedNodeId) {
        return;
      }

      // Validate and execute the move
      const isValidMove = validateMoveByID(draggedNodeId, targetNodeId);
      if (isValidMove) {
        const success = moveNodeByID(draggedNodeId, targetNodeId);

        if (!success) {
          console.error("DRAG_DROP_08: ERROR - move operation failed");
        }
      } else {
        console.log("DRAG_DROP_09: invalid move, operation cancelled", {
          draggedNodeId,
          targetNodeId,
        });
      }

      // Clear drop target highlighting
      setCurrentDropTarget(null);
    },
    [validateMoveByID, moveNodeByID]
  ); // Depend on store functions

  // Called when drag operation ends (regardless of success)
  const handleDragEnd = useCallback(() => {
    // Clear any remaining visual feedback
    setCurrentDropTarget(null);
  }, []); // No dependencies needed - just sets state

  // Helper to check if a node is currently a valid drop target
  const isValidDropTarget = useCallback((): boolean => {
    // Can't determine validity without knowing what's being dragged
    // This is used for static validation (like disabled state)
    return true; // Dynamic validation happens in handleDragOver
  }, []);

  // Helper to check if a target is currently being highlighted
  const isDropTarget = useCallback(
    (nodeId: string): boolean => {
      const result = currentDropTarget === nodeId;

      return result;
    },
    [currentDropTarget]
  ); // Depend on currentDropTarget

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
