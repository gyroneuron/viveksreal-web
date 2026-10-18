"use client";
import Image from "next/image";
import { mediaPresentation } from "../media-presentation";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Campaign } from "../content";
import { Arrow } from "./arrow";
import { useReelPlayback } from "./reel-playback";

export function ReelPlayer({
  campaign,
  featured = false,
  editorial = false,
}: {
  campaign: Campaign;
  featured?: boolean;
  editorial?: boolean;
}) {
  const media = mediaPresentation[campaign.id];
  const poster = media?.poster ?? campaign.image;
  const source = media?.video ?? `/media/${campaign.id}.mp4`;
  const ratio = media ? media.width / media.height : 9 / 16;
  const mediaStyle = { "--media-ratio": ratio } as CSSProperties;
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [previewHasFrame, setPreviewHasFrame] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const {
    canPreview,
    registerPreview,
    setPreviewPaused,
    isSelected,
    prioritizePreview,
    openDialog,
    closeDialog,
  } = useReelPlayback();
  const titleId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const finishClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    if (dialog.current?.open) dialog.current.close();
  }, []);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      if (motion.matches && dialog.current?.dataset.closing) finishClose();
    };
    motion.addEventListener("change", changed);
    return () => {
      clearTimeout(closeTimer.current);
      motion.removeEventListener("change", changed);
    };
  }, [finishClose]);
  useEffect(() => {
    if (preview.current && trigger.current)
      return registerPreview(preview.current, trigger.current);
  }, [registerPreview]);
  useEffect(() => {
    const player = video.current;
    if (!active || !player) return;
    let cancelled = false;
    player.muted = true;
    void player.play().catch(() => {
      if (!cancelled) setPlaybackBlocked(true);
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) player.pause();
    });
    const pauseWhenHidden = () => {
      if (document.hidden) player.pause();
    };
    observer.observe(player);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      cancelled = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      player.pause();
    };
  }, [active]);
  function close() {
    if (!dialog.current?.open || dialog.current.dataset.closing) return;
    video.current?.pause();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    dialog.current.dataset.closing = "true";
    closeTimer.current = setTimeout(finishClose, 240);
  }
  function restore() {
    clearTimeout(closeTimer.current);
    if (dialog.current) delete dialog.current.dataset.closing;
    video.current?.pause();
    setActive(false);
    trigger.current?.focus();
    closeDialog();
  }
  return (
    <>
      <div
        className={`reel-preview-wrap${featured ? " reel-featured" : ""}${ratio >= 1 ? " reel-landscape" : ""}`}
        style={mediaStyle}
      >
        <a
          ref={trigger}
          className="reel-cover"
          href={campaign.url}
          target="_blank"
          rel="noreferrer"
          aria-label={
            editorial
              ? `Watch the Reel: ${campaign.title}`
              : `Watch the collaboration with ${campaign.brand}`
          }
          onPointerEnter={() => {
            if (preview.current) prioritizePreview(preview.current);
          }}
          onFocus={() => {
            if (preview.current) prioritizePreview(preview.current);
          }}
          onClick={(event) => {
            if (
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            if (!dialog.current?.showModal) return;
            event.preventDefault();
            delete dialog.current.dataset.closing;
            openDialog();
            setPlaybackBlocked(false);
            setActive(true);
            dialog.current.showModal();
          }}
        >
          <Image
            src={poster}
            alt={
              campaign.id === "propeers"
                ? "Vivek in the ProPeers split-screen developer-roadmap video"
                : campaign.alt
            }
            fill
            sizes={
              ratio >= 1
                ? "(max-width: 767px) 90vw, (max-width: 1100px) 50vw, 620px"
                : "(max-width: 767px) 80vw, 360px"
            }
            className="reel-image"
          />
          <video
            ref={preview}
            className={`reel-preview${previewHasFrame && canPreview ? " has-frame" : ""}`}
            data-src={source}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={(event) => {
              if (!isSelected(event.currentTarget)) {
                event.currentTarget.pause();
                return;
              }
              setPreviewHasFrame(true);
              setPreviewPlaying(true);
            }}
            onPause={() => setPreviewPlaying(false)}
          />
          <span className="play-chip">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="m5 2 9 6-9 6z" />
            </svg>{" "}
            {editorial ? "Watch the Reel" : "Watch the collaboration"}
          </span>
        </a>
        {canPreview && previewHasFrame ? (
          <button
            className="preview-toggle"
            type="button"
            onClick={() => {
              if (preview.current)
                setPreviewPaused(preview.current, previewPlaying);
            }}
          >
            {previewPlaying ? "Pause" : "Play"}
            <span className="sr-only"> muted {campaign.brand} preview</span>
            <span aria-hidden="true">{previewPlaying ? "Ⅱ" : "▷"}</span>
          </button>
        ) : null}
      </div>
      <dialog
        ref={dialog}
        className={`reel-dialog${ratio >= 1 ? " reel-dialog-landscape" : ""}`}
        style={mediaStyle}
        aria-labelledby={titleId}
        onClose={restore}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onAnimationEnd={(event) => {
          if (
            event.target === dialog.current &&
            event.animationName === "dialog-exit"
          )
            finishClose();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const focusable = dialog.current?.querySelectorAll<HTMLElement>(
            'button, a[href], video[controls], [tabindex="0"]',
          );
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        onClick={(event) => {
          if (event.target === dialog.current) {
            const rect = dialog.current.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              close();
          }
        }}
      >
        <div className="dialog-header">
          <div>
            <p className="small-label">
              {editorial
                ? "Independent creator content"
                : "Selected collaboration"}
            </p>
            <h2 id={titleId}>{campaign.brand}</h2>
          </div>
          <button
            className="close-dialog"
            onClick={close}
            aria-label="Close collaboration video"
            autoFocus
          >
            ×
          </button>
        </div>
        {active ? (
          <video
            ref={video}
            className="campaign-video"
            src={source}
            poster={poster}
            controls
            muted
            playsInline
            preload="none"
            aria-label={
              editorial
                ? `${campaign.title} by Vivek Jaglan`
                : `${campaign.brand} collaboration by Vivek Jaglan`
            }
          >
            {campaign.captions?.map((caption, index) => (
              <track
                key={caption.src}
                kind="captions"
                src={caption.src}
                srcLang={caption.language}
                label={caption.label}
                default={index === 0}
              />
            ))}
            Your browser does not support this video.{" "}
            <a href={campaign.url}>Watch it on Instagram.</a>
          </video>
        ) : null}
        <div className="dialog-footer">
          {playbackBlocked ? (
            <p role="status">
              Playback was blocked by your browser. Use Play in the video
              controls.
            </p>
          ) : null}
          <p>{campaign.description}</p>
          <a
            href={campaign.url}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            View the original on Instagram <Arrow diagonal />
          </a>
        </div>
      </dialog>
    </>
  );
}
