// Window sizing utilities

// Base window size configuration
const BASE_WINDOW = {
  width: 400,
  height: 300,
  minWidth: 350,
  minHeight: 250,
  maxWidth: 800,
  maxHeight: 600,
};

// Item size estimates for content calculation
const ITEM_METRICS = {
  itemWidth: 80, // Approximate width of each node item
  itemHeight: 100, // Approximate height of each node item (icon + label)
  padding: 24, // Window content padding (12px * 2)
  gap: 16, // Gap between items (4 * 4px from gap-4)
  titleBarHeight: 28,
  itemsPerRow: 4, // Target items per row before wrapping
};

/**
 * Calculate optimal window size based on the number of items
 */
export const calculateWindowSize = (
  itemCount: number
): { w: number; h: number } => {
  console.log("calculateWindowSize: calculating size for", itemCount, "items");

  if (itemCount === 0) {
    // Empty folder - use smaller size
    return {
      w: BASE_WINDOW.minWidth,
      h: BASE_WINDOW.minHeight,
    };
  }

  // Calculate rows needed
  const rows = Math.ceil(itemCount / ITEM_METRICS.itemsPerRow);
  const cols = Math.min(itemCount, ITEM_METRICS.itemsPerRow);

  // Calculate content dimensions
  const contentWidth =
    cols * ITEM_METRICS.itemWidth +
    (cols - 1) * ITEM_METRICS.gap +
    ITEM_METRICS.padding;

  const contentHeight =
    rows * ITEM_METRICS.itemHeight +
    (rows - 1) * ITEM_METRICS.gap +
    ITEM_METRICS.padding +
    ITEM_METRICS.titleBarHeight;

  // Apply constraints
  const w = Math.max(
    BASE_WINDOW.minWidth,
    Math.min(BASE_WINDOW.maxWidth, contentWidth)
  );

  const h = Math.max(
    BASE_WINDOW.minHeight,
    Math.min(BASE_WINDOW.maxHeight, contentHeight)
  );

  console.log(
    "calculateWindowSize: calculated size",
    { w, h },
    "for",
    itemCount,
    "items"
  );
  return { w, h };
};

/**
 * Calculate staggered position for new windows to avoid overlap
 */
export const calculateWindowPosition = (
  windowIndex: number
): { x: number; y: number } => {
  const STAGGER_OFFSET = 30; // Offset for each new window
  const SCREEN_MARGIN = 50; // Margin from screen edges

  // Create a staggered pattern that wraps around
  const maxStaggerCount = 8; // After 8 windows, start over
  const staggerIndex = windowIndex % maxStaggerCount;

  const x = SCREEN_MARGIN + staggerIndex * STAGGER_OFFSET;
  const y = SCREEN_MARGIN + staggerIndex * STAGGER_OFFSET;

  console.log(
    "calculateWindowPosition: calculated position",
    { x, y },
    "for window index",
    windowIndex
  );
  return { x, y };
};

/**
 * Get size category for debugging/logging
 */
export const getWindowSizeCategory = (itemCount: number): string => {
  if (itemCount === 0) return "empty";
  if (itemCount <= 2) return "small";
  if (itemCount <= 6) return "medium";
  if (itemCount <= 12) return "large";
  return "extra-large";
};
