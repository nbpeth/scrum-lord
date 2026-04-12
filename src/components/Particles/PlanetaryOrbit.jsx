import { memo, useEffect, useId, useMemo, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Particles } from "@tsparticles/react";
import { initAppParticlesEngine } from "../../initParticles";
import "./particles.css";

const RADIANS_PER_FULL_TURN = Math.PI * 2;
const MAX_FRAME_DELTA_SECONDS = 0.12;
const INITIAL_ANGLE_JITTER_RADIANS = 0.4;
const FALLBACK_DEVICE_PIXEL_RATIO = 1;
const CAP_DEVICE_PIXEL_RATIO = 2;
const MIN_CSS_PX_BEFORE_DRAW = 2;

function randomizedEvenlySpacedAngles(bodyCount) {
  return Array.from({ length: bodyCount }, (_, index) => {
    const evenlySpaced = (index / bodyCount) * RADIANS_PER_FULL_TURN;
    return evenlySpaced + Math.random() * INITIAL_ANGLE_JITTER_RADIANS;
  });
}

function clampedSecondsSincePreviousFrame(nowMs, previousFrameTimestampMsRef) {
  const previous = previousFrameTimestampMsRef.current;
  if (previous == null) {
    return 0;
  }
  return Math.min((nowMs - previous) / 1000, MAX_FRAME_DELTA_SECONDS);
}

function integrateConstantAngularVelocity(angleRadians, radiansPerSecond, deltaSeconds) {
  for (let i = 0; i < angleRadians.length; i += 1) {
    angleRadians[i] += radiansPerSecond * deltaSeconds;
  }
}

function viewportCenterAndMinEdgeLength(cssWidth, cssHeight) {
  return {
    centerX: cssWidth * 0.5,
    centerY: cssHeight * 0.5,
    minEdgeLengthPx: Math.min(cssWidth, cssHeight),
  };
}

function spanUnit(pathIndex, pathCount) {
  if (pathCount <= 1) {
    return 0;
  }
  return pathIndex / (pathCount - 1);
}

function radiusFactorForPath(pathIndex, pathCount, innermostFactor, outermostFactor) {
  if (pathCount <= 0) {
    return innermostFactor;
  }
  if (pathCount === 1) {
    return (innermostFactor + outermostFactor) / 2;
  }
  const t = spanUnit(pathIndex, pathCount);
  return innermostFactor + t * (outermostFactor - innermostFactor);
}

function angularSpeedForPath(pathIndex, pathCount, innerFastSpeed, outerSlowSpeed) {
  if (pathCount <= 1) {
    return (innerFastSpeed + outerSlowSpeed) / 2;
  }
  const t = spanUnit(pathIndex, pathCount);
  return innerFastSpeed + t * (outerSlowSpeed - innerFastSpeed);
}

function rgbaTupleFromString(css) {
  const match = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    const alpha = match[4] !== undefined ? Number(match[4]) : 1;
    return [Number(match[1]), Number(match[2]), Number(match[3]), alpha];
  }
  const hex = css.trim();
  if (hex.startsWith("#") && (hex.length === 7 || hex.length === 4)) {
    const h = hex.slice(1);
    if (h.length === 6) {
      return [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
        1,
      ];
    }
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
      1,
    ];
  }
  return [128, 128, 128, 1];
}

function mixRgba(cssA, cssB, t) {
  const a = rgbaTupleFromString(cssA);
  const b = rgbaTupleFromString(cssB);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  const al = a[3] + (b[3] - a[3]) * t;
  return `rgba(${r}, ${g}, ${bl}, ${al})`;
}

function dotRadiusForPath(pathIndex, pathCount, innerRadiusPx, outerRadiusPx) {
  if (pathCount <= 1) {
    return (innerRadiusPx + outerRadiusPx) / 2;
  }
  const t = spanUnit(pathIndex, pathCount);
  return innerRadiusPx + t * (outerRadiusPx - innerRadiusPx);
}

