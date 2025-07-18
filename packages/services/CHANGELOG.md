# @penumbra-zone/router

## 69.0.0

### Patch Changes

- Updated dependencies [4657582]
  - @penumbra-zone/types@36.0.0
  - @penumbra-zone/crypto-web@48.0.0
  - @penumbra-zone/storage@62.0.0
  - @penumbra-zone/wasm@53.0.0

## 68.0.0

### Major Changes

- f1e701a: storage and wasm support for encrypted LP metadata

### Patch Changes

- Updated dependencies [bdb700d]
- Updated dependencies [f1e701a]
  - @penumbra-zone/types@35.0.0
  - @penumbra-zone/protobuf@11.0.0
  - @penumbra-zone/storage@61.0.0
  - @penumbra-zone/wasm@52.0.0
  - @penumbra-zone/crypto-web@47.0.0
  - @penumbra-zone/bech32m@18.0.0
  - @penumbra-zone/getters@28.0.0

## 67.0.1

### Patch Changes

- 82d034e: fix publish workflow
- Updated dependencies [82d034e]
  - @penumbra-zone/bech32m@17.0.1
  - @penumbra-zone/crypto-web@46.0.1
  - @penumbra-zone/getters@27.0.1
  - @penumbra-zone/protobuf@10.1.1
  - @penumbra-zone/storage@60.0.1
  - @penumbra-zone/transport-dom@7.5.2
  - @penumbra-zone/types@34.2.1
  - @penumbra-zone/wasm@51.0.1

## 67.0.0

### Patch Changes

- 6de12ea: Make the view service request for mapping indices to addresses take the randomizer into account.

  The WASM package has a breaking change in that the `get_address_by_index` function now
  _requires_ you to pass a randomizer.
  This can be an empty slice, indicating a randomizer consistent of all 0s.
  Clients should upgrade by adding a `&[]` parameter, which will preserve their current behavior.

- 15e5380: use type-correct mock in tests
- Updated dependencies [6de12ea]
- Updated dependencies [61270de]
  - @penumbra-zone/wasm@51.0.0
  - @penumbra-zone/storage@60.0.0

## 66.0.0

### Patch Changes

- Updated dependencies [6779599]
- Updated dependencies [cee8150]
  - @penumbra-zone/storage@59.0.0
  - @penumbra-zone/types@34.2.0
  - @penumbra-zone/crypto-web@46.0.0
  - @penumbra-zone/wasm@50.0.0

## 65.0.0

### Patch Changes

- Updated dependencies [ec85373]
  - @penumbra-zone/storage@58.0.0
  - @penumbra-zone/types@34.1.0
  - @penumbra-zone/crypto-web@45.0.0
  - @penumbra-zone/wasm@49.0.0

## 64.0.0

### Major Changes

- dc1eb8b: tct frontier support for freshly generated wallets

### Patch Changes

- Updated dependencies [dc1eb8b]
- Updated dependencies [f9cd9dd]
  - @penumbra-zone/protobuf@10.1.0
  - @penumbra-zone/storage@57.0.0
  - @penumbra-zone/types@34.0.0
  - @penumbra-zone/wasm@48.0.0
  - @penumbra-zone/bech32m@17.0.0
  - @penumbra-zone/getters@27.0.0
  - @penumbra-zone/crypto-web@44.0.0

## 63.0.0

### Minor Changes

- 085e855: use asset id instead of metadata in liquidity tournament idb table

### Patch Changes

- Updated dependencies [085e855]
  - @penumbra-zone/storage@56.0.0
  - @penumbra-zone/types@33.1.0
  - @penumbra-zone/crypto-web@43.0.0
  - @penumbra-zone/wasm@47.0.0

## 62.0.0

### Patch Changes

- Updated dependencies [694319c]
  - @penumbra-zone/storage@55.1.0

## 61.0.0

### Minor Changes

- 93f1d05: proto and storage changes to support querying tournament votes

### Patch Changes

- Updated dependencies [93f1d05]
  - @penumbra-zone/protobuf@10.0.0
  - @penumbra-zone/storage@55.0.0
  - @penumbra-zone/types@33.0.0
  - @penumbra-zone/wasm@46.0.0
  - @penumbra-zone/bech32m@16.0.0
  - @penumbra-zone/getters@26.0.0
  - @penumbra-zone/crypto-web@42.0.0

## 60.0.0

### Patch Changes

- Updated dependencies [43249b0]
  - @penumbra-zone/wasm@45.1.0
  - @penumbra-zone/storage@54.0.0

## 59.1.0

### Minor Changes

- 7131df9: implement StakeService.validatorStatus

### Patch Changes

- @penumbra-zone/wasm@45.0.2
- @penumbra-zone/storage@53.0.2

## 59.0.1

### Patch Changes

- Updated dependencies [405b5b1]
  - @penumbra-zone/getters@25.0.1
  - @penumbra-zone/types@32.2.1
  - @penumbra-zone/storage@53.0.1
  - @penumbra-zone/crypto-web@41.0.1
  - @penumbra-zone/wasm@45.0.1

## 59.0.0

### Patch Changes

