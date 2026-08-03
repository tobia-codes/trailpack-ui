import { globalLayer } from '@vanilla-extract/css';

/**
 * The cascade layer everything Trailpack ships sits in. An app's own CSS is
 * unlayered and therefore always wins, whatever its specificity and wherever
 * its stylesheet lands — which is what makes a `className` on a component
 * worth passing.
 *
 * The names are global rather than hashed because an app using layers of its
 * own has to be able to write this one down: `@layer trailpack, base,
 * utilities;` is how it decides where we sit relative to Tailwind.
 */
export const rootLayer = globalLayer('trailpack');

/**
 * Layer for what this package emits: the token declarations on `:root` and on
 * the dark theme class. Not exported from the package — a consumer adding
 * declarations of their own wants them unlayered, so they win over these, and a
 * package building on the tokens declares its own sublayer under `rootLayer`
 * rather than writing into this one.
 *
 * The order between such sublayers is nobody's business here: two of them that
 * declare different properties on different elements never decide anything
 * against each other.
 */
export const themeLayer = globalLayer({ parent: rootLayer }, 'theme');
