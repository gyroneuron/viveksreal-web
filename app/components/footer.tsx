import { contact, propeersResults, recentProof } from "../content";
import { Arrow } from "./arrow";
import { audienceInsights } from "../audience-insights";

export function Footer({ mediaKit = false }: { mediaKit?: boolean }) {
  return (
    <footer className="footer">
      <div className="footer-identity">
        <a className="wordmark" href={mediaKit ? "/" : "#top"}>
          viveksreal<span>.</span>
        </a>
        <p>
          Vivek Jaglan <span>/</span> Creator + software engineer
        </p>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <a
          href={contact.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram: @viveksreal"
        >
          @viveksreal <Arrow diagonal />
        </a>
        <a href={contact.linkedin} target="_blank" rel="noreferrer">
          LinkedIn <Arrow diagonal />
        </a>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <a href="#top">Back to top ↑</a>
      </nav>
      <p className="footer-update">
        Follower insights:{" "}
        <time dateTime={audienceInsights.capturedAt}>
          {audienceInsights.capturedLabel}
        </time>{" "}
        · Follower report: {audienceInsights.period.label} · Performance report:{" "}
        <time dateTime={recentProof.period.start}>17 Jul</time>–
        <time dateTime={recentProof.period.end}>15 Oct 2026</time> · ProPeers
        results through{" "}
        <time dateTime={propeersResults.cutoff}>16 Oct 2026</time>.
        {mediaKit ? (
          <>
            {" "}
            Independent highlights captured{" "}
            <time dateTime="2026-10-17">17 Oct 2026</time>.
          </>
        ) : null}
      </p>
    </footer>
  );
}