- Updated dependencies [ce4c43e]
  - @penumbra-zone/types@32.2.0
  - @penumbra-zone/crypto-web@41.0.0
  - @penumbra-zone/storage@53.0.0
  - @penumbra-zone/wasm@45.0.0

## 58.0.0

### Minor Changes

- f2f8fb2: add 'already_voted' field to LQT view service implementation

### Patch Changes

- Updated dependencies [b0e0eef]
- Updated dependencies [5c45f2c]
- Updated dependencies [85022e1]
- Updated dependencies [3c48120]
  - @penumbra-zone/types@32.1.0
  - @penumbra-zone/crypto-web@40.0.0
  - @penumbra-zone/storage@52.0.0
  - @penumbra-zone/wasm@44.0.0

## 57.0.0

### Patch Changes

- Updated dependencies [62a7767]
  - @penumbra-zone/wasm@43.1.0
  - @penumbra-zone/storage@51.0.0

## 56.0.0

### Minor Changes

- 15d768f: transaction summary support for transaction info rpc

### Patch Changes

- Updated dependencies [521caaa]
- Updated dependencies [a51a752]
- Updated dependencies [521caaa]
- Updated dependencies [ca71c02]
- Updated dependencies [a11bfe3]
- Updated dependencies [15d768f]
  - @penumbra-zone/transport-dom@7.5.1
  - @penumbra-zone/protobuf@9.0.0
  - @penumbra-zone/storage@50.0.0
  - @penumbra-zone/types@32.0.0
  - @penumbra-zone/wasm@43.0.0
  - @penumbra-zone/bech32m@15.0.0
  - @penumbra-zone/getters@25.0.0
  - @penumbra-zone/crypto-web@39.0.0

## 55.0.0

### Patch Changes

- Updated dependencies [d0cc2ee]
  - @penumbra-zone/getters@24.1.0
  - @penumbra-zone/storage@49.0.0
  - @penumbra-zone/types@31.0.0
  - @penumbra-zone/crypto-web@38.0.0
  - @penumbra-zone/wasm@42.0.0

## 54.0.0

### Major Changes

- 49ae3ab: LQT integration in web packages

### Patch Changes

- Updated dependencies [49ae3ab]
  - @penumbra-zone/protobuf@8.0.0
  - @penumbra-zone/storage@48.0.0
  - @penumbra-zone/types@30.0.0
  - @penumbra-zone/wasm@41.0.0
  - @penumbra-zone/bech32m@14.0.0
  - @penumbra-zone/getters@24.0.0
  - @penumbra-zone/crypto-web@37.0.0

## 53.0.1

### Patch Changes

- Updated dependencies [4a883bf]
  - @penumbra-zone/storage@47.0.1

## 53.0.0

### Minor Changes

- e51bc61: transaction table indexes by height and save txp and txv in indexdb

### Patch Changes

- Updated dependencies [e51bc61]
  - @penumbra-zone/storage@47.0.0
  - @penumbra-zone/types@29.1.0
  - @penumbra-zone/crypto-web@36.0.0
  - @penumbra-zone/wasm@40.0.0

## 52.0.0

### Patch Changes

- dd09e58: Fix latestSwaps method by picking initial swap block height instead of claim height
- Updated dependencies [68b8f36]
  - @penumbra-zone/protobuf@7.2.0
  - @penumbra-zone/bech32m@13.0.0
  - @penumbra-zone/getters@23.0.0
  - @penumbra-zone/storage@46.0.0
  - @penumbra-zone/types@29.0.0
  - @penumbra-zone/wasm@39.0.0
  - @penumbra-zone/crypto-web@35.0.0

## 51.0.0

### Major Changes

- 25a2c6b: add latestSwaps view server method

## 50.0.0

### Minor Changes

- 6869c52: extend alternative fees to LPs
- 29dd11a: - storage: add subaccount filter to `getOwnedPositionIds` method
  - protobuf: sync latest changes in penumbra protobufs
  - services: add subaccount filter to `ownedPositionIds` method in ViewService
  - types: update indexedDB schema

### Patch Changes

- Updated dependencies [6869c52]
- Updated dependencies [29dd11a]
  - @penumbra-zone/storage@45.0.0
  - @penumbra-zone/types@28.0.0
  - @penumbra-zone/protobuf@7.1.0
  - @penumbra-zone/crypto-web@34.0.0
  - @penumbra-zone/wasm@38.0.0
  - @penumbra-zone/bech32m@12.0.0
  - @penumbra-zone/getters@22.0.0

## 49.0.0

### Patch Changes

- Updated dependencies [fd4f34a]
  - @penumbra-zone/wasm@37.1.0
  - @penumbra-zone/storage@44.0.0

## 48.0.0

### Patch Changes

- Updated dependencies [ebc58d2]
  - @penumbra-zone/types@27.1.0
  - @penumbra-zone/crypto-web@33.0.0
  - @penumbra-zone/storage@43.0.0
  - @penumbra-zone/wasm@37.0.0

## 47.0.0

### Minor Changes

- 95d5fd9: support transparent addresses for usdc noble IBC withdrawals

### Patch Changes

