import React, { useEffect, useMemo, useState } from "react";
import * as TIMELINE from "./timelineData";
import "./careerTimeline.css";

export default function CareerTimeline() {
  const { chronological, lanes, NOW, abroadPeriods } = TIMELINE;

  const laneRanges = useMemo(() => {
    const ranges = {};

    for (const lane of Object.keys(lanes)) {
      const events = chronological.filter((event) => event.lane === lane);
      if (events.length === 0) {
        ranges[lane] = null;
        continue;
      }

      const idxs = chronological
        .map((event, index) => (event.lane === lane ? index : -1))
        .filter((index) => index >= 0);

      ranges[lane] = {
        first: idxs[0],
        last: idxs[idxs.length - 1],
        ongoing: events.some((event) => event.ongoing),
        idxs,
      };
    }

    return ranges;
  }, [chronological, lanes]);

  const activeNow = useMemo(() => {
    const nowMonths = NOW.y * 12 + NOW.m;

    return chronological.filter((event) => {
      const startM = event.start.y * 12 + event.start.m;
      const endM = event.ongoing ? Infinity : event.end.y * 12 + event.end.m;
      return startM <= nowMonths && endM > nowMonths;
    });
  }, [chronological, NOW]);

  const abroadById = useMemo(() => {
    const periods = {};
    abroadPeriods.forEach((period) => {
      period.stopIds.forEach((id) => {
        periods[id] = period;
      });
    });
    return periods;
  }, [abroadPeriods]);

  const [opened, setOpened] = useState(null);
  const openedEvent = chronological.find((event) => event.id === opened);

  return (
    <section id="career" className="ct-root" data-screen-label="Career timeline">
      <Header activeNow={activeNow} onOpen={setOpened} />

      <ol className="ct-list">
        {chronological.map((event, idx) => {
          const prev = idx > 0 ? chronological[idx - 1] : null;
          const isYearBreak = !prev || prev.start.y !== event.start.y;

          return (
            <React.Fragment key={event.id}>
              {isYearBreak && <YearMarker year={event.start.y} isFirst={!prev} />}
              <EventRow
                event={event}
                idx={idx}
                laneRanges={laneRanges}
                lanesByName={lanes}
                abroad={abroadById[event.id]}
                onOpen={() => setOpened(event.id)}
              />
            </React.Fragment>
          );
        })}
        <NowMarker laneRanges={laneRanges} />
      </ol>

      {openedEvent && <DetailModal event={openedEvent} onClose={() => setOpened(null)} />}
    </section>
  );
}

