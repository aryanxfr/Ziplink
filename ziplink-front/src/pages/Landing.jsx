import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Link2,
  BarChart3,
  ShieldCheck,
  Clock,
  Zap,
  LayoutDashboard,
  ChevronDown,
  MousePointerClick,
} from "lucide-react";
import Button from "../components/ui/Button";
import FeatureCard from "../components/ui/FeatureCard";
import Card from "../components/ui/Card";
import Section, { SectionHeading } from "../components/common/Section";
import { ROUTES } from "../constants/routes";

const FEATURES = [
  { icon: Link2, title: "URL Shortening", description: "Turn long, messy links into short, memorable ones in a single click." },
  { icon: BarChart3, title: "Analytics", description: "See clicks, locations, and devices update in real time for every link." },
  { icon: LayoutDashboard, title: "Link Management", description: "Organize, search, and update every link from one clean dashboard." },
  { icon: Clock, title: "Smart Expiration", description: "Set links to expire automatically after a date or click count." },
  { icon: ShieldCheck, title: "Secure Authentication", description: "Your account and links are protected behind secure sign-in." },
  { icon: Zap, title: "Fast Redirects", description: "Links resolve in milliseconds, wherever your audience clicks from." },
];

const STATS = [
  { value: "10M+", label: "Links shortened" },
  { value: "180", label: "Countries reached" },
  { value: "99.98%", label: "Uptime" },
  { value: "<50ms", label: "Redirect latency" },
];

const STEPS = [
  { title: "Create an account", description: "Sign up in seconds, no credit card required." },
  { title: "Shorten a URL", description: "Paste any link and get a clean short link instantly." },
  { title: "Share it anywhere", description: "Drop it into posts, messages, or campaigns." },
];

const TESTIMONIALS = [
  { quote: "Our click data finally makes sense — I know exactly what's working.", name: "Eren Yeager.", role: "Marketing Lead" },
  { quote: "Switching links from spreadsheets to ZipLink saved us hours every week.", name: "Tony S.", role: "Growth Engineer" },
  { quote: "Smart expiration alone is worth it for our limited-time campaigns.", name: "Levi Ackerman.", role: "Product Manager" },
];

const FAQS = [
  { q: "Is ZipLink free to use?", a: "ZipLink offers a generous free tier for personal use, with more advanced limits available on paid plans." },
  { q: "Can I track who clicks my links?", a: "Yes — every link comes with analytics covering location, device, browser, and time of click." },
  { q: "Can links expire automatically?", a: "You can set an expiration date or a maximum click count, and the link deactivates on its own." },
  { q: "Do I need to install anything?", a: "No. ZipLink runs entirely in your browser — create and manage links from any device." },
];

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-heading">{item.q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-body transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden px-5 pb-4"
        >
          <p className="text-sm leading-relaxed text-body">{item.a}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <Section className="pb-10 pt-16 lg:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-accent">
              Now with smart expiration
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] text-balance text-heading sm:text-5xl lg:text-6xl">
              Short links, <span className="text-primary">smarter</span> insights.
            </h1>
            <p className="mt-5 max-w-md text-balance text-lg leading-relaxed text-body">
              ZipLink turns long URLs into clean, trackable links — with real-time analytics
              built right in.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  Start shortening — it's free
                </Button>
              </Link>
              <Link to={ROUTES.HOW_IT_WORKS}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <span className="text-sm font-semibold text-heading">Overview</span>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-accent">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6">
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-xs text-body">Total clicks</p>
                  <p className="mt-1.5 text-2xl font-semibold text-heading">24,180</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/60 p-4">
                  <p className="text-xs text-body">Active links</p>
                  <p className="mt-1.5 text-2xl font-semibold text-heading">312</p>
                </div>
              </div>
              <div className="space-y-3 px-6 pb-6">
                {[
                  { url: "zip.link/summer-sale", clicks: 1204 },
                  { url: "zip.link/launch-day", clicks: 892 },
                  { url: "zip.link/newsletter", clicks: 540 },
                ].map((row) => (
                  <div
                    key={row.url}
                    className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <MousePointerClick className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-heading">{row.url}</span>
                    </div>
                    <span className="text-sm text-body">{row.clicks.toLocaleString()} clicks</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="py-14">
        <div className="grid grid-cols-2 gap-8 rounded-3xl border border-border bg-surface p-10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-semibold text-heading sm:text-4xl">{stat.value}</p>
              <p className="mt-1.5 text-sm text-body">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section>
        <SectionHeading
          eyebrow="Features"
          title="Everything a modern link needs"
          description="Built for teams and individuals who need more than a plain redirect."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </Section>

      {/* How it works preview */}
      <Section className="bg-surface rounded-[2.5rem] border border-border max-w-6xl">
        <SectionHeading eyebrow="Process" title="From long link to short link in seconds" />
        <div className="grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-3xl border border-border bg-background/50 p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-heading">{step.title}</h3>
              <p className="mt-1.5 text-sm text-body">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to={ROUTES.HOW_IT_WORKS}>
            <Button variant="outline" icon={ArrowRight} iconPosition="right">
              See the full process
            </Button>
          </Link>
        </div>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionHeading eyebrow="From the community" title="People rely on ZipLink daily" />
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} hover>
              <p className="text-sm leading-relaxed text-heading">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-accent">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-medium text-heading">{t.name}</p>
                  <p className="text-xs text-body">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Common questions" />
        <div className="space-y-3">
          {FAQS.map((item) => (
            <FaqItem key={item.q} item={item} />
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-accent px-8 py-16 text-center sm:px-16">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Ready to shorten smarter?</h2>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            Create your first link in under a minute — no credit card required.
          </p>
          <Link to={ROUTES.REGISTER}>
            <Button size="lg" className="mt-8 bg-white !text-accent font-semibold shadow-lg hover:bg-white/90">
              Create your free account
            </Button>
          </Link>
          <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
        </div>
      </Section>
    </div>
  );
}
