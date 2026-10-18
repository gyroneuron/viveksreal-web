import {
  CampaignBriefDraft,
  CampaignBriefLink,
} from "./components/campaign-brief";
import { DisclosureIcon } from "./components/disclosure-icon";
import Image from "next/image";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { AudienceInsights } from "./components/audience-insights";
import { ReelPlayer } from "./components/reel-player";
import { Reveal } from "./components/reveal";
import { Arrow } from "./components/arrow";
import { Journey } from "./components/journey";
import { RecentProof } from "./components/recent-proof";
import { ReelPlaybackProvider } from "./components/reel-playback";
import { HeroTitle } from "./components/hero-title";
import { Disclosure } from "./components/disclosure";
import {
  campaigns,
  contact,
  questions,
  propeersResults,
  recentProof,
} from "./content";

function SectionLabel({
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

export default function Home() {
  const lead = campaigns[0];
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <section className="hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="small-label hero-identity">
              Vivek Jaglan / @viveksreal
            </p>
            <p className="eyebrow hero-role">
              <span className="status-dot" /> Creator + software engineer
            </p>
            <HeroTitle />
            <p className="hero-description">
              I create practical tech, career, and startup content for young
              builders in India. For brands, I bring a software engineer’s
              understanding to product demos, educational Reels, and stories
              that show where a product fits in real life.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href="#contact"
                aria-haspopup="dialog"
                aria-controls="campaign-brief-dialog"
              >
                Work with me <Arrow />
              </a>
              <a className="text-link" href="#work">
                See brand work <Arrow diagonal />
              </a>
            </div>
            <p className="hero-location">
              <span>
                {recentProof.metrics[0].value} Instagram followers · Based in
                India
              </span>
              <span>
                Edits export ·{" "}
                <time dateTime={recentProof.followerSnapshot.date}>
                  {recentProof.followerSnapshot.label}
                </time>
              </span>
            </p>
          </div>
          <figure className="hero-figure">
            <div className="hero-image-wrap">
              <Image
                src="/media/propeers.jpg"
                alt="Vivek in a frame from his ProPeers developer-roadmap collaboration"
                fill
                preload
                sizes="(max-width: 767px) 100vw, 42vw"
                className="hero-image"
              />
              <span className="image-index" aria-hidden="true">
                VJ—01
              </span>
            </div>
            <figcaption>
              <span>A frame from the ProPeers collaboration.</span>
              <span className="figure-mark" aria-hidden="true">
                ↗
              </span>
            </figcaption>
          </figure>
        </section>

        <RecentProof />

        <ReelPlaybackProvider>
          <section
            id="work"
            className="section shell"
            aria-labelledby="work-title"
          >
            <Reveal>
              <div className="territory-strip" aria-label="Content territories">
                <p className="small-label">
                  Content
                  <br />
                  territories
                </p>
                <p>
                  <span>01</span> Tech &amp; tools
                </p>
                <p>
                  <span>02</span> Careers &amp; learning
                </p>
                <p>
                  <span>03</span> Startups &amp; builders
                </p>
              </div>

              <SectionLabel number="01">Selected collaborations</SectionLabel>
              <div className="section-heading">
                <h2 id="work-title">
                  Good products.
                  <br />
                  <span className="muted">Human stories.</span>
                </h2>
                <p>
                  A useful idea is the starting point.
                  <br />
                  Here’s what that looks like in practice.
                </p>
              </div>
            </Reveal>
            <Reveal className="lead-project">
              <div className="campaign-stage lead-stage">
                <span className="stage-label">01 / PROPEERS</span>
                <ReelPlayer campaign={lead} featured />
                <span className="stage-footnote">A clearer next step.</span>
                <span className="stage-corner" aria-hidden="true">
                  ↗
                </span>
              </div>
              <div className="project-story">
                <p className="eyebrow">{lead.category}</p>
                <h3>{lead.title}</h3>
                <p className="project-description">{lead.description}</p>
                <dl className="project-details">
                  <div>
                    <dt>The idea</dt>
                    <dd>
                      Turn “what should I learn next?” into a practical starting
                      point.
                    </dd>
                  </div>
                  <div>
                    <dt>The format</dt>
                    <dd>
                      A creator-led Instagram Reel with a developer-roadmap
                      resource.
                    </dd>
                  </div>
                </dl>
                <div
                  className="campaign-results"
                  aria-label="ProPeers reported Reel results"
                >
                  <dl className="campaign-result-metrics">
                    {propeersResults.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p>
                    Reel results ·{" "}
                    <time dateTime={propeersResults.posted}>21 Feb</time>–
                    <time dateTime={propeersResults.cutoff}>16 Oct 2026</time>
                    <br />
                    Source: {propeersResults.source} · Rounded figures
                  </p>
                </div>
                <a
                  className="text-link"
                  href={lead.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch on Instagram <Arrow diagonal />
                </a>
                <CampaignBriefLink
                  className="subtle-link"
                  targetId="contact"
                  context="A developer-tool campaign like ProPeers"
                >
                  Discuss a similar campaign
                </CampaignBriefLink>
              </div>
            </Reveal>
            <div className="supporting-projects">
              {campaigns.slice(1).map((campaign) => (
                <Reveal className="supporting-project" key={campaign.id}>
                  <div className={`campaign-stage ${campaign.id}-stage`}>
                    <span className="stage-label">
                      {campaign.index} / {campaign.brand.toUpperCase()}
                    </span>
                    <ReelPlayer campaign={campaign} />
                    <span className="stage-corner" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <div className="supporting-caption">
                    <div>
                      <p className="eyebrow">
                        {campaign.brand} / {campaign.category}
                      </p>
                      <h3>{campaign.title}</h3>
                      <p>{campaign.description}</p>
                    </div>
                    <a
                      className="circle-link"
                      href={campaign.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Watch the ${campaign.brand} collaboration on Instagram`}
                    >
                      <Arrow diagonal />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="work-footer">
              <p>More of the everyday thinking, building, and creating.</p>
              <a
                className="text-link"
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Find me on Instagram <Arrow diagonal />
              </a>
            </div>
          </section>
        </ReelPlaybackProvider>

        <section
          id="audience"
          className="audience section"
          aria-labelledby="audience-title"
        >
          <div className="shell">
            <SectionLabel number="02">Who I create for</SectionLabel>
            <h2 id="audience-title">
              For people figuring out{" "}
              <span className="accent">what to build next.</span>
            </h2>
            <p className="audience-section-intro">
              Practical technology, careers, and building — with a follower
              community centred in India.
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
          </div>
        </section>

        <section
          id="about"
          className="about section shell"
          aria-labelledby="about-title"
        >
          <Reveal className="about-aside">
            <SectionLabel number="03">The person behind the work</SectionLabel>
            <div className="about-typesetting" aria-hidden="true">
              <span>creator.</span>
              <span>engineer.</span>
              <span className="accent">
                always
                <br />a builder<span className="about-period">.</span>
              </span>
            </div>
            <span className="small-label">Vivek Jaglan / @viveksreal</span>
          </Reveal>
          <Reveal className="about-copy">
            <h2 id="about-title">
              I build things.
              <br />
              Then I make them easier to understand.
            </h2>
            <p>
              I’m Vivek, the creator behind @viveksreal and a software engineer.
              I make content about learning technology, building products, and
              finding your next opportunity, informed by the work I do myself.
            </p>
            <p>
              That perspective shapes how I approach a collaboration: understand
              the product, find a useful real-world example, and explain it
              clearly. I’m especially interested in brands helping young people
              learn, create, and work better. Whether I’m exploring a developer
              tool or sharing a career resource, the starting point is the same:
              make it useful.
            </p>
            <a
              className="text-link"
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              Explore my engineering background <Arrow diagonal />
            </a>
          </Reveal>
          <Journey />
        </section>

        <section
          className="process section shell"
          aria-labelledby="process-title"
        >
          <SectionLabel number="04">
            From a brief to a useful story
          </SectionLabel>
          <h2 id="process-title">
            Good work starts
            <br />
            with a conversation.
          </h2>
          <div className="process-steps">
            {[
              {
                title: "Share the brief",
                text: "Tell me about the product, your audience, the campaign goal, and timing.",
              },
              {
                title: "Agree on the concept",
                text: "We define the content, schedule, usage, and review process together.",
              },
              {
                title: "Create and review",
                text: "Create the agreed work and review performance where publishing is included.",
              },
            ].map((step, index) => (
              <Reveal className="process-step" key={step.title}>
                <div className="step-top">
                  <span className="small-label">0{index + 1}</span>
                  <Arrow />
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="faq-layout">
            <h3>A few useful answers.</h3>
            <div className="faq-list">
              {questions.map((item) => (
                <Disclosure
                  className="faq disclosure"
                  key={item.question}
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
          id="contact"
          className="contact"
          aria-labelledby="contact-title"
        >
          <div className="shell">
            <SectionLabel number="05">Let’s make something useful</SectionLabel>
            <Reveal className="contact-layout">
              <h2 id="contact-title">
                Have a product
                <br />
                my audience
                <br />
                should <span>know about?</span>
              </h2>
              <div className="contact-copy">
                <p>
                  Tell me what you’re launching, who it’s for, and what you want
                  the content to help people do.
                </p>
                <CampaignBriefDraft targetId="contact" />
                <a className="contact-email" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                <div className="contact-options">
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
                </div>
              </div>
            </Reveal>
            <Footer />
          </div>
        </section>
      </main>
    </>
  );
}