- Updated dependencies [95d5fd9]
  - @penumbra-zone/protobuf@7.0.0
  - @penumbra-zone/bech32m@11.0.0
  - @penumbra-zone/types@27.0.0
  - @penumbra-zone/wasm@36.0.0
  - @penumbra-zone/getters@21.0.0
  - @penumbra-zone/storage@42.0.0
  - @penumbra-zone/crypto-web@32.0.0

## 46.0.0

### Patch Changes

- Updated dependencies [d619836]
  - @penumbra-zone/types@26.4.0
  - @penumbra-zone/crypto-web@31.0.0
  - @penumbra-zone/storage@41.0.0
  - @penumbra-zone/wasm@35.0.0

## 45.0.0

### Patch Changes

- Updated dependencies [712e7b1]
  - @penumbra-zone/types@26.3.0
  - @penumbra-zone/crypto-web@30.0.0
  - @penumbra-zone/storage@40.0.0
  - @penumbra-zone/wasm@34.0.0

## 44.0.0

### Patch Changes

- Updated dependencies [838de8a]
- Updated dependencies [ccbe3a5]
  - @penumbra-zone/types@26.2.1
  - @penumbra-zone/wasm@33.1.0
  - @penumbra-zone/crypto-web@29.0.1
  - @penumbra-zone/query@40.0.0
  - @penumbra-zone/storage@39.0.0

## 43.0.0

### Patch Changes

- Updated dependencies [291bc7d]
  - @penumbra-zone/types@26.2.0
  - @penumbra-zone/crypto-web@29.0.0
  - @penumbra-zone/query@39.0.0
  - @penumbra-zone/storage@38.0.0
  - @penumbra-zone/wasm@33.0.0

## 42.0.0

### Patch Changes

- Updated dependencies [fa39e46]
  - @penumbra-zone/wasm@32.1.0
  - @penumbra-zone/query@38.0.0
  - @penumbra-zone/storage@37.0.0

## 41.0.1

### Patch Changes

- Updated dependencies [6e3fc9d]
  - @penumbra-zone/storage@36.0.1

## 41.0.0

### Minor Changes

- b5d2922: send max feature

### Patch Changes

- Updated dependencies [b5d2922]
  - @penumbra-zone/storage@36.0.0
  - @penumbra-zone/types@26.1.0
  - @penumbra-zone/crypto-web@28.0.0
  - @penumbra-zone/query@37.0.0
  - @penumbra-zone/wasm@32.0.0

## 40.0.0

### Patch Changes

- Updated dependencies [3269282]
  - @penumbra-zone/protobuf@6.3.0
  - @penumbra-zone/bech32m@10.0.0
  - @penumbra-zone/getters@20.0.0
  - @penumbra-zone/query@36.0.0
  - @penumbra-zone/storage@35.0.0
  - @penumbra-zone/types@26.0.0
  - @penumbra-zone/wasm@31.0.0
  - @penumbra-zone/crypto-web@27.0.0

## 39.0.0

### Patch Changes

- Updated dependencies [8c036f5]
  - @penumbra-zone/storage@34.1.0
  - @penumbra-zone/query@35.1.0

## 38.0.0

### Patch Changes

- Updated dependencies [48725e3]
  - @penumbra-zone/wasm@30.1.0
  - @penumbra-zone/query@35.0.0
  - @penumbra-zone/storage@34.0.0

## 37.0.0

### Patch Changes

- Updated dependencies [e0db143]
- Updated dependencies [e543db4]
- Updated dependencies [8bf66ea]
  - @penumbra-zone/wasm@30.0.0
  - @penumbra-zone/protobuf@6.2.0
  - @penumbra-zone/query@34.0.0
  - @penumbra-zone/storage@33.0.0
  - @penumbra-zone/bech32m@9.0.0
  - @penumbra-zone/getters@19.0.0
  - @penumbra-zone/types@25.0.0
  - @penumbra-zone/crypto-web@26.0.0

## 36.0.0

### Patch Changes

- Updated dependencies [735e22b]
- Updated dependencies [487e26d]
  - @penumbra-zone/wasm@29.1.0
  - @penumbra-zone/storage@32.0.0
  - @penumbra-zone/query@33.0.0

## 35.0.0

### Patch Changes

- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
- Updated dependencies [b6e32f8]
  - @penumbra-zone/storage@31.0.0
  - @penumbra-zone/protobuf@6.1.0
  - @penumbra-zone/bech32m@8.0.0
  - @penumbra-zone/wasm@29.0.0
  - @penumbra-zone/query@32.0.0
  - @penumbra-zone/types@24.0.0
  - @penumbra-zone/getters@18.0.0
  - @penumbra-zone/crypto-web@25.0.0

## 34.0.1

### Patch Changes

- Updated dependencies [e343d22]
- Updated dependencies [f9b8c07]
- Updated dependencies [e343d22]
- Updated dependencies [e343d22]
  - @penumbra-zone/storage@30.0.1
  - @penumbra-zone/query@31.0.1

## 34.0.0

### Patch Changes

- Updated dependencies [3a5c074]
- Updated dependencies [3a5c074]
- Updated dependencies [990291f]
  - @penumbra-zone/getters@17.0.0
  - @penumbra-zone/wasm@28.0.0
  - @penumbra-zone/query@31.0.0
  - @penumbra-zone/storage@30.0.0
  - @penumbra-zone/types@23.0.0
  - @penumbra-zone/crypto-web@24.0.0

