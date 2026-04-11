/** Fallback when graph metrics are unavailable (non-graph usage). */
export const GRAPH_NODE_SIZE = 92;

export const GRAPH_NODE_SIZE_MIN = 44;
export const GRAPH_NODE_SIZE_MAX = 156;

/**
 * Node diameter from available inner rect and participant count so the chain
 * can fill the viewport: fewer / larger area → bigger nodes; more people → smaller.
 */
export function computeGraphNodeDiameter(innerWidth, innerHeight, memberCount) {
  const n = memberCount;
  if (n <= 0) return GRAPH_NODE_SIZE;
  const m = Math.min(innerWidth, innerHeight);
  if (m < 1) return GRAPH_NODE_SIZE_MIN;

  const spreadFactor = 1 + 0.4 * Math.sqrt(Math.max(n - 1, 0));
  const raw = m / (spreadFactor + 0.34 * n);
  const capped = Math.max(
    GRAPH_NODE_SIZE_MIN,
    Math.min(GRAPH_NODE_SIZE_MAX, Math.round(raw))
  );

  const maxByBox = Math.floor(Math.min(innerWidth, innerHeight) * 0.92);
  return Math.min(capped, maxByBox);
}
