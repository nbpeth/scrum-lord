import { Box, useTheme, alpha } from "@mui/material";
import * as React from "react";
import { CitizenCard } from "../CitizenCard/CitizenCard";
import { computeGraphNodeDiameter, GRAPH_NODE_SIZE_MAX } from "./constants";

/** Smallest diameter we allow when squeezing into a tiny viewport. */
const NODE_DIAMETER_FLOOR = 16;

/** Deterministic PRNG from a string (stable layout for the same member list). */
function createSeededRng(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function next() {
    h |= 0;
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Random walk in the plane, then scale + translate so the chain (including
 * node diameter) fits the inner rect and is centered.
 */
function layoutMoleculeChain(citizens, width, height, pad, nodeDiameter) {
  const n = citizens.length;
  const D = nodeDiameter;
  const half = D / 2;

  if (n === 0) return [];

  const seedKey = citizens.map((c) => c.userId).join("\0");
  const rng = createSeededRng(seedKey);

  const innerW = Math.max(1, width - 2 * pad);
  const innerH = Math.max(1, height - 2 * pad);

  if (n === 1) {
    return [
      {
        cx: width / 2,
        cy: height / 2,
        left: width / 2 - half,
        top: height / 2 - half,
      },
    ];
  }

  let x = 0;
  let y = 0;
  let angle = rng() * Math.PI * 2;
  const centers = [{ x, y }];

  for (let i = 1; i < n; i++) {
    const dist = 36 + rng() * 88;
    angle += (rng() - 0.5) * 1.45;
    x += dist * Math.cos(angle);
    y += dist * Math.sin(angle);
    centers.push({ x, y });
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of centers) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const Wc = Math.max(maxX - minX, 1e-6);
  const Hc = Math.max(maxY - minY, 1e-6);

  const s = Math.min((innerW - D) / Wc, (innerH - D) / Hc);

  const totalW = s * Wc + D;
  const totalH = s * Hc + D;
  const tx = pad + (innerW - totalW) / 2 - s * minX + half;
  const ty = pad + (innerH - totalH) / 2 - s * minY + half;

  return centers.map((p) => {
    const cx = tx + s * p.x;
    const cy = ty + s * p.y;
    return {
      cx,
      cy,
      left: cx - half,
      top: cy - half,
    };
  });
}

function nodesFitInView(positions, nodeDiameter, width, height) {
  const eps = 0.75;
  const D = nodeDiameter;
  for (const p of positions) {
    if (p.left < -eps || p.top < -eps) return false;
    if (p.left + D > width + eps || p.top + D > height + eps) return false;
  }
  return true;
}

/**
 * Shrink node diameter until every node’s bounding box lies inside the graph
 * rect (handles rounding, border, and window resize into a tight area).
 */
function computeFittingLayout(citizens, width, height, pad) {
  const n = citizens.length;
  const innerW = Math.max(1, width - 2 * pad);
  const innerH = Math.max(1, height - 2 * pad);

  let nodeDiameter = computeGraphNodeDiameter(innerW, innerH, n);
  const maxByBox = Math.max(
    NODE_DIAMETER_FLOOR,
    Math.floor(Math.min(innerW, innerH) - 4)
  );
  nodeDiameter = Math.min(nodeDiameter, maxByBox, GRAPH_NODE_SIZE_MAX);

  for (let iter = 0; iter < 40; iter++) {
    if (nodeDiameter < NODE_DIAMETER_FLOOR) break;

    const positions = layoutMoleculeChain(
      citizens,
      width,
      height,
      pad,
      nodeDiameter
    );

    if (
      positions.length > 0 &&
      nodesFitInView(positions, nodeDiameter, width, height)
    ) {
      return { nodeDiameter, positions };
    }

    nodeDiameter = Math.max(
      NODE_DIAMETER_FLOOR,
      Math.floor(nodeDiameter * 0.87)
    );
  }

  const fallbackD = Math.max(
    NODE_DIAMETER_FLOOR,
    Math.min(
      Math.floor(Math.min(innerW, innerH) / Math.max(n, 1)),
      NODE_DIAMETER_FLOOR + 24
    )
  );
  return {
    nodeDiameter: fallbackD,
    positions: layoutMoleculeChain(
      citizens,
      width,
      height,
      pad,
      fallbackD
    ),
  };
}

/** Bond segment from circle edge to circle edge (line does not pass through nodes). */
function rimToRimSegment(cx1, cy1, cx2, cy2, radius) {
  const dx = cx2 - cx1;
  const dy = cy2 - cy1;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) {
    return { x1: cx1, y1: cy1, x2: cx2, y2: cy2 };
  }
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: cx1 + ux * radius,
    y1: cy1 + uy * radius,
    x2: cx2 - ux * radius,
    y2: cy2 - uy * radius,
  };
}

