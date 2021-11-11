# PostCSS CSS Var Fallback

[![NPM Version](https://img.shields.io/npm/v/@silvermine/postcss-css-var-fallback.svg)](https://www.npmjs.com/package/@silvermine/postcss-css-var-fallback)
[![License](https://img.shields.io/github/license/silvermine/postcss-css-var-fallback.svg)](./LICENSE)
[![Build Status](https://travis-ci.com/silvermine/postcss-css-var-fallback.svg?branch=main)](https://travis-ci.com/silvermine/postcss-css-var-fallback)
[![Coverage Status](https://api.travis-ci.com/silvermine/postcss-css-var-fallback.svg?branch=main)](https://coveralls.io/github/silvermine/postcss-css-var-fallback?branch=main)
[![Dependency Status](https://david-dm.org/silvermine/postcss-css-var-fallback.svg)](https://david-dm.org/silvermine/postcss-css-var-fallback)
[![Dev Dependency Status](https://david-dm.org/silvermine/postcss-css-var-fallback/dev-status.svg)](https://david-dm.org/silvermine/postcss-css-var-fallback#info=devDependencies&view=table)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

[PostCSS] plugin to insert fallbacks for CSS vars.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
   /* Input example */
   color: var(--color, #4a6da7);
}
```

```css
.foo {
   /* Output example */
   color: #4a6da7;
   color: var(--color, #4a6da7);
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss @silvermine/postcss-css-var-fallback
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('@silvermine/postcss-css-var-fallback'),
    require('autoprefixer')
  ]
}
```

## Limitations

Be aware that this plugin does not add a fallback for declarations with `var` statements
when there is more than one declaration for a given CSS property in a single rule.

For example, this plugin will not add a fallback for the `var` statement in this case:

```css
.example {
   color: red;
   color: var(--textColor, #333);
}
```

The plugin assumes that the previous `color: red` declaration is a fallback. This prevents
the plugin from having to parse the `var(--textColor, #333)` statement and compare the
fallback there with any other `color:` declaration values. We found that such a check
impacted performance enough that it was not worth the cost.

To avoid incorrect or missing fallbacks, ensure that the CSS that you write does not have
extraneous/duplicate declarations for the same CSS property.

[official docs]: https://github.com/postcss/postcss#usage