## 33.0.0

### Patch Changes

- Updated dependencies [e01d5f8]
  - @penumbra-zone/query@30.0.0
  - @penumbra-zone/types@22.0.0
  - @penumbra-zone/wasm@27.0.0
  - @penumbra-zone/crypto-web@23.0.0
  - @penumbra-zone/storage@29.0.0

## 32.0.0

### Patch Changes

- Updated dependencies [e7d0767]
  - @penumbra-zone/query@29.0.0
  - @penumbra-zone/wasm@26.2.0
  - @penumbra-zone/storage@28.0.0

## 31.0.0

### Patch Changes

- Updated dependencies [598d148]
- Updated dependencies [e952e03]
  - @penumbra-zone/wasm@26.1.0
  - @penumbra-zone/storage@27.0.0
  - @penumbra-zone/query@28.0.0

## 30.0.0

### Patch Changes

- Updated dependencies [f8730e9]
- Updated dependencies [94d2c8d]
  - @penumbra-zone/getters@16.0.0
  - @penumbra-zone/query@27.0.0
  - @penumbra-zone/storage@26.0.0
  - @penumbra-zone/types@21.0.0
  - @penumbra-zone/crypto-web@22.0.0
  - @penumbra-zone/wasm@26.0.0

## 29.0.0

### Patch Changes

- Updated dependencies [49263c6]
  - @penumbra-zone/protobuf@6.0.0
  - @penumbra-zone/bech32m@7.0.0
  - @penumbra-zone/getters@15.0.0
  - @penumbra-zone/query@26.0.0
  - @penumbra-zone/storage@25.0.0
  - @penumbra-zone/types@20.0.0
  - @penumbra-zone/wasm@25.0.0
  - @penumbra-zone/crypto-web@21.0.0

## 28.0.0

### Minor Changes

- 10ef940: Updating to v0.80.0 bufbuild types

### Patch Changes

- Updated dependencies [10ef940]
  - @penumbra-zone/transport-dom@7.5.0
  - @penumbra-zone/perspective@24.0.0
  - @penumbra-zone/protobuf@5.7.0
  - @penumbra-zone/getters@14.0.0
  - @penumbra-zone/storage@24.0.0
  - @penumbra-zone/query@25.0.0
  - @penumbra-zone/types@19.0.0
  - @penumbra-zone/wasm@24.0.0
  - @penumbra-zone/crypto-web@20.0.0

## 27.0.0

### Minor Changes

- 807648a: Support viewing fresh state of jailed validators
- ecc548e: Fix gas prices RPC
- f650f48: Return jailed validators in delegation balances request

### Patch Changes

- 457e04f: use `Any.pack` to create `Any` messages
- Updated dependencies [bd43d49]
- Updated dependencies [bd43d49]
- Updated dependencies [bd43d49]
- Updated dependencies [807648a]
- Updated dependencies [bd43d49]
  - @penumbra-zone/storage@23.0.0
  - @penumbra-zone/types@18.2.0
  - @penumbra-zone/getters@13.0.1
  - @penumbra-zone/query@24.0.0
  - @penumbra-zone/crypto-web@19.0.0
  - @penumbra-zone/wasm@23.0.0
  - @penumbra-zone/perspective@23.0.0

## 26.0.0

### Patch Changes

- Updated dependencies [534a6ad]
  - @penumbra-zone/wasm@22.1.0
  - @penumbra-zone/perspective@22.0.0
  - @penumbra-zone/query@23.0.0
  - @penumbra-zone/storage@22.0.0

## 25.0.0

### Minor Changes

- f5bea48: fix source randomizer

### Patch Changes

- Updated dependencies [f5bea48]
  - @penumbra-zone/storage@21.0.0
  - @penumbra-zone/types@18.1.0
  - @penumbra-zone/crypto-web@18.0.0
  - @penumbra-zone/query@22.0.0
  - @penumbra-zone/wasm@22.0.0
  - @penumbra-zone/perspective@21.0.0

## 24.0.0

### Minor Changes

- a9ffd2d: rework extractAltFee with fallback protections

### Patch Changes

- Updated dependencies [a9ffd2d]
- Updated dependencies
  - @penumbra-zone/storage@20.0.0
  - @penumbra-zone/types@18.0.0
  - @penumbra-zone/protobuf@5.6.0
  - @penumbra-zone/crypto-web@17.0.0
  - @penumbra-zone/query@21.0.0
  - @penumbra-zone/wasm@21.0.0
  - @penumbra-zone/getters@13.0.0
  - @penumbra-zone/perspective@20.0.0

## 23.0.0

### Minor Changes

- 955dbf2: Save customized symbol metadata on denom req

### Patch Changes

- Updated dependencies [40a471d]
- Updated dependencies [955dbf2]
- Updated dependencies [318690e]
- Updated dependencies
  - @penumbra-zone/perspective@19.0.0
  - @penumbra-zone/storage@19.0.0
  - @penumbra-zone/wasm@20.2.0
  - @penumbra-zone/query@20.0.0

