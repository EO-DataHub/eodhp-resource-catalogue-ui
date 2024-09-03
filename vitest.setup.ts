// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom';

import { vi } from 'vitest';

import { server } from '@/mocks/server';

globalThis.vi = vi;

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
