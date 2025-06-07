import { MenubarLayout } from "../components/menubar/MenubarLayout";
import { useStore } from "../hooks/useStore";

export const Desktop = () => {
  // Test our new store structure
  const { rootId, getChildren, debugGetObjectTree } = useStore();

  const desktopChildren = getChildren(rootId);
  console.log("4. Desktop children (actual nodes):", desktopChildren);

  // Test reverse conversion
  console.log("7. Testing reverse conversion (map → object):");
  debugGetObjectTree();

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden">
      <MenubarLayout />
      <div className="p-10 h-full">
        <div className="flex flex-col flex-wrap-reverse content-start w-full gap-10 h-full">
          {desktopChildren.map((node) => (
            <div key={node.id} className="text-white">
              <div className="p-4 w-[120px] h-[120px] flex flex-col items-center justify-center cursor-pointer rounded-md">
                <img src={node.image} alt={node.label} className="w-12 h-12" />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold text-white p-2">
                  {node.label}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
