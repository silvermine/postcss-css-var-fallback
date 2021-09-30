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

               let getCSSVarFallbackValue,
                   cssVarFallbackValue;

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
                  decl.cloneBefore({ prop: cssPropertyValue, value: cssVarFallbackValue });
               }
            }
         });
      },
   };
};

module.exports.postcss = true;
