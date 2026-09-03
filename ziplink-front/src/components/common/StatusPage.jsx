import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import Logo from "./Logo";
import { ROUTES } from "../../constants/routes";

export default function StatusPage({ code, icon: Icon, title, description, actionLabel = "Back to home", actionTo = ROUTES.HOME, secondaryAction }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
        <Logo />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex max-w-md flex-col items-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-accent">
          <Icon className="h-7 w-7" />
        </div>
        {code && <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-body/70">Error {code}</p>}
        <h1 className="mt-2 text-3xl font-semibold text-balance text-heading sm:text-4xl">{title}</h1>
        <p className="mt-3 text-balance text-sm leading-relaxed text-body">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={actionTo}>
            <Button>{actionLabel}</Button>
          </Link>
          {secondaryAction}
        </div>
      </motion.div>
    </div>
  );
}
