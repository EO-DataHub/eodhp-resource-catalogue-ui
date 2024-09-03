// vitest-globals.d.ts

// Tell TypeScript that `vi` is a global variable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { vi } from 'vitest';

declare global {
  const vi: typeof vi;
}