function particleDotRadiusPxForPath(
  pathIndex,
  pathCount,
  innerRadiusPx,
  outerRadiusPx,
  uniqueRadiusPerPath
) {
  if (uniqueRadiusPerPath) {
    return dotRadiusForPath(pathIndex, pathCount, innerRadiusPx, outerRadiusPx);
  }
  return (innerRadiusPx + outerRadiusPx) / 2;
}

function particleStrokeWidthPxForPath(
  pathIndex,
  pathCount,
  innerStrokeWidthPx,
  outerStrokeWidthPx,
  uniqueStrokeWidthPerPath
) {
  if (uniqueStrokeWidthPerPath) {
    return dotRadiusForPath(pathIndex, pathCount, innerStrokeWidthPx, outerStrokeWidthPx);
  }
  return (innerStrokeWidthPx + outerStrokeWidthPx) / 2;
}

function resolveLinkStrokeRgba(
  colorStr,
  opacity,
  blink,
  frequency,
  nowMs,
  reduceMotion
) {
  const t = rgbaTupleFromString(colorStr);
  let alpha = t[3] * opacity;
  if (blink && !reduceMotion) {
    const phase =
      0.5 + 0.5 * Math.sin((nowMs / 1000) * frequency * Math.PI * 2);
    alpha *= 0.35 + 0.65 * phase;
  }
  return `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${Math.min(1, Math.max(0, alpha))})`;
}

function resolveTriangleFillRgba(colorStr, triangleOpacity) {
  const t = rgbaTupleFromString(colorStr);
  const alpha = t[3] * triangleOpacity;
  return `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${Math.min(1, Math.max(0, alpha))})`;
}

function distancePx(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function fillMutuallyLinkedTriangles(ctx, positions, maxDistancePx, fillRgba) {
  if (positions.length < 3) {
    return;
  }
  ctx.fillStyle = fillRgba;
  const n = positions.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        const p = positions[i];
        const q = positions[j];
        const r = positions[k];
        if (
          distancePx(p, q) < maxDistancePx &&
          distancePx(q, r) < maxDistancePx &&
          distancePx(p, r) < maxDistancePx
        ) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.lineTo(r.x, r.y);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }
}

function strokeOneLinkSegment(ctx, ax, ay, bx, by, centerX, centerY, minEdgePx, warp) {
  if (!warp) {
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    return;
  }
  const mx = (ax + bx) * 0.5;
  const my = (ay + by) * 0.5;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const bend = minEdgePx * 0.06;
  const perpX = (-dy / len) * bend;
  const perpY = (dx / len) * bend;
  const towardCx = centerX - mx;
  const towardCy = centerY - my;
  const dot = perpX * towardCx + perpY * towardCy;
  const sign = dot >= 0 ? 1 : -1;
  const cx = mx + perpX * sign;
  const cy = my + perpY * sign;
  ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo(cx, cy, bx, by);
}

function renderParticleLinks(
  ctx,
  positions,
  centerX,
  centerY,
  minEdgePx,
  link,
  nowMs,
  reduceMotion
) {
  if (!link.enable || positions.length < 2) {
    return;
  }

  const maxDistancePx = link.distance;
  const strokeRgba = resolveLinkStrokeRgba(
    link.color,
    link.opacity,
    link.blink,
    link.frequency,
    nowMs,
    reduceMotion
  );

  if (link.triangles) {
    const fillRgba = resolveTriangleFillRgba(link.triangleColor, link.triangleOpacity);
    fillMutuallyLinkedTriangles(ctx, positions, maxDistancePx, fillRgba);
  }

  ctx.strokeStyle = strokeRgba;
  ctx.lineWidth = link.width;
  ctx.lineCap = "round";
  ctx.globalAlpha = 1;

  if (link.shadow.enable) {
    ctx.shadowColor = link.shadow.color;
    ctx.shadowBlur = link.shadow.blur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  }

  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const d = distancePx(positions[i], positions[j]);
      if (d <= 0 || d >= maxDistancePx) {
        continue;
      }
      ctx.beginPath();
      strokeOneLinkSegment(
        ctx,
        positions[i].x,
        positions[i].y,
        positions[j].x,
        positions[j].y,
        centerX,
        centerY,
        minEdgePx,
        link.warp
      );
      ctx.stroke();
    }
  }

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
}

