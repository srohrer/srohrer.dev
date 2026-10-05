"use client";

import { useState } from "react";
import { CanvasBoard } from "./canvas/CanvasBoard";
import { Showcase } from "./Showcase";

/**
 * Phones get the scrolling showcase; desktop gets the canvas, with a button to
 * switch to the showcase. The split is pure CSS so the server render matches and
 * nothing flashes on load. Previews in the hidden layout stay paused because
 * they're never on screen.
 */
export function Home() {
  const [list, setList] = useState(false);
  if (list) return <Showcase onCanvas={() => setList(false)} />;
  return (
    <>
      <div className="md:hidden">
        <Showcase />
      </div>
      <div className="hidden md:block">
        <CanvasBoard onList={() => setList(true)} />
      </div>
    </>
  );
}