## 22.0.0

### Patch Changes

- Updated dependencies [3477bef]
- Updated dependencies [d6ce325]
- Updated dependencies [16147fe]
  - @penumbra-zone/query@19.0.0
  - @penumbra-zone/types@17.0.1
  - @penumbra-zone/wasm@20.1.0
  - @penumbra-zone/perspective@18.0.0
  - @penumbra-zone/crypto-web@16.0.1
  - @penumbra-zone/storage@18.0.0

## 21.0.0

### Minor Changes

- a788eff: Update default timeouts to better support build times

### Patch Changes

- Updated dependencies [a788eff]
  - @penumbra-zone/transport-dom@7.4.0

## 20.0.0

### Patch Changes

- Updated dependencies [4e30796]
- Updated dependencies [86c1bbe]
  - @penumbra-zone/wasm@20.0.0
  - @penumbra-zone/perspective@17.0.0
  - @penumbra-zone/getters@12.1.0
  - @penumbra-zone/query@18.0.0
  - @penumbra-zone/storage@17.0.0
  - @penumbra-zone/types@17.0.0
  - @penumbra-zone/crypto-web@16.0.0

## 19.0.0

### Minor Changes

- 0233722: added proxying timestampByHeight

### Patch Changes

- Updated dependencies [0233722]
- Updated dependencies [af04e2a]
  - @penumbra-zone/query@17.0.0
  - @penumbra-zone/types@16.1.0
  - @penumbra-zone/transport-dom@7.3.0
  - @penumbra-zone/crypto-web@15.0.0
  - @penumbra-zone/storage@16.0.0
  - @penumbra-zone/wasm@19.0.0
  - @penumbra-zone/perspective@16.0.0

## 18.0.0

### Patch Changes

- Updated dependencies [22bf02c]
  - @penumbra-zone/protobuf@5.5.0
  - @penumbra-zone/getters@12.0.0
  - @penumbra-zone/query@16.0.0
  - @penumbra-zone/wasm@18.0.0
  - @penumbra-zone/perspective@15.0.0
  - @penumbra-zone/storage@15.0.0
  - @penumbra-zone/types@16.0.0
  - @penumbra-zone/crypto-web@14.0.0

## 17.0.2

### Patch Changes

- 3aaead1: Move the "default" option in package.json exports field to the last
- Updated dependencies [3aaead1]
  - @penumbra-zone/storage@14.0.2
  - @penumbra-zone/crypto-web@13.0.1
  - @penumbra-zone/query@15.0.2
  - @penumbra-zone/types@15.1.1
  - @penumbra-zone/wasm@17.0.2
  - @penumbra-zone/perspective@14.0.2

## 17.0.1

### Patch Changes

- Updated dependencies [1a57749]
  - @penumbra-zone/wasm@17.0.1
  - @penumbra-zone/perspective@14.0.1
  - @penumbra-zone/query@15.0.1
  - @penumbra-zone/storage@14.0.1

## 17.0.0

### Minor Changes

- 877fb1f: use epochDuration as PRICE_RELEVANCE_THRESHOLD for delegation assets

### Patch Changes

- Updated dependencies [83151cb]
- Updated dependencies [cbc2419]
- Updated dependencies [877fb1f]
- Updated dependencies [1011b3b]
- Updated dependencies [cbc2419]
- Updated dependencies [e65e36b]
- Updated dependencies [3b7a289]
- Updated dependencies [5641af2]
  - @penumbra-zone/query@15.0.0
  - @penumbra-zone/wasm@17.0.0
  - @penumbra-zone/storage@14.0.0
  - @penumbra-zone/types@15.1.0
  - @penumbra-zone/transport-dom@7.2.2
  - @penumbra-zone/perspective@14.0.0
  - @penumbra-zone/crypto-web@13.0.0

## 16.0.0

### Minor Changes

- fa798d9: Bufbuild + registry dep update

### Patch Changes

- Updated dependencies [fa798d9]
- Updated dependencies [fa798d9]
  - @penumbra-zone/wasm@16.0.0
  - @penumbra-zone/perspective@13.0.0
  - @penumbra-zone/protobuf@5.4.0
  - @penumbra-zone/getters@11.0.0
  - @penumbra-zone/storage@13.0.0
  - @penumbra-zone/query@14.0.0
  - @penumbra-zone/types@15.0.0
  - @penumbra-zone/crypto-web@12.0.0

## 15.0.0

### Patch Changes

- 28a48d7: Fixes for multi-asset fees
- dc77a52: Services: add priority scores to the `assets` service. Minifront: fix rendering issues
- Updated dependencies [28a48d7]
- Updated dependencies [28a48d7]
  - @penumbra-zone/wasm@15.0.0
  - @penumbra-zone/storage@12.0.0
  - @penumbra-zone/types@14.0.0
  - @penumbra-zone/perspective@12.0.0
  - @penumbra-zone/query@13.0.0
  - @penumbra-zone/crypto-web@11.0.0

## 14.0.0

### Minor Changes

- 43ccd96: Modify GasPrices storage to support multi-asset fees
- 066aabb: Add priority scores to the asset metadata

### Patch Changes

