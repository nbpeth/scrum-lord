import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useMemo } from "react";

const drift = keyframes`
  0% {
    transform: translate3d(0, -12vh, 0) rotate(0deg);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  100% {
    transform: translate3d(var(--drift-x), 110vh, 0) rotate(720deg);
    opacity: 0.85;
  }
`;

/**
 * Full-screen hotdog overload: real 🌭 glyphs via CSS (no tsParticles emoji plugin).
 * Avoids engine init failures and package resolution issues.
 */
export function HotDogAlertParticles() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${4 + Math.random() * 92}%`,
        duration: 4 + Math.random() * 5,
        delay: Math.random() * 2.5,
        sizePx: 20 + Math.random() * 36,
        driftX: `${(Math.random() - 0.5) * 120}px`,
      })),
    []
  );

  return (
    <Overlay aria-hidden>
      {flakes.map((f) => (
        <Flake
          key={f.id}
          style={{
            left: f.left,
            fontSize: f.sizePx,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            "--drift-x": f.driftX,
          }}
        >
          🌭
        </Flake>
      ))}
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
`;

const Flake = styled.span`
  position: absolute;
  top: 0;
  line-height: 1;
  user-select: none;
  animation-name: ${drift};
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform, opacity;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
`;
