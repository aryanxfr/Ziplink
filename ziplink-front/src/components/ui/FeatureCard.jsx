import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-border bg-surface p-7 shadow-soft transition-shadow hover:shadow-soft-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-accent">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-heading">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{description}</p>
    </motion.div>
  );
}