- Updated dependencies [43ccd96]
- Updated dependencies [8e68481]
  - @penumbra-zone/storage@11.0.0
  - @penumbra-zone/query@12.0.0
  - @penumbra-zone/types@13.1.0
  - @penumbra-zone/wasm@14.0.0
  - @penumbra-zone/crypto-web@10.0.0
  - @penumbra-zone/perspective@11.0.0

## 13.0.0

### Minor Changes

- 2f1c39f: Alt token fee extraction refactor + tests

### Patch Changes

- 3708e2c: include peer deps as dev deps
- Updated dependencies [e9e1320]
- Updated dependencies [3708e2c]
- Updated dependencies [e9e1320]
- Updated dependencies [af2d6b6]
- Updated dependencies [2f1c39f]
  - @penumbra-zone/protobuf@5.3.1
  - @penumbra-zone/transport-dom@7.2.1
  - @penumbra-zone/perspective@10.0.0
  - @penumbra-zone/bech32m@6.1.1
  - @penumbra-zone/getters@10.1.0
  - @penumbra-zone/storage@10.0.0
  - @penumbra-zone/crypto-web@9.0.0
  - @penumbra-zone/query@11.0.0
  - @penumbra-zone/types@13.0.0
  - @penumbra-zone/wasm@13.0.0

## 12.0.0

### Patch Changes

- Updated dependencies
  - @penumbra-zone/storage@9.1.0

## 11.0.0

### Patch Changes

- Updated dependencies
  - @penumbra-zone/query@10.0.0

## 10.0.0

### Minor Changes

- Synchronize published @buf deps

### Patch Changes

- Updated dependencies
  - @penumbra-zone/getters@10.0.0
  - @penumbra-zone/perspective@9.0.0
  - @penumbra-zone/protobuf@5.3.0
  - @penumbra-zone/query@9.0.0
  - @penumbra-zone/storage@9.0.0
  - @penumbra-zone/types@12.0.0
  - @penumbra-zone/wasm@12.0.0
  - @penumbra-zone/crypto-web@8.0.0

## 9.0.0

### Minor Changes

- bump registry

### Patch Changes

- Updated dependencies
  - @penumbra-zone/storage@8.0.0
  - @penumbra-zone/types@11.0.0
  - @penumbra-zone/crypto-web@7.0.0
  - @penumbra-zone/query@8.0.0
  - @penumbra-zone/wasm@11.0.0
  - @penumbra-zone/perspective@8.0.0

## 8.0.0

### Patch Changes

- Updated dependencies
  - @penumbra-zone/storage@7.1.0

## 7.0.0

### Minor Changes

- 4161587: Update to latest bufbuild deps (v0.77.4)

### Patch Changes

- Updated dependencies [c555df7]
- Updated dependencies [4161587]
- Updated dependencies [e207faa]
- Updated dependencies [47c6bc0]
  - @penumbra-zone/storage@7.0.0
  - @penumbra-zone/perspective@7.0.0
  - @penumbra-zone/protobuf@5.2.0
  - @penumbra-zone/getters@9.0.0
  - @penumbra-zone/query@7.0.0
  - @penumbra-zone/types@10.0.0
  - @penumbra-zone/wasm@10.0.0
  - @penumbra-zone/transport-dom@7.2.0
  - @penumbra-zone/crypto-web@6.0.0

## 6.0.0

### Minor Changes

- 9b3f561: properly build esm relative paths

### Patch Changes

- Updated dependencies [9b3f561]
  - @penumbra-zone/transport-dom@7.1.0
  - @penumbra-zone/perspective@6.0.0
  - @penumbra-zone/protobuf@5.1.0
  - @penumbra-zone/bech32m@6.1.0
  - @penumbra-zone/getters@8.0.0
  - @penumbra-zone/storage@6.0.0
  - @penumbra-zone/crypto-web@5.0.0
  - @penumbra-zone/query@6.0.0
  - @penumbra-zone/types@9.0.0
  - @penumbra-zone/wasm@9.0.0

## 5.0.0

### Major Changes

- f067fab: reconfigure all package builds

### Patch Changes

- Updated dependencies [f067fab]
  - @penumbra-zone/transport-dom@7.0.0
  - @penumbra-zone/perspective@5.0.0
  - @penumbra-zone/protobuf@5.0.0
  - @penumbra-zone/bech32m@6.0.0
  - @penumbra-zone/getters@7.0.0
  - @penumbra-zone/storage@5.0.0
  - @penumbra-zone/crypto-web@4.0.0
  - @penumbra-zone/query@5.0.0
  - @penumbra-zone/types@8.0.0
  - @penumbra-zone/wasm@8.0.0

## 4.1.1

### Patch Changes

- 89a0f22: Use the localSeq property to fix auction UI bugs
- Updated dependencies [a75256f]
- Updated dependencies [468ecc7]
- Updated dependencies [a75256f]
  - @penumbra-zone/bech32m@5.1.0
  - @penumbra-zone/getters@6.2.0
  - @penumbra-zone/protobuf@4.2.0
  - @penumbra-zone/perspective@4.0.2
  - @penumbra-zone/query@4.1.1
  - @penumbra-zone/storage@4.0.1
  - @penumbra-zone/types@7.1.1
  - @penumbra-zone/wasm@7.1.1
  - @penumbra-zone/services-context@3.3.1
  - @penumbra-zone/crypto-web@3.0.11

