import Link from "next/link";
import { MapPin, Bookmark, Building2 } from "lucide-react";
import type { JobListItem } from "@/lib/api";

const typeStyles: Record<string, string> = {
  FULL_TIME: "bg-brandGreen/10 text-brandGreen",
  PART_TIME: "bg-purpleAccent/10 text-purpleAccent",
  REMOTE: "bg-cyanAccent/10 text-cyanAccent",
  HYBRID: "bg-orangeAccent/10 text-orangeAccent",
  CONTRACT: "bg-redAccent/10 text-redAccent",
};

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function formatJobType(type: string) {
  return type.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function JobCard({ job }: { job: JobListItem }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col rounded-xl border border-border bg-white p-5 hover:border-brandGreen hover:shadow-card transition-all"
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-pageBg text-muted">
          <Building2 className="h-5 w-5" />
        </span>
        <Bookmark className="h-4 w-4 text-muted/50 group-hover:text-brandGreen transition-colors" />
      </div>

      <h3 className="text-cardH3 mt-3 text-ink leading-snug line-clamp-2">{job.title}</h3>
      <p className="text-sm text-muted mt-1">{job.company.name}</p>

      <div className="flex items-center gap-1 text-xs text-muted mt-2">
        <MapPin className="h-3.5 w-3.5" />
        {job.location}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeStyles[job.type] ?? "bg-muted/10 text-muted"}`}>
          {formatJobType(job.type)}
        </span>
        <span className="text-[11px] text-muted">{formatRelativeTime(job.createdAt)}</span>
      </div>
    </Link>
  );
}
