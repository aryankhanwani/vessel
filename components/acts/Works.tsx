"use client";

import type { CSSProperties } from "react";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

interface Work {
  n: string;
  title: string;
  client: string;
  year: string;
  disciplines: string;
  line: string;
}

const WORKS: Work[] = [
  {
    n: "01",
    title: "Salt Index",
    client: "Kilnhouse",
    year: "2025",
    disciplines: "Direction · Film · Sound",
    line: "Nine minutes of a coastline being catalogued by people who will never publish the catalogue.",
  },
  {
    n: "02",
    title: "Low Country",
    client: "Maison Terre",
    year: "2025",
    disciplines: "Identity · Motion",
    line: "A house mark built from one drawn curve, and a system patient enough to survive its founders.",
  },
  {
    n: "03",
    title: "Nocturne",
    client: "Northmoor",
    year: "2024",
    disciplines: "Film · Space",
    line: "A room that only works after dark, and the film we made to explain why.",
  },
  {
    n: "04",
    title: "Hollow Bell",
    client: "Atlas Forma",
    year: "2024",
    disciplines: "Sound · Installation",
    line: "Bronze, a long reverb tail, and eleven thousand people who stood very still.",
  },
];

/**
 * Act 03. Each work gets a held frame. The number, the title and the facts sit
 * in three different corners — you read it as a spread, not a card.
 */
export function Works() {
  const span = 1 / WORKS.length;

  return (
    <ActSection id="works">
      <Cell col="1 / 3" row="5 / 6" mcol="1 / -1" mrow="3 / 4">
        <Beat act="works" enter={[0, 0.04]} exit={[0.97, 1]} y={10}>
          <p className="mono mono--dust">Selected</p>
        </Beat>
      </Cell>

      {WORKS.map((w, i) => {
        const a = i * span;
        const flip = i % 2 === 1;

        const numeralStyle: CSSProperties = {
          position: "absolute",
          bottom: "-6vh",
          ...(flip ? { left: "-3vw" } : { right: "-3vw" }),
        };
        const titleStyle: CSSProperties = {
          position: "absolute",
          top: flip ? "16%" : "48%",
          textAlign: flip ? "right" : "left",
          maxWidth: "min(46vw, 620px)",
          ...(flip ? { right: 0 } : { left: 0 }),
        };
        const factStyle: CSSProperties = {
          position: "absolute",
          top: flip ? "62%" : "18%",
          textAlign: flip ? "left" : "right",
          maxWidth: "min(34vw, 420px)",
          ...(flip ? { left: 0 } : { right: 0 }),
        };

        return (
          <Cell
            key={w.n}
            col="1 / 13"
            row="1 / 13"
            mcol="1 / -1"
            mrow="1 / 13"
            style={{ position: "relative", display: "block" }}
          >
            {/* the numeral, bled off an edge */}
            <Beat
              act="works"
              enter={[a + span * 0.02, a + span * 0.26]}
              exit={[a + span * 0.76, a + span * 0.99]}
              y={46}
              style={numeralStyle}
            >
              <span className="numeral">{w.n}</span>
            </Beat>

            {/* the title, a third of the way down, never centred */}
            <Beat
              act="works"
              enter={[a + span * 0.06, a + span * 0.3]}
              exit={[a + span * 0.72, a + span * 0.96]}
              y={40}
              x={flip ? 28 : -28}
              blur={4}
              style={titleStyle}
            >
              <p className="mono mono--ember">{w.client}</p>
              <h2
                className="title"
                style={{ margin: "0.5rem 0 0", fontWeight: 400 }}
              >
                {w.title}
              </h2>
            </Beat>

            {/* the facts, in the opposite corner */}
            <Beat
              act="works"
              enter={[a + span * 0.18, a + span * 0.42]}
              exit={[a + span * 0.68, a + span * 0.92]}
              y={26}
              style={factStyle}
            >
              <p className="mono mono--dust">
                {w.year} · {w.disciplines}
              </p>
              <p
                className="body"
                style={{
                  marginTop: "0.9rem",
                  marginLeft: flip ? 0 : "auto",
                }}
              >
                {w.line}
              </p>
            </Beat>
          </Cell>
        );
      })}
    </ActSection>
  );
}
