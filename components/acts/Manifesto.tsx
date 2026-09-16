"use client";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

/**
 * Act 05. The fragments arrive one at a time and then stay, so the paragraph
 * assembles itself across the whole frame. You read it by looking around.
 */
const LINES: {
  t: string;
  col: string;
  row: string;
  at: number;
  cls: string;
  align?: "left" | "right";
}[] = [
  { t: "We are not fast.", col: "2 / 6", row: "2 / 4", at: 0.0, cls: "lede" },
  {
    t: "We are not loud.",
    col: "8 / 12",
    row: "3 / 5",
    at: 0.1,
    cls: "lede italic",
    align: "right",
  },
  {
    t: "We make one thing at a time,",
    col: "1 / 7",
    row: "5 / 8",
    at: 0.22,
    cls: "title",
  },
  {
    t: "and we keep making it until it stops arguing with us.",
    col: "7 / 12",
    row: "9 / 11",
    at: 0.36,
    cls: "body body--wide",
    align: "right" as const,
  },
  {
    t: "A vessel is only useful",
    col: "1 / 6",
    row: "9 / 11",
    at: 0.52,
    cls: "lede",
  },
  {
    t: "because of the space inside it.",
    col: "6 / 12",
    row: "11 / 13",
    at: 0.64,
    cls: "lede italic",
    align: "right",
  },
  {
    t: "So we leave room.",
    col: "8 / 12",
    row: "6 / 8",
    at: 0.78,
    cls: "title",
    align: "right",
  },
];

export function Manifesto() {
  return (
    <ActSection id="manifesto">
      <Cell col="1 / 3" row="4 / 5" mcol="1 / -1" mrow="3 / 4">
        <Beat act="manifesto" enter={[0, 0.05]} y={10}>
          <p className="mono mono--dust">On method</p>
        </Beat>
      </Cell>

      {LINES.map((l) => (
        <Cell
          key={l.t}
          col={l.col}
          row={l.row}
          mcol="1 / -1"
          mrow={l.row}
          ai={l.align === "right" ? "flex-end" : "flex-start"}
          jc="center"
        >
          <Beat
            act="manifesto"
            enter={[l.at, l.at + 0.09]}
            exit={[0.93, 1]}
            y={34}
            x={l.align === "right" ? 24 : -24}
            blur={4}
            style={{ textAlign: l.align ?? "left" }}
          >
            <p className={l.cls} style={{ margin: 0 }}>
              {l.t}
            </p>
          </Beat>
        </Cell>
      ))}
    </ActSection>
  );
}
