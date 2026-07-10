import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-ink-muted">
          © {year} Md. Shahriyar Rahim — built with the MERN stack.
        </p>
        <div className="flex items-center gap-5 text-lg text-ink-dim">
          <a href="https://github.com/Shahriyar-Rahim" target="_blank" rel="noreferrer" className="hover:text-copper-soft transition-colors" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-copper-soft transition-colors" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://www.facebook.com/mdshahriyarrahim/" target="_blank" rel="noreferrer" className="hover:text-copper-soft transition-colors" aria-label="Facebook">
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}