## 4.1.0

### Minor Changes

- ab9d743: decouple service/rpc init

### Patch Changes

- Updated dependencies [4012c48]
- Updated dependencies [adf3a28]
- Updated dependencies [ab9d743]
- Updated dependencies [282eabf]
- Updated dependencies [81b9536]
- Updated dependencies [14ba562]
- Updated dependencies [6b06e04]
- Updated dependencies [c8e8d15]
- Updated dependencies [6ee8222]
- Updated dependencies [e7d7ffc]
  - @penumbra-zone/storage@4.0.0
  - @penumbra-zone/services-context@3.3.0
  - @penumbra-zone/query@4.1.0
  - @penumbra-zone/types@7.1.0
  - @penumbra-zone/protobuf@4.1.0
  - @penumbra-zone/wasm@7.1.0
  - @penumbra-zone/getters@6.1.0
  - @penumbra-zone/crypto-web@3.0.10
  - @penumbra-zone/perspective@4.0.1

## 4.0.3

### Patch Changes

- Updated dependencies [8fe4de6]
  - @penumbra-zone/transport-dom@6.0.0
  - @penumbra-zone/perspective@4.0.0
  - @penumbra-zone/protobuf@4.0.0
  - @penumbra-zone/bech32m@5.0.0
  - @penumbra-zone/getters@6.0.0
  - @penumbra-zone/wasm@7.0.0
  - @penumbra-zone/query@4.0.2
  - @penumbra-zone/storage@3.4.3
  - @penumbra-zone/types@7.0.1
  - @penumbra-zone/services-context@3.2.3
  - @penumbra-zone/crypto-web@3.0.9

## 4.0.2

### Patch Changes

- Updated dependencies [bb5f621]
- Updated dependencies [8b121ec]
  - @penumbra-zone/types@7.0.0
  - @penumbra-zone/transport-dom@5.0.0
  - @penumbra-zone/perspective@3.0.0
  - @penumbra-zone/protobuf@3.0.0
  - @penumbra-zone/bech32m@4.0.0
  - @penumbra-zone/getters@5.0.0
  - @penumbra-zone/wasm@6.0.0
  - @penumbra-zone/crypto-web@3.0.8
  - @penumbra-zone/query@4.0.1
  - @penumbra-zone/services-context@3.2.2
  - @penumbra-zone/storage@3.4.2

## 4.0.1

### Patch Changes

- Updated dependencies [a22d3a8]
  - @penumbra-zone/services-context@3.2.1
  - @penumbra-zone/storage@3.4.1

## 4.0.0

### Major Changes

- 029eebb: use service definitions from protobuf collection package

### Minor Changes

- 3ea1e6c: update buf types dependencies

### Patch Changes

- Updated dependencies [120b654]
- Updated dependencies [4f8c150]
- Updated dependencies [029eebb]
- Updated dependencies [029eebb]
- Updated dependencies [e86448e]
- Updated dependencies [3ea1e6c]
  - @penumbra-zone/getters@4.1.0
  - @penumbra-zone/protobuf@2.1.0
  - @penumbra-zone/query@4.0.0
  - @penumbra-zone/types@6.0.0
  - @penumbra-zone/wasm@5.1.0
  - @penumbra-zone/services-context@3.2.0
  - @penumbra-zone/transport-dom@4.1.0
  - @penumbra-zone/perspective@2.1.0
  - @penumbra-zone/bech32m@3.2.0
  - @penumbra-zone/storage@3.4.0
  - @penumbra-zone/crypto-web@3.0.7

## 3.2.1

### Patch Changes

- @penumbra-zone/wasm@5.0.1
- @penumbra-zone/perspective@2.0.1
- @penumbra-zone/query@3.2.1
- @penumbra-zone/services-context@3.1.1
- @penumbra-zone/storage@3.3.0

## 3.2.0

### Minor Changes

- e4c9fce: Add features to handle auction withdrawals

### Patch Changes

- e35c6f7: Deps bumped to latest
- Updated dependencies [e47a04e]
- Updated dependencies [146b48d]
- Updated dependencies [65677c1]
- Updated dependencies [8ccaf30]
- Updated dependencies [8ccaf30]
- Updated dependencies [e35c6f7]
- Updated dependencies [cf63b30]
- Updated dependencies [99feb9d]
- Updated dependencies [e4c9fce]
- Updated dependencies [d6b8a23]
- Updated dependencies [8ccaf30]
  - @penumbra-zone/services-context@3.1.0
  - @penumbra-zone/storage@3.3.0
  - @penumbra-zone/getters@4.0.0
  - @penumbra-zone/types@5.0.0
  - @penumbra-zone/wasm@5.0.0
  - @penumbra-zone/perspective@2.0.0
  - @penumbra-zone/bech32m@3.1.1
  - @penumbra-zone/query@3.2.0
  - @penumbra-zone/crypto-web@3.0.6

## 3.1.0

### Minor Changes

