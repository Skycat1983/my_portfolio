export const formatDisplayValue = (val: string): string => {
  const num = parseFloat(val);

  // Handle special cases
  if (val === "" || val === "0") return "0";
  if (isNaN(num)) return val;

  // Format large numbers with exponential notation
  if (Math.abs(num) >= 1e12) {
    return num.toExponential(6);
  }

  // Format numbers with proper decimal places
  if (val.includes(".")) {
    // Limit decimal display to fit in smaller window
    const parts = val.split(".");
    if (parts[1] && parts[1].length > 8) {
      return parseFloat(val).toFixed(8);
    }
    return val;
  }

  // Add comma separators for large whole numbers (but be mindful of space)
  if (Math.abs(num) >= 1000 && val.length <= 12) {
    return num.toLocaleString();
  }

  return val;
};
