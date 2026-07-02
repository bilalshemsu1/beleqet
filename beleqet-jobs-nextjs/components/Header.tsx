"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "About Us", href: "/about" },
  { label: "CV Maker", href: "/cv-maker" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const { status, user, signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
      <div className="container-page flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-lg text-primary">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brandGreen text-white text-sm">
            B
          </span>
          <span>
            Beleqet <span className="text-brandGreen">Job</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brandGreen transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {status === "authenticated" && user ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-ink">{user.firstName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-brandGreen hover:text-brandGreen transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-block text-sm font-medium text-ink hover:text-brandGreen transition-colors"
            >
              Login / Sign Up
            </Link>
          )}

          <Link
            href="/post-job"
            className="inline-flex items-center rounded-full bg-brandGreen px-4 py-2 text-sm font-semibold text-white hover:bg-darkGreen transition-colors"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </header>
  );
}
