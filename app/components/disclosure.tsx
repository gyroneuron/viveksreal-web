"use client";

import { useEffect, useRef } from "react";

export function Disclosure({
  className,
  summary,
  contentClassName,
  children,
}: {
  className: string;
  summary: React.ReactNode;
  contentClassName: string;
  children: React.ReactNode;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const heading = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const intendedOpen = useRef(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finishImmediately = () => {
      if (!motion.matches || !animation.current || !details.current) return;
      animation.current.cancel();
      animation.current = null;
      details.current.open = intendedOpen.current;
      details.current.style.height = "";
      details.current.style.overflow = "";
      if (content.current) content.current.inert = false;
    };
    motion.addEventListener("change", finishImmediately);
    return () => {
      animation.current?.cancel();
      motion.removeEventListener("change", finishImmediately);
    };
  }, []);

  return (
    <details
      ref={details}
      className={className}
      onToggle={() => {
        if (!animation.current && details.current)
          intendedOpen.current = details.current.open;
      }}
    >
      <summary
        ref={heading}
        onClick={(event) => {
          const node = details.current;
          const body = content.current;
          const question = heading.current;
          if (
            !node ||
            !body ||
            !question ||
            !node.animate ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
          )
            return;
          event.preventDefault();
          const target = !(animation.current
            ? intendedOpen.current
            : node.open);
          intendedOpen.current = target;
          const start = node.getBoundingClientRect().height;
          animation.current?.cancel();
          node.style.height = `${start}px`;
          node.style.overflow = "clip";
          node.open = true;
          body.inert = !target;
          const style = getComputedStyle(node);
          const border =
            parseFloat(style.borderTopWidth) +
            parseFloat(style.borderBottomWidth);
          const end =
            question.getBoundingClientRect().height +
            (target ? body.getBoundingClientRect().height : 0) +
            border;
          const transition = node.animate(
            { height: [`${start}px`, `${end}px`] },
            {
              duration: 250,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "forwards",
            },
          );
          animation.current = transition;
          transition.onfinish = () => {
            node.open = target;
            node.style.height = "";
            node.style.overflow = "";
            body.inert = false;
            animation.current = null;
            transition.cancel();
          };
        }}
      >
        {summary}
      </summary>
      <div ref={content} className={contentClassName}>
        {children}
      </div>
    </details>
  );
}
