import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';

const LINKS = [
  { href: "https://github.com/faa35", label: "GitHub", Icon: FaGithub },
  { href: "https://www.linkedin.com/in/fardin-abdulla/", label: "LinkedIn", Icon: FaLinkedin },
  { href: "mailto:abdullafardin2202@gmail.com", label: "Email", Icon: FaEnvelope },
  { href: "https://www.instagram.com/acanto_abdulla/", label: "Instagram", Icon: FaInstagram },
];

const Footer = () => {
  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] py-8 text-[13px] text-[var(--muted)] sm:flex-row">
      <p>
        © {new Date().getFullYear()} Fardin Abdulla · Built with Next.js
      </p>
      <div className="flex items-center gap-1">
        {LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-[var(--accent-soft)] hover:text-[var(--text)]"
          >
            <Icon size={17} />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
