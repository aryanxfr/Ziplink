import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Link2, Share2, BarChart3, LayoutDashboard, TrendingUp, ArrowRight } from "lucide-react";
import Section, { SectionHeading } from "../components/common/Section";
import Button from "../components/ui/Button";
import { ROUTES } from "../constants/routes";

const STEPS = [
  { icon: UserPlus, title: "Create an account", description: "Sign up with your email in under a minute — no credit card needed." },
  { icon: Link2, title: "Shorten a URL", description: "Paste any long link and get a short, clean ZipLink instantly." },
  { icon: Share2, title: "Share it anywhere", description: "Post it, message it, or embed it — it works everywhere a link does." },
  { icon: BarChart3, title: "Track analytics", description: "Watch clicks roll in with location, device, and referrer detail." },
  { icon: LayoutDashboard, title: "Manage your links", description: "Search, filter, deactivate, or delete links from one dashboard." },
  { icon: TrendingUp, title: "Gain insights", description: "Spot what's resonating and double down on what's working." },
];

export default function HowItWorks() {
  return (
    <div>
      <Section className="pb-8 pt-16 text-center lg:pt-20">
        <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-accent">How it works</span>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold text-balance text-heading sm:text-5xl">
          Six steps from long link to real insight
        </h1>
      </Section>

      <Section className="pt-0">
        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-border sm:left-1/2" />
          <div className="space-y-10">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4 }}
                className={`relative flex items-start gap-5 sm:w-1/2 ${
                  i % 2 === 0 ? "sm:pr-10" : "sm:ml-auto sm:pl-10 sm:text-left"
                }`}
              >
                <span className="absolute -left-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-soft sm:static">
                  <step.icon className="h-5 w-5" />
                </span>
                <div className="pl-16 sm:pl-0">
                  <h3 className="text-lg font-semibold text-heading">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded-[2.5rem] bg-accent px-8 py-14 text-center sm:px-16">
          <h2 className="text-3xl font-semibold text-white">Ready to try it yourself?</h2>
          <p className="mx-auto mt-3 max-w-sm text-white/80">Create your first ZipLink in under a minute.</p>
          <Link to={ROUTES.REGISTER}>
            <Button size="lg" variant="ghost" icon={ArrowRight} iconPosition="right" className="mt-7 bg-white text-heading font-semibold shadow-soft hover:bg-white/90 hover:text-heading">
              Get started free
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}
