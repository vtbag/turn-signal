# @vtbag/turn-signal

## 1.2.0 - 2024-12-11

### Minor Changes

- 5feccc0: link-types: assign view transition types directly to the links that trigger navigation!

## 1.1.0 - 2024-10-22

### Minor Changes

- 58b6a3a: Transition types and direction attributes are now also determined on the old page!
  And the additional `old` and `new` types tell you, where you are.
  One use case is to exclude elements from view transitions depending on the direction.
  With this change you can not only exclude or add the new images but also the old images!

## 1.0.3 - 2024-10-17

### Patch Changes

- 3de8989: Dependency updates
- 961b31e: Adds .d.ts declarations

## 1.0.2 - 2024-09-25

### Patch Changes

- 214b570: Fixes an issue where the scripts where not reexecuted when fetched from the bfcache.

## 1.0.1 - 2024-09-25

### Patch Changes

- 60db4dd: Fixes a bug where backward animations didn't work as advertised
- 83e2556: Removes debug logging

## 1.0.0 - 2024-09-25

### Major Changes

- 57b6b2f: First public version
