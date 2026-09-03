import { Target, Eye, Cpu } from "lucide-react";
import Section, { SectionHeading } from "../components/common/Section";
import Card from "../components/ui/Card";
import FeatureCard from "../components/ui/FeatureCard";
import { Link2, BarChart3, Clock, ShieldCheck } from "lucide-react";

const CORE_FEATURES = [
  { icon: Link2, title: "URL Shortening", description: "Compact, brandable links generated in an instant." },
  { icon: BarChart3, title: "Analytics", description: "Every click, understood — location, device, and time." },
  { icon: Clock, title: "Smart Expiration", description: "Links that retire themselves on your schedule." },
  { icon: ShieldCheck, title: "Secure Authentication", description: "Your links and data, protected by design." },
];

export default function About() {
  return (
    <div>
      <Section className="pb-10 pt-16 text-center lg:pt-20">
        <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-accent">About ZipLink</span>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold text-balance text-heading sm:text-5xl">
          A link shortener built for people who care about their data.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-body">
          ZipLink turns unwieldy URLs into short, trackable links — with the analytics and
          controls that modern teams actually need.
        </p>
      </Section>

      <Section className="grid gap-6 pt-0 sm:grid-cols-2">
        <Card>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-accent">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-heading">Our mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Make sharing links simple, transparent, and genuinely useful — with analytics
            available to anyone, not just large enterprises.
          </p>
        </Card>
        <Card>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-accent">
            <Eye className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-heading">Our vision</h2>
          <p className="mt-2 text-sm leading-relaxed text-body">
            A web where every shared link is a little smarter — easy to manage, easy to
            measure, and built to expire gracefully when it should.
          </p>
        </Card>
      </Section>

      <Section>
        <SectionHeading eyebrow="Why ZipLink" title="Why choose ZipLink" description="A few reasons teams pick ZipLink over a plain redirect service." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CORE_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section className="rounded-[2.5rem] border border-border bg-surface max-w-6xl">
        <div className="flex items-start gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-heading">Built on a modern stack</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-body">
              ZipLink's dashboard is built with React for a fast, responsive interface, backed
              by a Spring Boot service for link resolution and analytics processing —
              engineered for speed at scale.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
