import { motion } from "framer-motion";

const techs = [
  { label: "React", emoji: "⚛️" },
  { label: "Node.js", emoji: "🟢" },
  { label: "JavaScript", emoji: "🌐" },
];

export default function TechOrbit() {
  return (
    <div className="relative flex h-48 w-full items-center justify-center sm:h-60">
      <div className="absolute inset-0 rounded-full border border-line/70" />
      <div className="absolute inset-8 rounded-full border border-line/50" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute h-40 w-40 rounded-full border border-copper/30"
      />
      {techs.map((tech, index) => (
        <motion.div
          key={tech.label}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8 + index * 2, repeat: Infinity, ease: "linear" }}
          className="absolute"
          style={{
            transform: `rotate(${index * 120}deg) translateY(-90px) rotate(-${index * 120}deg)`,
          }}
        >
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3 py-2 text-sm text-ink-dim shadow-lg">
            <span className="text-lg">{tech.emoji}</span>
            {tech.label}
          </div>
        </motion.div>
      ))}
      <div className="rounded-full border border-copper/40 bg-surface/80 px-4 py-3 text-center shadow-xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-copper-soft">iot / embedded</p>
        <p className="mt-2 font-display text-lg text-ink">⚡ connected systems</p>
      </div>
    </div>
  );
}
