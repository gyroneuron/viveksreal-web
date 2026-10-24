"use client";

import { useEffect, useRef, useState } from "react";
import { campaigns } from "../content";
import { ReelPlayer } from "./reel-player";
import { useReelPlayback } from "./reel-playback";

const panels = [
  { campaign: campaigns[0], label: "Practical tech" },
  { campaign: campaigns[2], label: "Product storytelling" },
  { campaign: campaigns[1], label: "Selected collaboration" },
];

/** Three real campaigns, one shared playback coordinator, a 12-second cycle. */
export function CampaignComposition() {
  const root = useRef<HTMLElement>(null);
  const remaining = useRef(4000);
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const { canPreview, dialogActive } = useReelPlayback();
  const running =
    available && canPreview && !paused && inView && visible && !dialogActive;

  useEffect(() => {
    const node = root.current;
    if (!node || !window.IntersectionObserver) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");
    const preferences = () => {
      setAvailable(!reduced.matches);
      if (reduced.matches || touch.matches) setPaused(true);
    };
    preferences();
    const observer = new IntersectionObserver(
      ([entry]) =>
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.3),
      { threshold: [0, 0.3] },
    );
    observer.observe(node);
    const visibility = () => setVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preferences);
    touch.addEventListener("change", preferences);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preferences);
      touch.removeEventListener("change", preferences);
    };
  }, []);

  useEffect(() => {
    if (!running || interacting) return;
    const start = performance.now();
    let advanced = false;
    const timer = window.setTimeout(() => {
      advanced = true;
      remaining.current = 4000;
      setSelected((index) => (index + 1) % panels.length);
    }, remaining.current);
    return () => {
      window.clearTimeout(timer);
      if (!advanced)
        remaining.current = Math.max(
          0,
          remaining.current - (performance.now() - start),
        );
    };
  }, [running, interacting, selected]);

  function select(index: number) {
    setSelected(index);
    setPaused(true);
    remaining.current = 4000;
  }

  return (
    <figure
      className="campaign-composition"
      ref={root}
      data-selected={selected}
      data-running={running}
    >
      <div className="composition-topline small-label">
        <span>Creator × engineer</span>
        <span aria-hidden="true">VJ / 01—03</span>
      </div>
      <div
        className="composition-stage"
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setInteracting(false);
        }}
      >
        <div className="composition-depth">
          {panels.map(({ campaign, label }, index) => (
            <div
              className={`composition-panel composition-panel-${index}`}
              key={campaign.id}
              data-active={index === selected}
            >
              <div className="composition-panel-enter">
                <ReelPlayer
                  campaign={campaign}
                  sequence
                  previewEnabled={running && index === selected}
                />
                <div className="composition-caption">
                  <span>{label}</span>
                  <span>{campaign.brand}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="composition-controls">
        <div
          className="composition-selectors"
          role="group"
          aria-label="Featured campaign"
        >
          {panels.map(({ campaign }, index) => (
            <button
              key={campaign.id}
              type="button"
              aria-label={`Feature ${campaign.brand}`}
              aria-pressed={selected === index}
              onClick={() => select(index)}
            >
              <span>0{index + 1}</span>
            </button>
          ))}
        </div>
        {available && canPreview ? (
          <button
            type="button"
            className="composition-toggle"
            onClick={() => setPaused((value) => !value)}
            aria-label={
              paused ? "Play campaign sequence" : "Pause campaign sequence"
            }
          >
            <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{" "}
            {paused ? "Play sequence" : "Pause sequence"}
          </button>
        ) : (
          <span className="composition-static">Selected work</span>
        )}
      </figcaption>
      <noscript>
        <style>{`.composition-selectors {display:none} @media(max-width:767px){.composition-panel {display:block!important;position:relative!important;width:100%!important;margin-bottom:24px;transform:none!important}.composition-stage{height:auto!important}.composition-depth{position:relative!important}.composition-stage::before{display:none}}`}</style>
      </noscript>
    </figure>
  );
}
