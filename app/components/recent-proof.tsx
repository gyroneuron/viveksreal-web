import { recentProof } from "../content";

export function RecentProof() {
  return (
    <section
      id="recent-proof"
      className="recent-proof shell"
      aria-labelledby="recent-proof-title"
    >
      <h2 id="recent-proof-title" className="small-label">
        Recent proof
      </h2>
      <dl className="proof-metrics">
        {recentProof.metrics.map((metric) => (
          <div className="proof-metric" key={metric.id}>
            <dt className="proof-label">{metric.label}</dt>
            <dd className="proof-value">{metric.value}</dd>
            <dd className="proof-context">
              <span>{metric.scope}</span>
              {metric.id === "followers" ? (
                <span>
                  Exported{" "}
                  <time dateTime={recentProof.followerSnapshot.date}>
                    {recentProof.followerSnapshot.label}
                  </time>
                </span>
              ) : (
                <span>
                  <time dateTime={recentProof.period.start}>17 Jul</time>–
                  <time dateTime={recentProof.period.end}>15 Oct 2026</time>
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      <p className="proof-source">
        Source: Instagram Edits exports · Followers:{" "}
        <time dateTime={recentProof.followerSnapshot.date}>
          {recentProof.followerSnapshot.label}
        </time>{" "}
        · Performance:{" "}
        <time dateTime={recentProof.exportDate}>16 Oct 2026</time>.
      </p>
    </section>
  );
}
