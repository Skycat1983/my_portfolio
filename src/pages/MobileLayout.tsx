import GridLayout, { GridCell } from "../components/GridLayout";

export const MobileLayout = () => {
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
