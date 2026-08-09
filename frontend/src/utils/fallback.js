export function withFallback(data, fallback) {
  return (data !== undefined && data !== null && (!Array.isArray(data) || data.length > 0)) ? data : fallback;
}
export function getRealOrSimulated(envVar, simulated) {
  return envVar ? 'real' : simulated;
}
