import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is Intervize AI free to use?",
    a: "Yes — you can sign up for free and start practicing immediately. Premium features and unlimited AI feedback will be available with a paid plan.",
  },
  {
    q: "What categories are covered?",
    a: "13 categories including Java, DSA, SQL, DBMS, OS, Networks, OOP, HTML, CSS, JavaScript, Aptitude, HR, and Behavioral questions.",
  },
  {
    q: "How does the AI feedback work?",
    a: "After each mock interview, the AI evaluates your responses across communication, technical depth, confidence, and problem solving, then generates specific strengths, weaknesses, and improvement suggestions.",
  },
  {
    q: "Can I track my progress?",
    a: "Absolutely. Your dashboard shows daily streaks, accuracy, weekly activity, completed questions, badges, and leaderboard ranking.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All authentication and user data is handled with industry-standard security, and your interview sessions remain private to you.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Frequently Asked
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Questions, <span className="gradient-text">answered.</span>
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-6"
            >
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
