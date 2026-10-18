import Image from "next/image";
import type { CSSProperties } from "react";
import { brandLogos } from "../media-kit/brand-logos";
import type { BrandLogo } from "../media-kit/brand-logos";
import { Arrow } from "./arrow";
import { Reveal } from "./reveal";

function LogoArtwork({ brand }: { brand: BrandLogo }) {
  const { bounds, canvas } = brand;
  return (
    <span
      className="kit-logo-artwork"
      style={
        {
          "--logo-width": `${brand.displayWidth}px`,
          "--logo-mobile-width": `${brand.mobileWidth}px`,
          aspectRatio: `${bounds.width} / ${bounds.height}`,
        } as CSSProperties
      }
    >
      <Image
        src={brand.src}
        alt={`${brand.name} charcoal logo`}
        width={canvas.width}
        height={canvas.height}
        sizes="(max-width: 767px) 240px, 320px"
        style={{
          width: `${(canvas.width / bounds.width) * 100}%`,
          height: `${(canvas.height / bounds.height) * 100}%`,
          left: `${(-bounds.x / bounds.width) * 100}%`,
          top: `${(-bounds.y / bounds.height) * 100}%`,
        }}
      />
    </span>
  );
}

export function BrandPartnerships() {
  const completed = brandLogos.filter(
    (brand) => brand.status === "completed" && brand.name,
  );
  const upcoming = brandLogos.filter(
    (brand) => brand.status === "upcoming" && brand.name,
  );
  const enquiries = brandLogos.filter(
    (brand) => brand.status === "enquiry-only" && brand.name,
  );
  return (
    <section
      className="kit-brand-partnerships"
      id="selected-brand-partnerships"
      aria-labelledby="brand-logos-title"
    >
      <Reveal>
        <div className="kit-logo-heading">
          <h2 id="brand-logos-title">Selected brand partnerships</h2>
          <p>Completed collaborations.</p>
        </div>
      </Reveal>
      <ul className="kit-logo-grid" aria-label="Completed brand partnerships">
        {completed.map((brand) => (
          <li key={brand.id}>
            {brand.caseHref ? (
              <a
                className="kit-logo-area"
                href={brand.caseHref}
                aria-label={`Explore the ${brand.name} campaign case study`}
              >
                <LogoArtwork brand={brand} />
              </a>
            ) : (
              <div className="kit-logo-area">
                <LogoArtwork brand={brand} />
              </div>
            )}
          </li>
        ))}
      </ul>
      {upcoming.length ? (
        <aside
          className="kit-brand-enquiries"
          aria-labelledby="brand-upcoming-title"
        >
          <div className="kit-logo-heading">
            <h3 id="brand-upcoming-title">Coming this month</h3>
            <p>Upcoming collaborations · October 2026.</p>
          </div>
          <ul
            className="kit-logo-grid"
            aria-label="Upcoming brand collaborations"
          >
            {upcoming.map((brand) => (
              <li key={brand.id}>
                <div className="kit-logo-area">
                  <LogoArtwork brand={brand} />
                </div>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
      {enquiries.length ? (
        <aside
          className="kit-brand-enquiries"
          aria-labelledby="brand-enquiries-title"
        >
          <div className="kit-logo-heading">
            <h3 id="brand-enquiries-title">Brands that reached out</h3>
            <p>Enquiries only.</p>
          </div>
          <ul className="kit-logo-grid" aria-label="Inbound brand enquiries">
            {enquiries.map((brand) => (
              <li key={brand.id}>
                <div className="kit-logo-area">
                  <LogoArtwork brand={brand} />
                </div>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
      <div className="kit-logo-footer">
        <a
          className="text-link"
          href="#campaign-brief"
          aria-haspopup="dialog"
          aria-controls="campaign-brief-dialog"
        >
          Send a campaign brief <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
