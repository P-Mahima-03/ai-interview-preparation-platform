import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkCheck, CheckCircle2, Circle, Search, FileText, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/questions")({
  component: QuestionsPage,
});

type Difficulty = "easy" | "medium" | "hard";

type Question = {
  id: string;
  title: string;
  question: string;
  answer: string | null;
  difficulty: Difficulty;
  category_id: string;
  interview_categories: { name: string; slug: string } | null;
};

const PAGE_SIZE = 9;

function QuestionsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Question | null>(null);
  const [note, setNote] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("interview_categories")
        .select("id, name, slug")
        .order("name");
      return data ?? [];
    },
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select(
          "id, title, question, answer, difficulty, category_id, interview_categories(name, slug)",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Question[];
    },
  });

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("question_id")
        .eq("user_id", user!.id);
      return new Set((data ?? []).map((b) => b.question_id));
    },
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("progress")
        .select("question_id, completed, notes")
        .eq("user_id", user!.id);
      const map = new Map<string, { completed: boolean; notes: string | null }>();
      (data ?? []).forEach((p) =>
        map.set(p.question_id, { completed: p.completed, notes: p.notes }),
      );
      return map;
    },
  });

  const filtered = useMemo(() => {
    if (!questions) return [];
    return questions.filter((q) => {
      if (category !== "all" && q.category_id !== category) return false;
      if (difficulty !== "all" && q.difficulty !== difficulty) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!q.title.toLowerCase().includes(s) && !q.question.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [questions, category, difficulty, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function toggleBookmark(q: Question) {
    if (!user) return;
    const isBookmarked = bookmarks?.has(q.id);
    if (isBookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("question_id", q.id);
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, question_id: q.id });
    }
    qc.invalidateQueries({ queryKey: ["bookmarks", user.id] });
  }

  async function toggleComplete(q: Question) {
    if (!user) return;
    const existing = progress?.get(q.id);
    const completed = !existing?.completed;
    await supabase.from("progress").upsert(
      {
        user_id: user.id,
        question_id: q.id,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        notes: existing?.notes ?? null,
      },
      { onConflict: "user_id,question_id" },
    );
    qc.invalidateQueries({ queryKey: ["progress", user.id] });
    qc.invalidateQueries({ queryKey: ["progress-count", user.id] });
    toast.success(completed ? "Marked completed" : "Marked incomplete");
  }

  async function saveNote() {
    if (!user || !active) return;
    const existing = progress?.get(active.id);
    await supabase.from("progress").upsert(
      {
        user_id: user.id,
        question_id: active.id,
        completed: existing?.completed ?? false,
        notes: note,
      },
      { onConflict: "user_id,question_id" },
    );
    qc.invalidateQueries({ queryKey: ["progress", user.id] });
    toast.success("Notes saved");
  }

  function openQuestion(q: Question) {
    setActive(q);
    setNote(progress?.get(q.id)?.notes ?? "");
  }

  return (
    <div>
      <PageHeader
        title="Question Bank"
        description="Browse, bookmark, and conquer questions across every category."
        crumbs={[{ label: "Questions" }]}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or content…"
            className="pl-9"
          />
        </div>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={difficulty}
          onValueChange={(v) => {
            setDifficulty(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : pageItems.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No questions match"
            description="Try a different search or clear your filters."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setDifficulty("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((q) => {
              const isCompleted = progress?.get(q.id)?.completed;
              const isBookmarked = bookmarks?.has(q.id);
              return (
                <article
                  key={q.id}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elegant"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {q.interview_categories?.name ?? "General"}
                      </span>
                      <DifficultyPill level={q.difficulty} />
                    </div>
                    <button
                      onClick={() => toggleBookmark(q)}
                      className="text-muted-foreground transition-colors hover:text-primary"
                      aria-label="Bookmark"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="size-4 text-primary" />
                      ) : (
                        <Bookmark className="size-4" />
                      )}
                    </button>
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-base font-bold leading-snug">{q.title}</h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
                    {q.question}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openQuestion(q)}
                    >
                      <FileText className="mr-1.5 size-3.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant={isCompleted ? "default" : "secondary"}
                      onClick={() => toggleComplete(q)}
                      className={
                        isCompleted ? "bg-success text-success-foreground hover:bg-success/90" : ""
                      }
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="mt-8 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Page {page} of {totalPages} · {filtered.length} questions
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl">
          {active && (
            <>
              <DialogHeader>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {active.interview_categories?.name ?? "General"}
                  </span>
                  <DifficultyPill level={active.difficulty} />
                </div>
                <DialogTitle className="text-xl">{active.title}</DialogTitle>
                <DialogDescription className="whitespace-pre-wrap text-left text-sm leading-relaxed text-foreground/90">
                  {active.question}
                </DialogDescription>
              </DialogHeader>
              {active.answer && (
                <div className="rounded-xl border border-border bg-secondary/40 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Sample Answer
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                    {active.answer}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Notes
                </p>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Jot down your approach, time complexity, mistakes…"
                  className="mt-2 min-h-[120px]"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setActive(null)}>
                    <X className="mr-1 size-4" /> Close
                  </Button>
                  <Button size="sm" onClick={saveNote} className="bg-brand-gradient text-white">
                    Save notes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DifficultyPill({ level }: { level: Difficulty }) {
  const cls =
    level === "easy"
      ? "bg-success/15 text-success"
      : level === "medium"
        ? "bg-warning/15 text-warning-foreground"
        : "bg-destructive/15 text-destructive";
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}
    >
      {level}
    </span>
  );
}
