import { ArrowLeft, Check, Clock, Sparkles, MessageSquare, FileDown, GitBranch, Users, LayoutTemplate, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface RoadmapItem {
  title: string;
  description: string;
  status: "shipped" | "in-progress" | "coming-soon";
  icon: React.ReactNode;
}

const roadmapItems: RoadmapItem[] = [
  {
    title: "AI Spec Generation",
    description: "Transform plain-English briefs into structured technical specs with confidence scoring.",
    status: "shipped",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Encrypted Sharing",
    description: "AES-GCM encrypted links with optional expiry for secure spec distribution.",
    status: "shipped",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: "Dashboard & Project Management",
    description: "Bento-style dashboard with draft briefs, approved specs, and integration portal.",
    status: "shipped",
    icon: <LayoutTemplate className="h-5 w-5" />,
  },
  {
    title: "Google Sign-In",
    description: "One-click authentication with Google OAuth for faster onboarding.",
    status: "shipped",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Slack Integration",
    description: "Push approved specs directly to Slack channels so your engineering team gets instant context.",
    status: "coming-soon",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "PDF Export",
    description: "Download approved specs as branded, shareable PDF documents.",
    status: "coming-soon",
    icon: <FileDown className="h-5 w-5" />,
  },
  {
    title: "Version History & Diffs",
    description: "Track every spec revision with side-by-side diffs so nothing gets lost.",
    status: "coming-soon",
    icon: <GitBranch className="h-5 w-5" />,
  },
  {
    title: "Team Workspaces",
    description: "Shared dashboards for organizations with role-based access and collaborative editing.",
    status: "coming-soon",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Spec Templates",
    description: "Pre-built brief templates for common project types — APIs, mobile apps, migrations, and more.",
    status: "coming-soon",
    icon: <LayoutTemplate className="h-5 w-5" />,
  },
];

const statusConfig = {
  shipped: {
    label: "Shipped",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: <Check className="h-3.5 w-3.5" />,
  },
  "in-progress": {
    label: "In Progress",
    badge: "bg-primary/10 text-primary border-primary/20",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  "coming-soon": {
    label: "Coming Soon",
    badge: "bg-muted text-muted-foreground border-white/[0.06]",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
};

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-white/[0.06] py-6">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <div className="mb-12 md:mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 text-xs tracking-wider uppercase">
            Roadmap
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            What we&apos;re <span className="text-primary">building</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            SpecMirror is evolving fast. Here&apos;s what&apos;s live and what&apos;s next on our radar.
          </p>
        </div>

        {/* Shipped */}
        <section className="mb-14">
          <h2 className="text-sm font-medium uppercase tracking-wider text-emerald-400 mb-6 flex items-center gap-2">
            <Check className="h-4 w-4" /> Shipped
          </h2>
          <div className="grid gap-4">
            {roadmapItems.filter(i => i.status === "shipped").map((item) => (
              <RoadmapCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Coming Soon
          </h2>
          <div className="grid gap-4">
            {roadmapItems.filter(i => i.status === "coming-soon").map((item) => (
              <RoadmapCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const RoadmapCard = ({ item }: { item: RoadmapItem }) => {
  const config = statusConfig[item.status];
  return (
    <div className="group flex items-start gap-4 rounded-xl border border-white/[0.06] bg-card/50 p-5 transition-colors hover:border-white/[0.1]">
      <div className="mt-0.5 rounded-lg bg-muted/50 p-2.5 text-muted-foreground group-hover:text-foreground transition-colors">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <h3 className="font-medium">{item.title}</h3>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${config.badge}`}>
            {config.icon}
            {config.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
};

export default Roadmap;
