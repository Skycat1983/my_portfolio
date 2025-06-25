# Drag & Drop System Architecture

## Overview

This document explains the drag and drop system for the desktop/file manager interface. The system allows users to drag nodes (files, folders, etc.) between different contexts: desktop, directory windows, and individual directory nodes.

## Core Components

### 1. `useNodeDrag.ts` - Central Drag Logic

**Location**: `src/components/nodes/hooks/useNodeDrag.ts`

The heart of the drag and drop system. Provides event handlers and state management for drag operations.

**Key Features**:

- Manages drag state (`currentDropTarget`)
- Provides validation during drag operations
- Handles actual move operations on drop
- Implements throttling to prevent excessive validation calls

**Critical Fix Applied**: Uses `useCallback` with proper dependencies and subscribes to `nodeMap` to prevent **stale closure issues** where drag handlers would reference outdated store functions.

```ts
// Subscribe to nodeMap to ensure callbacks update when data changes
const nodeMap = useNewStore((s) => s.nodeMap);
const moveNodeByID = useNewStore((s) => s.moveNodeByID);
const validateMoveByID = useNewStore((s) => s.validateMoveByID);

// Use callbacks with proper dependencies
const handleDrop = useCallback(
  (e, targetNodeId) => {
    // Uses fresh function references
  },
  [validateMoveByID, moveNodeByID]
);
```

### 2. `useNodeEvents.ts` - Node Behavior Integration

**Location**: `src/components/nodes/hooks/useNodeEvents.ts`

Integrates drag functionality with individual node components (files, folders, etc.).

**Responsibilities**:

- Creates drag handlers via `useNodeDrag()`
- Determines if node can be a drop target (only directories)
- Provides both drag source and drop target handlers
- Integrates with other node behaviors (click, selection, etc.)

```ts
const dragHandlers = useNodeDrag();
const canBeDropTarget = nodeType === "directory";

// Returns handlers for both drag source and drop target
return {
  dragSourceHandlers: { draggable: "true", onDragStart, onDragEnd },
  dropTargetHandlers: canBeDropTarget ? { onDragOver, onDragEnter, etc. } : {}
};
```

### 3. Container-Level Drag Handling

#### Desktop Container (`Desktop.tsx`)

```ts
const dragHandlers = useNodeDrag();
<div onDragOver={(e) => dragHandlers.handleDragOver(e, rootId)}>
  {/* Desktop content */}
</div>;
```

#### Directory Window Container (`DirectoryContent.tsx`)

```ts
const dragHandlers = useNodeDrag();
<div onDragOver={(e) => dragHandlers.handleDragOver(e, nodeId)}>
  <DirectoryLayout nodes={children} layout="window" />
</div>;
```

## Event Flow Architecture

### Drag Operation Sequence

1. **Drag Start**: User begins dragging a node

   ```
   Node Element → useNodeEvents → useNodeDrag.handleDragStart()
   ```

2. **Drag Over**: User drags over potential targets

   ```
   Target Element → useNodeEvents/Container → useNodeDrag.handleDragOver()
   ```

3. **Validation**: System validates if move is allowed

   ```
   useNodeDrag → Store.validateMoveByID() → Boolean result
   ```

4. **Drop**: User releases on valid target
   ```
   Target Element → useNodeEvents/Container → useNodeDrag.handleDrop() → Store.moveNodeByID()
   ```

### Event Propagation Hierarchy

**Desktop → Window Flow**:

```
Desktop Container (has drag handlers)
  ├── Window Container (event passthrough)
  │   ├── Window Content Area (event passthrough)
  │   │   ├── DirectoryContent (has drag handlers) ✓
  │   │   │   └── DirectoryLayout
  │   │   │       └── Individual Nodes (have drag handlers) ✓
```

**Key Design Decision**: Both **container-level** and **node-level** drag handlers are needed:

- **Container handlers**: Handle drops on empty space
- **Node handlers**: Handle drops on specific folders/directories

## Context-Aware Behavior

### Desktop Context (`layout="desktop"`)

