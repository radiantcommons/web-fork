# @penumbra-zone/storage

## 62.0.0

### Patch Changes

- Updated dependencies [4657582]
  - @penumbra-zone/types@36.0.0
  - @penumbra-zone/wasm@53.0.0

## 61.0.0

### Major Changes

- f1e701a: storage and wasm support for encrypted LP metadata

### Patch Changes

- Updated dependencies [bdb700d]
- Updated dependencies [f1e701a]
  - @penumbra-zone/types@35.0.0
  - @penumbra-zone/protobuf@11.0.0
  - @penumbra-zone/wasm@52.0.0
  - @penumbra-zone/bech32m@18.0.0
  - @penumbra-zone/getters@28.0.0

## 60.0.1

### Patch Changes

- 82d034e: fix publish workflow
- Updated dependencies [82d034e]
  - @penumbra-zone/bech32m@17.0.1
  - @penumbra-zone/getters@27.0.1
  - @penumbra-zone/protobuf@10.1.1
  - @penumbra-zone/types@34.2.1
  - @penumbra-zone/wasm@51.0.1

## 60.0.0

### Patch Changes

- Updated dependencies [6de12ea]
- Updated dependencies [61270de]
  - @penumbra-zone/wasm@51.0.0

## 59.0.0

### Minor Changes

- 6779599: don't specicy auto increment key

### Patch Changes

- Updated dependencies [cee8150]
  - @penumbra-zone/types@34.2.0
  - @penumbra-zone/wasm@50.0.0

## 58.0.0

### Minor Changes

- ec85373: storage helper to save remote epoch

### Patch Changes

- Updated dependencies [ec85373]
  - @penumbra-zone/types@34.1.0
  - @penumbra-zone/wasm@49.0.0

## 57.0.0

### Minor Changes

- dc1eb8b: tct frontier support for freshly generated wallets

### Patch Changes

- Updated dependencies [dc1eb8b]
- Updated dependencies [f9cd9dd]
  - @penumbra-zone/protobuf@10.1.0
  - @penumbra-zone/types@34.0.0
  - @penumbra-zone/wasm@48.0.0
  - @penumbra-zone/bech32m@17.0.0
  - @penumbra-zone/getters@27.0.0

## 56.0.0

### Minor Changes

- 085e855: use asset id instead of metadata in liquidity tournament idb table

### Patch Changes

- Updated dependencies [085e855]
  - @penumbra-zone/types@33.1.0
  - @penumbra-zone/wasm@47.0.0

## 55.1.0

### Minor Changes

- 694319c: bump registry version

## 55.0.0

### Minor Changes

- 93f1d05: proto and storage changes to support querying tournament votes

### Patch Changes

- Updated dependencies [93f1d05]
  - @penumbra-zone/protobuf@10.0.0
  - @penumbra-zone/types@33.0.0
  - @penumbra-zone/wasm@46.0.0
  - @penumbra-zone/bech32m@16.0.0
  - @penumbra-zone/getters@26.0.0

## 54.0.0

### Patch Changes

- Updated dependencies [43249b0]
  - @penumbra-zone/wasm@45.1.0

## 53.0.2

### Patch Changes

- @penumbra-zone/wasm@45.0.2

## 53.0.1

### Patch Changes

- Updated dependencies [405b5b1]
  - @penumbra-zone/getters@25.0.1
  - @penumbra-zone/types@32.2.1
  - @penumbra-zone/wasm@45.0.1

## 53.0.0

### Patch Changes

- Updated dependencies [ce4c43e]
  - @penumbra-zone/types@32.2.0
  - @penumbra-zone/wasm@45.0.0

## 52.0.0

### Patch Changes

- Updated dependencies [b0e0eef]
- Updated dependencies [5c45f2c]
- Updated dependencies [85022e1]
- Updated dependencies [3c48120]
  - @penumbra-zone/types@32.1.0
  - @penumbra-zone/wasm@44.0.0

## 51.0.0

### Patch Changes

- Updated dependencies [62a7767]
  - @penumbra-zone/wasm@43.1.0

## 50.0.0

### Minor Changes

- 15d768f: transaction summary support for transaction info rpc

### Patch Changes

- Updated dependencies [15d768f]
  - @penumbra-zone/protobuf@9.0.0
  - @penumbra-zone/types@32.0.0
  - @penumbra-zone/wasm@43.0.0
  - @penumbra-zone/bech32m@15.0.0
  - @penumbra-zone/getters@25.0.0

## 49.0.0

### Patch Changes

