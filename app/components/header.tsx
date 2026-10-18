"use client";
import { useEffect, useRef } from "react";
import { Arrow } from "./arrow";

const links = [
  { href: "#work", label: "Work" },
  { href: "#audience", label: "Audience" },
  { href: "#about", label: "About" },
];

export function Header({ mediaKit = false }: { mediaKit?: boolean }) {
  const navigation = [
    ...links.map((link) => ({
      ...link,
      href: mediaKit ? `/${link.href}` : link.href,
    })),
    { href: "/media-kit", label: "Media Kit" },
  ];
  const action = {
    href: mediaKit ? "#campaign-brief" : "#contact",
    label: mediaKit ? "Send a campaign brief" : "Work with me",
  };
  const menu = useRef<HTMLDetailsElement>(null);
  const toggle = useRef<HTMLElement>(null);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        toggle.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node))
        menu.current.open = false;
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, []);
  function followAnchor(href: string) {
    if (menu.current) menu.current.open = false;
    const target = href.startsWith("#")
      ? document.querySelector<HTMLElement>(href)
      : null;
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  }
  return (
    <header className={`site-header${mediaKit ? " kit-header" : ""}`} id="top">
      <div className="header-inner shell">
        <a
          href={mediaKit ? "/" : "#top"}
          className="wordmark"
          aria-label="Viveksreal home"
        >
          viveksreal<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((link) => (
            <a
              href={link.href}
              key={link.href}
              aria-current={
                mediaKit && link.href === "/media-kit" ? "page" : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="button button-primary header-cta"
          href={action.href}
          aria-haspopup="dialog"
          aria-controls="campaign-brief-dialog"
        >
          {action.label} <Arrow diagonal />
        </a>
        <details className="mobile-menu" ref={menu}>
          <summary ref={toggle}>
            <span className="menu-closed">Menu</span>
            <span className="menu-open">Close</span>
            <span className="sr-only"> navigation</span>
            <span className="menu-lines" aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation">
            {[...navigation, action].map((link) => (
              <a
                href={link.href}
                key={link.href}
                aria-current={
                  mediaKit && link.href === "/media-kit" ? "page" : undefined
                }
                aria-haspopup={link.href === action.href ? "dialog" : undefined}
                aria-controls={
                  link.href === action.href
                    ? "campaign-brief-dialog"
                    : undefined
                }
                onClick={() => followAnchor(link.href)}
              >
                {link.label}
                <Arrow diagonal />
              </a>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
