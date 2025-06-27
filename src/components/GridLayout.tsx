import React from "react";
import { cn } from "../lib/utils";

// Types for GridCell component
interface GridCellProps {
  children: React.ReactNode;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  rowSpan?: 1 | 2 | 3 | 4;
  colStart?: 1 | 2 | 3 | 4 | 5 | 6;
  rowStart?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  bgColor?: string;
}

// GridCell component - allows granular control over grid placement
const GridCell: React.FC<GridCellProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  colStart,
  rowStart,
  className = "",
  bgColor = "bg-blue-100",
}) => {
  return (
    <div
      className={cn(
        // Base styles
        "text-center shadow-md hover:shadow-lg transition-shadow duration-200",
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
        // Column starts - explicit positioning
        colStart === 1 && "col-start-1",
        colStart === 2 && "col-start-2",
        colStart === 3 && "col-start-3",
        colStart === 4 && "col-start-4",
        colStart === 5 && "col-start-5",
        colStart === 6 && "col-start-6",
        // Row starts - explicit positioning
        rowStart === 1 && "row-start-1",
        rowStart === 2 && "row-start-2",
        rowStart === 3 && "row-start-3",
        rowStart === 4 && "row-start-4",
        rowStart === 5 && "row-start-5",
        rowStart === 6 && "row-start-6",
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
        "grid grid-cols-6 gap-4 w-full h-screen bg-red-100/10",
        "grid-rows-[auto_1fr_auto]",
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
    <div className="min-h-screen z-9999">
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

export { GridCell, GridLayout, GridLayoutDemo };
