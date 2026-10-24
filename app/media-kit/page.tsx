import { mediaPresentation } from "../media-presentation";
import { BrandPartnerships } from "../components/brand-partnerships";
import { DisclosureIcon } from "../components/disclosure-icon";
import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { AudienceInsights } from "../components/audience-insights";
import { Arrow } from "../components/arrow";
import { Disclosure } from "../components/disclosure";
import { ReelPlayer } from "../components/reel-player";
import { HeroTitle } from "../components/hero-title";
import {
  CampaignBriefDraft,
  CampaignBriefLink,
} from "../components/campaign-brief";
import { campaigns, contact, propeersResults, recentProof } from "../content";
import {
  accountSnapshot,
  highlights,
  kitQuestions,
  leadInteractions,
  leadResults,
  partnershipDetails,
} from "./content";
import type { MetricRecord } from "./content";
import "./media-kit.css";

export const metadata: Metadata = {
  title: "Media Kit — Vivek Jaglan / @viveksreal",
  description:
    "Dated audience context, real brand partnerships, and selected creator work from Vivek Jaglan. Explore the fit and send a campaign brief.",
  openGraph: {
    title: "Viveksreal — Media Kit",
    description:
      "Useful product stories. Real work. The context for your next campaign.",
    type: "website",
    locale: "en_IN",
  },
};

