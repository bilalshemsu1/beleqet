import { Suspense } from "react";
import JobsListing from "@/components/JobsListing";
import { getJobCategories, getJobs } from "@/lib/api";

export const metadata = {
  title: "Find Jobs | Beleqet Jobs",
};

export default async function JobsPage() {
  const [jobsResponse, categories] = await Promise.all([
    getJobs({ limit: 24 }),
    getJobCategories(),
  ]);

  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-muted">Loading jobs…</div>}>
      <JobsListing jobs={jobsResponse.items} categories={categories} />
    </Suspense>
  );
}
