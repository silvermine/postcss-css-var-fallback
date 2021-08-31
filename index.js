module.exports = (opts = { }) => {

  // Work with options here

  console.log('What are my opts?', opts);

  return {
    postcssPlugin: 'postcss-var-fallback',

    // Root (root) {
    //   // Transform CSS AST here
    //   console.log('Whats in root?', root);
    // },

    Rule (decl) {
      const getCSSVarValue = decl.nodes.find(node => {
        return node.value.match(/var\(/i)
      });

      if (getCSSVarValue) {
        console.log('Matching in rule?', getCSSVarValue);
      }

    },
  }
}
module.exports.postcss = true
