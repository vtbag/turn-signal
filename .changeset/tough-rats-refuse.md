---
'@vtbag/turn-signal': minor
---


This release adds the `link-types` script that let's you annotate view transition types at `<a>` elements by adding the `data-vtbag-link-types` attributes.

```html
<a href="..." data-vtbag-link-types="backward types/forward types">
```

For details on how to use the scripts see the [documentation](https://vtbag.dev/tools/turn-signal/).

This release also adds support for browsers that have native cross-document view transitions support but don't support the Navigation API. Looking at you, Safari!
