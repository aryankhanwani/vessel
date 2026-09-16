"use client";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

/** single words, dropped across the frame as the archive travels past */
const WORDS: { w: string; col: string; row: string; at: number; serif?: boolean }[] = [
  { w: "patience", col: "2 / 6", row: "3 / 5", at: 0.02, serif: true },
  { w: "material", col: "8 / 12", row: "6 / 8", at: 0.14 },
  { w: "restraint", col: "4 / 8", row: "10 / 12", at: 0.26, serif: true },
  { w: "light", col: "9 / 13", row: "2 / 4", at: 0.38 },
  { w: "repetition", col: "1 / 5", row: "7 / 9", at: 0.5, serif: true },
  { w: "the turn", col: "6 / 11", row: "4 / 6", at: 0.62 },
];

/**
 * Act 04. The studio archive is pulled through the lens. Words arrive like
 * things half-remembered — never twice in the same place.
 */
export function CorridorAct() {
  return (
    <ActSection id="corridor">
      <Cell col="1 / 4" row="5 / 6" mcol="1 / -1" mrow="3 / 4">
        <Beat act="corridor" enter={[0, 0.05]} exit={[0.88, 1]} y={10}>
          <p className="mono mono--dust">The archive, 2019 —</p>
        </Beat>
      </Cell>

      {WORDS.map((item) => (
        <Cell
          key={item.w}
          col={item.col}
          row={item.row}
          mcol="2 / -2"
          mrow={item.row}
          jc="center"
        >
          <Beat
            act="corridor"
            enter={[item.at, item.at + 0.06]}
            exit={[item.at + 0.14, item.at + 0.2]}
            y={30}
            yOut={-34}
            blur={6}
          >
            <span
              className={item.serif ? "lede italic" : "lede"}
              style={{ color: item.serif ? "var(--bone)" : "var(--ash)" }}
            >
              {item.w}
            </span>
          </Beat>
        </Cell>
      ))}

      <Cell col="7 / 12" row="9 / 12" mcol="1 / -1" mrow="9 / 12" jc="flex-end" ai="flex-end">
        <Beat
          act="corridor"
          enter={[0.76, 0.88]}
          y={28}
          style={{ textAlign: "right" }}
        >
          <p className="body" style={{ marginLeft: "auto" }}>
            Forty-one pieces of work. Each one is the same line, drawn again with
            a slightly steadier hand.
          </p>
        </Beat>
      </Cell>
    </ActSection>
  );
}