- Nodes are arranged in desktop grid
- Container drops go to `rootId` (desktop)
- Double-click opens new windows

### Window Context (`layout="window"`)

- Nodes are arranged in window grid
- Container drops go to window's `nodeId` (current directory)
- Double-click navigates within window

## Critical Issues Solved

### 1. Stale Closure Problem

**Symptom**: Drag and drop only worked on second attempt

**Root Cause**: Store functions extracted at hook level captured stale references:

```ts
// ❌ BROKEN - Stale closure
const validateMoveByID = useNewStore((s) => s.validateMoveByID);
```

**Solution**: Subscribe to `nodeMap` + use `useCallback` with dependencies:

```ts
// ✅ FIXED - Fresh references
const nodeMap = useNewStore((s) => s.nodeMap); // Force updates
const validateMoveByID = useNewStore((s) => s.validateMoveByID);

const handleDrop = useCallback(
  (e, targetNodeId) => {
    // Function always has fresh store references
  },
  [validateMoveByID, moveNodeByID]
);
```

### 2. Desktop → Window Drag Failure

**Symptom**: Could drag from window to desktop, but not desktop to window

**Root Cause**: Windows lacked container-level drag handlers

**Solution**: Added `useNodeDrag()` to `DirectoryContent.tsx` to match desktop pattern

## Usage Patterns

### Adding Drag Support to New Node Types

1. Use `useNodeEvents()` in your node component:

```ts
const nodeBehavior = useNodeEvents({
  id: nodeId,
  nodeType: "your-type", // Only "directory" gets drop handlers
  onActivate: handleDoubleClick
});

return (
  <div
    {...nodeBehavior.dragSourceHandlers}      // Always included
    {...nodeBehavior.dropTargetHandlers}     // Only for directories
  >
```

### Adding Drag Support to New Container Types

1. Create drag handlers: `const dragHandlers = useNodeDrag()`
2. Apply to container element with target ID:

```ts
<div onDragOver={(e) => dragHandlers.handleDragOver(e, containerId)}>
```

## Store Integration

### Required Store Functions

- `validateMoveByID(nodeId, newParentId)`: Validates if move is allowed
- `moveNodeByID(nodeId, newParentId)`: Executes the move operation
- `nodeMap`: Node data (subscription needed for reactivity)

### Validation Rules

- Cannot move node into itself
- Cannot create circular references
- Cannot move to same parent (no-op)
- Cannot move non-existent nodes

## Performance Considerations

### Throttling

Validation is throttled to 100ms intervals to prevent excessive calls during drag operations:

```ts
const shouldValidate = now - lastValidationTime.current > 100;
```

### useCallback Dependencies

Callbacks only recreate when their specific dependencies change:

- `handleDragStart`: No dependencies (static)
- `handleDragOver`: `[validateMoveByID, currentDropTarget]`
- `handleDrop`: `[validateMoveByID, moveNodeByID]`

## Debugging

### Console Log Prefixes

- `DRAG_START_*`: Drag initiation
- `DRAG_OVER_*`: Validation and visual feedback
- `DRAG_DROP_*`: Drop execution
- `NODE_EVENTS_*`: Node-level event handling
- `DESKTOP_DRAG_*`: Desktop container events
- `WINDOW_DRAG_*`: Window container events

### Common Issues

1. **Second attempt bug**: Check for stale closures - ensure `nodeMap` subscription
2. **Events not reaching target**: Check event propagation hierarchy
3. **Validation failing**: Check store validation logic and console logs
4. **No visual feedback**: Check `currentDropTarget` state and styling

## Architecture Decisions

### Why Two-Level Drag Handling?

- **Node-level**: Precise targeting of specific folders
- **Container-level**: Catch-all for empty space drops

### Why Subscribe to nodeMap?

- Prevents stale closure issues with store functions
- Ensures drag handlers always have fresh data references
- Small performance cost for major reliability gain

### Why useCallback?

- Prevents unnecessary re-renders of child components
- Ensures drag handlers only update when their data dependencies change
- Critical for performance with many nodes on screen
