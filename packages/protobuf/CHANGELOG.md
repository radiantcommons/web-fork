# @penumbra-zone/protobuf

## 11.0.0

### Major Changes

- f1e701a: storage and wasm support for encrypted LP metadata

## 10.1.1

### Patch Changes

- 82d034e: fix publish workflow

## 10.1.0

### Minor Changes

- dc1eb8b: tct frontier support for freshly generated wallets

## 10.0.0

### Major Changes

- 93f1d05: proto and storage changes to support querying tournament votes

## 9.0.0

### Major Changes

- 15d768f: transaction summary support for transaction info rpc

## 8.0.0

### Major Changes

- 49ae3ab: LQT integration in web packages

## 7.2.0

### Minor Changes

- 68b8f36: Update protos to the latest version

## 7.1.0

### Minor Changes

- 29dd11a: - storage: add subaccount filter to `getOwnedPositionIds` method
  - protobuf: sync latest changes in penumbra protobufs
  - services: add subaccount filter to `ownedPositionIds` method in ViewService
  - types: update indexedDB schema

## 7.0.0

### Major Changes

- 95d5fd9: support transparent addresses for usdc noble IBC withdrawals

## 6.3.0

### Minor Changes

- 3269282: Updating to latest penumbra definitions (with new badges field on Metadata)

## 6.2.0

### Minor Changes

- e543db4: Add noble forwarding protobufs

## 6.1.0

### Minor Changes

- b6e32f8: Add MsgUpdateClient to typeRegistry

## 6.0.0

### Major Changes

- 49263c6: generate and bundle proto types

## 5.7.0

### Minor Changes

- 10ef940: Updating to v0.80.0 bufbuild types

## 5.6.0

### Minor Changes

- Catchup bump (previously changed without a bump)

## 5.5.0

### Minor Changes

- 22bf02c: Add additional query services to PenumbraService

## 5.4.0

### Minor Changes

- fa798d9: Bufbuild + registry dep update

## 5.3.1

### Patch Changes

- e9e1320: add ValidatorInfo to registry
- 3708e2c: include peer deps as dev deps

## 5.3.0

### Minor Changes

- Synchronize published @buf deps

## 5.2.0

### Minor Changes

- 4161587: Update to latest bufbuild deps (v0.77.4)

## 5.1.0

### Minor Changes

- 9b3f561: properly build esm relative paths

## 5.0.0

### Major Changes

- f067fab: reconfigure all package builds

## 4.2.0

### Minor Changes

- a75256f: Improve build processes in multiple packages within monorepo

## 4.1.0

### Minor Changes

- 81b9536: add ibc types to registry, address wasm ser/de of protobuf.Any types

## 4.0.0

### Major Changes

- 8fe4de6: correct ordering of default export

## 3.0.0

### Major Changes

- 8b121ec: change package exports to use 'default' field

## 2.1.0

### Minor Changes

- 3ea1e6c: update buf types dependencies

### Patch Changes

- 4f8c150: restore DutchAuction type to registry
- 029eebb: organize internally, export service definitions

## 2.0.0

### Major Changes

- 8ccaf30: externalize dependencies

### Patch Changes

- 8ccaf30: readme update recommending bsr
- e35c6f7: Deps bumped to latest

## 1.1.0

### Minor Changes

- v8.0.0 versioning and manifest

## 1.0.0

### Major Changes

- 6fb898a: initial release of `@penumbra-zone/protobuf` package containing `typeRegistry`. same removed from `@penumbra-zone/types`
