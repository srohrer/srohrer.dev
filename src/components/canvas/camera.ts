/**
 * Camera state lives outside React so panning/zooming doesn't re-render the board.
 * The world transform is applied imperatively; small widgets (minimap, zoom label)
 * subscribe via useSyncExternalStore.
 */
export interface Camera {
  x: number; // screen-space offset of world origin
  y: number;
  z: number; // zoom
}

export const MIN_Z = 0.2;
export const MAX_Z = 2;

export function createCameraStore(initial: Camera) {
  let cam = initial;
  const listeners = new Set<() => void>();
  let anim = 0;
  return {
    get: () => cam,
    set(next: Camera) {
      cam = { ...next, z: Math.min(MAX_Z, Math.max(MIN_Z, next.z)) };
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    /** Zooms by `factor`, keeping the world point under (sx, sy) fixed on screen. */
    zoomAt(sx: number, sy: number, factor: number) {
      const z = Math.min(MAX_Z, Math.max(MIN_Z, cam.z * factor));
      const k = z / cam.z;
      this.set({ x: sx - (sx - cam.x) * k, y: sy - (sy - cam.y) * k, z });
    },
    animateTo(target: Camera, ms = 450) {
      cancelAnimationFrame(anim);
      const from = cam;
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / ms);
        const e = ease(t);
        this.set({
          x: from.x + (target.x - from.x) * e,
          y: from.y + (target.y - from.y) * e,
          z: from.z + (target.z - from.z) * e,
        });
        if (t < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    },
    stop: () => cancelAnimationFrame(anim),
  };
}

export type CameraStore = ReturnType<typeof createCameraStore>;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function bounds(rects: Rect[]): Rect {
  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.w));
  const maxY = Math.max(...rects.map((r) => r.y + r.h));
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/** Camera that fits `r` into a viewport of size (vw, vh) with padding. */
export function fitRect(r: Rect, vw: number, vh: number, pad = 48, maxZ = 1): Camera {
  const z = Math.min(maxZ, (vw - pad * 2) / r.w, (vh - pad * 2) / r.h);
  return { z, x: vw / 2 - (r.x + r.w / 2) * z, y: vh / 2 - (r.y + r.h / 2) * z };
}
