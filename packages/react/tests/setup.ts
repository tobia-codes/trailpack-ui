import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library registers its own cleanup only if it can see a global
// `afterEach`, and this package runs without `globals`. Without this call every
// render in a file stays mounted for the rest of it — invisible to scoped
// queries, but axe's document-wide rules then fail on the leftovers.
afterEach(cleanup);
