import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PlayCircle,
  Timer,
  ChevronLeft,
  ChevronRight,
  StopCircle,
  Sparkles,
  RotateCcw,
  Brain,
  MessageCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/mock")({
  component: MockInterviewPage,
});

type Question = {
  id: string;
  title: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  interview_categories: { name: string } | null;
};

type Stage = "setup" | "active" | "result";

const TOTAL_QUESTIONS = 5;
const SECONDS_PER_QUESTION = 120;

function MockInterviewPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("setup");
  const [category, setCategory] = useState<string>("any");
  const [difficulty, setDifficulty] = useState<string>("any");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [feedback, setFeedback] = useState<MockFeedback | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("interview_categories").select("id, name").order("name");
      return data ?? [];
    },
  });

  useEffect(() => {
    if (stage !== "active") return;
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(t);
  }, [stage]);

  async function startInterview() {
    if (!user) return;
    let query = supabase
      .from("questions")
      .select("id, title, question, difficulty, interview_categories(name)")
      .limit(40);
    if (category !== "any") query = query.eq("category_id", category);
    if (difficulty !== "any") query = query.eq("difficulty", difficulty as Question["difficulty"]);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      toast.error("No questions found for that filter.");
      return;
    }
    // Shuffle and take TOTAL_QUESTIONS
    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
    setQuestions(shuffled as Question[]);
    setAnswers(new Array(shuffled.length).fill(""));
    setIdx(0);
    setElapsed(0);
    setStage("active");
  }

  async function endInterview() {
    if (!user || questions.length === 0) {
      setStage("setup");
      return;
    }
    const generated = generateFeedback(answers);
    setFeedback(generated);
    setStage("result");

    // Persist mock + feedback (RLS-friendly: user inserts own rows)
    try {
      const { data: mock, error: mockErr } = await supabase
        .from("mock_interviews")
        .insert({
          user_id: user.id,
          difficulty: difficulty === "any" ? "medium" : (difficulty as Question["difficulty"]),
          question_count: questions.length,
          duration_minutes: Math.max(1, Math.round(elapsed / 60)),
          status: "completed",
          completed_at: new Date().toISOString(),
          score: generated.overall,
        })
        .select("id")
        .single();
      if (mockErr) throw mockErr;

      await supabase.from("feedback").insert({
        user_id: user.id,
        mock_interview_id: mock.id,
        communication_score: generated.communication,
        technical_score: generated.technical,
        confidence_score: generated.confidence,
        problem_solving_score: generated.problemSolving,
        overall_rating: generated.overall,
        strengths: generated.strengths,
        weaknesses: generated.weaknesses,
        suggestions: generated.suggestions,
        summary: generated.summary,
      });
    } catch (e) {
      console.error(e);
      // Result still shown to the user even if persistence fails.
    }
  }

  function resetAll() {
    setStage("setup");
    setQuestions([]);
    setAnswers([]);
    setIdx(0);
    setElapsed(0);
    setFeedback(null);
  }

  return (
    <div>
      <PageHeader
        title="Mock Interview"
        description="Simulate a real interview with random questions, a live timer, and instant AI feedback."
        crumbs={[{ label: "Mock Interview" }]}
      />

      {stage === "setup" && (
        <SetupView
          category={category}
          difficulty={difficulty}
          categories={categories ?? []}
          onCategory={setCategory}
          onDifficulty={setDifficulty}
          onStart={startInterview}
        />
      )}

      {stage === "active" && (
        <ActiveView
          question={questions[idx]}
          idx={idx}
          total={questions.length}
          elapsed={elapsed}
          answer={answers[idx]}
          onAnswer={(v) => {
            const next = [...answers];
            next[idx] = v;
            setAnswers(next);
          }}
          onPrev={() => setIdx((i) => Math.max(0, i - 1))}
          onNext={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}
          onEnd={endInterview}
        />
      )}

      {stage === "result" && feedback && (
        <ResultView feedback={feedback} elapsedSec={elapsed} onReset={resetAll} />
      )}
    </div>
  );
}