- Updated dependencies [d0cc2ee]
  - @penumbra-zone/getters@24.1.0
  - @penumbra-zone/types@31.0.0
  - @penumbra-zone/wasm@42.0.0

## 48.0.0

### Major Changes

- 49ae3ab: LQT integration in web packages

### Patch Changes

- Updated dependencies [49ae3ab]
  - @penumbra-zone/protobuf@8.0.0
  - @penumbra-zone/types@30.0.0
  - @penumbra-zone/wasm@41.0.0
  - @penumbra-zone/bech32m@14.0.0
  - @penumbra-zone/getters@24.0.0

## 47.0.1

### Patch Changes

- 4a883bf: bump registry versions in web packages

## 47.0.0

### Major Changes

- e51bc61: transaction table indexes by height and save txp and txv in indexdb

### Patch Changes

- Updated dependencies [e51bc61]
  - @penumbra-zone/types@29.1.0
  - @penumbra-zone/wasm@40.0.0

## 46.0.0

### Patch Changes

- Updated dependencies [68b8f36]
  - @penumbra-zone/protobuf@7.2.0
  - @penumbra-zone/bech32m@13.0.0
  - @penumbra-zone/getters@23.0.0
  - @penumbra-zone/types@29.0.0
  - @penumbra-zone/wasm@39.0.0

## 45.0.0

### Major Changes

- 29dd11a: - storage: add subaccount filter to `getOwnedPositionIds` method
  - protobuf: sync latest changes in penumbra protobufs
  - services: add subaccount filter to `ownedPositionIds` method in ViewService
  - types: update indexedDB schema

### Minor Changes

- 6869c52: extend alternative fees to LPs

### Patch Changes

- Updated dependencies [6869c52]
- Updated dependencies [29dd11a]
  - @penumbra-zone/types@28.0.0
  - @penumbra-zone/protobuf@7.1.0
  - @penumbra-zone/wasm@38.0.0
  - @penumbra-zone/bech32m@12.0.0
  - @penumbra-zone/getters@22.0.0

## 44.0.0

### Patch Changes

- Updated dependencies [fd4f34a]
  - @penumbra-zone/wasm@37.1.0

## 43.0.0

### Patch Changes

- Updated dependencies [ebc58d2]
  - @penumbra-zone/types@27.1.0
  - @penumbra-zone/wasm@37.0.0

## 42.0.0

### Patch Changes

- Updated dependencies [95d5fd9]
  - @penumbra-zone/protobuf@7.0.0
  - @penumbra-zone/bech32m@11.0.0
  - @penumbra-zone/types@27.0.0
  - @penumbra-zone/wasm@36.0.0
  - @penumbra-zone/getters@21.0.0

## 41.0.0

### Patch Changes

- Updated dependencies [d619836]
  - @penumbra-zone/types@26.4.0
  - @penumbra-zone/wasm@35.0.0

## 40.0.0

### Patch Changes

- Updated dependencies [712e7b1]
  - @penumbra-zone/types@26.3.0
  - @penumbra-zone/wasm@34.0.0

## 39.0.0

### Patch Changes

- Updated dependencies [838de8a]
- Updated dependencies [ccbe3a5]
  - @penumbra-zone/types@26.2.1
  - @penumbra-zone/wasm@33.1.0

## 38.0.0

### Patch Changes

- Updated dependencies [291bc7d]
  - @penumbra-zone/types@26.2.0
  - @penumbra-zone/wasm@33.0.0

## 37.0.0

### Patch Changes

- Updated dependencies [fa39e46]
  - @penumbra-zone/wasm@32.1.0

## 36.0.1

### Patch Changes

- 6e3fc9d: Supporting forward compatible parsing of Metadata from remote registry

## 36.0.0

### Minor Changes

- b5d2922: send max feature

### Patch Changes

- Updated dependencies [b5d2922]
  - @penumbra-zone/types@26.1.0
  - @penumbra-zone/wasm@32.0.0

## 35.0.0

### Patch Changes

- Updated dependencies [3269282]
  - @penumbra-zone/protobuf@6.3.0
  - @penumbra-zone/bech32m@10.0.0
  - @penumbra-zone/getters@20.0.0
  - @penumbra-zone/types@26.0.0
  - @penumbra-zone/wasm@31.0.0

## 34.1.0

### Minor Changes

- 8c036f5: batching storage operations with promises

## 34.0.0

### Patch Changes

- Updated dependencies [48725e3]
  - @penumbra-zone/wasm@30.1.0

## 33.0.0

### Patch Changes

