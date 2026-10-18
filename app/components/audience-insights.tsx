import { DisclosureIcon } from "./disclosure-icon";
import { audienceInsights } from "../audience-insights";
import world from "../data/world-map.json";
import { AudienceMap } from "./audience-map";
import { Disclosure } from "./disclosure";

export function AudienceInsights() {
  const countries = new Set(
    audienceInsights.countries.map((country) => country.id),
  );
  return (
    <div className="audience-insights">
      <div className="audience-insights-heading">
        <div>
          <p className="small-label">Instagram follower insights</p>
          <h3>A community with a clear centre.</h3>
        </div>
        <p>
          <strong>{audienceInsights.followers.toLocaleString("en-IN")}</strong>{" "}
          followers in this export
          <br />
          <span>
            {audienceInsights.period.label} · Exported{" "}
            {audienceInsights.capturedLabel}
          </span>
        </p>
      </div>
      <AudienceMap>
        {world.map((country) => (
          <path
            key={country.id}
            d={country.d}
            data-country={country.id}
            className={`audience-map-country${countries.has(country.id) ? " audience-map-country-reported" : ""}`}
            fillRule="evenodd"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </AudienceMap>
      <div className="audience-demographics">
        <div className="audience-age">
          <div className="audience-demographic-title">
            <h4>Age range</h4>
            <span>Share of followers · 0–100%</span>
          </div>
          <dl>
            {audienceInsights.ages.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.percent.toFixed(1)}%</dd>
                <span className="audience-age-track" aria-hidden="true">
                  <span style={{ width: `${item.percent}%` }} />
                </span>
              </div>
            ))}
          </dl>
        </div>
        <div className="audience-gender">
          <div className="audience-demographic-title">
            <h4>Gender</h4>
            <span>As reported by Instagram</span>
          </div>
          <dl>
            {audienceInsights.gender.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.percent.toFixed(1)}%</dd>
              </div>
            ))}
          </dl>
          <p>
            Followers are the base for every percentage here. This profile is
            historical context, not a guarantee of who a future campaign will
            reach.
          </p>
          <Disclosure
            className="audience-source-details disclosure"
            contentClassName="audience-source-body"
            summary={
              <>
                <span>Source & map details</span>
                <DisclosureIcon />
              </>
            }
          >
            <p>
              Source: creator-supplied Instagram Edits Follower insights export.
              Reporting window: {audienceInsights.period.label} (labelled 90
              days). Exported {audienceInsights.capturedLabel}. Original age
              buckets and rounded percentages are preserved.
            </p>
            <p>
              Country and city lists are partial top-five rankings. Locations
              are approximate geographic centres, not individual follower
              positions. This interactive map uses a dated export and does not
              receive live updates.
            </p>
            <p>
              Geographic outlines:{" "}
              <a
                href="https://www.naturalearthdata.com/about/"
                target="_blank"
                rel="noreferrer"
              >
                Natural Earth (public domain) ↗
              </a>
              . Geography provides context; only the export supplies audience
              values.
            </p>
          </Disclosure>
        </div>
      </div>
      <noscript>
        <style>{`.audience-map-controls, .audience-map-modes, .audience-map-locations, .audience-map-help { display: none; }`}</style>
        <div className="audience-map-fallback">
          <h4>Reported top countries</h4>
          <p>
            {audienceInsights.countries
              .map(
                (country) => `${country.name} ${country.percent.toFixed(1)}%`,
              )
              .join(" · ")}
            . Share of all followers.
          </p>
          <h4>Reported top cities</h4>
          <p>
            {audienceInsights.cities
              .map((city) => `${city.name} ${city.percent.toFixed(1)}%`)
              .join(" · ")}
            . Share of all followers.
          </p>
        </div>
      </noscript>
    </div>
  );
}
