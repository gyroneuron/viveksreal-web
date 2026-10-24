"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Line = { words: string[]; top: number; height: number; delay: number };

export function HeroTitle({
  id = "hero-title",
  text = "Make your product useful to the next generation of builders.",
  accentText = "builders.",
  compact = false,
}: {
  id?: string;
  text?: string;
  accentText?: string;
  compact?: boolean;
}) {
  const words = text.split(" ");
  const accentWords = new Set(accentText.split(" "));
  const title = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState<Line[] | null>(null);

  useEffect(() => {
    const node = title.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let resize: ResizeObserver | undefined;
    const finish = () => {
      setLines(null);
      resize?.disconnect();
    };
    const preferenceChanged = () => {
      if (motion.matches) finish();
    };
    motion.addEventListener("change", preferenceChanged);

    void document.fonts.ready.then(() => {
      // A delayed enhancement must not restart the visitor's reading experience.
      if (cancelled || motion.matches || performance.now() > 1200) return;
      const elements = [
        ...node.querySelectorAll<HTMLElement>("[data-hero-word]"),
      ];
      const groups: { top: number; words: string[] }[] = [];
      for (const element of elements) {
        const top = element.getBoundingClientRect().top;
        const last = groups[groups.length - 1];
        if (last && Math.abs(last.top - top) < 2)
          last.words.push(element.textContent ?? "");
        else groups.push({ top, words: [element.textContent ?? ""] });
      }
      const style = getComputedStyle(node);
      const lineHeight = parseFloat(style.lineHeight);
      const padding = parseFloat(style.fontSize) * 0.14;
      const stagger = Math.min(70, 350 / Math.max(1, groups.length - 1));
      setLines(
        groups.map((group, index) => ({
          words: group.words,
          top: index * lineHeight - padding,
          height: lineHeight + padding * 2,
          delay: index * stagger,
        })),
      );
      timer = setTimeout(
        finish,
        (compact ? 550 : 750) + (groups.length - 1) * stagger,
      );
      if (window.ResizeObserver) {
        const width = node.getBoundingClientRect().width;
        resize = new ResizeObserver(() => {
          if (Math.abs(node.getBoundingClientRect().width - width) > 1)
            finish();
        });
        resize.observe(node);
      }
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      resize?.disconnect();
      motion.removeEventListener("change", preferenceChanged);
    };
  }, [compact]);

  return (
    <h1
      id={id}
      className={`hero-title${compact ? " hero-title-compact" : ""}`}
      ref={title}
      data-masked={lines ? "true" : undefined}
    >
      <span className="hero-title-source">
        {words.map((word, index) => (
          <Fragment key={word + index}>
            <span
              data-hero-word
              className={accentWords.has(word) ? "accent" : undefined}
            >
              {word}
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
      {lines?.map((line, index) => (
        <span
          key={index}
          className="hero-line-mask"
          aria-hidden="true"
          style={
            {
              top: line.top,
              height: line.height,
              "--line-delay": `${line.delay}ms`,
            } as CSSProperties
          }
        >
          <span className="hero-line-content">
            {line.words.map((word, wordIndex) => (
              <Fragment key={word + wordIndex}>
                <span className={accentWords.has(word) ? "accent" : undefined}>
                  {word}
                </span>
                {wordIndex < line.words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        </span>
      ))}
    </h1>
  );
}