- Updated dependencies [e0db143]
- Updated dependencies [e543db4]
  - @penumbra-zone/wasm@30.0.0
  - @penumbra-zone/protobuf@6.2.0
  - @penumbra-zone/bech32m@9.0.0
  - @penumbra-zone/getters@19.0.0
  - @penumbra-zone/types@25.0.0

## 32.0.0

### Minor Changes

- 487e26d: perform idb genesis in the block processor

### Patch Changes

- Updated dependencies [735e22b]
  - @penumbra-zone/wasm@29.1.0

## 31.0.0

### Patch Changes

- b6e32f8: Bump registry version
- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
  - @penumbra-zone/protobuf@6.1.0
  - @penumbra-zone/bech32m@8.0.0
  - @penumbra-zone/wasm@29.0.0
  - @penumbra-zone/types@24.0.0
  - @penumbra-zone/getters@18.0.0

## 30.0.1

### Patch Changes

- e343d22: Version DB to 47
- f9b8c07: Bump registry version to v11.2

## 30.0.0

### Patch Changes

- Updated dependencies [3a5c074]
- Updated dependencies [3a5c074]
- Updated dependencies [990291f]
  - @penumbra-zone/getters@17.0.0
  - @penumbra-zone/wasm@28.0.0
  - @penumbra-zone/types@23.0.0

## 29.0.0

### Patch Changes

- Updated dependencies [e01d5f8]
  - @penumbra-zone/types@22.0.0
  - @penumbra-zone/wasm@27.0.0

## 28.0.0

### Patch Changes

- Updated dependencies [e7d0767]
  - @penumbra-zone/wasm@26.2.0

## 27.0.0

### Patch Changes

- e952e03: remove BSR dependencies, correctly specify @bufbuild and @connectrpc dependencies
- Updated dependencies [598d148]
  - @penumbra-zone/wasm@26.1.0

## 26.0.0

### Patch Changes

- Updated dependencies [f8730e9]
  - @penumbra-zone/getters@16.0.0
  - @penumbra-zone/types@21.0.0
  - @penumbra-zone/wasm@26.0.0

## 25.0.0

### Patch Changes

- Updated dependencies [49263c6]
  - @penumbra-zone/protobuf@6.0.0
  - @penumbra-zone/bech32m@7.0.0
  - @penumbra-zone/getters@15.0.0
  - @penumbra-zone/types@20.0.0
  - @penumbra-zone/wasm@25.0.0

## 24.0.0

### Minor Changes

- 10ef940: Updating to v0.80.0 bufbuild types

### Patch Changes

- Updated dependencies [10ef940]
  - @penumbra-zone/getters@14.0.0
  - @penumbra-zone/types@19.0.0
  - @penumbra-zone/wasm@24.0.0

## 23.0.0

### Minor Changes

- bd43d49: assert binary input dimensions
- bd43d49: require complete GasPrices input to saveGasPrices
- 807648a: Support viewing fresh state of jailed validators

### Patch Changes

- Updated dependencies [bd43d49]
- Updated dependencies [bd43d49]
- Updated dependencies [807648a]
  - @penumbra-zone/types@18.2.0
  - @penumbra-zone/getters@13.0.1
  - @penumbra-zone/wasm@23.0.0

## 22.0.0

### Patch Changes

- Updated dependencies [534a6ad]
  - @penumbra-zone/wasm@22.1.0

## 21.0.0

### Minor Changes

- f5bea48: fix source randomizer

### Patch Changes

- Updated dependencies [f5bea48]
  - @penumbra-zone/types@18.1.0
  - @penumbra-zone/wasm@22.0.0

## 20.0.0

### Minor Changes

- a9ffd2d: rework extractAltFee with fallback protections

### Patch Changes

- Updated dependencies [a9ffd2d]
  - @penumbra-zone/types@18.0.0
  - @penumbra-zone/wasm@21.0.0
  - @penumbra-zone/getters@13.0.0

## 19.0.0

### Minor Changes

- 955dbf2: Bump idb version so del vote tokens show up correctly in storage
- Update registry dep

### Patch Changes

- Updated dependencies [318690e]
  - @penumbra-zone/wasm@20.2.0

## 18.0.0

### Patch Changes

- Updated dependencies [3477bef]
- Updated dependencies [d6ce325]
  - @penumbra-zone/types@17.0.1
  - @penumbra-zone/wasm@20.1.0

## 17.0.0

### Patch Changes

- Updated dependencies [4e30796]
- Updated dependencies [86c1bbe]
  - @penumbra-zone/wasm@20.0.0
  - @penumbra-zone/getters@12.1.0
  - @penumbra-zone/types@17.0.0

## 16.0.0

### Patch Changes

