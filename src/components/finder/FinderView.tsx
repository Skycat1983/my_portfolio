// FinderView.tsx
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Columns3, Grid2x2, List, UnfoldVertical } from "lucide-react";

export type FinderViewProps = {
  /** current view mode */
  view: "icons" | "list" | "columns";
  /** handler to switch modes */
  onChangeView: (mode: "icons" | "list" | "columns") => void;
  /** zIndex offset for layering */
  zIndex?: number;
} & React.ComponentProps<typeof DropdownMenu>;

const getIcon = (view: "icons" | "list" | "columns") => {
  if (view === "icons") {
    return <Grid2x2 className="size-4" />;
  }
  if (view === "list") {
    return <List className="size-4" />;
  }
  if (view === "columns") {
    return <Columns3 className="size-4" />;
  }
};

export const FinderView: React.FC<FinderViewProps> = ({
  view,
  onChangeView,
  zIndex = 0,
  ...menuProps
}) => {
  const menuZ = zIndex + 1;

  return (
    <DropdownMenu {...menuProps} data-slot="finder-view">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          {getIcon(view)}
          <UnfoldVertical className="size-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={4}
        style={{ zIndex: menuZ }}
        className="bg-neutral-900"
      >
        <DropdownMenuRadioGroup
          value={view}
          onValueChange={(value) =>
            onChangeView(value as "icons" | "list" | "columns")
          }
        >
          <DropdownMenuRadioItem value="icons">as Icons</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="list">as List</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="columns">
            as Columns
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
