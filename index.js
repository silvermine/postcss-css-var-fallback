'use strict';

// Capture the fallback value within var() statements https://regex101.com/r/XPqn0X/1
const FALLBACK_VALUE_REGEX = /var\(\s*--[\w-]+\s*,([^)]*\)|[^)]*)\s*\)/g;

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

function getFallbackValue(cssDeclValue) {
   let cssDeclFallbackValue = cssDeclValue;

   // Here's an example string value for `cssDeclValue` to use when thinking about what
   // this function does:
   //
   // `linear-gradient(to left, var(--color1, #4a6da7) 0%, var(--color2, #474747) 100%)`

   const fallbackValues = Array.from(cssDeclValue.matchAll(FALLBACK_VALUE_REGEX));

   /* eslint-disable max-len */
   // fallbackValues is an array of RegEx matches:
   // [
   //    [
   //       'var(--color1, #4a6da7)',
   //       '#4a6da7',
   //       index: 43,
   //       input: 'linear-gradient(to left, var(--color1, #4a6da7) 0%, var(--color2, #474747) 100%)',
   //       groups: undefined
   //    ],
   //    ...
   // ]
   /* eslint-enable max-len */
   if (fallbackValues.length === 0) {
      return undefined;
   }

   for (const fallbackValueMatch of fallbackValues) {
      // Replace the var statement with the fallback value. For example, this operation
      // turns:
      //
      // linear-gradient(to left, var(--color1, #4a6da7) 0%, var(--color2, #474747) 100%)
      //
      // into:
      //
      // linear-gradient(to left, #4a6da7 0%, var(--color2, #474747) 100%)
      cssDeclFallbackValue = cssDeclFallbackValue.replace(fallbackValueMatch[0], fallbackValueMatch[1].trim());
   }

   if (cssDeclFallbackValue === cssDeclValue) {
      return undefined;
   }

   return cssDeclFallbackValue;
}

module.exports = () => {

   return {
      postcssPlugin: 'postcss-css-var-fallback',

      Root(root) {
         root.walkDecls((decl) => {
            if (!shouldAddFallback(decl)) {
               return;
            }

            const fallbackValue = getFallbackValue(decl.value);

            if (fallbackValue) {
               const cssFallbackRule = { prop: decl.prop, value: fallbackValue };

               decl.cloneBefore(cssFallbackRule);
            }
         });
      },
   };
};

module.exports.postcss = true;
