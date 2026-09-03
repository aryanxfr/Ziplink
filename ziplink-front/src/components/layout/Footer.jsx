import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import Logo from "../common/Logo";
import { ROUTES } from "../../constants/routes";
import { BRAND } from "../../constants/brand";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", to: ROUTES.HOW_IT_WORKS },
      { label: "Dashboard", to: ROUTES.DASHBOARD },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: ROUTES.ABOUT },
      { label: "Contact", to: ROUTES.CONTACT },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", to: ROUTES.LOGIN },
      { label: "Create account", to: ROUTES.REGISTER },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-body">{BRAND.tagline}</p>
            <div className="mt-5 flex items-center gap-3">
              <a href={BRAND.github} target="_blank" rel="noreferrer" className="text-body hover:text-heading">
                <Github className="h-4.5 w-4.5" />
              </a>
              <a href={BRAND.linkedin} target="_blank" rel="noreferrer" className="text-body hover:text-heading">
                <Linkedin className="h-4.5 w-4.5" />
              </a>
              <a href={`mailto:${BRAND.email}`} className="text-body hover:text-heading">
                <Mail className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-heading">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-body hover:text-heading">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-body/80">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="text-xs text-body/80">{BRAND.location}</p>
        </div>
      </div>
    </footer>
  );
}