function Label({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="section-label">
      <span>{number}</span>
      {children}
    </p>
  );
}
function Metrics({
  items,
  className = "",
}: {
  items: MetricRecord[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <dl className={`kit-metrics ${className}`}>
      {items
        .filter((item) => item.verification_status === "source-checked")
        .map((item) => (
          <div key={item.id}>
            <dt>{item.unit}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
    </dl>
  );
}
function Detail({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <Disclosure
      className="kit-details disclosure"
      contentClassName="kit-detail-body"
      summary={
        <>
          <span>{summary}</span>
          <DisclosureIcon />
        </>
      }
    >
      {children}
    </Disclosure>
  );
}

export default function MediaKitPage() {
  const lead = campaigns[0];
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header mediaKit />
      <main id="main" className="media-kit">
        <nav className="kit-index" aria-label="Media kit sections">
          <div className="shell">
            <span className="small-label">Inside the kit</span>
            <a href="#results">Results</a>
            <a href="#kit-audience">Audience</a>
            <a href="#partnerships">Partnerships</a>
            <a
              href="#campaign-brief"
              aria-haspopup="dialog"
              aria-controls="campaign-brief-dialog"
            >
              Brief <Arrow diagonal />
            </a>
          </div>
        </nav>
        <section className="kit-hero shell" aria-labelledby="kit-title">
          <div className="kit-hero-copy">
            <p className="eyebrow">@viveksreal / Media Kit</p>
            <HeroTitle
              id="kit-title"
              text="Your next campaign, backed by the right context."
              accentText="backed by the right context."
              compact
            />
            <p className="kit-intro">
              Audience insights, recent performance, and selected collaborations
              from Vivek Jaglan — creator and software engineer making tech,
              careers, and building more accessible.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#campaign-brief"
                aria-haspopup="dialog"
                aria-controls="campaign-brief-dialog"
              >
                Send a campaign brief <Arrow />
              </a>
              <a className="text-link" href="#results">
                Explore brand partnerships <Arrow diagonal />
              </a>
            </div>
          </div>
          <figure className="kit-hero-frame">
            <div>
              <Image
                src={lead.image}
                alt="Vivek explaining a developer roadmap in his ProPeers collaboration"
                fill
                preload
                sizes="(max-width: 767px) 40vw, 230px"
              />
            </div>
            <figcaption>
              Vivek Jaglan
              <br />
              <span>Creator + software engineer</span>
            </figcaption>
          </figure>
          <div className="kit-opening-facts">
            {accountSnapshot.map((item, index) => (
              <div key={item.id}>
                <strong>{item.value}</strong>
                <p>{item.unit}</p>
                <span>
                  {index === 0
                    ? `${recentProof.followerSnapshot.exact.toLocaleString("en-IN")} · Exported ${recentProof.followerSnapshot.label}`
                    : `${index === 1 ? "Reels" : "Reels + posts"} · 17 Jul–15 Oct 2026`}
                </span>
              </div>
            ))}
            <div className="kit-focus">
              <span className="small-label">Content focus</span>
              <p>
                Technology.
                <br />
                Careers. Builders.
              </p>
              <span>Practical stories for young people in India.</span>
            </div>
          </div>
          <p className="kit-source kit-snapshot-source">
            Source: Instagram Edits exports · Followers:{" "}
            {recentProof.followerSnapshot.label}. Performance: 16 Oct 2026.
            Viewers is the report’s field label.
          </p>
        </section>
        <section
          id="results"
          className="kit-section shell"
          aria-labelledby="lead-title"
        >
          <Label number="01">Lead partnership</Label>
          <div className="lead-project kit-lead" id="case-propeers">
            <div className="campaign-stage lead-stage">
              <span className="stage-label">PROPEERS / DEVELOPER TOOLS</span>
              <ReelPlayer campaign={lead} featured />
              <span className="stage-footnote">
                A useful next learning step.
              </span>
            </div>
            <div className="project-story">
              <p className="eyebrow">ProPeers · Commissioned partnership</p>
              <h2 id="lead-title">{lead.title}</h2>
              <p className="project-description">{lead.description}</p>
              <dl className="kit-case-meta">
                <div>
                  <dt>Format</dt>
                  <dd>Instagram Reel on @viveksreal</dd>
                </div>
                <div>
                  <dt>My role</dt>
                  <dd>Concept, script, filming, editing, publication</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>
                    <time dateTime={propeersResults.posted}>21 Feb 2026</time>
                  </dd>
                </div>
              </dl>
              <Metrics items={leadResults} />
              <p className="kit-source">
                Cumulative Reel results · 21 Feb–16 Oct 2026.
                <br />
                Source: Instagram Edits export · Rounded figures.
              </p>
              <Detail summary="See all reported interactions">
                <Metrics
                  items={leadInteractions}
                  className="kit-small-metrics"
                />
                <p>
                  Same Reel and 16 Oct 2026 cutoff. Likes, comments, shares,
                  saves, and reposts count interactions; they are not unique
                  prospects or sales.
                </p>
              </Detail>
              <Detail summary="View source details">
                <p>
                  Creator-supplied Instagram Edits export, downloaded 16 Oct
                  2026. The Reel was posted 21 Feb 2026. Values keep the
                  export’s rounded precision. Views may include repeats. Paid
                  and organic split unavailable.
                </p>
                <p>
                  The creative invites viewers to request a developer roadmap.
                  Comment counts may include resource requests and replies; no
                  tracked registration or sales result is claimed.
                </p>
              </Detail>
              <div className="kit-case-actions">
                <CampaignBriefLink
                  context="ProPeers — developer-roadmap campaign"
                  className="button button-primary"
                />
                <a
                  className="text-link"
                  href={lead.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on Instagram <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
          <BrandPartnerships />
        </section>
        <section
          id="kit-audience"
          className="kit-section kit-ruled shell"
          aria-labelledby="kit-audience-title"
        >
          <Label number="02">Audience fit</Label>
          <h2 id="kit-audience-title">
            Who your campaign
            <br />
            would reach.
          </h2>
          <p className="kit-intro">
            A dated picture of the followers behind the content — by location,
            age, and gender.
          </p>
          <AudienceInsights />
          <div className="audience-content-themes">
            <div>
              <h3>Learning technology</h3>
              <p>
                Roadmaps, developer tools, and practical product explanations.
              </p>
            </div>
            <div>
              <h3>Starting careers</h3>
              <p>Internship resources and clearer next steps.</p>
            </div>
            <div>
              <h3>Building ideas</h3>
              <p>Startup lessons, useful tools, and founder conversations.</p>
            </div>
          </div>
        </section>
        <section
          id="performance"
          className="kit-section kit-ruled shell"
          aria-labelledby="performance-title"
        >
          <Label number="03">Performance in context</Label>
          <div className="kit-heading">
            <h2 id="performance-title">
              Recent attention.
              <br />
              <span className="muted">Visible interaction.</span>
            </h2>
            <p>
              Account scale and individual creative tell different parts of the
              story. Each snapshot keeps its own dates and scope.
            </p>
          </div>
          <div className="kit-performance-grid">
            <div>
              <p className="eyebrow">Account reporting window</p>
              <p className="kit-period">17 Jul–15 Oct 2026</p>
              <p>
                Reel views and Viewers are shown in the opening snapshot. The
                export labels this a 90-day report; Viewers covers Reels +
                posts.
              </p>
              <Detail summary="Account source and definitions">
                <p>
                  Instagram Edits export supplied by Vivek, created 16 Oct 2026.
                  The follower snapshot is refreshed separately from the 17 Oct
                  2026 Follower insights export (21,512), not growth during this
                  performance window. Reel views can include repeat viewing.
                  Viewers retains the platform’s label and is not relabelled
                  accounts reached.
                </p>
              </Detail>
            </div>
            <div>
              <p className="eyebrow">Individual Reel snapshots</p>
              <p className="kit-period">Examples, with their own context.</p>
              <p>
                Explore the creator work below for views and interactions
                attached to specific Reels. These are selected examples, not a
                typical-performance sample.
              </p>
              <p className="kit-source">
                Historical snapshots do not predict the reach or response of a
                future campaign. Delivery split is unavailable; the work is not
                labelled organic.
              </p>
              <a className="text-link" href="#independent-work">
                Explore independent work <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
        <section
          id="partnerships"
          className="kit-section kit-ruled shell"
          aria-labelledby="partnerships-title"
        >
          <Label number="04">More brand work</Label>
          <div className="kit-heading">
            <h2 id="partnerships-title">
              More campaign
              <br />
              stories.
            </h2>
            <p>
              Different products. The same focus on showing where they fit in
              real life.
            </p>
          </div>
          <div className="kit-partnership-grid">
            {campaigns.slice(1).map((campaign, i) => (
              <article key={campaign.id} id={`case-${campaign.id}`}>
                <div className={`campaign-stage ${campaign.id}-stage`}>
                  <span className="stage-label">{campaign.brand}</span>
                  <ReelPlayer campaign={campaign} />
                </div>
                <p className="eyebrow kit-card-label">
                  Commissioned partnership · Instagram Reel
                </p>
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
                <Detail summary="Role and delivery">
                  <p>
                    My role:{" "}
                    {partnershipDetails[i + 1].verified_role
                      .join(", ")
                      .toLowerCase()}
                    . Published on @viveksreal. Paid and organic delivery split
                    unavailable.
                  </p>
                </Detail>
                <CampaignBriefLink
                  context={`${campaign.brand} — similar campaign`}
                >
                  Discuss a similar campaign
                </CampaignBriefLink>
              </article>
            ))}
          </div>
        </section>
        <section
          id="independent-work"
          className="kit-section kit-ruled shell"
          aria-labelledby="independent-title"
        >
          <Label number="05">Independent creator work</Label>
          <div className="kit-heading">
            <h2 id="independent-title">
              Useful ideas.
              <br />
              <span className="muted">A reason to respond.</span>
            </h2>
            <p>
              Three selected examples of my own creator work, separate from
              commissioned brand campaigns.
            </p>
          </div>
          <div className="kit-highlight-grid">
            {highlights.map((item) => (
              <article key={item.campaign.id}>
                <div className="campaign-stage kit-editorial-stage">
                  <span className="stage-label">
                    {item.campaign.index} / INDEPENDENT EDITORIAL
                  </span>
                  {item.localVideo ? (
                    <ReelPlayer campaign={item.campaign} editorial />
                  ) : (
                    <a
                      className="kit-external-poster"
                      style={{
                        aspectRatio: `${mediaPresentation[item.campaign.id].width} / ${mediaPresentation[item.campaign.id].height}`,
                      }}
                      href={item.campaign.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Watch on Instagram: ${item.campaign.title}`}
                    >
                      <Image
                        src={mediaPresentation[item.campaign.id].poster}
                        alt={item.campaign.alt}
                        fill
                        sizes="(max-width: 767px) 90vw, (max-width: 1100px) 45vw, 430px"
                      />
                      <span className="play-chip">
                        Watch on Instagram <Arrow diagonal />
                      </span>
                    </a>
                  )}
                </div>
                <h3>{item.campaign.title}</h3>
                <p>{item.campaign.description}</p>
                <p className="kit-source">Creative approach: {item.angle}</p>
                <Metrics items={item.metrics} className="kit-small-metrics" />
                {item.posted ? (
                  <p className="kit-source">
                    Posted <time dateTime={item.posted}>{item.dateLabel}</time>{" "}
                    · Cumulative through 17 Oct 2026.
                    <br />
                    Instagram Edits export · Rounded figures.
                  </p>
                ) : null}
                {item.interactions.length ? (
                  <Detail summary="More interactions and source">
                    <Metrics
                      items={item.interactions}
                      className="kit-small-metrics"
                    />
                    <p>
                      Source: creator-supplied Instagram Edits screenshot,
                      downloaded 17 Oct 2026. Same Reel and cutoff. Counts
                      reflect interactions, not distinct people or commercial
                      outcomes. Paid and organic split unavailable.
                    </p>
                  </Detail>
                ) : null}
                {item.campaign.id === "founder-circle" ? (
                  <a
                    className="text-link"
                    href="https://www.instagram.com/foundercirclepro/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore Founder Circle <Arrow diagonal />
                  </a>
                ) : (
                  <a
                    className="text-link"
                    href={item.campaign.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch on Instagram <Arrow diagonal />
                  </a>
                )}
              </article>
            ))}
          </div>
          <aside className="kit-recognition" aria-label="Editorial recognition">
            <span className="small-label">Editorial recognition</span>
            <div>
              <h3>Featured by @startup.ln.</h3>
              <p>
                A feature about turning a comment section into a space for
                founders and builders to connect.
              </p>
            </div>
            <a
              className="text-link"
              href="https://www.instagram.com/reels/Dc3SFoMzV4G/"
              target="_blank"
              rel="noreferrer"
            >
              View the feature <Arrow diagonal />
            </a>
          </aside>
        </section>
        <section
          className="kit-section kit-ruled shell"
          aria-labelledby="kit-faq-title"
        >
          <div className="kit-faq-layout">
            <h2 id="kit-faq-title">
              A little more
              <br />
              context.
            </h2>
            <div>
              {kitQuestions.map((item) => (
                <Disclosure
                  key={item.question}
                  className="faq disclosure"
                  contentClassName="faq-answer"
                  summary={
                    <>
                      <span>{item.question}</span>
                      <DisclosureIcon />
                    </>
                  }
                >
                  <p>{item.answer}</p>
                </Disclosure>
              ))}
            </div>
          </div>
        </section>
        <section
          id="campaign-brief"
          className="contact kit-contact"
          aria-labelledby="brief-title"
        >
          <div className="shell">
            <Label number="06">Send a campaign brief</Label>
            <div className="contact-layout">
              <div>
                <h2 id="brief-title">
                  <span className="closing-line">
                    <span>Tell me what</span>
                  </span>
                  <span className="closing-line">
                    <span>you’re launching.</span>
                  </span>
                </h2>
                <p className="kit-contact-intro">
                  Share the product, the audience you want to reach, and what
                  you want people to do next. I’ll review the fit and suggest a
                  scope.
                </p>
              </div>
              <div className="contact-copy">
                <CampaignBriefDraft />
                <a className="kit-email" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                <a
                  className="text-link"
                  href={contact.booking}
                  target="_blank"
                  rel="noreferrer"
                >
                  Book a 30-minute call <Arrow diagonal />
                </a>
                <a
                  className="text-link"
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp only: +91 8968526279 <Arrow diagonal />
                </a>
                <p className="kit-source kit-privacy">
                  Review and submit your brief in the guided overlay. Your
                  details are sent to Vivek through Formspree for the
                  collaboration conversation.
                </p>
              </div>
            </div>
            <Footer mediaKit />
          </div>
        </section>
      </main>
    </>
  );
}
