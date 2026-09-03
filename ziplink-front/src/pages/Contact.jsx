import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, MapPin, Github, Linkedin } from "lucide-react";
import Section from "../components/common/Section";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { BRAND } from "../constants/brand";
import notify from "../utils/toast";
import contactService from "../services/contact.service";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  message: z.string().min(10, "Tell us a bit more (10+ characters)"),
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await contactService.submitMessage(data);
      notify.success("Message sent! We'll get back to you shortly.");
      reset();
    } catch (err) {
      notify.error(err.response?.data?.message ?? "Failed to send message. Please try again.");
      throw err; // keep isSubmitSuccessful false on error
    }
  };

  return (
    <div>
      <Section className="pb-8 pt-16 text-center lg:pt-20">
        <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-medium text-accent">Contact</span>
        <h1 className="mx-auto mt-5 max-w-xl text-4xl font-semibold text-balance text-heading sm:text-5xl">
          We'd love to hear from you
        </h1>
      </Section>

      <Section className="grid gap-8 pt-0 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-heading">Send a message</h2>
          {isSubmitSuccessful ? (
            <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-sm text-heading">
              Thanks for reaching out — we'll get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
                <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
              </div>
              <Textarea label="Message" placeholder="How can we help?" rows={5} error={errors.message?.message} {...register("message")} />
              <Button type="submit" isLoading={isSubmitting}>
                Send message
              </Button>
            </form>
          )}
        </Card>

        <div className="space-y-5 lg:col-span-2">
          <Card>
            <h3 className="text-sm font-semibold text-heading">Get in touch</h3>
            <div className="mt-4 space-y-3.5 text-sm">
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 text-body hover:text-heading">
                <Mail className="h-4.5 w-4.5 text-accent" /> {BRAND.email}
              </a>
              <a href={BRAND.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-body hover:text-heading">
                <Github className="h-4.5 w-4.5 text-accent" /> github.com/ziplink
              </a>
              <a href={BRAND.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-body hover:text-heading">
                <Linkedin className="h-4.5 w-4.5 text-accent" /> linkedin.com/company/ziplink
              </a>
              <div className="flex items-center gap-3 text-body">
                <MapPin className="h-4.5 w-4.5 text-accent" /> {BRAND.location}
              </div>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
