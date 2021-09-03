# PostCSS Var Fallback

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
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-var-fallback
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
+   require('postcss-var-fallback'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
