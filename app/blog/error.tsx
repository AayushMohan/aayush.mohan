"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="body-lg">Something went wrong while loading the blog.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="text-sm text-primary hover:text-primary/80 font-display"
      >
        Try again
      </button>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors font-display"
      >
        Back to Portfolio
      </Link>
    </div>
  );
}
