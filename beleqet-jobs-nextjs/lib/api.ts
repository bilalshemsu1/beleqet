const DEFAULT_API_BASE_URL = "http://localhost:4000/api/v1";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL;

export type ApiListResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type FetchJsonOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function fetchJson<T>(path: string, options: FetchJsonOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type JobCategory = {
  id: string;
  slug: string;
  label: string;
};

export type JobCompany = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

export type JobListItem = {
  id: string;
  title: string;
  location: string;
  type: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  company: JobCompany;
  category: JobCategory;
  _count?: {
    applications: number;
  };
};

export type JobDetail = JobListItem & {
  description: string;
  requirements?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
  tags?: string[];
  deadline?: string | null;
  companyName?: string | null;
  applyEmail?: string | null;
  applyType?: string | null;
  applyUrl?: string | null;
};

export async function getJobs(params: {
  q?: string;
  category?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
} = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return fetchJson<ApiListResponse<JobListItem>>(`/jobs${query ? `?${query}` : ""}`, {
    next: { revalidate: 60 },
  });
}

export async function getJob(id: string) {
  return fetchJson<JobDetail>(`/jobs/${id}`, {
    next: { revalidate: 60 },
  });
}

export async function getJobCategories() {
  return fetchJson<JobCategory[]>("/jobs/categories", {
    next: { revalidate: 300 },
  });
}
