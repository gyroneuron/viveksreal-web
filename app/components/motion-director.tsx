"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Progressive enhancement: nothing is hidden while waiting for JavaScript. */
export function MotionDirector() {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.IntersectionObserver || !Element.prototype.animate) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
    );
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const composition = document.querySelector<HTMLElement>(
      ".campaign-composition",
    );
    const depth = composition?.querySelector<HTMLElement>(".composition-depth");
    function animate(
      node: Element,
      frames: Keyframe[],
      duration: number,
      delay = 0,
    ) {
      const animation = node.animate(frames, {
        duration,
        delay,
        easing: ease,
        fill: "backwards",
      });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    }
    function parallax() {
      frame = 0;
      if (!depth || !composition || reduced.matches || !desktop.matches) return;
      const bounds = composition.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const offset = Math.max(
        -12,
        Math.min(
          12,
          (innerHeight / 2 - bounds.top - bounds.height / 2) * 0.035,
        ),
      );
      depth.style.transform = `translateY(${offset}px)`;
    }
    const scroll = () => {
      if (!frame && !reduced.matches && desktop.matches)
        frame = requestAnimationFrame(parallax);
    };
    function setup() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (depth) depth.style.transform = "";
      if (reduced.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || seen.has(entry.target)) continue;
            seen.add(entry.target);
            observer?.unobserve(entry.target);
            const node = entry.target;
            // Back/anchor navigation shouldn't replay effects above the reading position.
            if (entry.boundingClientRect.bottom < 0) continue;
            if (node.matches(".reel-cover, .kit-external-poster")) {
              animate(
                node,
                [
                  { clipPath: "inset(0 100% 0 0)" },
                  { clipPath: "inset(0 0% 0 0)" },
                ],
                580,
              );
              node
                .querySelectorAll("img, video")
                .forEach((image) =>
                  animate(
                    image,
                    [{ transform: "scale(1.035)" }, { transform: "scale(1)" }],
                    580,
                  ),
                );
            } else if (node.matches(".kit-logo-grid")) {
              node.querySelectorAll(".kit-logo-artwork").forEach((logo, i) =>
                animate(
                  logo,
                  [
                    { opacity: 0.3, transform: "translateY(8px)" },
                    { opacity: 1, transform: "none" },
                  ],
                  420,
                  i * 55,
                ),
              );
            } else if (node.matches(".audience-age")) {
              node
                .querySelectorAll(".audience-age-track > span")
                .forEach((bar) =>
                  animate(
                    bar,
                    [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
                    550,
                  ),
                );
            } else if (node.matches(".contact-layout")) {
              node.querySelectorAll(".closing-line > span").forEach((line, i) =>
                animate(
                  line,
                  [
                    { transform: "translateY(36px)", opacity: 0.2 },
                    { transform: "none", opacity: 1 },
                  ],
                  700,
                  i * 70,
                ),
              );
              const action = node.querySelector(".brief-launch");
              if (action)
                animate(action, [{ opacity: 0.5 }, { opacity: 1 }], 400, 180);
            } else {
              animate(node, [{ opacity: 0.5 }, { opacity: 1 }], 480);
            }
          }
        },
        { threshold: 0.12 },
      );
      document
        .querySelectorAll(
          ".reel-preview-wrap:not(.composition-panel .reel-preview-wrap) > .reel-cover, .kit-external-poster, .kit-logo-grid, .audience-age, .contact-layout, .section-heading h2, .kit-heading h2, .kit-logo-heading h2, #kit-audience-title",
        )
        .forEach((node) => observer?.observe(node));
      parallax();
    }
    setup();
    reduced.addEventListener("change", setup);
    desktop.addEventListener("change", setup);
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", setup);
      desktop.removeEventListener("change", setup);
      window.removeEventListener("scroll", scroll);
      if (depth) depth.style.transform = "";
    };
  }, [pathname]);
  return null;
}
