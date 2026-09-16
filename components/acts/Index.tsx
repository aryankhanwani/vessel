"use client";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

interface Craft {
  n: string;
  name: string;
  note: string;
  col: string;
  row: string;
  mrow: string;
  align: "left" | "right";
}

/**
 * Act 02. Six things we do — each one lands somewhere different on the grid, so
 * the eye has to travel. Nothing repeats position, nothing lines up.
 */
const CRAFT: Craft[] = [
  {
    n: "i",
    name: "Direction",
    note: "We find the idea and then hold it still long enough to be sure of it.",
    col: "2 / 6",
    row: "3 / 6",
    mrow: "3 / 6",
    align: "left",
  },
  {
    n: "ii",
    name: "Film",
    note: "Origination through post. Crews we have worked with for years.",
    col: "8 / 13",
    row: "2 / 5",
    mrow: "3 / 6",
    align: "right",
  },
  {
    n: "iii",
    name: "Motion",
    note: "Design that moves because it has a reason to, never because it can.",
    col: "3 / 7",
    row: "8 / 11",
    mrow: "3 / 6",
    align: "left",
  },
  {
    n: "iv",
    name: "Sound",
    note: "Composition, design, mix. We think about it first, not last.",
    col: "7 / 12",
    row: "6 / 9",
    mrow: "3 / 6",
    align: "right",
  },
  {
    n: "v",
    name: "Identity",
    note: "Marks, systems, and the discipline to keep them intact for a decade.",
    col: "1 / 5",
    row: "6 / 9",
    mrow: "3 / 6",
    align: "left",
  },
  {
    n: "vi",
    name: "Space",
    note: "Installation, stage and the walk-up. Objects you can stand beside.",
    col: "6 / 11",
    row: "9 / 12",
    mrow: "3 / 6",
    align: "right",
  },
];

export function Index() {
  const span = 1 / CRAFT.length;

  return (
    <ActSection id="index">
      <Cell col="1 / 3" row="5 / 6" mcol="1 / -1" mrow="3 / 4">
        <Beat act="index" enter={[0, 0.06]} exit={[0.94, 1]} y={12}>
          <p className="mono mono--dust">
            Index of
            <br />
            capabilities
          </p>
        </Beat>
      </Cell>

      {CRAFT.map((c, i) => {
        const a = i * span;
        return (
          <Cell
            key={c.name}
            col={c.col}
            row={c.row}
            mcol="1 / -1"
            mrow={c.mrow}
            ai={c.align === "right" ? "flex-end" : "flex-start"}
            jc="center"
          >
            <Beat
              act="index"
              enter={[a + span * 0.04, a + span * 0.3]}
              exit={[a + span * 0.72, a + span * 0.98]}
              y={38}
              x={c.align === "right" ? 34 : -34}
              blur={4}
              style={{ textAlign: c.align }}
            >
              <p className="mono mono--ember">{c.n}</p>
              <h2
                className="title"
                style={{ margin: "0.35rem 0 0.9rem", fontWeight: 400 }}
              >
                {c.name}
              </h2>
              <p
                className="body"
                style={{ marginLeft: c.align === "right" ? "auto" : 0 }}
              >
                {c.note}
              </p>
            </Beat>
          </Cell>
        );
      })}

      <Cell col="11 / 13" row="11 / 12" mcol="1 / -1" mrow="11 / 12" ai="flex-end" jc="flex-end">
        <Beat act="index" enter={[0.02, 0.08]} exit={[0.95, 1]} y={10}>
          <p className="mono mono--dust">vi disciplines</p>
        </Beat>
      </Cell>
    </ActSection>
  );
}
