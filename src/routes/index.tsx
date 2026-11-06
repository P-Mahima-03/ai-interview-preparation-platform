import { createFileRoute } from "@tanstack/react-router";
import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Categories } from "@/components/landing/Categories";
import { AIFeedback } from "@/components/landing/AIFeedback";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Intervize AI — AI-Powered Interview Preparation Platform" },
      {
        name: "description",
        content:
          "Premium AI interview prep for software engineers. Mock interviews, instant AI feedback, progress tracking and leaderboards across 13 categories.",
      },
      { property: "og:title", content: "Intervize AI — AI-Powered Interview Preparation" },
      {
        property: "og:description",
        content:
          "Practice DSA, SQL, JS and more. Run timed mocks and get instant AI feedback on every session.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <Categories />
        <AIFeedback />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <LandingFooter />
    </div>
  );
}
