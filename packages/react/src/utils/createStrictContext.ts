'use client';

import { type Context, createContext, use } from 'react';

const missing = Symbol('missing provider');

// Not in the language standard, and typed by `@types/node` — which a browser
// package must not depend on, so the capability is declared here and called
// optionally.
type StackTraceCapture = {
  captureStackTrace?: (target: object, above: (...args: never[]) => unknown) => void;
};

/**
 * Creates a context with no default, paired with a hook that reads it and
 * throws when called outside its provider — so consumers get a guaranteed
 * value without null-checking. A context that has a sensible default does not
 * need this and stays on React's `createContext`.
 * @param providerName - What has to be rendered above the consumer, named in
 *   the error thrown without it, e.g. `"Modal"` for `<Modal>`.
 * @returns A `[Context, useStrictContext]` tuple: the context to render with a
 *   `value`, and a hook returning that value. The hook takes an optional name
 *   for the reading component, which sharpens the error where the stack alone
 *   is not obvious.
 */
// @__NO_SIDE_EFFECTS__
export const createStrictContext = <T>(
  providerName: string,
): readonly [Context<T>, (consumerName?: string) => T] => {
  // A context must have a default, and any real value would be
  // indistinguishable from a provider supplying it. The symbol never leaves
  // this module, which is what makes the cast below sound.
  const StrictContext = createContext<T | typeof missing>(missing);
  StrictContext.displayName = `${providerName}Context`;

  const useStrictContext = (consumerName?: string) => {
    const value = use(StrictContext);

    if (value === missing) {
      const error = new Error(
        `${consumerName ?? `${providerName}Context`} must be used within <${providerName}>`,
      );
      error.name = 'ContextError';
      // Starts the trace at the calling component instead of inside this hook.
      (Error as StackTraceCapture).captureStackTrace?.(error, useStrictContext);
      throw error;
    }

    return value;
  };

  return [StrictContext as Context<T>, useStrictContext];
};
