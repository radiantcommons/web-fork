# @penumbra-zone/getters

## 28.0.0

### Patch Changes

- Updated dependencies [f1e701a]
  - @penumbra-zone/protobuf@11.0.0
  - @penumbra-zone/bech32m@18.0.0

## 27.0.1

### Patch Changes

- 82d034e: fix publish workflow
- Updated dependencies [82d034e]
  - @penumbra-zone/bech32m@17.0.1
  - @penumbra-zone/protobuf@10.1.1

## 27.0.0

### Patch Changes

- Updated dependencies [dc1eb8b]
  - @penumbra-zone/protobuf@10.1.0
  - @penumbra-zone/bech32m@17.0.0

## 26.0.0

### Patch Changes

- Updated dependencies [93f1d05]
  - @penumbra-zone/protobuf@10.0.0
  - @penumbra-zone/bech32m@16.0.0

## 25.0.1

### Patch Changes

- 405b5b1: Fix swap ActionViews not rendering values correctly

## 25.0.0

### Patch Changes

- Updated dependencies [15d768f]
  - @penumbra-zone/protobuf@9.0.0
  - @penumbra-zone/bech32m@15.0.0

## 24.1.0

### Minor Changes

- d0cc2ee: Implement `SwapClaim` action view

## 24.0.0

### Patch Changes

- Updated dependencies [49ae3ab]
  - @penumbra-zone/protobuf@8.0.0
  - @penumbra-zone/bech32m@14.0.0

## 23.0.0

### Patch Changes

- Updated dependencies [68b8f36]
  - @penumbra-zone/protobuf@7.2.0
  - @penumbra-zone/bech32m@13.0.0

## 22.0.0

### Patch Changes

- Updated dependencies [29dd11a]
  - @penumbra-zone/protobuf@7.1.0
  - @penumbra-zone/bech32m@12.0.0

## 21.0.0

### Patch Changes

- Updated dependencies [95d5fd9]
  - @penumbra-zone/protobuf@7.0.0
  - @penumbra-zone/bech32m@11.0.0

## 20.0.0

### Patch Changes

- Updated dependencies [3269282]
  - @penumbra-zone/protobuf@6.3.0
  - @penumbra-zone/bech32m@10.0.0

## 19.0.0

### Patch Changes

- Updated dependencies [e543db4]
  - @penumbra-zone/protobuf@6.2.0
  - @penumbra-zone/bech32m@9.0.0

## 18.0.0

### Patch Changes

- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
  - @penumbra-zone/protobuf@6.1.0
  - @penumbra-zone/bech32m@8.0.0

## 17.0.0

### Major Changes

- 3a5c074: don't export optional getters
- 3a5c074: improve getter type

## 16.0.0

### Major Changes

- f8730e9: Update asset ID getter; it no longer has a hardcoded Optional version

## 15.0.0

### Patch Changes

- Updated dependencies [49263c6]
  - @penumbra-zone/protobuf@6.0.0
  - @penumbra-zone/bech32m@7.0.0

## 14.0.0

### Minor Changes

- 10ef940: Updating to v0.80.0 bufbuild types

### Patch Changes

- Updated dependencies [10ef940]
  - @penumbra-zone/protobuf@5.7.0

## 13.0.1

### Patch Changes

- bd43d49: add export getAssetIdFromGasPrices

## 13.0.0

### Patch Changes

- Updated dependencies
  - @penumbra-zone/protobuf@5.6.0

## 12.1.0

### Minor Changes

- 86c1bbe: Add support for delegate vote action views

## 12.0.0

### Patch Changes

- Updated dependencies [22bf02c]
  - @penumbra-zone/protobuf@5.5.0

## 11.0.0

### Minor Changes

- fa798d9: Bufbuild + registry dep update

### Patch Changes

- Updated dependencies [fa798d9]
  - @penumbra-zone/protobuf@5.4.0

## 10.1.0

### Minor Changes

- af2d6b6: Update ZQuery to accept selectors; update minifront to take advantage of this feature

  ZQuery's `use[Name]()` hooks now accept an optional options object as their first argument, then pass any remaining arguments to the `fetch` function.

