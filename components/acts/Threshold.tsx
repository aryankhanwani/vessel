"use client";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

/**
 * Act 00. Nothing is centred. The form sits right of frame because the camera
 * is standing to its left, and every word is pushed to an edge.
 */
export function Threshold() {
  return (
    <ActSection id="threshold">
      <Cell col="2 / 6" row="3 / 4" mrow="2 / 4">
        <Beat act="threshold" enter={[0.02, 0.16]} exit={[0.72, 0.9]} y={18}>
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
          enter={[0.06, 0.22]}
          exit={[0.7, 0.88]}
          y={14}
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
        <Beat act="threshold" enter={[0.1, 0.34]} exit={[0.66, 0.88]} y={40} blur={5}>
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
        <Beat act="threshold" enter={[0.16, 0.36]} exit={[0.6, 0.8]} y={16}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="dot" />
            <span className="mono mono--bone">Keep scrolling</span>
          </div>
        </Beat>
      </Cell>

      <Cell col="10 / 13" row="10 / 13" mcol="1 / -1" mrow="10 / 11" ai="flex-end" jc="flex-end">
        <Beat
          act="threshold"
          enter={[0.3, 0.5]}
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
