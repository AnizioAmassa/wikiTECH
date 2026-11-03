/** Teste de primalidade por divisão (6k ± 1). Rápido o bastante até Number.MAX_SAFE_INTEGER. */
export function ehPrimo(n: number): boolean {
  if (!Number.isSafeInteger(n) || n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
