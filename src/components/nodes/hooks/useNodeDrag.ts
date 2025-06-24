import { useState, useRef, useCallback } from "react";
import { useNewStore } from "../../../hooks/useStore";

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
  const nodeMap = useNewStore((s) => s.nodeMap);
  const moveNodeByID = useNewStore((s) => s.moveNodeByID);
  const validateMoveByID = useNewStore((s) => s.validateMoveByID);

  // Throttle validation to prevent excessive console logging
  const lastValidationTime = useRef<number>(0);

  // Called when user starts dragging a node
  const handleDragStart = useCallback((e: React.DragEvent, nodeId: string) => {
    console.log("DRAG_START_01: starting drag for nodeId", nodeId);

    // Store the dragged node ID in the drag data
    e.dataTransfer.setData("nodeId", nodeId);

    // Set drag effect to indicate this is a move operation
    e.dataTransfer.effectAllowed = "move";

    // Customize the drag image opacity for better visual feedback
    e.dataTransfer.dropEffect = "move";

    console.log("DRAG_START_02: dataTransfer configured", {
      nodeId,
      effectAllowed: e.dataTransfer.effectAllowed,
      dropEffect: e.dataTransfer.dropEffect,
    });
  }, []); // No dependencies needed - drag start doesn't depend on store state

  // Called when dragging over a potential drop target
  const handleDragOver = useCallback(
    (e: React.DragEvent, targetNodeId?: string) => {
      console.log("DRAG_OVER_01: dragOver event", {
        targetNodeId,
        hasTarget: !!targetNodeId,
      });

      // Must preventDefault to allow drop
      e.preventDefault();

      // Stop propagation when we have a specific target to prevent desktop interference
      if (targetNodeId) {
        e.stopPropagation();
        console.log(
          "DRAG_OVER_02: stopped propagation for targetNodeId",
          targetNodeId
        );
      }

      // Get the dragged node ID from drag data
      const draggedNodeId = e.dataTransfer.getData("nodeId");
      console.log(
        "DRAG_OVER_03: retrieved draggedNodeId from dataTransfer",
        draggedNodeId
      );

      // Update visual feedback if we have a valid target
      if (targetNodeId && draggedNodeId) {
        console.log(
          "DRAG_OVER_04: both draggedNodeId and targetNodeId present",
          {
            draggedNodeId,
            targetNodeId,
          }
        );

        // Throttle validation to prevent excessive console logging
        const now = Date.now();
        const shouldValidate = now - lastValidationTime.current > 100; // Only validate every 100ms

        console.log("DRAG_OVER_05: throttling check", {
          now,
          lastValidationTime: lastValidationTime.current,
          timeDiff: now - lastValidationTime.current,
          shouldValidate,
        });

        let isValid = true; // Default to true to avoid blocking
        if (shouldValidate) {
          console.log("DRAG_OVER_06: performing validation");
          isValid = validateMoveByID(draggedNodeId, targetNodeId);
          lastValidationTime.current = now;
          console.log("DRAG_OVER_07: validation result", {
            isValid,
            draggedNodeId,
            targetNodeId,
            updatedLastValidationTime: lastValidationTime.current,
          });
        } else {
          console.log(
            "DRAG_OVER_08: skipping validation (throttled), using default isValid=true"
          );
        }

        // Set cursor based on validity
        e.dataTransfer.dropEffect = isValid ? "move" : "none";
        console.log("DRAG_OVER_09: set dropEffect", {
          isValid,
          dropEffect: e.dataTransfer.dropEffect,
        });

        // Update current drop target for highlighting
        if (currentDropTarget !== targetNodeId) {
          console.log("DRAG_OVER_10: updating currentDropTarget", {
            from: currentDropTarget,
            to: targetNodeId,
          });
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
      console.log("DRAG_ENTER_01: entering target", targetNodeId);

      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up

      console.log("DRAG_ENTER_02: setting currentDropTarget to", targetNodeId);
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
      console.log("DRAG_DROP_01: drop event on target", targetNodeId);

      e.preventDefault();
      e.stopPropagation(); // Prevent event from bubbling up to parent elements

      // Get the dragged node ID
      const draggedNodeId = e.dataTransfer.getData("nodeId");
      console.log("DRAG_DROP_02: retrieved draggedNodeId", draggedNodeId);

      if (!draggedNodeId) {
        console.log("DRAG_DROP_03: ERROR - no dragged node ID found");
        return;
      }

      // Validate and execute the move
      console.log("DRAG_DROP_04: performing final validation");
      const isValidMove = validateMoveByID(draggedNodeId, targetNodeId);
      console.log("DRAG_DROP_05: final validation result", {
        isValidMove,
        draggedNodeId,
        targetNodeId,
      });

      if (isValidMove) {
        console.log("DRAG_DROP_06: executing move operation");
        const success = moveNodeByID(draggedNodeId, targetNodeId);
        console.log("DRAG_DROP_07: move operation result", {
          success,
          draggedNodeId,
          targetNodeId,
        });

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
      console.log("DRAG_DROP_10: clearing currentDropTarget");
      setCurrentDropTarget(null);
    },
    [validateMoveByID, moveNodeByID]
  ); // Depend on store functions

  // Called when drag operation ends (regardless of success)
  const handleDragEnd = useCallback(() => {
    console.log("DRAG_END_01: drag operation ended");

    // Clear any remaining visual feedback
    console.log("DRAG_END_02: clearing currentDropTarget");
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
      console.log("DRAG_TARGET_CHECK: isDropTarget called", {
        nodeId,
        currentDropTarget,
        result,
      });
      return result;
    },
    [currentDropTarget]
  ); // Depend on currentDropTarget

  // Use nodeMap to ensure the hook updates when node data changes
  // This prevents stale closure issues
  console.log(
    "NODE_DRAG_HOOK: nodeMap has",
    Object.keys(nodeMap).length,
    "nodes"
  );

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
