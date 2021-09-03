// Disabling this jest eslint rule since our expects are wrapped up
// in the `run()` function.
/* eslint-disable jest/expect-expect */
'use strict';

const postcss = require('postcss');

const plugin = require('./');

async function run(input, output, opts = {}) {
   let result = await postcss([ plugin(opts) ]).process(input, { from: undefined });

   expect(result.css).toEqual(output);
   expect(result.warnings()).toHaveLength(0);
}

it('does something', async () => {
   const inputCSS = `
  a {
    color: #ffffff;
  }
  `;

   const expectedOuput = `
  a {
    color: #ffffff;
  }
  `;

   await run(inputCSS, expectedOuput, {});
});
