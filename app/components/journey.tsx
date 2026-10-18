import { milestones } from "../content";
import { Reveal } from "./reveal";
import type { CSSProperties } from "react";

export function Journey() {
  return (
    <section className="journey" aria-labelledby="journey-title">
      <Reveal className="journey-heading">
        <div>
          <p className="small-label journey-eyebrow">The journey / 2025–2026</p>
          <h3 id="journey-title">Built one post at a time.</h3>
        </div>
        <p>
          A few moments that made me pause.
          <br />
          And then keep creating.
        </p>
      </Reveal>
      <ol className="journey-track" role="list">
        {milestones.map((milestone, index) => (
          <li
            className="journey-stop"
            key={milestone.id}
            style={{ "--milestone-order": index } as CSSProperties}
          >
            <span className="journey-dot" aria-hidden="true" />
            <Reveal className="journey-content">
              <time dateTime={milestone.date}>{milestone.dateLabel}</time>
              <h4
                className={
                  milestone.kind === "collaboration" ||
                  milestone.kind === "start"
                    ? "journey-value journey-value-word"
                    : "journey-value"
                }
              >
                {milestone.value}
              </h4>
              <p className="journey-unit">{milestone.unit}</p>
              <p className="journey-detail">{milestone.detail}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal className="journey-recognition">
        <p className="small-label">Along the way / University recognition</p>
        <h4>Entrepreneur of the Batch Award</h4>
        <p>
          SRMIST, Kattankulathur · CINTEL department
          <br />
          Academic journey, 2022–2026
        </p>
      </Reveal>
      <div className="journey-footer">
        <p>
          Personal milestones · Reported by Vivek, 16 Oct 2026.
          <br />
          Dates mark when each milestone was reached.
        </p>
        <p className="journey-continuation">
          <span aria-hidden="true">↗</span> And I’m not stopping here.
        </p>
      </div>
    </section>
  );
}
