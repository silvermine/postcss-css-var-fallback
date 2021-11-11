'use strict';


// Capture everything within var() https://regex101.com/r/7UYMv8/1
const INSIDE_PAREN_REGEX = new RegExp(/var\(([^()]*\([^)]*\)|[^)]*)\)/);

// Capture everything from first comma to end of string
const CSS_VAR_FALLBACK_REGEX = new RegExp(/,(.*$)/);

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

function getCSSVarFallbackValue(value) {
   const cssVarParams = value.match(INSIDE_PAREN_REGEX),
         rawFallbackValue = cssVarParams[1].match(CSS_VAR_FALLBACK_REGEX);

   if (rawFallbackValue !== null) {
      return rawFallbackValue[1].trim();
   }
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
