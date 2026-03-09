"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export default function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }
    } catch {
      // no-op
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-display"
      title={copied ? "Copied" : "Share article"}
      aria-label={copied ? "Copied" : "Share article"}
    >
      <Share2 size={16} />
    </button>
  );
}
