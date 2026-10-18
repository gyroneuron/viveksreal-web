"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
type Preview = {
  video: HTMLVideoElement;
  target: HTMLElement;
  visible: boolean;
  userPaused: boolean;
};
type Playback = {
  canPreview: boolean;
  registerPreview: (video: HTMLVideoElement, target: HTMLElement) => () => void;
  setPreviewPaused: (video: HTMLVideoElement, paused: boolean) => void;
  isSelected: (video: HTMLVideoElement) => boolean;
  prioritizePreview: (video: HTMLVideoElement) => void;
  openDialog: () => void;
  closeDialog: () => void;
};

const PlaybackContext = createContext<Playback | null>(null);

export function ReelPlaybackProvider({
  children,
  previewsEnabled = true,
}: {
  children: React.ReactNode;
  previewsEnabled?: boolean;
}) {
  const previews = useRef(new Map<HTMLVideoElement, Preview>());
  const observer = useRef<IntersectionObserver | null>(null);
  const selected = useRef<HTMLVideoElement | null>(null);
  const priority = useRef<HTMLVideoElement | null>(null);
  const permitted = useRef(false);
  const dialogOpen = useRef(false);
  const [canPreview, setCanPreview] = useState(false);

  const reconcile = useCallback((preferred?: HTMLVideoElement) => {
    const entries = [...previews.current.values()];
    const candidates =
      permitted.current && !document.hidden && !dialogOpen.current
        ? entries.filter((entry) => entry.visible && !entry.userPaused)
        : [];
    const requested = preferred ?? priority.current;
    const next =
      candidates.find((entry) => entry.video === requested) ??
      candidates.sort((a, b) => {
        const aRect = a.target.getBoundingClientRect();
        const bRect = b.target.getBoundingClientRect();
        return (
          Math.abs(aRect.top + aRect.height / 2 - innerHeight / 2) -
          Math.abs(bRect.top + bRect.height / 2 - innerHeight / 2)
        );
      })[0];
    selected.current = next?.video ?? null;
    for (const entry of entries) {
      if (entry.video !== selected.current) entry.video.pause();
    }
    if (!next) return;
    const player = next.video;
    if (!player.getAttribute("src") && player.dataset.src)
      player.src = player.dataset.src;
    player.muted = true;
    if (player.paused)
      void player.play().catch(() => {
        /* Poster and click-to-open link remain available if autoplay is blocked. */
      });
  }, []);

  const registerPreview = useCallback(
    (video: HTMLVideoElement, target: HTMLElement) => {
      const entry: Preview = {
        video,
        target,
        visible: false,
        userPaused: false,
      };
      previews.current.set(video, entry);
      observer.current?.observe(target);
      return () => {
        observer.current?.unobserve(target);
        video.pause();
        previews.current.delete(video);
        if (priority.current === video) priority.current = null;
        reconcile();
      };
    },
    [reconcile],
  );

  const setPreviewPaused = useCallback(
    (video: HTMLVideoElement, paused: boolean) => {
      const entry = previews.current.get(video);
      if (!entry) return;
      entry.userPaused = paused;
      if (!paused) priority.current = video;
      else if (priority.current === video) priority.current = null;
      reconcile(paused ? undefined : video);
    },
    [reconcile],
  );
  const isSelected = useCallback(
    (video: HTMLVideoElement) => selected.current === video,
    [],
  );
  const prioritizePreview = useCallback(
    (video: HTMLVideoElement) => {
      priority.current = video;
      reconcile(video);
    },
    [reconcile],
  );
  const openDialog = useCallback(() => {
    dialogOpen.current = true;
    reconcile();
  }, [reconcile]);
  const closeDialog = useCallback(() => {
    dialogOpen.current = false;
    reconcile();
  }, [reconcile]);

  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const entries = previews.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection })
      .connection;
    const updatePreferences = () => {
      const allowed =
        previewsEnabled &&
        !motion.matches &&
        !connection?.saveData &&
        !["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
      permitted.current = allowed;
      setCanPreview(allowed);
      reconcile();
      if (!allowed) {
        for (const { video } of entries.values()) {
          if (video.hasAttribute("src")) {
            video.removeAttribute("src");
            video.load();
          }
        }
      }
    };
    observer.current = new IntersectionObserver(
      (changes) => {
        for (const change of changes) {
          const entry = [...entries.values()].find(
            (entry) => entry.target === change.target,
          );
          if (entry)
            entry.visible =
              change.isIntersecting && change.intersectionRatio >= 0.4;
        }
        reconcile();
      },
      { threshold: [0, 0.4, 0.6, 0.8, 1] },
    );
    for (const entry of entries.values())
      observer.current.observe(entry.target);
    updatePreferences();
    const briefVisibilityChanged = (event: Event) => {
      if (event instanceof CustomEvent) {
        dialogOpen.current = Boolean(event.detail);
        reconcile();
      }
    };
    window.addEventListener(
      "campaign-brief-visibility",
      briefVisibilityChanged,
    );
    const visibilityChanged = () => reconcile();
    document.addEventListener("visibilitychange", visibilityChanged);
    motion.addEventListener("change", updatePreferences);
    connection?.addEventListener("change", updatePreferences);
    return () => {
      observer.current?.disconnect();
      observer.current = null;
      for (const { video } of entries.values()) video.pause();
      window.removeEventListener(
        "campaign-brief-visibility",
        briefVisibilityChanged,
      );
      document.removeEventListener("visibilitychange", visibilityChanged);
      motion.removeEventListener("change", updatePreferences);
      connection?.removeEventListener("change", updatePreferences);
    };
  }, [reconcile, previewsEnabled]);

  const value = useMemo(
    () => ({
      canPreview,
      registerPreview,
      setPreviewPaused,
      isSelected,
      prioritizePreview,
      openDialog,
      closeDialog,
    }),
    [
      canPreview,
      registerPreview,
      setPreviewPaused,
      isSelected,
      prioritizePreview,
      openDialog,
      closeDialog,
    ],
  );
  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}

export function useReelPlayback() {
  const playback = useContext(PlaybackContext);
  if (!playback)
    throw new Error("ReelPlayer must be inside ReelPlaybackProvider");
  return playback;
}
