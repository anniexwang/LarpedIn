import React, { useState, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children,
}) {

  const [textScale, setTextScale] = useState(() => {
  const saved = Number(localStorage.getItem('larpedin-text-scale'));
  return [0.9, 1, 1.1, 1.2].includes(saved) ? saved : 1;
});

useEffect(() => {
  document.documentElement.style.setProperty('--text-scale', textScale);
  localStorage.setItem('larpedin-text-scale', String(textScale));
}, [textScale]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute right-5 top-5">
        <div
          className="flex items-center gap-1 rounded-full border border-border px-2 py-1"
          role="group"
          aria-label="Text size controls"
        >
          <button
            type="button"
            aria-label="Decrease text size"
            disabled={textScale <= 0.9}
            onClick={() =>
              setTextScale((size) =>
                Math.max(0.9, Number((size - 0.1).toFixed(1))),
              )
            }
            className="rounded px-2 py-1 text-sm hover:bg-secondary disabled:opacity-40"
          >
            A−
          </button>

          <button
            type="button"
            aria-label="Reset text size"
            onClick={() => setTextScale(1)}
            className="rounded px-2 py-1 text-sm hover:bg-secondary"
          >
            A
          </button>

          <button
            type="button"
            aria-label="Increase text size"
            disabled={textScale >= 1.2}
            onClick={() =>
              setTextScale((size) =>
                Math.min(1.2, Number((size + 0.1).toFixed(1))),
              )
            }
            className="rounded px-2 py-1 text-sm hover:bg-secondary disabled:opacity-40"
          >
            A+
          </button>
        </div>
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Icon
              className="w-7 h-7 text-primary-foreground"
              aria-hidden="true"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