function SetupView({
  category,
  difficulty,
  categories,
  onCategory,
  onDifficulty,
  onStart,
}: {
  category: string;
  difficulty: string;
  categories: { id: string; name: string }[];
  onCategory: (v: string) => void;
  onDifficulty: (v: string) => void;
  onStart: () => void;
}) {
  return (
    <div className="glass-strong rounded-3xl p-8 shadow-elegant">
      <div className="bg-brand-gradient mx-auto grid size-16 place-items-center rounded-2xl text-white shadow-elegant">
        <Sparkles className="size-7" />
      </div>
      <h2 className="mt-6 text-center text-2xl font-bold">Configure your session</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        We'll serve {TOTAL_QUESTIONS} random questions. Take your time — there's no penalty.
      </p>
      <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Category
          </label>
          <Select value={category} onValueChange={onCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any category</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Difficulty
          </label>
          <Select value={difficulty} onValueChange={onDifficulty}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-xl justify-center">
        <Button
          onClick={onStart}
          className="bg-brand-gradient h-12 px-8 text-base font-semibold text-white"
        >
          <PlayCircle className="mr-2 size-5" />
          Start Mock Interview
        </Button>
      </div>
    </div>
  );
}

function ActiveView({
  question,
  idx,
  total,
  elapsed,
  answer,
  onAnswer,
  onPrev,
  onNext,
  onEnd,
}: {
  question: Question;
  idx: number;
  total: number;
  elapsed: number;
  answer: string;
  onAnswer: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onEnd: () => void;
}) {
  const pct = Math.min(100, ((idx + 1) / total) * 100);
  const qSeconds = elapsed % SECONDS_PER_QUESTION;
  const remaining = Math.max(0, SECONDS_PER_QUESTION - qSeconds);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Question {idx + 1} of {total}
            </p>
            <Progress value={pct} className="mt-2 h-2" />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-2.5 font-mono text-sm font-bold">
            <Timer className="size-4 text-primary" />
            {formatTime(remaining)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            {question.interview_categories?.name ?? "General"}
          </span>
          <span className="rounded-md bg-warning/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning-foreground">
            {question.difficulty}
          </span>
        </div>
        <h2 className="text-xl font-bold md:text-2xl">{question.title}</h2>
        <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
          {question.question}
        </p>
        <div className="mt-6">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Your Answer
          </label>
          <Textarea
            value={answer}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Explain your approach. Pretend you're talking to your interviewer…"
            className="min-h-[200px]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={onPrev} disabled={idx === 0}>
          <ChevronLeft className="mr-1 size-4" /> Previous
        </Button>
        <Button variant="destructive" onClick={onEnd}>
          <StopCircle className="mr-1 size-4" /> End Interview
        </Button>
        {idx < total - 1 ? (
          <Button onClick={onNext} className="bg-brand-gradient text-white">
            Next <ChevronRight className="ml-1 size-4" />
          </Button>
        ) : (
          <Button onClick={onEnd} className="bg-brand-gradient text-white">
            Finish & Get Feedback
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultView({
  feedback,
  elapsedSec,
  onReset,
}: {
  feedback: MockFeedback;
  elapsedSec: number;
  onReset: () => void;
}) {
  const scores = [
    { label: "Technical", value: feedback.technical, icon: Brain, color: "var(--brand-blue)" },
    {
      label: "Communication",
      value: feedback.communication,
      icon: MessageCircle,
      color: "var(--brand-purple)",
    },
    { label: "Confidence", value: feedback.confidence, icon: TrendingUp, color: "var(--primary)" },
    {
      label: "Problem Solving",
      value: feedback.problemSolving,
      icon: Target,
      color: "var(--brand-violet)",
    },
  ];
  return (
    <div className="space-y-6">
      <div className="bg-brand-gradient relative overflow-hidden rounded-3xl p-8 text-white shadow-elegant">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
        <div className="relative grid items-center gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">
              AI Feedback Summary
            </p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">{feedback.summary}</h2>
            <p className="mt-3 text-sm text-white/85">
              Completed in {Math.round(elapsedSec / 60)} minutes
            </p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-7xl font-extrabold leading-none">{feedback.overall}</div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Overall</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scores.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <s.icon className="size-4" style={{ color: s.color }} /> {s.label}
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-bold">{s.value}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${s.value}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <FeedbackList title="Strengths" items={feedback.strengths} tone="success" />
        <FeedbackList title="Weaknesses" items={feedback.weaknesses} tone="warning" />
        <FeedbackList title="Suggestions" items={feedback.suggestions} tone="primary" />
      </div>

      <div className="flex justify-end">
        <Button onClick={onReset} className="bg-brand-gradient text-white">
          <RotateCcw className="mr-2 size-4" />
          Start a new mock
        </Button>
      </div>
    </div>
  );
}

function FeedbackList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning" | "primary";
}) {
  const dotClass =
    tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((s) => (
          <li key={s} className="flex items-start gap-2 text-sm">
            <span className={`mt-2 size-1.5 shrink-0 rounded-full ${dotClass}`} />
            <span className="text-foreground/90">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

type MockFeedback = {
  communication: number;
  technical: number;
  confidence: number;
  problemSolving: number;
  overall: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
};

/**
 * Generate deterministic-but-realistic feedback based on the user's answers.
 * In production this would call an LLM via an edge function.
 */
function generateFeedback(answers: string[]): MockFeedback {
  const lengths = answers.map((a) => a.trim().length);
  const totalChars = lengths.reduce((a, b) => a + b, 0);
  const avgLen = totalChars / Math.max(1, answers.length);
  const filledRatio = lengths.filter((l) => l > 30).length / Math.max(1, answers.length);

  const technical = clamp(60 + Math.round(avgLen / 12) + Math.round(filledRatio * 15));
  const communication = clamp(58 + Math.round(avgLen / 18) + Math.round(filledRatio * 20));
  const confidence = clamp(55 + Math.round(filledRatio * 30));
  const problemSolving = clamp(60 + Math.round(avgLen / 14) + Math.round(filledRatio * 18));
  const overall = Math.round((technical + communication + confidence + problemSolving) / 4);

  const summary =
    overall >= 85
      ? "Excellent — you're interview ready."
      : overall >= 70
        ? "Solid performance with room to sharpen."
        : overall >= 55
          ? "Promising — keep iterating on depth."
          : "Strong foundation needed before next round.";

  return {
    communication,
    technical,
    confidence,
    problemSolving,
    overall,
    summary,
    strengths: [
      avgLen > 200 ? "Detailed and well-structured explanations" : "Clear, concise responses",
      filledRatio > 0.7
        ? "Strong engagement across every question"
        : "Confident handling of familiar topics",
      "Logical step-by-step reasoning",
    ],
    weaknesses: [
      avgLen < 120
        ? "Answers could include more depth and tradeoffs"
        : "Some answers ran long without a clear summary",
      "Limited use of concrete examples or real-world scenarios",
      filledRatio < 0.7
        ? "A few questions were skipped or under-developed"
        : "Edge cases occasionally missed",
    ],
    suggestions: [
      "Practice the STAR method for behavioral answers",
      "Verbalize time and space complexity for every coding solution",
      "Rehearse with a 30-second elevator summary before diving in",
    ],
  };
}

function clamp(n: number) {
  return Math.max(40, Math.min(99, n));
}