- v8.0.0 versioning and manifest

### Patch Changes

- Updated dependencies
- Updated dependencies [610a445]
  - @penumbra-zone/bech32m@3.1.0
  - @penumbra-zone/query@3.1.0
  - @penumbra-zone/storage@3.2.0
  - @penumbra-zone/types@4.1.0
  - @penumbra-zone/wasm@4.0.4
  - @penumbra-zone/services-context@3.0.4
  - @penumbra-zone/getters@3.0.2
  - @penumbra-zone/perspective@1.0.6
  - @penumbra-zone/crypto-web@3.0.5

## 3.0.3

### Patch Changes

- Updated dependencies [8410d2f]
  - @penumbra-zone/bech32m@3.0.1
  - @penumbra-zone/getters@3.0.1
  - @penumbra-zone/perspective@1.0.5
  - @penumbra-zone/query@3.0.2
  - @penumbra-zone/storage@3.1.2
  - @penumbra-zone/types@4.0.1
  - @penumbra-zone/wasm@4.0.3
  - @penumbra-zone/services-context@3.0.3
  - @penumbra-zone/crypto-web@3.0.4

## 3.0.2

### Patch Changes

- Updated dependencies [423e1d2]
- Updated dependencies [fc500af]
- Updated dependencies [6fb898a]
  - @penumbra-zone/polyfills@4.0.0
  - @penumbra-zone/transport-dom@4.0.0
  - @penumbra-zone/types@4.0.0
  - @penumbra-zone/storage@3.1.1
  - @penumbra-zone/crypto-web@3.0.3
  - @penumbra-zone/perspective@1.0.4
  - @penumbra-zone/query@3.0.1
  - @penumbra-zone/services-context@3.0.2
  - @penumbra-zone/wasm@4.0.2

## 3.0.1

### Patch Changes

- Updated dependencies [3148375]
- Updated dependencies [55f31c9]
- Updated dependencies [55f31c9]
- Updated dependencies [fdd4303]
  - @penumbra-zone/transport-dom@3.0.0
  - @penumbra-zone/constants@4.0.0
  - @penumbra-zone/polyfills@3.0.0
  - @penumbra-zone/getters@3.0.0
  - @penumbra-zone/query@3.0.0
  - @penumbra-zone/types@3.0.0
  - @penumbra-zone/storage@3.1.0
  - @penumbra-zone/bech32m@3.0.0
  - @penumbra-zone/services-context@3.0.1
  - @penumbra-zone/crypto-web@3.0.2
  - @penumbra-zone/perspective@1.0.3
  - @penumbra-zone/wasm@4.0.1

## 3.0.0

### Major Changes

- 9f4c112: Drop /src/ requirement for imports and renaming

### Patch Changes

- Updated dependencies [78ab976]
- Updated dependencies [862283c]
- Updated dependencies [9f4c112]
  - @penumbra-zone/wasm@4.0.0
  - @penumbra-zone/constants@3.0.0
  - @penumbra-zone/services-context@3.0.0
  - @penumbra-zone/perspective@1.0.2
  - @penumbra-zone/query@2.0.3
  - @penumbra-zone/getters@2.0.1
  - @penumbra-zone/storage@3.0.1
  - @penumbra-zone/types@2.0.1
  - @penumbra-zone/crypto-web@3.0.1

## 2.0.2

### Patch Changes

- Updated dependencies [76302da]
  - @penumbra-zone/storage@3.0.0
  - @penumbra-zone/query@2.0.2

## 2.0.1

### Patch Changes

- Updated dependencies [66c2407]
  - @penumbra-zone/wasm@3.0.0
  - @penumbra-zone/storage@2.0.1
  - @penumbra-zone/perspective@1.0.1
  - @penumbra-zone/query@2.0.1
  - @penumbra-zone/services@2.0.1

## 2.0.0

### Major Changes

- 929d278: barrel imports to facilitate better tree shaking

### Patch Changes

- Updated dependencies [8933117]
- Updated dependencies [929d278]
  - @penumbra-zone/wasm@2.0.0
  - @penumbra-zone/constants@2.0.0
  - @penumbra-zone/storage@2.0.0
  - @penumbra-zone/query@2.0.0
  - @penumbra-zone/perspective@1.0.0
  - @penumbra-zone/services@2.0.0
  - @penumbra-zone/getters@2.0.0
  - @penumbra-zone/bech32@2.0.0
  - @penumbra-zone/crypto-web@2.0.0
  - @penumbra-zone/types@2.0.0
  - @penumbra-zone/polyfills@2.0.0
  - @penumbra-zone/transport-dom@2.0.0

## 1.0.2

### Patch Changes

- Updated dependencies
  - @penumbra-zone/constants@1.1.0
  - @penumbra-zone/getters@1.1.0
  - @penumbra-zone/polyfills@1.1.0
  - @penumbra-zone/transport-dom@1.1.0
  - @penumbra-zone/types@1.1.0
  - @penumbra-zone/query@1.0.2
  - @penumbra-zone/services@1.0.2
  - @penumbra-zone/storage@1.0.2
  - @penumbra-zone/crypto-web@1.0.1
  - @penumbra-zone/wasm@1.0.2
