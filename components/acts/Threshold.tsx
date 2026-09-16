"use client";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

/**
 * Act 00. Nothing is centred. The form sits right of frame because the camera
 * is standing to its left, and every word is pushed to an edge.
 *
 * Most of this act is staged in by the loader rather than by scroll — the page
 * should be a finished composition the moment it is handed over, not an empty
 * frame waiting for a wheel event.
 */
export function Threshold() {
  return (
    <ActSection id="threshold">
      <Cell col="2 / 6" row="3 / 4" mrow="2 / 4">
        <Beat act="threshold" exit={[0.72, 0.9]} introAt={0.14}>
          <p className="mono">
            Vessel — a creative
            <br />
            &amp; production studio
          </p>
        </Beat>
      </Cell>

      <Cell col="9 / 13" row="2 / 4" mcol="1 / -1" mrow="4 / 5" ai="flex-end">
        <Beat
          act="threshold"
          exit={[0.7, 0.88]}
          introAt={0.24}
          style={{ textAlign: "right" }}
        >
          <p className="mono mono--dust">
            Ahmedabad · Lisbon
            <br />
            MMXIX —
          </p>
        </Beat>
      </Cell>

      <Cell col="2 / 8" row="8 / 12" mcol="1 / -1" mrow="6 / 10" jc="flex-end">
        <Beat act="threshold" exit={[0.66, 0.88]} introAt={0} blur={5}>
          <h1 className="display" style={{ margin: 0 }}>
            Everything we make
            <br />
            <span className="italic" style={{ color: "var(--ash)" }}>
              begins as one line,
            </span>
            <br />
            turned.
          </h1>
        </Beat>
      </Cell>

      <Cell col="5 / 8" row="12 / 13" mcol="1 / -1" mrow="10 / 11" jc="flex-end">
        <Beat act="threshold" exit={[0.6, 0.8]} introAt={0.38}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="dot" />
            <span className="mono mono--bone">Keep scrolling</span>
          </div>
        </Beat>
      </Cell>

      <Cell col="10 / 13" row="10 / 13" mcol="1 / -1" mrow="10 / 11" ai="flex-end" jc="flex-end">
        <Beat
          act="threshold"
          enter={[0.1, 0.3]}
          exit={[0.74, 0.92]}
          y={22}
          style={{ textAlign: "right" }}
        >
          <p className="body" style={{ marginLeft: "auto" }}>
            Film, motion, sound, identity and space — for people who care how a
            thing was made, not only what it looks like when it is.
          </p>
        </Beat>
      </Cell>
    </ActSection>
  );
}
