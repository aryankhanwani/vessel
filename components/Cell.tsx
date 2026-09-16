"use client";

import type { CSSProperties, ReactNode } from "react";

interface CellProps {
  /** grid-column, e.g. "3 / 7" */
  col: string;
  /** grid-row, e.g. "8 / 11" */
  row: string;
  /** narrow-screen overrides */
  mcol?: string;
  mrow?: string;
  /** justify-content along the column axis */
  jc?: CSSProperties["justifyContent"];
  /** align-items */
  ai?: CSSProperties["alignItems"];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * Every piece of copy on this site is placed by hand on a 12×12 grid.
 * Nothing is centred, nothing sits where a template would put it.
 */
export function Cell({
  col,
  row,
  mcol,
  mrow,
  jc,
  ai,
  className = "",
  style,
  children,
}: CellProps) {
  return (
    <div
      className={`cell ${className}`}
      style={
        {
          "--c": col,
          "--r": row,
          "--mc": mcol ?? "1 / -1",
          "--mr": mrow ?? row,
          "--jc": jc ?? "flex-start",
          "--ai": ai ?? "flex-start",
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
