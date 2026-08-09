export function withFallback(data, fallback) {
  // اگر data معتبر نبود، fallback را برگردان
  if (data === undefined || data === null || (Array.isArray(data) && data.length === 0)) {
    return fallback;
  }
  return data;
}

export function getRealOrSimulated(envVar, simulated) {
  return envVar ? 'real' : 'simulated';
}
