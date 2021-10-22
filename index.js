'use strict';

module.exports = () => {

   return {
      postcssPlugin: 'postcss-css-var-fallback',

      Root(root) {
         root.walkDecls((decl) => {

            // Capture declarations with include var()
            const cssVarRegEx = new RegExp(/var\(/);

            if (decl.value.match(cssVarRegEx)) {

               const cssPropertyValue = decl.prop;

               let declarationRawLines,
                   getCSSVarFallbackValue,
                   cssVarFallbackValue;

               declarationRawLines = decl
                  .source
                  .input
                  .css
                  .split('\n') // Splits on newlines to create a list of all the lines in the declaration.
                  .map((line) => {
                     // Strip out any spaces from the raw incoming statement.
                     // We can use this for comparison when we build the fallback rule.
                     return line.replace(/\s+/g, '');
                  });

               getCSSVarFallbackValue = (value) => {
                  // Capture everything within var() https://regex101.com/r/7UYMv8/1
                  const insideParenRegEx = new RegExp(/var\(([^()]*\([^)]*\)|[^)]*)\)/);

                  // Capture everything from first comma to end of string
                  const cssVarFallbackRegEx = new RegExp(/,(.*$)/);

                  const cssVarParams = value.match(insideParenRegEx);

                  const rawFallbackValue = cssVarParams[1].match(cssVarFallbackRegEx);

                  if (rawFallbackValue !== null) {
                     return rawFallbackValue[1].trim();
                  }
               };

               cssVarFallbackValue = getCSSVarFallbackValue(decl.value);

               if (cssVarFallbackValue) {
                  const cssFallbackRule = { prop: cssPropertyValue, value: cssVarFallbackValue };

                  // If a fallback value is already in the statement,
                  // skip insertion of the fallback.
                  if (declarationRawLines.indexOf(`${cssFallbackRule.prop}:${cssFallbackRule.value};`) > -1) {
                     return;
                  }

                  decl.cloneBefore(cssFallbackRule);
               }
            }
         });
      },
   };
};

module.exports.postcss = true;
