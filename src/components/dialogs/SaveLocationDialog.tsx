import { useState, useMemo } from "react";
import { useNewStore } from "@/hooks/useStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { systemRootId, desktopRootId } from "@/constants/nodeHierarchy";
import { theme } from "@/styles/theme";

interface DirectoryOption {
  value: string;
  label: string;
  fullPath: string;
  isSeparator?: boolean;
}

interface SaveLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLocation: string;
  initialLabel: string;
  onSave: (location: string, label: string) => void;
}

export const SaveLocationDialog = ({
  open,
  onOpenChange,
  initialLocation,
  initialLabel,
  onSave,
}: SaveLocationDialogProps) => {
  const themeMode = useNewStore((s) => s.theme);
  const backgroundColor = theme.colors[themeMode].background.primary;
  const backgroundSecondary = theme.colors[themeMode].background.secondary;
  const textColor = theme.colors[themeMode].text.primary;
  const buttonColor = theme.colors[themeMode].background.tertiary;
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [label, setLabel] = useState(initialLabel);

  // Store selectors
  const getCurrentNodeMap = useNewStore((s) => s.getCurrentNodeMap);
  const isUniqueNodePropertyValue = useNewStore(
    (s) => s.isUniqueNodePropertyValue
  );

  // Build directory options with hierarchy and separators
  const directoryOptions = useMemo(() => {
    const nodeMap = getCurrentNodeMap();
    const directories = Object.values(nodeMap)
      .filter((node) => node.type === "directory")
      .sort((a, b) => a.label.localeCompare(b.label));

    console.log("SaveLocationDialog: found directories", directories.length);

    // Helper to get full path for a directory
    const getDirectoryPath = (nodeId: string): string => {
      const node = nodeMap[nodeId];
      if (!node || node.id === systemRootId) return node?.label || "Root";

      if (!node.parentId) return node.label;

      const parent = nodeMap[node.parentId];
      if (!parent || parent.id === systemRootId) return node.label;

      return `${getDirectoryPath(parent.id)} > ${node.label}`;
    };

    // Build grouped hierarchy with separators
    const buildGroupedHierarchy = (): DirectoryOption[] => {
      const options: DirectoryOption[] = [];

      // 1. System root direct children (including desktop root)
      const systemChildren = directories
        .filter((dir) => dir.parentId === systemRootId)
        .map((dir) => ({
          value: dir.id,
          label: dir.label,
          fullPath: getDirectoryPath(dir.id),
        }));

      options.push(...systemChildren);

      // Add separator after system root children
      if (systemChildren.length > 0) {
        options.push({
          value: "separator-1",
          label: "────────────",
          fullPath: "",
          isSeparator: true,
        });
      }

      // 2. Desktop root direct children
      const desktopChildren = directories
        .filter((dir) => dir.parentId === desktopRootId)
        .map((dir) => ({
          value: dir.id,
          label: dir.label,
          fullPath: getDirectoryPath(dir.id),
        }));

      options.push(...desktopChildren);

      // Add separator after desktop root children
      if (desktopChildren.length > 0) {
        options.push({
          value: "separator-2",
          label: "────────────",
          fullPath: "",
          isSeparator: true,
        });
      }

      // 3. All other directories (not direct children of system or desktop root)
      const otherDirectories = directories
        .filter(
          (dir) =>
            dir.parentId !== systemRootId &&
            dir.parentId !== desktopRootId &&
            dir.id !== systemRootId &&
            dir.id !== desktopRootId
        )
        .map((dir) => ({
          value: dir.id,
          label: dir.label,
          fullPath: getDirectoryPath(dir.id),
        }));

      options.push(...otherDirectories);

      return options;
    };

    const options = buildGroupedHierarchy();
    console.log("SaveLocationDialog: built grouped options", options);
    return options;
  }, [getCurrentNodeMap]);

  // Validate label uniqueness in selected location
  const isValidLabel = useMemo(() => {
    if (!label.trim()) return false;

    return isUniqueNodePropertyValue(label, "label", {
      predicate: (node) => node.parentId === selectedLocation,
    });
  }, [label, selectedLocation, isUniqueNodePropertyValue]);

  // Dynamic placeholder based on validation
  const validationMessage = useMemo(() => {
    if (!label.trim()) return "Enter document name";
    return isValidLabel
      ? `"${label}" is available`
      : `"${label}" already exists in this location`;
  }, [label, isValidLabel]);

  // Find the selected directory for display (excluding separators)
  const selectedDirectory = directoryOptions.find(
    (option) => option.value === selectedLocation && !option.isSeparator
  );

  const isValidSave =
    label.trim() &&
    isValidLabel &&
    selectedDirectory &&
    !selectedDirectory.isSeparator;

  const handleSave = () => {
    if (isValidSave) {
      onSave(selectedLocation, label.trim());
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        style={{
          backgroundColor: backgroundSecondary,
          color: textColor,
          //   borderColor: buttonColor,
        }}
      >
        <DialogHeader>
          <DialogTitle>Save Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Select */}
          <div className="space-y-2">
            <Label htmlFor="location">Save Location</Label>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <SelectValue
                  style={{ color: textColor, borderColor: buttonColor }}
                  placeholder="Select save location"
                  title={selectedDirectory?.fullPath}
                >
                  {selectedDirectory?.label || "Select location..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: backgroundColor }}>
                {directoryOptions.map((option) =>
                  option.isSeparator ? (
                    <div key={option.value} className="px-2 py-1">
                      <Separator style={{ backgroundColor: buttonColor }} />
                    </div>
                  ) : (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      title={option.fullPath}
                      style={{ color: textColor }}
                    >
                      {option.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {selectedDirectory && (
              <p className="text-sm text-muted-foreground">
                Path: {selectedDirectory.fullPath}
              </p>
            )}
          </div>

          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="filename" style={{ color: textColor }}>
              Document Name
            </Label>
            <Input
              id="filename"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={validationMessage}
              className={!isValidLabel && label.trim() ? "border-red-500" : ""}
            />
            <p
              className={`text-sm ${
                isValidLabel ? "text-green-600" : "text-red-600"
              }`}
            >
              {validationMessage}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            style={{ backgroundColor: buttonColor, color: textColor }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValidSave}
            style={{ backgroundColor: buttonColor, color: textColor }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
