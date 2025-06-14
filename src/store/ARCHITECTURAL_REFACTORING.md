# Store Architecture Refactoring: Hook Interface Layer

## Current State Analysis

### Problems with Current Architecture

1. **Duplication**: Multiple slices have similar patterns and repetitive logic
2. **Overly Specific Actions**: Actions like `downloadEgg` are specialized versions of generic actions like `createNode`
3. **Bloated Slices**: Some slices (nodeSlice.ts - 608 lines) contain both generic and highly specific logic
4. **Tight Coupling**: Components directly consume specific state actions

### Examples of Duplication

- `nodeSlice.ts`: `downloadEgg` vs `createNode`
- Terminal commands: Repetitive path resolution logic in `terminalLs`, `terminalCd`, `terminalCat`
- File system operations: Similar validation patterns across multiple methods

## Proposed Architecture: Hook Interface Layer

### Core Concept

Use hooks as an interface/facade layer between state slices and components. This creates:

- **Generic state actions** (minimal, reusable)
- **Domain-specific hooks** (pre-configured, composed functionality)
- **Clean component interfaces** (semantic, business-logic focused)

### Architecture Layers

```
Components
    ↓
Hooks (Interface Layer)
    ↓
State Slices (Generic Actions)
    ↓
Store
```

### Benefits

1. **Reduced Duplication**: Generic actions reused through different hook configurations
2. **Better Separation of Concerns**: State handles data, hooks handle business logic
3. **Improved Testability**: Can test business logic in hooks independently
4. **Enhanced Maintainability**: Changes to business logic don't require state changes
5. **Consistent Patterns**: All achievements follow same state→hook→component pattern

## Implementation Examples

### Current Pattern (Before)

```typescript
// nodeSlice.ts
downloadEgg: () => {
  // Specific logic for downloading eggs
  // Duplicates createNode logic
};

// Component
const downloadEgg = useNewStore((state) => state.downloadEgg);
```

### Proposed Pattern (After)

```typescript
// nodeSlice.ts - Generic action
createNode: (nodeConfig: NodeConfig) => {
  // Generic node creation logic
};

// useNodeOperations.ts - Hook interface
export const useNodeOperations = () => {
  const createNode = useNewStore((state) => state.createNode);

  const downloadEgg = () =>
    createNode({
      type: "easter-egg",
      parentId: "downloads",
      label: "Egg",
      // ... other egg-specific config
    });

  return { downloadEgg };
};

// Component
const { downloadEgg } = useNodeOperations();
```

## Refactoring Strategy

### Phase 1: Hook Interface for New Features

- Implement hook pattern for new achievements
- Use existing specific actions but access through hooks
- Establish pattern consistency

### Phase 2: Consolidate Similar Actions

- Identify groups of similar actions (e.g., terminal commands)
- Create generic base actions
- Migrate specific actions to hook layer

### Phase 3: Slice Simplification

- Remove redundant specific actions
- Keep only generic, reusable actions in slices
- Move all business logic to hooks

## Specific Refactoring Candidates

### High Priority

1. **Node Operations**: `downloadEgg` → `createNode` with hook configuration
2. **Terminal Commands**: Consolidate path resolution logic
3. **File System Operations**: Generic file/folder operations

### Medium Priority

1. **Window Management**: Consolidate window state operations
2. **Browser Operations**: Generic browser action patterns

### Low Priority

1. **Weather/System**: Already quite generic
2. **Selection**: Minimal and focused

## Implementation Guidelines

### Hook Naming Convention

- `useNodeOperations` - for node-related business logic
- `useFileSystemOperations` - for file system operations
- `useAchievementOperations` - for achievement-related logic

### State Action Principles

- Keep actions generic and reusable
- Avoid business logic in state layer
- Focus on pure data manipulation

### Hook Interface Principles

- Provide semantic, business-focused methods
- Handle complex parameter configuration
- Compose multiple state actions when needed
- Maintain backward compatibility during migration

## Migration Path

1. **Identify** groups of related functionality
2. **Create** hook interfaces for new patterns
3. **Migrate** components to use hooks
4. **Consolidate** redundant state actions
5. **Refactor** remaining specific actions to generic ones
6. **Clean up** unused code

This approach aligns with the achievement system pattern and creates a more maintainable, scalable architecture.
