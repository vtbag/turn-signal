---
'@vtbag/turn-signal': major
---

Adds support for browsers with native cross-document view transitions that don't support Navigation API.
Looking at you, Safari! See [update instructions](https://vtbag.dev/tools/turn-signal/update).
Also adds the `link-types` script that let's you annotate view transition types at `<a>` elements by adding the `data-vtbag-link-types` attributes.

```html
<a href="..." data-vtbag-link-types="forward types/backward types">
```

For Details on how to use the scripts see the [documentation](https://vtbag.dev/tools/turn-signal/).