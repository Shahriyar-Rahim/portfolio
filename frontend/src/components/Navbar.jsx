import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router";

const LINKS = [
  { to: "/#about", label: "about" },
  { to: "/#experience", label: "experience" },
  { to: "/#services", label: "services" },
  { to: "/blog", label: "blog" },
  { to: "/#contact", label: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-bg/90 backdrop-blur-md border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-mono text-lg text-ink">
          <span className="text-copper">&gt;</span>shahriyar
          <span className="animate-pulse text-copper">_</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="font-mono text-sm text-ink-dim hover:text-copper-soft transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-ink text-2xl"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-line bg-bg px-6 py-4 flex flex-col gap-4"
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.to}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-ink-dim"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </header>
  );
}
