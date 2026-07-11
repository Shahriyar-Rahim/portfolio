import { AnimatePresence, motion } from "framer-motion";
import { HiCheck } from "react-icons/hi";

export default function ThankYouModal({ open, title, message, actions }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 18, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ok/15 text-ok">
              <HiCheck className="text-3xl" />
            </div>
            <h3 className="font-display text-2xl text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink-dim">{message}</p>
            {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