- Updated dependencies [0233722]
  - @penumbra-zone/types@16.1.0
  - @penumbra-zone/wasm@19.0.0

## 15.0.0

### Patch Changes

- @penumbra-zone/getters@12.0.0
- @penumbra-zone/wasm@18.0.0
- @penumbra-zone/types@16.0.0

## 14.0.2

### Patch Changes

- 3aaead1: Move the "default" option in package.json exports field to the last
- Updated dependencies [3aaead1]
  - @penumbra-zone/types@15.1.1
  - @penumbra-zone/wasm@17.0.2

## 14.0.1

### Patch Changes

- Updated dependencies [1a57749]
  - @penumbra-zone/wasm@17.0.1

## 14.0.0

### Major Changes

- 877fb1f: use epochDuration as PRICE_RELEVANCE_THRESHOLD for delegation assets

### Minor Changes

- cbc2419: Storage: bump IDB version. UI: fix Dialog rendering on mobile screens. Minifront: fix metadata symbol truncation.
- 3b7a289: Utilize v10 remote registry methods

### Patch Changes

- Updated dependencies [83151cb]
- Updated dependencies [cbc2419]
- Updated dependencies [877fb1f]
- Updated dependencies [1011b3b]
- Updated dependencies [5641af2]
  - @penumbra-zone/wasm@17.0.0
  - @penumbra-zone/types@15.1.0

## 13.0.0

### Minor Changes

- fa798d9: Bufbuild + registry dep update

### Patch Changes

- Updated dependencies [fa798d9]
- Updated dependencies [fa798d9]
  - @penumbra-zone/wasm@16.0.0
  - @penumbra-zone/getters@11.0.0
  - @penumbra-zone/types@15.0.0

## 12.0.0

### Major Changes

- 28a48d7: Fixes for multi-asset fees

### Patch Changes

- Updated dependencies [28a48d7]
- Updated dependencies [28a48d7]
  - @penumbra-zone/wasm@15.0.0
  - @penumbra-zone/types@14.0.0

## 11.0.0

### Major Changes

- 43ccd96: Modify GasPrices storage to support multi-asset fees

### Minor Changes

- 8e68481: Update to v9.3.0 registry

### Patch Changes

- Updated dependencies [43ccd96]
  - @penumbra-zone/types@13.1.0
  - @penumbra-zone/wasm@14.0.0

## 10.0.0

### Patch Changes

- 3708e2c: include peer deps as dev deps
- Updated dependencies [3708e2c]
- Updated dependencies [af2d6b6]
- Updated dependencies [2f1c39f]
  - @penumbra-zone/bech32m@6.1.1
  - @penumbra-zone/getters@10.1.0
  - @penumbra-zone/types@13.0.0
  - @penumbra-zone/wasm@13.0.0

## 9.1.0

### Minor Changes

- bump @penumbra-labs/registry

## 9.0.0

### Minor Changes

- Synchronize published @buf deps

### Patch Changes

- Updated dependencies
  - @penumbra-zone/getters@10.0.0
  - @penumbra-zone/types@12.0.0
  - @penumbra-zone/wasm@12.0.0

## 8.0.0

### Major Changes

- bump registry

### Patch Changes

- Updated dependencies
  - @penumbra-zone/types@11.0.0
  - @penumbra-zone/wasm@11.0.0

## 7.1.0

### Minor Changes

- Bump registry

## 7.0.0

### Major Changes

- c555df7: switch to using IDB_VERSION defined inside the package

### Minor Changes

- 4161587: Update to latest bufbuild deps (v0.77.4)

### Patch Changes

- Updated dependencies [4161587]
- Updated dependencies [e207faa]
  - @penumbra-zone/getters@9.0.0
  - @penumbra-zone/types@10.0.0
  - @penumbra-zone/wasm@10.0.0

## 6.0.0

### Minor Changes

- 9b3f561: properly build esm relative paths

### Patch Changes

- Updated dependencies [9b3f561]
  - @penumbra-zone/bech32m@6.1.0
  - @penumbra-zone/getters@8.0.0
  - @penumbra-zone/types@9.0.0
  - @penumbra-zone/wasm@9.0.0

## 5.0.0

### Major Changes

- f067fab: reconfigure all package builds

### Patch Changes

- Updated dependencies [f067fab]
  - @penumbra-zone/bech32m@6.0.0
  - @penumbra-zone/getters@7.0.0
  - @penumbra-zone/types@8.0.0
  - @penumbra-zone/wasm@8.0.0

## 4.0.1

### Patch Changes

