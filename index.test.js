const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('does something', async () => {
  const inputCSS = `
  a {
    color: var(--color, #ffffff);
  }
  `;

  const expectedOuput = `
  a {
    color: #ffffff;
    color: var(--color, #ffffff);
  }
  `;

  await run(inputCSS, expectedOuput, { })
})
