"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import JobCard from "@/components/JobCard";
import type { JobCategory, JobListItem } from "@/lib/api";

const jobTypes = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "CONTRACT", label: "Contract" },
];

export default function JobsListing({
  jobs,
  categories,
}: {
  jobs: JobListItem[];
  categories: JobCategory[];
}) {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("loc") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [type, setType] = useState<string>("");

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesQuery =
        !query ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.name.toLowerCase().includes(query.toLowerCase());
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      const matchesCategory = !category || job.category.slug === category;
      const matchesType = !type || job.type === type;
      return matchesQuery && matchesLocation && matchesCategory && matchesType;
    });
  }, [query, location, category, type]);

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-pageH1">Search verified jobs from trusted employers.</h1>
        <p className="text-muted text-sm mt-2">{filtered.length} jobs found</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-2 flex flex-col sm:flex-row gap-2 mb-8">
        <div className="flex items-center flex-1 gap-2 px-3 py-2.5 rounded-xl">
          <Search className="h-4 w-4 text-muted shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, keyword or company"
            className="w-full text-sm text-ink placeholder:text-muted outline-none"
          />
        </div>
        <div className="hidden sm:block w-px bg-border my-1" />
        <div className="flex items-center flex-1 gap-2 px-3 py-2.5 rounded-xl">
          <MapPin className="h-4 w-4 text-muted shrink-0" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full text-sm text-ink placeholder:text-muted outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
              <SlidersHorizontal className="h-4 w-4" /> Category
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setCategory("")}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  category === "" ? "bg-brandGreen/10 text-brandGreen font-semibold" : "text-muted hover:bg-pageBg"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.slug)}
                  className={`flex w-full items-center justify-between text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      category === cat.slug ? "bg-brandGreen/10 text-brandGreen font-semibold" : "text-muted hover:bg-pageBg"
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-5">
            <h3 className="text-sm font-semibold text-ink mb-4">Job Type</h3>
            <div className="space-y-2">
              <button
                onClick={() => setType("")}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  type === "" ? "bg-brandGreen/10 text-brandGreen font-semibold" : "text-muted hover:bg-pageBg"
                }`}
              >
                All Types
              </button>
              {jobTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    type === t.value ? "bg-brandGreen/10 text-brandGreen font-semibold" : "text-muted hover:bg-pageBg"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center">
              <p className="text-ink font-semibold">No jobs match your filters</p>
              <p className="text-sm text-muted mt-1">Try adjusting your search or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
