import { Mail, MessageSquare, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border bg-secondary/40 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="bg-brand-gradient relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-elegant md:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Ready to ace your next interview?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              Join thousands of engineers preparing smarter with AI. Sign up free and start
              practicing in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth" search={{ mode: "signup" }}>
                <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold">
                  Start Free Trial
                </Button>
              </Link>
              <a href="mailto:hello@intervize.ai">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  Contact Sales
                </Button>
              </a>
            </div>
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 text-white/90 sm:grid-cols-3">
              {[
                { icon: Mail, text: "hello@intervize.ai" },
                { icon: MessageSquare, text: "24/7 community" },
                { icon: MapPin, text: "Built remote" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-sm">
                  <c.icon className="size-4" />
                  {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