### Patch Changes

- 3708e2c: include peer deps as dev deps
- Updated dependencies [e9e1320]
- Updated dependencies [3708e2c]
  - @penumbra-zone/protobuf@5.3.1
  - @penumbra-zone/bech32m@6.1.1

## 10.0.0

### Minor Changes

- Synchronize published @buf deps

### Patch Changes

- Updated dependencies
  - @penumbra-zone/protobuf@5.3.0

## 9.0.0

### Minor Changes

- 4161587: Update to latest bufbuild deps (v0.77.4)

### Patch Changes

- Updated dependencies [4161587]
  - @penumbra-zone/protobuf@5.2.0

## 8.0.0

### Minor Changes

- 9b3f561: properly build esm relative paths

### Patch Changes

- Updated dependencies [9b3f561]
  - @penumbra-zone/protobuf@5.1.0
  - @penumbra-zone/bech32m@6.1.0

## 7.0.0

### Major Changes

- f067fab: reconfigure all package builds

### Patch Changes

- Updated dependencies [f067fab]
  - @penumbra-zone/protobuf@5.0.0
  - @penumbra-zone/bech32m@6.0.0

## 6.2.0

### Minor Changes

- 468ecc7: Allow calling .optional() at any point in a getter chain
- a75256f: Improve build processes in multiple packages within monorepo

### Patch Changes

- Updated dependencies [a75256f]
- Updated dependencies [a75256f]
  - @penumbra-zone/bech32m@5.1.0

## 6.1.0

### Minor Changes

- 6b06e04: Introduce ZQuery package and use throughout minifront

## 6.0.0

### Major Changes

- 8fe4de6: correct ordering of default export

### Patch Changes

- Updated dependencies [8fe4de6]
  - @penumbra-zone/bech32m@5.0.0

## 5.0.0

### Major Changes

- 8b121ec: change package exports to use 'default' field

### Patch Changes

- Updated dependencies [8b121ec]
  - @penumbra-zone/bech32m@4.0.0

## 4.1.0

### Minor Changes

- 120b654: Support estimates of outputs for auctions; redesign the estimate results part of the swap/auction UI
- 3ea1e6c: update buf types dependencies

### Patch Changes

- Updated dependencies [3ea1e6c]
  - @penumbra-zone/bech32m@3.2.0

## 4.0.0

### Major Changes

- 8ccaf30: remove /src/ segment of import path
- 8ccaf30: externalize dependencies

### Minor Changes

- 146b48d: Support GDAs
- cf63b30: Show swap routes in the UI; extract a <TokenSwapInput /> component.

### Patch Changes

- 8ccaf30: readme update recommending bsr
- e35c6f7: Deps bumped to latest
- Updated dependencies [e35c6f7]
  - @penumbra-zone/bech32m@3.1.1

## 3.0.2

### Patch Changes

- Updated dependencies
  - @penumbra-zone/bech32m@3.1.0

## 3.0.1

### Patch Changes

- Updated dependencies [8410d2f]
  - @penumbra-zone/bech32m@3.0.1

## 3.0.0

### Major Changes

- 3148375: remove `/src/` path segment from exports

### Patch Changes

- Updated dependencies [3148375]
- Updated dependencies [fdd4303]
  - @penumbra-zone/constants@4.0.0
  - @penumbra-zone/bech32m@3.0.0

## 2.0.1

### Patch Changes

- Updated dependencies [862283c]
  - @penumbra-zone/constants@3.0.0

## 2.0.0

### Major Changes

- 929d278: barrel imports to facilitate better tree shaking

### Patch Changes

- Updated dependencies [8933117]
- Updated dependencies [929d278]
  - @penumbra-zone/constants@2.0.0
  - @penumbra-zone/bech32@2.0.0

## 1.1.0

### Minor Changes

- Initial changest. Git tag v5.0.0 updates.

### Patch Changes

- Updated dependencies
  - @penumbra-zone/constants@1.1.0
