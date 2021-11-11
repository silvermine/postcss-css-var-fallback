'use strict';

// Capture everything within var() https://regex101.com/r/7UYMv8/1
const INSIDE_PAREN_REGEX = /var\(([^()]*\([^)]*\)|[^)]*)\)/g;

function shouldAddFallback(decl) {
   // `str.includes` is 3-5% faster than using RegEx matching for this expression
   if (!decl.value.includes('var(')) {
      return false;
   }

   const siblings = decl.parent.nodes.filter((n) => { return n.prop === decl.prop; });

   // If there is more than one CSS declaration for the same property, we assume that
   // the other declaration is either a fallback for this declaration, or it overrides
   // this declaration. In either case, we don't want to add a fallback.
   //
   // Of course, this assumption is not always true. We could have a style rule
   // that contains multiple declarations for the same property, but the property appears
   // first is not intended to be a fallback:
   //
   // .sloppy {
   //    color: var(--defaultTextColor);
   //    color: var(--overrideTextColor);
   // }
   //
   // For the sake of simplicity and performance, we do not account for this case. In the
   // above example, this plugin will not add any fallbacks.
   return siblings.length === 1;
}

function getCSSVarFallbackValue(cssDeclValue) {
   let fallbackValue = cssDeclValue;

   // Here's an example string value for `cssDeclValue` to use when thinking about what
   // this function does:
   //
   // `linear-gradient(to left, var(--color1, #4a6da7) 0%, var(--color2, #474747) 100%)`
   //
   const cssVarParams = Array.from(cssDeclValue.matchAll(INSIDE_PAREN_REGEX));

   /* eslint-disable max-len */
   // cssVarParams is an array of RegEx matches:
   // [
   //    [
   //       'var(--color1, #4a6da7)',
   //       '--color1, #4a6da7',
   //       index: 43,
   //       input: 'linear-gradient(to left, var(--color1, #4a6da7) 0%, var(--color2, #474747) 100%)',
   //       groups: undefined
   //    ],
   //    ...
   // ]
   /* eslint-enable max-len */
   if (cssVarParams.length === 0) {
      return undefined;
   }

   for (const varParamMatch of cssVarParams) {
      const rawFallbackValue = varParamMatch[1].match(/,(.*$)/);
      // varParamMatch[1] = '--color1, #4a6da7' for example. So, rawFallbackValue is:
      // [
      //    ', #4a6da7',
      //    ' #4a6da7',
      //    index: 8,
      //    input: '--color1, #4a6da7',
      //    groups: undefined
      // ]

      if (rawFallbackValue !== null) {
         /* eslint-disable max-len */
         // If the CSS var statement has a fallback value, replace the var statement
         // with the fallback value. For example, this operation turns:
         //
         // linear-gradient(to left, var(--color1, #4a6da7) 0%, var(--color2, #474747) 100%)
         //
         // into:
         //
         // linear-gradient(to left, #4a6da7 0%, var(--color2, #474747) 100%)
         /* eslint-disable max-len */
         fallbackValue = fallbackValue.replace(varParamMatch[0], rawFallbackValue[1].trim());
      }
   }

   if (fallbackValue === cssDeclValue) {
      return undefined;
   }

   return fallbackValue;
}

module.exports = () => {

   return {
      postcssPlugin: 'postcss-css-var-fallback',

      Root(root) {
         root.walkDecls((decl) => {
            if (!shouldAddFallback(decl)) {
               return;
            }

            const cssVarFallbackValue = getCSSVarFallbackValue(decl.value);

            if (cssVarFallbackValue) {
               const cssFallbackRule = { prop: decl.prop, value: cssVarFallbackValue };

               decl.cloneBefore(cssFallbackRule);
            }
         });
      },
   };
};

module.exports.postcss = true;