function applyCanvasBitmapSizeToMatchLayout(canvas, ctx) {
  const parent = canvas.parentElement;
  const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
  const cssWidth = rect.width;
  const cssHeight = rect.height;
  if (cssWidth < 1 || cssHeight < 1) {
    return false;
  }
  const dpr = Math.min(
    window.devicePixelRatio || FALLBACK_DEVICE_PIXEL_RATIO,
    CAP_DEVICE_PIXEL_RATIO
  );
  canvas.width = Math.floor(cssWidth * dpr);
  canvas.height = Math.floor(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return true;
}

function clearCanvasCssRect(ctx, cssWidth, cssHeight) {
  ctx.clearRect(0, 0, cssWidth, cssHeight);
}

function strokeConcentricRings(ctx, centerX, centerY, radiiPx, stroke) {
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.lineWidthPx;
  for (let i = 0; i < radiiPx.length; i += 1) {
    const radiusPx = radiiPx[i];
    ctx.beginPath();
    ctx.arc(centerX, centerY, radiusPx, 0, RADIANS_PER_FULL_TURN);
    ctx.stroke();
  }
}

function isPointerNearBody(pointerCanvas, bodyX, bodyY, dotRadiusPx, hitPaddingPx) {
  if (
    !pointerCanvas ||
    !pointerCanvas.active ||
    pointerCanvas.x == null ||
    pointerCanvas.y == null
  ) {
    return false;
  }
  return (
    Math.hypot(pointerCanvas.x - bodyX, pointerCanvas.y - bodyY) < dotRadiusPx + hitPaddingPx
  );
}

function stepHoverFillAmount(current, target, deltaSeconds, rampSeconds, instant) {
  if (instant) {
    return target;
  }
  if (rampSeconds <= 0) {
    return target;
  }
  const t = 1 - Math.exp(-deltaSeconds / rampSeconds);
  return current + (target - current) * t;
}

function drawOrbitDotsWithHoverFill(
  ctx,
  centerX,
  centerY,
  orbitRadiusPx,
  angleRadians,
  dotStyle,
  fillAmounts
) {
  const dotRadiusPx = dotStyle.radiusPx;
  const strokeWidthPx = Math.max(0.5, dotStyle.strokeWidthPx);
  const hoverFillOpacity = dotStyle.hoverFillOpacity ?? 0.88;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (let i = 0; i < angleRadians.length; i += 1) {
    const angle = angleRadians[i];
    const x = centerX + orbitRadiusPx * Math.cos(angle);
    const y = centerY + orbitRadiusPx * Math.sin(angle);
    const fillAmount = Math.min(1, Math.max(0, fillAmounts?.[i] ?? 0));
    const fillAlpha = hoverFillOpacity * fillAmount;

    ctx.beginPath();
    ctx.arc(x, y, dotRadiusPx, 0, RADIANS_PER_FULL_TURN);
    if (fillAlpha > 0.002) {
      ctx.fillStyle = dotStyle.color;
      ctx.globalAlpha = fillAlpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = dotStyle.color;
    ctx.lineWidth = strokeWidthPx;
    ctx.stroke();
  }
}

function collectBodyPositionsCssPx(centerX, centerY, radiiPx, anglesPerPathNested) {
  const positions = [];
  for (let p = 0; p < anglesPerPathNested.length; p += 1) {
    const orbitRadiusPx = radiiPx[p];
    const angleRadians = anglesPerPathNested[p];
    for (let i = 0; i < angleRadians.length; i += 1) {
      const angle = angleRadians[i];
      positions.push({
        x: centerX + orbitRadiusPx * Math.cos(angle),
        y: centerY + orbitRadiusPx * Math.sin(angle),
      });
    }
  }
  return positions;
}

function orbitRadiiPxFromRingConfigs(minEdgeLengthPx, ringConfigs) {
  return ringConfigs.map((ring) => minEdgeLengthPx * ring.radiusFactor);
}

/**
 * Per-orbit ring: omitted fields inherit from PlanetaryOrbit legacy props by ring index.
 * @typedef {object} OrbitalRingConfig
 * @property {number} [speed] Angular velocity (rad/s). Alias: `angularSpeed`.
 * @property {number} [bodies] Body count. Alias: `bodyCount`. Falls back to `bodiesPerPath`.
 * @property {number} [bodySize] Dot radius in CSS px. Alias: `dotRadiusPx`.
 * @property {number} [strokeWidth] Dot stroke width in px. Alias: `particleStrokeWidthPx`.
 * @property {string} [color] Particle stroke/fill color. Default: blend inner→outer path colors.
 * @property {number} [radiusFactor] Orbit radius as a fraction of min(viewport edge). Default: evenly spaced between innermost/outermost factors.
 */

function normalizeOrbitalRing(raw, pathIndex, pathCount, defaults) {
  const t = spanUnit(pathIndex, pathCount);
  const defaultColor = mixRgba(
    defaults.innerPathParticleColor,
    defaults.outerPathParticleColor,
    t
  );
  const defaultDotRadius = particleDotRadiusPxForPath(
    pathIndex,
    pathCount,
    defaults.innerPathDotRadiusPx,
    defaults.outerPathDotRadiusPx,
    defaults.uniqueParticleSizePerPath
  );
  const defaultStrokeWidth = particleStrokeWidthPxForPath(
    pathIndex,
    pathCount,
    defaults.innerPathParticleStrokeWidthPx,
    defaults.outerPathParticleStrokeWidthPx,
    defaults.uniqueParticleStrokeWidthPerPath
  );

  const bodies = Math.max(
    1,
    Math.floor(raw.bodies ?? raw.bodyCount ?? defaults.bodiesPerPath)
  );

  let radiusFactor = raw.radiusFactor;
  if (!Number.isFinite(radiusFactor)) {
    radiusFactor = radiusFactorForPath(
      pathIndex,
      pathCount,
      defaults.innermostRadiusFactor,
      defaults.outermostRadiusFactor
    );
  }

  let speed = raw.speed ?? raw.angularSpeed;
  if (!Number.isFinite(speed)) {
    if (
      Array.isArray(defaults.orbitAngularSpeeds) &&
      Number.isFinite(defaults.orbitAngularSpeeds[pathIndex])
    ) {
      speed = defaults.orbitAngularSpeeds[pathIndex];
    } else {
      speed = angularSpeedForPath(
        pathIndex,
        pathCount,
        defaults.innerFastAngularSpeed,
        defaults.outerSlowAngularSpeed
      );
    }
  }

  const dotCandidate = raw.bodySize ?? raw.dotRadiusPx;
  const dotRadiusPx = Number.isFinite(dotCandidate) ? dotCandidate : defaultDotRadius;

  const strokeCandidate = raw.strokeWidth ?? raw.particleStrokeWidthPx;
  const strokeWidthPx = Number.isFinite(strokeCandidate)
    ? strokeCandidate
    : defaultStrokeWidth;

  const color =
    typeof raw.color === "string" && raw.color.length > 0 ? raw.color : defaultColor;

  return {
    radiusFactor,
    speed,
    bodies,
    dotRadiusPx,
    strokeWidthPx,
    color,
  };
}

function buildOrbitalRingConfigs(props) {
  const defaults = {
    bodiesPerPath: props.bodiesPerPath,
    innermostRadiusFactor: props.innermostRadiusFactor,
    outermostRadiusFactor: props.outermostRadiusFactor,
    innerFastAngularSpeed: props.innerFastAngularSpeed,
    outerSlowAngularSpeed: props.outerSlowAngularSpeed,
    orbitAngularSpeeds: props.orbitAngularSpeeds,
    innerPathParticleColor: props.innerPathParticleColor,
    outerPathParticleColor: props.outerPathParticleColor,
    innerPathDotRadiusPx: props.innerPathDotRadiusPx,
    outerPathDotRadiusPx: props.outerPathDotRadiusPx,
    innerPathParticleStrokeWidthPx: props.innerPathParticleStrokeWidthPx,
    outerPathParticleStrokeWidthPx: props.outerPathParticleStrokeWidthPx,
    uniqueParticleSizePerPath: props.uniqueParticleSizePerPath,
    uniqueParticleStrokeWidthPerPath: props.uniqueParticleStrokeWidthPerPath,
  };

  if (Array.isArray(props.orbitalRings) && props.orbitalRings.length > 0) {
    const pathCount = props.orbitalRings.length;
    return props.orbitalRings.map((raw, pathIndex) =>
      normalizeOrbitalRing(raw ?? {}, pathIndex, pathCount, defaults)
    );
  }

  const pathCount = Math.max(1, Math.floor(props.orbitPathCount));
  return Array.from({ length: pathCount }, (_, pathIndex) =>
    normalizeOrbitalRing({}, pathIndex, pathCount, defaults)
  );
}

export const PlanetaryOrbit = memo(function PlanetaryOrbit({
  /** @type {OrbitalRingConfig[]|undefined} When set (non-empty), defines each ring independently; `orbitPathCount` / `bodiesPerPath` are only used as defaults for missing fields. */
  orbitalRings,
  orbitPathCount = 4,
  bodiesPerPath = 1,
  innermostRadiusFactor = 0.22,
  outermostRadiusFactor = 0.36,
  innerFastAngularSpeed = 0.42,
  outerSlowAngularSpeed = 0.26,
  orbitAngularSpeeds,
  ringColor = "rgba(57, 57, 61, 0.38)",
  ringLineWidth = 1.5,
  innerPathParticleColor = "rgba(187, 255, 255, 0.92)",
  outerPathParticleColor = "rgba(186, 140, 255, 0.9)",
  innerPathDotRadiusPx = 15,
  outerPathDotRadiusPx = 40,
  innerPathParticleStrokeWidthPx = 3,
  outerPathParticleStrokeWidthPx = 4.5,
  uniqueParticleSizePerPath = true,
  uniqueParticleStrokeWidthPerPath = true,
  linkEnable = true,
  linkDistance = 350,
  linkBlink = false,
  linkTriangles = false,
  linkColor = "rgb(179, 102, 255)",
  linkOpacity = .15,
  linkWarp = false,
  linkConsent = true,
  linkFrequency = 1,
  linkShadowColor = "rgba(0, 0, 0, 0.45)",
  linkShadowBlur = 8,
  linkShadowEnable = true,
  linkTriangleColor = "rgb(179, 102, 255)",
  linkTriangleOpacity = 0.12,
  linkWidth = 5,
  emitterBehindRingsEnabled = true,
  orbitHoverInteractionEnabled = true,
  orbitHoverHitPaddingPx = 12,
  orbitHoverFillOpacity = 0.88,
  orbitHoverFillRampSeconds = 0.38,
}) {
  const orbitalRingConfigs = useMemo(
    () =>
      buildOrbitalRingConfigs({
        orbitalRings,
        orbitPathCount,
        bodiesPerPath,
        innermostRadiusFactor,
        outermostRadiusFactor,
        innerFastAngularSpeed,
        outerSlowAngularSpeed,
        orbitAngularSpeeds,
        innerPathParticleColor,
        outerPathParticleColor,
        innerPathDotRadiusPx,
        outerPathDotRadiusPx,
        innerPathParticleStrokeWidthPx,
        outerPathParticleStrokeWidthPx,
        uniqueParticleSizePerPath,
        uniqueParticleStrokeWidthPerPath,
      }),
    [
      orbitalRings,
      orbitPathCount,
      bodiesPerPath,
      innermostRadiusFactor,
      outermostRadiusFactor,
      innerFastAngularSpeed,
      outerSlowAngularSpeed,
      orbitAngularSpeeds,
      innerPathParticleColor,
      outerPathParticleColor,
      innerPathDotRadiusPx,
      outerPathDotRadiusPx,
      innerPathParticleStrokeWidthPx,
      outerPathParticleStrokeWidthPx,
      uniqueParticleSizePerPath,
      uniqueParticleStrokeWidthPerPath,
    ]
  );

  const pathCount = orbitalRingConfigs.length;
  const emitterLayerId = useId().replace(/:/g, "");

  const canvasRef = useRef(null);
  const pointerCanvasRef = useRef({
    x: null,
    y: null,
    active: false,
  });
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [emitterEngineReady, setEmitterEngineReady] = useState(false);
  const anglesPerPath = useRef([]);
  const hoverFillAmountPerPath = useRef([]);
  const animationFrameId = useRef(0);
  const previousFrameTimestampMs = useRef(null);

  useEffect(() => {
    anglesPerPath.current = orbitalRingConfigs.map((ring) =>
      randomizedEvenlySpacedAngles(ring.bodies)
    );
    hoverFillAmountPerPath.current = orbitalRingConfigs.map(
      (ring) => new Float32Array(ring.bodies).fill(0)
    );
  }, [orbitalRingConfigs]);

  useEffect(() => {
    if (!orbitHoverInteractionEnabled || reduceMotion) {
      pointerCanvasRef.current = { x: null, y: null, active: false };
      return undefined;
    }
    const onPointerMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      pointerCanvasRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const clearPointer = () => {
      pointerCanvasRef.current = { x: null, y: null, active: false };
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearPointer();
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", clearPointer);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", clearPointer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearPointer();
    };
  }, [orbitHoverInteractionEnabled, reduceMotion]);

  useEffect(() => {
    if (!emitterBehindRingsEnabled) {
      return undefined;
    }
    let cancelled = false;
    initAppParticlesEngine()
      .then(() => {
        if (!cancelled) {
          setEmitterEngineReady(true);
        }
      })
      .catch((err) => {
        console.error("tsParticles engine init failed (PlanetaryOrbit emitter)", err);
      });
    return () => {
      cancelled = true;
    };
  }, [emitterBehindRingsEnabled]);

  const behindRingsEmitterOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: {
        color: { value: "transparent" },
      },
      detectRetina: true,
      fpsLimit: 30,
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },
      particles: {
        number: { value: 0 },
      },
      emitters: {
        autoPlay: true,
        position: {
          x: 50,
          y: 50,
        },
        size: {
          width: 14,
          height: 14,
          mode: "percent",
        },
        rate: {
          delay: 0.2,
          quantity: 1,
        },
        particles: {
          color: {
            value: "rgb(140, 190, 255)",
          },
          shape: { type: "circle" },
          opacity: {
            value: { min: 0.15, max: 0.45 },
          },
          size: {
            value: { min: 1, max: 4 },
          },
          life: {
            count: 1,
            duration: {
              value: { min: 14, max: 26 },
            },
          },
          move: {
            enable: true,
            speed: { min: 1, max: 3.2 },
            direction: "outside",
            random: false,
            straight: true,
            outModes: {
              default: "destroy",
            },
          },
        },
      },
    }),
    []
  );

  const ringStroke = useMemo(
    () => ({ color: ringColor, lineWidthPx: ringLineWidth }),
    [ringColor, ringLineWidth]
  );

  const linkRender = useMemo(
    () => ({
      enable: linkEnable,
      distance: linkDistance,
      blink: linkBlink,
      triangles: linkTriangles,
      color: linkColor,
      opacity: linkOpacity,
      warp: linkWarp,
      consent: linkConsent,
      frequency: Math.max(0.05, linkFrequency),
      width: linkWidth,
      shadow: {
        enable: linkShadowEnable,
        color: linkShadowColor,
        blur: linkShadowBlur,
      },
      triangleColor: linkTriangleColor,
      triangleOpacity: linkTriangleOpacity,
    }),
    [
      linkEnable,
      linkDistance,
      linkBlink,
      linkTriangles,
      linkColor,
      linkOpacity,
      linkWarp,
      linkConsent,
      linkFrequency,
      linkWidth,
      linkShadowEnable,
      linkShadowColor,
      linkShadowBlur,
      linkTriangleColor,
      linkTriangleOpacity,
    ]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return undefined;
    }

    previousFrameTimestampMs.current = null;

    const handleResize = () => {
      applyCanvasBitmapSizeToMatchLayout(canvas, ctx);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas.parentElement || canvas);
    window.addEventListener("resize", handleResize);

    const renderFrame = (nowMs) => {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      if (cssWidth < MIN_CSS_PX_BEFORE_DRAW || cssHeight < MIN_CSS_PX_BEFORE_DRAW) {
        animationFrameId.current = requestAnimationFrame(renderFrame);
        return;
      }

      const deltaSeconds = clampedSecondsSincePreviousFrame(nowMs, previousFrameTimestampMs);
      previousFrameTimestampMs.current = nowMs;

      const { centerX, centerY, minEdgeLengthPx } = viewportCenterAndMinEdgeLength(
        cssWidth,
        cssHeight
      );
      const radiiPx = orbitRadiiPxFromRingConfigs(minEdgeLengthPx, orbitalRingConfigs);

      const pointerSnapshot = pointerCanvasRef.current;
      const pointerForHover =
        orbitHoverInteractionEnabled ? pointerSnapshot : { active: false };

      if (!reduceMotion) {
        for (let p = 0; p < pathCount; p += 1) {
          integrateConstantAngularVelocity(
            anglesPerPath.current[p],
            orbitalRingConfigs[p].speed,
            deltaSeconds
          );
        }
      }

      for (let p = 0; p < pathCount; p += 1) {
        const angles = anglesPerPath.current[p];
        const amounts = hoverFillAmountPerPath.current[p];
        if (!amounts || amounts.length !== angles.length) {
          continue;
        }
        const orbitRadiusPx = radiiPx[p];
        const dotRadiusPx = orbitalRingConfigs[p].dotRadiusPx;
        for (let i = 0; i < angles.length; i += 1) {
          const x = centerX + orbitRadiusPx * Math.cos(angles[i]);
          const y = centerY + orbitRadiusPx * Math.sin(angles[i]);
          const target = isPointerNearBody(
            pointerForHover,
            x,
            y,
            dotRadiusPx,
            orbitHoverHitPaddingPx
          )
            ? 1
            : 0;
          amounts[i] = stepHoverFillAmount(
            amounts[i],
            target,
            deltaSeconds,
            orbitHoverFillRampSeconds,
            reduceMotion
          );
        }
      }

      clearCanvasCssRect(ctx, cssWidth, cssHeight);

      strokeConcentricRings(ctx, centerX, centerY, radiiPx, ringStroke);

      const bodyPositionsCssPx = collectBodyPositionsCssPx(
        centerX,
        centerY,
        radiiPx,
        anglesPerPath.current
      );
      renderParticleLinks(
        ctx,
        bodyPositionsCssPx,
        centerX,
        centerY,
        minEdgeLengthPx,
        linkRender,
        nowMs,
        reduceMotion
      );

      for (let p = 0; p < pathCount; p += 1) {
        const ring = orbitalRingConfigs[p];
        drawOrbitDotsWithHoverFill(
          ctx,
          centerX,
          centerY,
          radiiPx[p],
          anglesPerPath.current[p],
          {
            color: ring.color,
            radiusPx: ring.dotRadiusPx,
            strokeWidthPx: ring.strokeWidthPx,
            hoverFillOpacity: orbitHoverFillOpacity,
          },
          hoverFillAmountPerPath.current[p]
        );
      }

      animationFrameId.current = requestAnimationFrame(renderFrame);
    };

    animationFrameId.current = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [
    reduceMotion,
    pathCount,
    orbitalRingConfigs,
    ringStroke,
    linkRender,
    orbitHoverInteractionEnabled,
    orbitHoverHitPaddingPx,
    orbitHoverFillOpacity,
    orbitHoverFillRampSeconds,
  ]);

  const showBehindRingsEmitter =
    emitterBehindRingsEnabled && emitterEngineReady && !reduceMotion;

  return (
    <div
      className="planetary-orbit-root"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {showBehindRingsEmitter && (
        <div className="planetary-orbit-emitter-layer">
          <Particles
            id={`particles-planetary-orbit-emitter-${emitterLayerId}`}
            className="planetary-orbit-emitter-host"
            options={behindRingsEmitterOptions}
          />
        </div>
      )}
      <canvas ref={canvasRef} className="planetary-orbit-canvas" />
    </div>
  );
});
