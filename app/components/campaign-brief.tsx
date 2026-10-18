"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { contact } from "../content";
import { useForm } from "@formspree/react";
import {
  briefDate,
  briefEmail,
  budgetInr,
  budgetLabel,
  budgetRanges,
  emptyBrief,
  formatBrief,
  formspreeEndpoint,
  formspreePayload,
} from "../brief";
import type { BriefAnswers, BudgetId } from "../brief";
import { Arrow } from "./arrow";
import { BriefIcon } from "./brief-icon";
import type { BriefIconName } from "./brief-icon";
import { useBriefExchange } from "./use-brief-exchange";
import "./campaign-brief.css";

export function CampaignBriefLink({
  context,
  targetId = "campaign-brief",
  children = "Send a campaign brief",
  className = "text-link",
}: {
  context?: string;
  targetId?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className={className}
      aria-haspopup="dialog"
      aria-controls="campaign-brief-dialog"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        if (context)
          window.dispatchEvent(
            new CustomEvent("campaign-context", { detail: context }),
          );
      }}
    >
      {children}
      <Arrow diagonal />
    </a>
  );
}
const titles = [
  "A quick introduction.",
  "What are you building?",
  "What’s the goal?",
  "When, and what budget?",
  "Ready when you are.",
];
const groups = ["About you", "Your product", "Your goal", "Timing & budget"];
const fields: (keyof BriefAnswers)[][] = [
  ["name", "brand", "email"],
  ["product"],
  ["goal"],
  ["timing", "budget"],
  [],
];
const labels: Record<keyof BriefAnswers, string> = {
  name: "Your name",
  brand: "Brand / company",
  email: "Work email",
  product: "Product or campaign link",
  goal: "Campaign goal",
  timing: "Preferred launch date",
  budget: "Planned budget",
  reference: "Campaign reference",
};
const limits: Partial<Record<keyof BriefAnswers, number>> = {
  name: 80,
  brand: 120,
  email: 254,
  product: 500,
  goal: 1000,
  reference: 160,
};
function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function CampaignBriefDraft({
  targetId = "campaign-brief",
}: {
  targetId?: string;
}) {
  const [answers, setAnswers] = useState<BriefAnswers>(emptyBrief);
  const [submission, sendSubmission, resetSubmission] =
    useForm<Record<string, string>>("xrpejkob");
  const sendLock = useRef(false);
  const [sendFailure, setSendFailure] = useState("");
  const sendError = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [dateMode, setDateMode] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [editing, setEditing] = useState(false);
  const editSnapshot = useRef<BriefAnswers | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BriefAnswers, string>>
  >({});
  const [copyStatus, setCopyStatus] = useState("");
  const [showCopy, setShowCopy] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const focusFallback = useRef<HTMLElement | null>(null);
  const copyText = useRef<HTMLTextAreaElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const oldPadding = useRef<string | null>(null);
  const { exchange, loading, failed, retry } = useBriefExchange(
    active && step >= 3,
  );
  const id = useId();
  const restorePadding = useCallback(() => {
    if (oldPadding.current !== null) {
      document.body.style.paddingRight = oldPadding.current;
      oldPadding.current = null;
    }
  }, []);
  const finishClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    dialog.current?.close();
  }, []);
  const open = useCallback((trigger: HTMLElement) => {
    const node = dialog.current;
    if (!node?.showModal || node.open) return;
    opener.current = trigger;
    focusFallback.current =
      trigger.closest("details")?.querySelector<HTMLElement>("summary") ??
      launcher.current;
    const gutter = innerWidth - document.documentElement.clientWidth;
    oldPadding.current = document.body.style.paddingRight;
    if (gutter > 0)
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`;
    delete node.dataset.closing;
    setMinDate(today());
    setActive(true);
    node.showModal();
    window.dispatchEvent(
      new CustomEvent("campaign-brief-visibility", { detail: true }),
    );
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  }, []);
  function close() {
    if (!dialog.current?.open || dialog.current.dataset.closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      finishClose();
    else {
      dialog.current.dataset.closing = "true";
      closeTimer.current = setTimeout(finishClose, 240);
    }
  }
  function restore() {
    clearTimeout(closeTimer.current);
    if (dialog.current) delete dialog.current.dataset.closing;
    setActive(false);
    restorePadding();
    window.dispatchEvent(
      new CustomEvent("campaign-brief-visibility", { detail: false }),
    );
    const hiddenMenu = opener.current?.closest("details:not([open])");
    const trigger =
      opener.current?.getClientRects().length && !hiddenMenu
        ? opener.current
        : focusFallback.current;
    trigger?.focus({ preventScroll: true });
  }
  useEffect(() => {
    setReady(true);
    const select = (event: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === "string") {
        const reference = event.detail.slice(0, 160);
        setAnswers((current) =>
          current.reference.trim() ? current : { ...current, reference },
        );
      }
    };
    const follow = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (
        !link ||
        link.target === "_blank" ||
        link.origin !== location.origin ||
        link.pathname !== location.pathname ||
        link.hash !== `#${targetId}` ||
        !dialog.current?.showModal
      )
        return;
      event.preventDefault();
      open(link);
    };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => {
      if (motion.matches && dialog.current?.dataset.closing) finishClose();
    };
    window.addEventListener("campaign-context", select);
    document.addEventListener("click", follow);
    motion.addEventListener("change", motionChanged);
    return () => {
      clearTimeout(closeTimer.current);
      restorePadding();
      window.dispatchEvent(
        new CustomEvent("campaign-brief-visibility", { detail: false }),
      );
      window.removeEventListener("campaign-context", select);
      document.removeEventListener("click", follow);
      motion.removeEventListener("change", motionChanged);
    };
  }, [targetId, open, finishClose, restorePadding]);
  useEffect(() => {
    if (!active) return;
    scroller.current?.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
  }, [step, active, submission.succeeded]);
  function update(key: keyof BriefAnswers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setCopyStatus("");
  }
  function next(event: FormEvent) {
    event.preventDefault();
    if (step === 4) {
      void submitBrief();
      return;
    }
    const invalid: Partial<Record<keyof BriefAnswers, string>> = {};
    for (const key of fields[step]) {
      const value = answers[key].trim();
      if (key !== "budget" && !value)
        invalid[key] =
          key === "timing"
            ? "Choose a date, or select Flexible."
            : "Please fill in this field.";
      else if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        invalid[key] = "Enter a valid email address.";
      else if (key === "product" && value) {
        try {
          const url = new URL(value);
          if (
            !["https:", "http:"].includes(url.protocol) ||
            !url.hostname.includes(".")
          )
            throw Error();
        } catch {
          invalid[key] = "Enter a full link starting with https://.";
        }
      } else if (
        key === "timing" &&
        dateMode &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
          Number.isNaN(Date.parse(value)) ||
          value < today())
      )
        invalid[key] = "Choose today or a future date, or select Flexible.";
    }
    setErrors(invalid);
    const first = Object.keys(invalid)[0];
    if (first)
      requestAnimationFrame(() =>
        (
          form.current?.elements.namedItem(first) as HTMLElement | null
        )?.focus(),
      );
    else {
      setShowCopy(false);
      setStep(editing ? 4 : step + 1);
      setEditing(false);
      editSnapshot.current = null;
    }
  }
  async function submitBrief() {
    if (sendLock.current || submission.submitting || submission.succeeded)
      return;
    sendLock.current = true;
    setSendFailure("");
    try {
      await sendSubmission(
        formspreePayload(
          answers,
          exchange,
          location.origin + location.pathname,
        ),
      );
    } catch {
      setSendFailure(
        "We couldn’t confirm the submission. Your brief is still here. Try again or email it instead.",
      );
    } finally {
      sendLock.current = false;
    }
  }
  useEffect(() => {
    if (!submission.errors && !sendFailure) return;
    requestAnimationFrame(() =>
      sendError.current?.focus({ preventScroll: false }),
    );
  }, [submission.errors, sendFailure]);
  function startAnotherBrief() {
    resetSubmission();
    setSendFailure("");
    setAnswers(emptyBrief);
    setDateMode(false);
    setStep(0);
    setEditing(false);
    editSnapshot.current = null;
    setErrors({});
    setCopyStatus("");
    setShowCopy(false);
  }
  function edit(index: number) {
    if (submission.submitting) return;
    resetSubmission();
    setSendFailure("");
    editSnapshot.current = { ...answers };
    setEditing(true);
    setStep(index);
    setErrors({});
    setCopyStatus("");
  }
  function back() {
    setErrors({});
    setCopyStatus("");
    if (editing && editSnapshot.current) {
      setAnswers(editSnapshot.current);
      setDateMode(editSnapshot.current.timing !== "Flexible");
      setEditing(false);
      setStep(4);
      editSnapshot.current = null;
    } else setStep((current) => current - 1);
  }
  const body = formatBrief(answers, exchange);
  const estimate = exchange ? budgetInr(answers.budget, exchange.rate) : null;
  function field(
    key: "name" | "brand" | "email" | "product" | "goal" | "reference",
    optional = false,
  ) {
    const inputId = `${id}-${key}`;
    const shared = {
      id: inputId,
      name: key,
      value: answers[key],
      required: !optional,
      maxLength: limits[key],
      disabled: submission.submitting,
      "aria-invalid": errors[key] ? (true as const) : undefined,
      "aria-describedby": errors[key] ? `${inputId}-error` : undefined,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => update(key, event.target.value),
    };
    return (
      <div className="brief-field" key={key}>
        <label htmlFor={inputId}>
          <BriefIcon name={key} />
          {labels[key]}
          {optional ? <span>(optional)</span> : null}
        </label>
        {key === "goal" ? (
          <textarea
            {...shared}
            rows={4}
            placeholder="The launch, who it’s for, and what you want people to do next."
          />
        ) : (
          <input
            {...shared}
            type={
              key === "email" ? "email" : key === "product" ? "url" : "text"
            }
            autoComplete={
              key === "name"
                ? "name"
                : key === "brand"
                  ? "organization"
                  : key === "email"
                    ? "email"
                    : "off"
            }
            placeholder={
              key === "product"
                ? "https://your-brand.com/product"
                : key === "reference"
                  ? "A campaign that caught your eye"
                  : undefined
            }
          />
        )}
        {errors[key] ? (
          <p id={`${inputId}-error`} className="brief-error">
            {errors[key]}
          </p>
        ) : null}
      </div>
    );
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopyStatus(
        "Brief copied. Paste it into your email whenever you’re ready.",
      );
    } catch {
      setShowCopy(true);
      setCopyStatus("Select and copy the brief below.");
      requestAnimationFrame(() => {
        copyText.current?.focus();
        copyText.current?.select();
      });
    }
  }
  return (
    <div className="campaign-journey" data-ready={ready}>
      <div className="brief-fallback">
        <p>
          Email your name, brand, product link, goal, preferred date, and budget
          if available.
        </p>
        <a className="text-link" href={`mailto:${contact.email}`}>
          Email Vivek <Arrow diagonal />
        </a>
      </div>
      <div className="brief-launch">
        <button
          ref={launcher}
          type="button"
          className="button button-light"
          aria-haspopup="dialog"
          aria-controls="campaign-brief-dialog"
          onClick={(event) => open(event.currentTarget)}
        >
          Start a campaign brief <Arrow diagonal />
        </button>
        <p>A few quick details. Review before sending.</p>
      </div>
      <dialog
        ref={dialog}
        id="campaign-brief-dialog"
        className="brief-dialog"
        aria-labelledby={`${id}-title`}
        onClose={restore}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            dialog.current?.querySelectorAll<HTMLElement>(
              'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]',
            ) ?? [],
          ).filter(
            (control) =>
              control.getClientRects().length &&
              getComputedStyle(control).visibility !== "hidden",
          );
          const first = controls[0],
            last = controls[controls.length - 1];
          if (!first || !last) return;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
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
        onClick={(event) => {
          if (event.target !== dialog.current) return;
          const rect = dialog.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            close();
        }}
      >
        <header className="brief-modal-header">
          <h2 id={`${id}-title`}>
            Campaign brief<span> / @viveksreal</span>
          </h2>
          <button
            type="button"
            className="brief-close"
            aria-label="Close campaign brief"
            onClick={close}
          >
            <BriefIcon name="close" />
          </button>
        </header>
        <form
          ref={form}
          className="brief-form"
          action={formspreeEndpoint}
          method="POST"
          noValidate
          onSubmit={next}
          aria-busy={submission.submitting}
          aria-label="Campaign brief"
        >
          {submission.succeeded ? (
            <>
              <div className="brief-scroll brief-success" ref={scroller}>
                <div className="brief-success-icon">
                  <BriefIcon name="email" />
                </div>
                <h3 ref={heading} tabIndex={-1}>
                  Brief submitted.
                </h3>
                <p>
                  Thanks for sharing what you’re building. Vivek can follow up
                  at <strong>{answers.email}</strong>.
                </p>
                <p className="brief-success-brand">
                  {answers.brand} · {budgetLabel(answers.budget)}
                </p>
              </div>
              <footer className="brief-actions">
                <button
                  type="button"
                  className="brief-back"
                  onClick={startAnotherBrief}
                >
                  Start another brief
                </button>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={close}
                >
                  Done <Arrow />
                </button>
              </footer>
            </>
          ) : (
            <>
              <div className="brief-scroll" ref={scroller}>
                <div className="brief-progress">
                  <p aria-live="polite" aria-atomic="true">
                    {editing ? "Edit your brief" : `Step ${step + 1} of 5`}
                  </p>
                  <span aria-hidden="true">
                    {titles.map((title, index) => (
                      <i key={title} data-current={index <= step} />
                    ))}
                  </span>
                </div>
                <div key={step} className="brief-step">
                  <h3 ref={heading} tabIndex={-1}>
                    {titles[step]}
                  </h3>
                  <p className="brief-hint">
                    {
                      [
                        "The right person and brand to start the conversation.",
                        "One link is all we need to begin.",
                        "A couple of sentences is plenty.",
                        "Choose a date or keep it flexible. Budget is optional.",
                        "Check your details, then send your brief directly.",
                      ][step]
                    }
                  </p>
                  {step < 3 ? (
                    fields[step].map((key) =>
                      field(
                        key as "name" | "brand" | "email" | "product" | "goal",
                      ),
                    )
                  ) : step === 3 ? (
                    <>
                      <fieldset className="brief-timing">
                        <legend>
                          <BriefIcon name="timing" />
                          Campaign timing
                        </legend>
                        <div className="brief-choice-row">
                          {[false, true].map((specific) => (
                            <label
                              className="brief-choice"
                              key={String(specific)}
                            >
                              <input
                                type="radio"
                                name="date-mode"
                                checked={dateMode === specific}
                                onChange={() => {
                                  setDateMode(specific);
                                  update("timing", specific ? "" : "Flexible");
                                }}
                              />
                              <span>
                                {specific ? "Choose a date" : "Flexible"}
                              </span>
                            </label>
                          ))}
                        </div>
                        {dateMode ? (
                          <div className="brief-field">
                            <label htmlFor={`${id}-date`}>
                              <BriefIcon name="timing" />
                              {labels.timing}
                            </label>
                            <input
                              id={`${id}-date`}
                              name="timing"
                              type="date"
                              value={
                                answers.timing === "Flexible"
                                  ? ""
                                  : answers.timing
                              }
                              min={minDate}
                              required
                              aria-invalid={errors.timing ? true : undefined}
                              aria-describedby={
                                errors.timing ? `${id}-date-error` : undefined
                              }
                              onChange={(event) =>
                                update("timing", event.target.value)
                              }
                            />
                            {errors.timing ? (
                              <p
                                className="brief-error"
                                id={`${id}-date-error`}
                              >
                                {errors.timing}
                              </p>
                            ) : null}
                          </div>
                        ) : null}
                      </fieldset>
                      <fieldset className="brief-budget">
                        <legend>
                          <BriefIcon name="budget" />
                          Planned budget <span>(USD · optional)</span>
                        </legend>
                        <div className="brief-budget-grid">
                          {budgetRanges.map((range) => (
                            <label
                              className="brief-budget-option"
                              key={range.id}
                            >
                              <input
                                type="radio"
                                name="budget"
                                value={range.id}
                                checked={answers.budget === range.id}
                                onChange={() => {
                                  setAnswers((current) => ({
                                    ...current,
                                    budget: range.id as BudgetId,
                                  }));
                                  setCopyStatus("");
                                }}
                              />
                              <span>{range.label}</span>
                              {exchange && range.id !== "discuss" ? (
                                <small>
                                  ≈ {budgetInr(range.id, exchange.rate)}
                                </small>
                              ) : (
                                <small>
                                  {range.id === "discuss"
                                    ? "Find the right scope together"
                                    : "USD"}
                                </small>
                              )}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <div className="brief-conversion">
                        <p
                          className="brief-estimate"
                          role="status"
                          aria-live="polite"
                        >
                          {estimate
                            ? `Approx. ${estimate}`
                            : answers.budget === "discuss"
                              ? "We’ll agree on a scope that fits."
                              : loading
                                ? "Getting the INR estimate…"
                                : "INR estimate unavailable. Your USD budget is saved."}
                        </p>
                        {exchange ? (
                          <p>
                            1 USD = ₹{exchange.rate.toFixed(2)} · Reference rate{" "}
                            <time dateTime={exchange.date}>
                              {briefDate(exchange.date)}
                            </time>
                            .{" "}
                            <a
                              href="https://frankfurter.dev/"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Frankfurter
                            </a>{" "}
                            · Estimate only.
                          </p>
                        ) : loading ? (
                          <p>
                            Fetching the latest available USD/INR reference
                            rate.
                          </p>
                        ) : failed ? (
                          <p>
                            Conversion is optional.{" "}
                            <button
                              type="button"
                              className="brief-text-button"
                              onClick={retry}
                            >
                              Try again
                            </button>
                          </p>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="brief-review">
                        {fields.slice(0, 4).map((group, index) => (
                          <section key={index}>
                            <div className="brief-review-heading">
                              <h4>{groups[index]}</h4>
                              <button
                                type="button"
                                disabled={submission.submitting}
                                onClick={() => edit(index)}
                                aria-label={`Edit ${groups[index].toLowerCase()}`}
                              >
                                Edit <Arrow diagonal />
                              </button>
                            </div>
                            <dl>
                              {group.map((key) => (
                                <div key={key}>
                                  <dt>
                                    <BriefIcon name={key as BriefIconName} />
                                    {labels[key]}
                                  </dt>
                                  <dd>
                                    {key === "timing"
                                      ? briefDate(answers.timing)
                                      : key === "budget"
                                        ? budgetLabel(answers.budget)
                                        : answers[key]}
                                    {key === "budget" &&
                                    estimate &&
                                    exchange ? (
                                      <small>
                                        Approx. {estimate} · Rate dated{" "}
                                        {briefDate(exchange.date)}
                                      </small>
                                    ) : null}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </section>
                        ))}
                      </div>
                      {field("reference", true)}
                    </>
                  )}
                </div>
                {step === 4 ? (
                  <div className="brief-copy">
                    <button type="button" onClick={copy}>
                      Copy brief
                    </button>
                    <a
                      href={briefEmail(answers, exchange)}
                      className="brief-email-fallback"
                    >
                      Email instead <Arrow diagonal />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCopy((value) => !value);
                        setCopyStatus("");
                      }}
                    >
                      {showCopy ? "Hide text" : "Show text to copy"}
                    </button>
                    <p role="status">{copyStatus}</p>
                    {showCopy ? (
                      <div className="brief-field">
                        <label htmlFor={`${id}-copy`}>
                          Your complete brief
                        </label>
                        <textarea
                          id={`${id}-copy`}
                          ref={copyText}
                          readOnly
                          value={body}
                          rows={8}
                          onFocus={(event) => event.currentTarget.select()}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {submission.errors || sendFailure ? (
                  <div
                    className="brief-send-error"
                    role="alert"
                    tabIndex={-1}
                    ref={sendError}
                  >
                    <p>
                      {sendFailure ||
                        "We couldn’t submit your brief. Your details are saved here—please try again, or email it instead."}
                    </p>
                    {submission.errors ? (
                      <ul>
                        {[
                          ...submission.errors.getFormErrors(),
                          ...submission.errors
                            .getAllFieldErrors()
                            .flatMap(([field, values]) =>
                              values.map((value) => ({
                                message: `${String(field)}: ${value.message}`,
                              })),
                            ),
                        ].map((error, index) => (
                          <li key={index}>{error.message}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
                <p className="brief-privacy">
                  Your brief is shared with Vivek through Formspree only when
                  you submit. Your draft stays here until you leave or refresh.
                </p>
              </div>
              <footer className="brief-actions">
                {step > 0 || editing ? (
                  <button
                    type="button"
                    className="brief-back"
                    onClick={back}
                    disabled={submission.submitting}
                  >
                    {editing ? "Cancel edit" : "Back"}
                  </button>
                ) : (
                  <span />
                )}
                {step < 4 ? (
                  <button className="button button-primary" type="submit">
                    {editing
                      ? "Save changes"
                      : step === 3
                        ? "Review brief"
                        : "Continue"}
                    <Arrow />
                  </button>
                ) : (
                  <button
                    className="button button-primary"
                    type="submit"
                    disabled={submission.submitting}
                  >
                    {submission.submitting
                      ? "Sending…"
                      : submission.errors || sendFailure
                        ? "Try sending again"
                        : "Send campaign brief"}{" "}
                    <Arrow diagonal />
                  </button>
                )}
              </footer>
            </>
          )}
        </form>
      </dialog>
    </div>
  );
}
