/**
 * Maps category slugs to lucide icons and brand colors used throughout the app.
 */
import {
  Coffee,
  Network,
  Database,
  Server,
  Cpu,
  Wifi,
  Boxes,
  Code,
  Palette,
  Braces,
  Calculator,
  Users,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  java: Coffee,
  dsa: Network,
  sql: Database,
  dbms: Server,
  os: Cpu,
  cn: Wifi,
  oop: Boxes,
  html: Code,
  css: Palette,
  javascript: Braces,
  aptitude: Calculator,
  hr: Users,
  behavioral: MessageSquare,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Code;
}
