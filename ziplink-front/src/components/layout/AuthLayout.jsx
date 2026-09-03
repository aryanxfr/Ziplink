import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../common/Logo";
import { BRAND } from "../../constants/brand";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <Logo />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto w-full max-w-sm py-10"
        >
          <Outlet />
        </motion.div>
        <p className="text-xs text-body/70">© {new Date().getFullYear()} {BRAND.name}</p>
      </div>
      <div className="relative hidden overflow-hidden bg-accent lg:block">
        <div className="absolute inset-0 flex flex-col justify-center px-14 text-white">
          <span className="text-sm font-medium uppercase tracking-widest text-white/70">{BRAND.tagline}</span>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-balance">
            Every link, shortened, shared and understood.
          </h2>
          <p className="mt-5 max-w-sm text-white/80">
            Track clicks, manage campaigns, and control link lifetimes — all from one clean dashboard.
          </p>
        </div>
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -top-16 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  );
}
