"use client";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

/**
 * Act 01. The form is dead centre while it is being turned, so the copy lives
 * entirely in the gutters — captions on a technical drawing.
 */
export function Turning() {
  return (
    <ActSection id="turning">
      <Cell col="1 / 5" row="1 / 4" mcol="1 / -1" mrow="2 / 4">
        <Beat
          act="turning"
          enter={[0.0, 0.12]}
          exit={[0.88, 1]}
          y={30}
          style={{ marginLeft: "-2.5vw" }}
        >
          <span className="numeral">01</span>
        </Beat>
      </Cell>

      <Cell
        col="10 / 13"
        row="3 / 5"
        mcol="1 / -1"
        mrow="2 / 4"
        ai="flex-end"
        style={{ position: "relative" }}
      >
        <Beat
          act="turning"
          enter={[0.04, 0.16]}
          exit={[0.3, 0.42]}
          y={22}
          style={{ textAlign: "right", position: "absolute", top: 0, right: 0 }}
        >
          <p className="mono mono--bone">Step one</p>
          <p className="lede" style={{ marginTop: "0.6rem" }}>
            A profile
            <br />
            is drawn.
          </p>
        </Beat>

        <Beat
          act="turning"
          enter={[0.34, 0.46]}
          exit={[0.62, 0.74]}
          y={22}
          style={{ textAlign: "right", position: "absolute", top: 0, right: 0 }}
        >
          <p className="mono mono--ember">Step two</p>
          <p className="lede" style={{ marginTop: "0.6rem" }}>
            The profile
            <br />
            is revolved.
          </p>
        </Beat>

        <Beat
          act="turning"
          enter={[0.66, 0.78]}
          y={22}
          style={{ textAlign: "right", position: "absolute", top: 0, right: 0 }}
        >
          <p className="mono mono--bone">Step three</p>
          <p className="lede" style={{ marginTop: "0.6rem" }}>
            Three hundred
            <br />
            and sixty degrees.
          </p>
        </Beat>
      </Cell>

      <Cell col="1 / 4" row="8 / 11" mcol="1 / -1" mrow="9 / 11">
        <Beat act="turning" enter={[0.18, 0.32]} exit={[0.82, 0.96]} y={26}>
          <p className="body">
            It is the oldest trick there is. You take a flat line, spin it about
            an axis, and a solid appears that was never really there.
          </p>
        </Beat>
      </Cell>

      <Cell col="9 / 13" row="10 / 13" mcol="1 / -1" mrow="11 / 13" ai="flex-end" jc="flex-end">
        <Beat
          act="turning"
          enter={[0.5, 0.64]}
          y={20}
          style={{ textAlign: "right" }}
        >
          <p className="mono mono--dust">
            Radius 0.60 · Height 2.00
            <br />
            96 segments · 128 samples
          </p>
        </Beat>
      </Cell>

      <Cell col="5 / 9" row="12 / 13" mcol="1 / -1" mrow="8 / 9" ai="center" jc="flex-end">
        <Beat act="turning" enter={[0.9, 1]} y={14} style={{ textAlign: "center" }}>
          <p className="mono mono--dust">Now — what we do with it</p>
        </Beat>
      </Cell>
    </ActSection>
  );
}
