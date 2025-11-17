import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{ willChange: "opacity" }}
    >
      {children}
    </motion.div>
  );
}

