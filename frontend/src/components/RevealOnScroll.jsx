import { motion } from "framer-motion";

// Shared scroll-reveal wrapper so every section animates in consistently
// instead of each page hand-rolling its own motion props.
export default function RevealOnScroll({
  children,
  delay = 0,
  y = 24,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
