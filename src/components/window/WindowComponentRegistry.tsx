import type { ComponentType } from "react";
import type { WindowContentProps } from "../../types/storeTypes";
import { DocumentEditor } from "../apps/document/DocumentEditor";

// Test component to demonstrate the flexible system
const TestCustomComponent = ({ window }: WindowContentProps) => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 h-full">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🎉 Custom Component Test
        </h2>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Window ID:</p>
            <p className="text-sm font-mono text-blue-800">{window.windowId}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Node ID:</p>
            <p className="text-sm font-mono text-green-800">{window.nodeId}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Window Title:</p>
            <p className="text-sm font-mono text-purple-800">{window.title}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Node Type:</p>
            <p className="text-sm font-mono text-yellow-800">
              {window.nodeType}
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-gray-700">
            ✅ <strong>Success!</strong> This window is being rendered by a
            custom component specified through the new flexible component
            system.
          </p>
        </div>
      </div>
    </div>
  );
};

// Component registry mapping component keys to React components
export const WINDOW_COMPONENT_REGISTRY: Record<
  string,
  ComponentType<WindowContentProps>
> = {
  testCustom: DocumentEditor,
  documentEditor: DocumentEditor,
  // Add more custom components here as needed
  // customEditor: CustomEditorComponent,
  // customDashboard: CustomDashboardComponent,
};

// Type-safe function to get component by key
export const getWindowComponent = (
  componentKey: string
): ComponentType<WindowContentProps> | undefined => {
  return WINDOW_COMPONENT_REGISTRY[componentKey];
};

// Get all available component keys (useful for debugging/development)
export const getAvailableComponentKeys = (): string[] => {
  return Object.keys(WINDOW_COMPONENT_REGISTRY);
};
