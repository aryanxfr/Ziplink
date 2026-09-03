import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../ui/Button";

export default function AuthMessage({ icon: Icon, tone = "primary", title, description, actionLabel, actionTo, secondary }) {
  const toneClasses = {
    primary: "bg-primary/10 text-accent",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl ${toneClasses[tone]}`}>
        <Icon className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold text-heading">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button className="mt-8 w-full">{actionLabel}</Button>
        </Link>
      )}
      {secondary}
    </motion.div>
  );
}
