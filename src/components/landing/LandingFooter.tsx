import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "../Logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The premium AI-powered interview prep platform for engineers serious about landing
              their dream role.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-foreground">
                  Categories
                </a>
              </li>
              <li>
                <Link to="/auth" className="hover:text-foreground">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#faq" className="hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Intervize AI. Built for engineers.</span>
          <span>Made with care.</span>
        </div>
      </div>
    </footer>
  );
}
