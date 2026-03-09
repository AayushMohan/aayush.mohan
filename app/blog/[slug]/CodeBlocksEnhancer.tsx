"use client";

import { useEffect } from "react";

type PrismLike = {
  highlightElement: (element: Element) => void;
};

function getNormalizedCodeText(el: HTMLElement): string {
  // Medium frequently uses <br> tags inside <code> to represent line breaks.
  // `textContent` ignores <br>, so use `innerText` when <br> is present.
  const hasBr = !!el.querySelector("br");
  const raw = hasBr ? el.innerText : el.textContent || "";
  return raw.replace(/\r\n/g, "\n");
}

function getLanguageFromClassName(className: string): string {
  const m = className.match(/language-([a-z0-9_+-]+)/i);
  return (m?.[1] || "").toLowerCase();
}

function guessLanguageFromText(text: string): string {
  const t = text.trim();
  const firstLine = t.split(/\r?\n/)[0] || "";

  // Shell-ish
  if (/^\s*\$\s+/.test(firstLine)) return "bash";
  if (/\b(npm|pnpm|yarn)\s+(install|add|run)\b/i.test(t)) return "bash";
  if (/\b(cd|ls|cat|curl|wget)\b/.test(firstLine)) return "bash";

  // Python-ish
  if (/^\s*import\s+\w+/m.test(t)) return "python";
  if (/^\s*from\s+\w+\s+import\s+/m.test(t)) return "python";
  if (/^\s*def\s+\w+\s*\(/m.test(t)) return "python";
  if (/^\s*class\s+\w+\s*\(?/m.test(t) && /:\s*(#.*)?$/m.test(t))
    return "python";

  // JS / TS-ish
  if (/\b(console\.log|document\.|window\.)\b/.test(t)) return "javascript";
  if (/\b(const|let|var)\s+\w+\s*=/.test(t)) return "javascript";
  if (/=>\s*\{?/.test(t)) return "javascript";
  if (/\binterface\s+\w+\b|\btype\s+\w+\s*=/.test(t)) return "typescript";

  // JSON
  if (/^\s*\{[\s\S]*\}\s*$/.test(t) || /^\s*\[[\s\S]*\]\s*$/.test(t)) {
    try {
      JSON.parse(t);
      return "json";
    } catch {
      // ignore
    }
  }

  return "javascript";
}

function toHumanLanguage(lang: string): string {
  const map: Record<string, string> = {
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    jsx: "JSX",
    tsx: "TSX",
    bash: "Bash",
    shell: "Shell",
    sh: "Shell",
    zsh: "Shell",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    python: "Python",
    py: "Python",
    markdown: "Markdown",
    md: "Markdown",
    css: "CSS",
    html: "HTML",
  };
  return map[lang] || lang.toUpperCase();
}

async function ensurePrismLanguages(_prism: PrismLike, langs: string[]) {
  // Prism loads core languages on-demand. Missing imports are fine.
  await Promise.all(
    langs.map(async (l) => {
      try {
        await import(`prismjs/components/prism-${l}.js`);
      } catch {
        // ignore
      }
    }),
  );

  return;
}

export default function CodeBlocksEnhancer({
  containerSelector = ".blog-content",
}: {
  containerSelector?: string;
}) {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const prismModule = (await import("prismjs")) as unknown as {
        default: PrismLike;
      };
      const Prism = prismModule.default;

      await ensurePrismLanguages(Prism, [
        "javascript",
        "typescript",
        "jsx",
        "tsx",
        "python",
        "bash",
        "json",
        "yaml",
        "markdown",
      ]);

      if (cancelled) return;

      const codeBlocks = Array.from(
        container.querySelectorAll<HTMLPreElement>("pre"),
      );

      for (const pre of codeBlocks) {
        if (pre.dataset.enhanced === "1") continue;
        pre.dataset.enhanced = "1";

        const code = pre.querySelector<HTMLElement>("code") || pre;
        const normalizedText = getNormalizedCodeText(code);

        // If Medium used <br> tags, convert them into real newlines before highlighting.
        // This also strips any residual markup in code blocks (safe + consistent for Prism).
        if (code.querySelector("br")) {
          code.textContent = normalizedText;
        }

        const rawLang = getLanguageFromClassName(code.className || "");
        const lang = rawLang || guessLanguageFromText(normalizedText);
        const label = toHumanLanguage(lang);

        // Wrap in a container so we can add a header.
        const wrapper = document.createElement("div");
        wrapper.className = "blog-codeblock";

        const header = document.createElement("div");
        header.className = "blog-codeblock__header";

        const language = document.createElement("span");
        language.className = "blog-codeblock__lang";
        language.textContent = label;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "blog-codeblock__copy";
        button.textContent = "Copy";

        const copyText = normalizedText.trimEnd();

        button.addEventListener("click", async () => {
          try {
            if (!copyText) return;

            if (navigator.clipboard) {
              await navigator.clipboard.writeText(copyText);
            } else {
              const range = document.createRange();
              range.selectNodeContents(code);
              const sel = window.getSelection();
              sel?.removeAllRanges();
              sel?.addRange(range);
              document.execCommand("copy");
              sel?.removeAllRanges();
            }

            const old = button.textContent;
            button.textContent = "Copied";
            window.setTimeout(() => {
              button.textContent = old;
            }, 1100);
          } catch {
            // ignore
          }
        });

        header.appendChild(language);
        header.appendChild(button);

        const parent = pre.parentNode;
        if (!parent) continue;

        parent.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);

        // Normalize classes so Prism can highlight.
        if (!code.className.includes("language-")) {
          code.className = `${code.className} language-${lang}`.trim();
        }

        try {
          Prism.highlightElement(code);
        } catch {
          // ignore
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [containerSelector]);

  return null;
}
