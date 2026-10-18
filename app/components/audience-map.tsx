"use client";

import { useId, useRef, useState } from "react";
import { audienceInsights, projectLocation } from "../audience-insights";

type Mode = "countries" | "cities";
type View = { x: number; y: number; scale: number };
const worldView: View = { x: 0, y: 0, scale: 1 };
function constrain(view: View): View {
  const scale = Math.min(10, Math.max(1, view.scale));
  return {
    scale,
    x: Math.min(0, Math.max(1000 - 1000 * scale, view.x)),
    y: Math.min(0, Math.max(430 - 430 * scale, view.y)),
  };
}
function centred(longitude: number, latitude: number, scale: number): View {
  const point = projectLocation(longitude, latitude);
  return constrain({
    x: 500 - point.x * scale,
    y: 215 - point.y * scale,
    scale,
  });
}
const cityView = centred(78, 21, 6.5);

export function AudienceMap({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("countries");
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState<View>(worldView);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{
    pointer: number;
    startX: number;
    startY: number;
    view: View;
  } | null>(null);
  const id = useId();
  const locations = audienceInsights[mode];
  const location = locations[selected];
  const point = projectLocation(location.longitude, location.latitude);
  function changeMode(next: Mode) {
    setMode(next);
    setSelected(0);
    setView(next === "cities" ? cityView : worldView);
  }
  function zoom(factor: number) {
    setView((current) => {
      const scale = Math.min(10, Math.max(1, current.scale * factor));
      const ratio = scale / current.scale;
      return constrain({
        scale,
        x: 500 - (500 - current.x) * ratio,
        y: 215 - (215 - current.y) * ratio,
      });
    });
  }
  function reset() {
    setView(mode === "cities" ? cityView : worldView);
  }
  function endDrag() {
    drag.current = null;
    setDragging(false);
  }
  return (
    <div className="audience-map-module">
      <div className="audience-map-toolbar">
        <div
          className="audience-map-modes"
          role="group"
          aria-label="Audience location view"
        >
          <button
            type="button"
            aria-pressed={mode === "countries"}
            onClick={() => changeMode("countries")}
          >
            Countries
          </button>
          <button
            type="button"
            aria-pressed={mode === "cities"}
            onClick={() => changeMode("cities")}
          >
            Cities
          </button>
        </div>
        <p>Share of all followers</p>
      </div>
      <div className="audience-map-layout">
        <div className="audience-map-figure">
          <div
            className="audience-map-surface"
            role="group"
            aria-label="Audience geography map"
            aria-describedby={`${id}-help`}
            tabIndex={0}
            data-dragging={dragging || undefined}
            onKeyDown={(event) => {
              if (
                event.target !== event.currentTarget ||
                event.ctrlKey ||
                event.metaKey ||
                event.altKey
              )
                return;
              if (
                ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                  event.key,
                )
              ) {
                event.preventDefault();
                const key = event.key;
                setView((current) =>
                  constrain({
                    ...current,
                    x:
                      current.x +
                      (key === "ArrowLeft"
                        ? 40
                        : key === "ArrowRight"
                          ? -40
                          : 0),
                    y:
                      current.y +
                      (key === "ArrowUp" ? 40 : key === "ArrowDown" ? -40 : 0),
                  }),
                );
              } else if (event.key === "+" || event.key === "=") {
                event.preventDefault();
                zoom(1.35);
              } else if (event.key === "-") {
                event.preventDefault();
                zoom(1 / 1.35);
              } else if (event.key === "0") {
                event.preventDefault();
                reset();
              }
            }}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              drag.current = {
                pointer: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                view,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
            }}
            onPointerMove={(event) => {
              const current = drag.current;
              if (!current || current.pointer !== event.pointerId) return;
              const deltaX = event.clientX - current.startX,
                deltaY = event.clientY - current.startY;
              // Native vertical page scrolling remains available on touch screens.
              if (
                event.pointerType === "touch" &&
                Math.abs(deltaY) > Math.abs(deltaX)
              )
                return;
              const ratio =
                1000 / event.currentTarget.getBoundingClientRect().width;
              setView(
                constrain({
                  ...current.view,
                  x: current.view.x + deltaX * ratio,
                  y: current.view.y + deltaY * ratio,
                }),
              );
            }}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
          >
            <svg
              className="audience-map-svg"
              viewBox="0 0 1000 430"
              aria-hidden="true"
              focusable="false"
            >
              <g
                className="audience-map-geography"
                data-selected={mode === "countries" ? location.id : "IND"}
                data-mode={mode}
                style={{
                  transform: `translate(${view.x}px,${view.y}px) scale(${view.scale})`,
                }}
              >
                {children}
                {mode === "cities"
                  ? audienceInsights.cities.map((city) => {
                      const p = projectLocation(city.longitude, city.latitude);
                      return (
                        <circle
                          key={city.id}
                          cx={p.x}
                          cy={p.y}
                          r={3.5 / view.scale}
                          className="audience-map-city"
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })
                  : null}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={11 / view.scale}
                  className="audience-map-pin-halo"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={5 / view.scale}
                  className="audience-map-pin"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
          <div
            className="audience-map-controls"
            role="group"
            aria-label="Map zoom controls"
          >
            <button
              type="button"
              onClick={() => zoom(1.35)}
              aria-label="Zoom in"
              disabled={view.scale >= 10}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => zoom(1 / 1.35)}
              aria-label="Zoom out"
              disabled={view.scale <= 1}
            >
              −
            </button>
            <button type="button" onClick={reset}>
              Reset view
            </button>
          </div>
          <div
            className="audience-map-selection"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="audience-map-selection-dot" />
            <span>{location.name}</span>
            <strong>{location.percent.toFixed(1)}%</strong>
            <span>of followers</span>
          </div>
          <p id={`${id}-help`} className="audience-map-help">
            Drag to pan. Use + / − to zoom.{" "}
            <span className="sr-only">
              With the map focused, arrow keys pan, plus and minus zoom, and
              zero resets. Location buttons provide all map values.
            </span>
          </p>
        </div>
        <div className="audience-map-locations">
          <p className="small-label">
            {mode === "countries" ? "Top countries" : "Top cities · India"}
          </p>
          <ol>
            {locations.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={selected === index}
                  onClick={() => {
                    setSelected(index);
                    setView(
                      centred(
                        item.longitude,
                        item.latitude,
                        mode === "cities" ? 8 : item.id === "USA" ? 2 : 4,
                      ),
                    );
                  }}
                >
                  <span className="audience-location-rank">0{index + 1}</span>
                  <span>{item.name}</span>
                  <strong>{item.percent.toFixed(1)}%</strong>
                  <span className="audience-location-track" aria-hidden="true">
                    <span style={{ width: `${item.percent}%` }} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="audience-map-note">
            {mode === "countries"
              ? "Reported top five only. Unlisted countries stay neutral; they are not zero."
              : "City percentages are shares of all followers. Markers show city centres."}
          </p>
        </div>
      </div>
    </div>
  );
}
