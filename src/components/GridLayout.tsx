import React from "react";
import { cn } from "../lib/utils";

// Types for GridCell component
interface GridCellProps {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  rowSpan?: 1 | 2 | 3 | 4;
  className?: string;
  bgColor?: string;
}

// GridCell component - allows granular control over grid placement
const GridCell: React.FC<GridCellProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = "",
  bgColor = "bg-blue-100",
}) => {
  return (
    <div
      className={cn(
        // Base styles
        "border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center text-center shadow-md hover:shadow-lg transition-shadow duration-200",
        // Background color
        bgColor,
        // Column spans - hardcoded to ensure Tailwind includes them
        colSpan === 1 && "col-span-1",
        colSpan === 2 && "col-span-2",
        colSpan === 3 && "col-span-3",
        colSpan === 4 && "col-span-4",
        colSpan === 5 && "col-span-5",
        colSpan === 6 && "col-span-6",
        // Row spans - hardcoded to ensure Tailwind includes them
        rowSpan === 1 && "row-span-1",
        rowSpan === 2 && "row-span-2",
        rowSpan === 3 && "row-span-3",
        rowSpan === 4 && "row-span-4",
        // Custom className
        className
      )}
    >
      {children}
    </div>
  );
};

// Types for GridLayout component
interface GridLayoutProps {
  children: React.ReactNode;
  className?: string;
}

// GridLayout component - main grid container with fixed 6x4 grid
const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-6 gap-4 w-full p-6 bg-gradient-to-br from-gray-50 to-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
};

// Demo component showcasing basic grid capabilities
const GridLayoutDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 z-9999">
      <div className="p-6">
        <GridLayout className="min-h-96">
          {/* Header spanning full width */}
          <GridCell
            colSpan={6}
            bgColor="bg-purple-200"
            className="text-xl font-bold text-purple-800"
          >
            Header (col-span-6)
          </GridCell>

          {/* Sidebar */}
          <GridCell
            rowSpan={3}
            bgColor="bg-green-200"
            className="text-green-800 font-semibold"
          >
            Sidebar
            <br />
            (row-span-3)
          </GridCell>

          {/* Main content */}
          <GridCell
            colSpan={3}
            rowSpan={2}
            bgColor="bg-blue-200"
            className="text-blue-800 text-lg"
          >
            Main Content
            <br />
            (col-span-3, row-span-2)
          </GridCell>

          {/* Right widgets */}
          <GridCell
            colSpan={2}
            bgColor="bg-yellow-200"
            className="text-yellow-800"
          >
            Widget 1<br />
            (col-span-2)
          </GridCell>

          <GridCell bgColor="bg-red-200" className="text-red-800">
            Small
          </GridCell>

          <GridCell bgColor="bg-pink-200" className="text-pink-800">
            Cell
          </GridCell>

          {/* Bottom row */}
          <GridCell
            colSpan={2}
            bgColor="bg-indigo-200"
            className="text-indigo-800"
          >
            Footer Left
            <br />
            (col-span-2)
          </GridCell>

          <GridCell colSpan={3} bgColor="bg-teal-200" className="text-teal-800">
            Footer Center (col-span-3)
          </GridCell>

          <GridCell bgColor="bg-orange-200" className="text-orange-800">
            End
          </GridCell>
        </GridLayout>
      </div>
    </div>
  );
};

export { GridLayout, GridCell, GridLayoutDemo };
export default GridLayoutDemo;
