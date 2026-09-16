"use client";

import { ActSection, Beat } from "@/components/Beat";
import { Cell } from "@/components/Cell";

const SOCIAL = ["Instagram", "Vimeo", "LinkedIn"];

/**
 * Act 06. There is no footer. The form closes back into the line it came from
 * and the contact details are left in the margins around it.
 */
export function Signoff() {
  return (
    <ActSection id="signoff">
      <Cell col="8 / 12" row="2 / 4" mcol="1 / -1" mrow="2 / 4" ai="flex-end">
        <Beat
          act="signoff"
          enter={[0.02, 0.16]}
          exit={[0.7, 0.86]}
          y={26}
          style={{ textAlign: "right" }}
        >
          <p className="mono mono--ember">Open</p>
          <p className="lede" style={{ marginTop: "0.7rem" }}>
            Taking work
            <br />
            for 2026.
          </p>
        </Beat>
      </Cell>

      <Cell col="2 / 7" row="5 / 8" mcol="1 / -1" mrow="5 / 8" jc="center">
        <Beat act="signoff" enter={[0.16, 0.34]} exit={[0.74, 0.9]} y={30}>
          <p className="mono mono--dust">Start a conversation</p>
          <a
            href="mailto:studio@vessel.works"
            className="title"
            style={{ display: "inline-block", marginTop: "0.6rem" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--ember)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--bone)";
            }}
          >
            studio@vessel.works
          </a>
          <p className="mono mono--dust" style={{ marginTop: "1.4rem" }}>
            +91 79 4000 1119
            <br />
            Studio 4, Kilnyard, Ahmedabad
          </p>
        </Beat>
      </Cell>

      <Cell col="12 / 13" row="5 / 11" mcol="12 / 13" mrow="5 / 11" ai="flex-end">
        <Beat act="signoff" enter={[0.24, 0.4]} exit={[0.8, 0.94]} y={20}>
          <div className="vert--up" style={{ display: "flex", gap: "2.2rem" }}>
            {SOCIAL.map((s) => (
              <a key={s} className="mono mono--bone" href="#">
                {s}
              </a>
            ))}
          </div>
        </Beat>
      </Cell>

      {/* the wordmark, set enormous and allowed to fall off the bottom edge */}
      <Cell col="1 / 12" row="10 / 13" mcol="1 / -1" mrow="10 / 13" jc="flex-end">
        <Beat
          act="signoff"
          enter={[0.5, 0.78]}
          y={60}
          style={{ marginBottom: "-4.5vh", width: "100%" }}
        >
          <h2
            className="serif"
            style={{
              margin: 0,
              fontSize: "clamp(5rem, 26vw, 26rem)",
              lineHeight: 0.74,
              letterSpacing: "-0.04em",
              color: "var(--bone)",
              whiteSpace: "nowrap",
            }}
          >
            Vessel
          </h2>
        </Beat>
      </Cell>

      <Cell col="9 / 13" row="12 / 13" mcol="1 / -1" mrow="12 / 13" ai="flex-end" jc="flex-end">
        <Beat
          act="signoff"
          enter={[0.86, 0.97]}
          y={14}
          style={{ textAlign: "right" }}
        >
          <p className="mono mono--dust">
            © MMXXVI — one line, turned
          </p>
        </Beat>
      </Cell>
    </ActSection>
  );
}
