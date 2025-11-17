import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function LoadingOverlay({ loading }) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#121420] pointer-events-auto"
          style={{ willChange: "opacity" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform, opacity" }}
          >
            <Spinner size={64} variant={"ring"} className="text-yellow-500" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

