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