- Updated dependencies [a75256f]
- Updated dependencies [468ecc7]
- Updated dependencies [a75256f]
  - @penumbra-zone/bech32m@5.1.0
  - @penumbra-zone/getters@6.2.0
  - @penumbra-zone/crypto-web@3.0.11

## 4.0.0

### Major Changes

- 4012c48: remove chrome storage exports

### Minor Changes

- ab9d743: decouple service/rpc init
- e7d7ffc: 'chrome-extension': Add an onboarding screen for the default frontend selection

  '@penumbra-zone/storage': Remove the MINIFRONT_URL env usages

  '@penumbra-zone/ui': Don't show the image in SelectList.Option component if it is not passed

### Patch Changes

- adf3a28: Update to june 12 testnet registry
- Updated dependencies [6b06e04]
  - @penumbra-zone/getters@6.1.0
  - @penumbra-zone/crypto-web@3.0.10

## 3.4.3

### Patch Changes

- Updated dependencies [8fe4de6]
  - @penumbra-zone/bech32m@5.0.0
  - @penumbra-zone/getters@6.0.0
  - @penumbra-zone/crypto-web@3.0.9

## 3.4.2

### Patch Changes

- Updated dependencies [8b121ec]
  - @penumbra-zone/bech32m@4.0.0
  - @penumbra-zone/getters@5.0.0
  - @penumbra-zone/crypto-web@3.0.8

## 3.4.1

### Patch Changes

- a22d3a8: Update registry (noble/testnet channel update)

## 3.4.0

### Minor Changes

- 3ea1e6c: update buf types dependencies

### Patch Changes

- Updated dependencies [120b654]
- Updated dependencies [3ea1e6c]
  - @penumbra-zone/getters@4.1.0
  - @penumbra-zone/bech32m@3.2.0
  - @penumbra-zone/crypto-web@3.0.7

## 3.3.0

### Minor Changes

- e47a04e: Update registry to latest (fixes labs + adds starling)
- e4c9fce: Add features to handle auction withdrawals

### Patch Changes

- e35c6f7: Deps bumped to latest
- d6b8a23: Update registry
- Updated dependencies [146b48d]
- Updated dependencies [8ccaf30]
- Updated dependencies [8ccaf30]
- Updated dependencies [e35c6f7]
- Updated dependencies [cf63b30]
- Updated dependencies [8ccaf30]
  - @penumbra-zone/getters@4.0.0
  - @penumbra-zone/bech32m@3.1.1
  - @penumbra-zone/crypto-web@3.0.6

## 3.2.0

### Minor Changes

- v8.0.0 versioning and manifest

### Patch Changes

- 610a445: update osmosis channel for deimos-8
- Updated dependencies
  - @penumbra-zone/bech32m@3.1.0
  - @penumbra-zone/getters@3.0.2
  - @penumbra-zone/crypto-web@3.0.5

## 3.1.2

### Patch Changes

- Updated dependencies [8410d2f]
  - @penumbra-zone/bech32m@3.0.1
  - @penumbra-zone/getters@3.0.1
  - @penumbra-zone/crypto-web@3.0.4

## 3.1.1

### Patch Changes

- @penumbra-zone/crypto-web@3.0.3

## 3.1.0

### Minor Changes

- 55f31c9: Store sct positions of swaps

### Patch Changes

- Updated dependencies [3148375]
- Updated dependencies [fdd4303]
  - @penumbra-zone/constants@4.0.0
  - @penumbra-zone/getters@3.0.0
  - @penumbra-zone/bech32m@3.0.0
  - @penumbra-zone/crypto-web@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies [862283c]
  - @penumbra-zone/constants@3.0.0
  - @penumbra-zone/getters@2.0.1
  - @penumbra-zone/crypto-web@3.0.1

## 3.0.0

### Major Changes

- 76302da: Drop /src/ requirement for imports

### Patch Changes

- Updated dependencies [b4082b7]
  - @penumbra-zone/crypto-web@3.0.0

## 2.0.1

### Patch Changes

- 66c2407: v6.2.0 release

## 2.0.0

### Major Changes

- 929d278: barrel imports to facilitate better tree shaking

### Patch Changes

- 8933117: Account for changes to core
- Updated dependencies [8933117]
- Updated dependencies [929d278]
  - @penumbra-zone/constants@2.0.0
  - @penumbra-zone/getters@2.0.0
  - @penumbra-zone/bech32@2.0.0
  - @penumbra-zone/crypto-web@2.0.0

## 1.0.2

### Patch Changes

- Updated dependencies
  - @penumbra-zone/constants@1.1.0
  - @penumbra-zone/getters@1.1.0
  - @penumbra-zone/crypto-web@1.0.1
