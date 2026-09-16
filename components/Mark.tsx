"use client";

/**
 * The house mark: a profile, turned. `pathLength="1"` normalises both strokes
 * so the loader can draw them in with a single dash offset.
 */
export function Mark({
  size = 22,
  draw = false,
}: {
  size?: number;
  draw?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse
        cx="12"
        cy="5.2"
        rx="6.2"
        ry="1.9"
        stroke="currentColor"
        strokeWidth="0.7"
        pathLength="1"
        className={draw ? "mark__stroke" : undefined}
      />
      <path
        d="M5.8 5.2c0 4.4 -3 5.6 -3 9.1C2.8 17.9 6.9 21 12 21s9.2-3.1 9.2-6.7c0-3.5-3-4.7-3-9.1"
        stroke="currentColor"
        strokeWidth="0.7"
        pathLength="1"
        className={draw ? "mark__stroke" : undefined}
      />
      <ellipse
        cx="12"
        cy="14.3"
        rx="9.2"
        ry="2.6"
        stroke="currentColor"
        strokeWidth="0.35"
        opacity="0.4"
        pathLength="1"
        className={draw ? "mark__stroke" : undefined}
      />
    </svg>
  );
}
