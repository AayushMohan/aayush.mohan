import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