function Header({ activeNow, onOpen }) {
  return (
    <header className="ct-header">
      <div className="ct-header-text">
        <h2 className="ct-h2">Experience &amp; Education</h2>
        <p className="ct-lede">
          Three threads I&apos;ve been weaving since 2021: studies, work,
          and the communities I&apos;ve been part of.
        </p>
      </div>

      <div className="ct-now">
        <div className="ct-now-label">
          <span className="ct-now-dot" />
          {`Right now - ${activeNow.length} role${activeNow.length === 1 ? "" : "s"} in parallel`}
        </div>
        <div className="ct-now-grid">
          {activeNow.map((event) => (
            <button
              key={event.id}
              className={`ct-now-card ct-lane-${event.lane}`}
              onClick={() => onOpen(event.id)}
            >
              <div className="ct-now-card-logo">
                {event.logo ? <img src={event.logo} alt={event.institution} /> : <span>{event.initials}</span>}
              </div>
              <div className="ct-now-card-text">
                <div className="ct-now-card-name">{event.shortName}</div>
                <div className="ct-now-card-role">{event.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function YearMarker({ year, isFirst }) {
  return (
    <li className={`ct-year ${isFirst ? "is-first" : ""}`} aria-hidden="true">
      <div className="ct-year-gutter">
        <span className="ct-year-num mono">{year}</span>
      </div>
      <div className="ct-year-rule" />
    </li>
  );
}

function EventRow({ event, idx, laneRanges, lanesByName, abroad, onOpen }) {
  const laneOrder = ["education", "career", "community"];

  return (
    <li
      className={`ct-row ct-lane-${event.lane} ${abroad ? "is-abroad" : ""}`}
      data-year={event.start.y}
      data-year-parity={event.start.y % 2}
      onClick={onOpen}
    >
      <div className="ct-gutter">
        {laneOrder.map((laneId) => {
          const range = laneRanges[laneId];
          if (!range) return <span key={laneId} className="ct-spine ct-spine-empty" />;

          const isBefore = idx < range.first;
          const isAfter = range.ongoing ? false : idx > range.last;
          const isFirst = idx === range.first;
          const isLast = !range.ongoing && idx === range.last;
          const hasStop = laneId === event.lane;

          return (
            <span
              key={laneId}
              className={`ct-spine ct-spine-${laneId}
                ${isBefore ? "is-before" : ""}
                ${isAfter ? "is-after" : ""}
                ${isFirst ? "is-first" : ""}
                ${isLast ? "is-last" : ""}`}
            >
              {hasStop && <span className="ct-stop" />}
              <span className="ct-spine-line" aria-hidden="true" />
            </span>
          );
        })}
      </div>

      <article className="ct-card">
        {abroad && (
          <div className="ct-abroad-tag mono" aria-hidden="true">
            <span className="ct-abroad-code">{abroad.country.toUpperCase()}</span>
            {abroad.countryName.toUpperCase()}
          </div>
        )}

        <div className="ct-card-grid">
          <div className="ct-card-logo">
            {event.logo ? <img src={event.logo} alt={event.institution} /> : <span>{event.initials}</span>}
          </div>
          <div className="ct-card-body">
            <div className="ct-card-meta">
              <span className={`ct-card-pill ct-lane-${event.lane}`}>{lanesByName[event.lane].label}</span>
              <span className="ct-card-date mono">{TIMELINE.periodLabel(event)}</span>
              <span className="ct-card-dur mono">{TIMELINE.durationLabel(event)}</span>
            </div>
            <h3 className="ct-card-title">{event.institution}</h3>
            <div className="ct-card-role">{event.role}</div>
            <div className="ct-card-loc mono">
              {event.location} - {event.countryName}
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

function NowMarker({ laneRanges }) {
  const laneOrder = ["education", "career", "community"];

  return (
    <li className="ct-now-mark" aria-hidden="true">
      <div className="ct-gutter">
        {laneOrder.map((laneId) => {
          const range = laneRanges[laneId];
          if (!range) return <span key={laneId} className="ct-spine ct-spine-empty" />;

          return (
            <span
              key={laneId}
              className={`ct-spine ct-spine-${laneId} ct-spine-now ${range.ongoing ? "is-ongoing" : "is-after"}`}
            >
              {range.ongoing && <span className="ct-stop ct-stop-now" />}
              <span className="ct-spine-line" aria-hidden="true" />
            </span>
          );
        })}
      </div>
      <div className="ct-now-mark-label">
        <span className="ct-now-mark-pulse" />
        <span className="mono">TODAY - {TIMELINE.fmt(TIMELINE.NOW.y, TIMELINE.NOW.m)}</span>
      </div>
    </li>
  );
}

function DetailModal({ event, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const laneLabel = TIMELINE.lanes[event.lane].label;

  return (
    <div className="ct-modal-backdrop" onClick={onClose}>
      <div className={`ct-modal ct-lane-${event.lane}`} onClick={(e) => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose} aria-label="Close">x</button>
        <header className="ct-modal-head">
          <div className="ct-modal-logo">
            {event.logo ? <img src={event.logo} alt={event.institution} /> : <span>{event.initials}</span>}
          </div>
          <div className="ct-modal-head-text">
            <div className={`ct-card-pill ct-lane-${event.lane}`}>{laneLabel}</div>
            <h2>{event.institution}</h2>
            <div className="ct-modal-role">{event.role}</div>
            <div className="ct-modal-meta mono">
              {TIMELINE.periodLabel(event)} - {TIMELINE.durationLabel(event)} - {event.location}, {event.countryName}
            </div>
          </div>
        </header>
        <ul className="ct-modal-body">
          {event.description.map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </div>
    </div>
  );
}