/**
 * Voting members as an organic “molecule” chain; node size and layout respond
 * to container size and headcount.
 */
export const CitizenGraph = ({
  citizens,
  iAmCitizen,
  handleDeleteUser,
  currentCommunity,
  animationClassPosition,
}) => {
  const theme = useTheme();
  const containerRef = React.useRef(null);
  const [size, setSize] = React.useState({ width: 360, height: 340 });

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      let w = rect.width;
      let h = rect.height;
      if (h < 2) h = el.clientHeight;
      if (h < 2) h = el.offsetHeight;
      w = Math.max(80, w);
      h = Math.max(80, h);
      setSize({ width: w, height: h });
    };

    measure();
    const raf1 = requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(measure);
    });

    const ro = new ResizeObserver(() => measure());
    ro.observe(el, { box: "border-box" });

    // aspect-ratio alone ties height to width — vertical-only resizes often leave
    // width unchanged, so the graph never re-lays out. vh-based height + this
    // listener fixes that (mobile URL bar, short windows).
    window.addEventListener("resize", measure);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf1);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      vv?.removeEventListener("resize", measure);
    };
  }, []);

  const n = citizens.length;
  const pad = 12;

  const layout = React.useMemo(
    () => computeFittingLayout(citizens, size.width, size.height, pad),
    [citizens, size.width, size.height]
  );

  const { nodeDiameter, positions } = layout;
  const half = nodeDiameter / 2;

  const edgeWidth = Math.max(1.2, Math.min(3.2, nodeDiameter * 0.028));

  const edgeColor = alpha(theme.palette.primary.main, 0.42);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 920,
        mx: "auto",
        // Height must track viewport height (vh), not only width — otherwise
        // vertical-only window resize keeps width constant and the graph never
        // shrinks/tallies with the available column height.
        height: {
          xs: "clamp(220px, min(52vh, 88vw), 520px)",
          sm: "clamp(260px, min(56vh, 70vw), 620px)",
        },
        minHeight: { xs: 200, sm: 240 },
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          component="svg"
          width="100%"
          height="100%"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            display: "block",
          }}
        >
          {n > 1 &&
            positions.slice(0, -1).map((_, i) => {
              const a = positions[i];
              const b = positions[i + 1];
              const seg = rimToRimSegment(a.cx, a.cy, b.cx, b.cy, half);
              return (
                <line
                  key={`edge-${citizens[i].userId}-${citizens[i + 1].userId}`}
                  x1={seg.x1}
                  y1={seg.y1}
                  x2={seg.x2}
                  y2={seg.y2}
                  stroke={edgeColor}
                  strokeWidth={edgeWidth}
                  strokeLinecap="round"
                />
              );
            })}
        </Box>

        {citizens.map((citizen, i) => (
          <Box
            key={citizen.userId}
            sx={{
              position: "absolute",
              left: positions[i]?.left ?? 0,
              top: positions[i]?.top ?? 0,
              width: nodeDiameter,
              height: nodeDiameter,
              zIndex: 2,
              pointerEvents: "auto",
            }}
          >
            <CitizenCard
              variant="node"
              nodeSize={nodeDiameter}
              animationClassPosition={animationClassPosition}
              fullsizeScreen
              position={i}
              currentCommunity={currentCommunity}
              handleDeleteUser={handleDeleteUser}
              iAmCitizen={iAmCitizen}
              citizen={citizen}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
