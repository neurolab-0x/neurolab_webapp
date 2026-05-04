/**
 * Cryptographically secure random number utilities to replace Math.random().
 * These functions use window.crypto.getRandomValues() and implement rejection 
 * sampling where necessary to eliminate modulo bias.
 */

/**
 * Generates a cryptographically secure random integer between min and max (inclusive).
 * Uses rejection sampling to eliminate modulo bias.
 */
export function getSecureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;

  // For very large ranges, we'd need more than 32 bits, but for most UI/logic 
  // needs (like 0-999 or 0-100), 32 bits is plenty.
  const uint32Range = 0x100000000;
  const maxSafe = Math.floor(uint32Range / range) * range;
  
  let randomValue: number;
  const array = new Uint32Array(1);
  
  do {
    window.crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxSafe);
  
  return min + (randomValue % range);
}

/**
 * Generates a cryptographically secure random float between 0 (inclusive) and 1 (exclusive).
 * This is a drop-in replacement for Math.random().
 */
export function getSecureRandomFloat(): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  // Divide by 2^32 to get a float in [0, 1)
  return array[0] / 0x100000000;
}
