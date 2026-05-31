const LEGACY_PREFIXES = ['base44_', 'base44-'];

export function clearLegacyStorage() {
  if (typeof window === 'undefined') return;

  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (LEGACY_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
