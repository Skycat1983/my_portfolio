import { Loader } from "lucide-react";
import { motion } from "framer-motion";

/**
 * A simple loading spinner component using Lucide's Loader icon
 * and Framer Motion for smooth rotation animation.
 */
export default function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="flex items-center justify-center p-4"
    >
      <Loader className="h-18 w-18 text-white" />
    </motion.div>
  );
}
