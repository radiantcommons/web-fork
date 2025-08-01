import { DBSchema, StoreKey, StoreNames, StoreValue } from 'idb';

import {
  ScanBlockResult,
  StateCommitmentTree,
  StoreCommitment,
  StoredPosition,
  StoreHash,
} from './state-commitment-tree.js';

import { AppParameters } from '@penumbra-zone/protobuf/penumbra/core/app/v1/app_pb';
import {
  AssetId,
  EstimatedPrice,
  Metadata,
  Value,
} from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';
import {
  AuctionId,
  DutchAuctionDescription,
} from '@penumbra-zone/protobuf/penumbra/core/component/auction/v1/auction_pb';
import {
  Position,
  PositionId,
  PositionMetadata,
  PositionState,
  TradingPair,
} from '@penumbra-zone/protobuf/penumbra/core/component/dex/v1/dex_pb';
import { GasPrices } from '@penumbra-zone/protobuf/penumbra/core/component/fee/v1/fee_pb';
import { Epoch, Nullifier } from '@penumbra-zone/protobuf/penumbra/core/component/sct/v1/sct_pb';
import {
  FmdParameters,
  Note,
} from '@penumbra-zone/protobuf/penumbra/core/component/shielded_pool/v1/shielded_pool_pb';
import { ValidatorInfo } from '@penumbra-zone/protobuf/penumbra/core/component/stake/v1/stake_pb';
import { AddressIndex, IdentityKey } from '@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb';
import {
  Transaction,
  TransactionPerspective,
  TransactionSummary,
  TransactionView,
} from '@penumbra-zone/protobuf/penumbra/core/transaction/v1/transaction_pb';
import { TransactionId } from '@penumbra-zone/protobuf/penumbra/core/txhash/v1/txhash_pb';
import { StateCommitment } from '@penumbra-zone/protobuf/penumbra/crypto/tct/v1/tct_pb';
import {
  NotesForVotingResponse,
  SpendableNoteRecord,
  SwapRecord,
  TransactionInfo,
} from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { PlainMessage } from '@bufbuild/protobuf';
import type { Jsonified } from './jsonified.js';
import { Amount } from '@penumbra-zone/protobuf/penumbra/core/num/v1/num_pb';

export interface IdbUpdate<DBTypes extends PenumbraDb, StoreName extends StoreNames<DBTypes>> {
  table: StoreName;
  value: StoreValue<DBTypes, StoreName>;
  key?: StoreKey<DBTypes, StoreName> | IDBKeyRange;
}

export interface IndexedDbInterface {
  stakingTokenAssetId: AssetId;

  subscribe<DBTypes extends PenumbraDb, StoreName extends StoreNames<DBTypes>>(
    table: StoreName,
  ): AsyncGenerator<IdbUpdate<DBTypes, StoreName>, void>;
  constants(): IdbConstants;
  clear(): Promise<void>;
  getFullSyncHeight(): Promise<bigint | undefined>;
  saveFullSyncHeight(height: bigint): Promise<void>;
  getSpendableNoteByNullifier(nullifier: Nullifier): Promise<SpendableNoteRecord | undefined>;
  getSpendableNoteByCommitment(
    commitment: StateCommitment,
  ): Promise<SpendableNoteRecord | undefined>;
  saveSpendableNote(
    note: PlainMessage<SpendableNoteRecord> & { noteCommitment: PlainMessage<StateCommitment> },
  ): Promise<void>;
  iterateSpendableNotes(): AsyncGenerator<SpendableNoteRecord, void>;
  saveTransaction(id: TransactionId, height: bigint, tx: Transaction): Promise<void>;
  getTransaction(txId: TransactionId): Promise<TransactionInfo | undefined>;
  iterateTransactions(): AsyncGenerator<TransactionInfo, void>;
  getAssetsMetadata(assetId: AssetId): Promise<Metadata | undefined>;
  saveAssetsMetadata(metadata: Required<PlainMessage<Metadata>>): Promise<void>;
  iterateAssetsMetadata(): AsyncGenerator<Metadata, void>;
  getStateCommitmentTree(): Promise<StateCommitmentTree>;
  saveScanResult(updates: ScanBlockResult): Promise<void>;
  getFmdParams(): Promise<FmdParameters | undefined>;
  saveFmdParams(params: FmdParameters): Promise<void>;
  getAppParams(): Promise<AppParameters | undefined>;
  saveAppParams(params: AppParameters): Promise<void>;
  iterateSwaps(): AsyncGenerator<SwapRecord, void>;
  getSwapByNullifier(nullifier: Nullifier): Promise<SwapRecord | undefined>;
  saveSwap(
    swap: PlainMessage<SwapRecord> & { swapCommitment: PlainMessage<StateCommitment> },
  ): Promise<void>;
  getSwapByCommitment(commitment: StateCommitment): Promise<SwapRecord | undefined>;
  getNativeGasPrices(): Promise<GasPrices | undefined>;
  getAltGasPrices(): Promise<GasPrices[]>;
  saveGasPrices(value: Required<PlainMessage<GasPrices>>): Promise<void>;
  getNotesForVoting(
    addressIndex: AddressIndex | undefined,
    votableAtHeight: bigint,
  ): Promise<NotesForVotingResponse[]>;
  getOwnedPositionIds(
    positionState: PositionState | undefined,
    tradingPair: TradingPair | undefined,
    subaccount: AddressIndex | undefined,
  ): AsyncGenerator<PositionId, void>;
  addPosition(
    positionId: PositionId,
    position: Position,
    positionMetadata?: PositionMetadata,
    subaccount?: AddressIndex,
  ): Promise<void>;
  updatePosition(
    positionId: PositionId,
    newState: PositionState,
    subaccount?: AddressIndex,
    positionMetadata?: PositionMetadata,
  ): Promise<void>;
  addEpoch(epoch: Epoch): Promise<void>;
  getEpochByHeight(height: bigint): Promise<Epoch | undefined>;
  getEpochByIndex(epochIndex: bigint): Promise<Epoch | undefined>;
  upsertValidatorInfo(validatorInfo: ValidatorInfo): Promise<void>;
  iterateValidatorInfos(): AsyncGenerator<ValidatorInfo, void>;
  clearValidatorInfos(): Promise<void>;
  getValidatorInfo(identityKey: IdentityKey): Promise<ValidatorInfo | undefined>;
  updatePrice(
    pricedAsset: AssetId,
    numeraire: AssetId,
    numerairePerUnit: number,
    height: bigint,
  ): Promise<void>;
  getPricesForAsset(
    assetMetadata: Metadata,
    latestBlockHeight: bigint,
    epochDuration: bigint,
  ): Promise<EstimatedPrice[]>;
  clearSwapBasedPrices(): Promise<void>;

  // Add more auction union types as they are created
  upsertAuction(
    auctionId: AuctionId,
    value: {
      auction?: DutchAuctionDescription;
      noteCommitment?: StateCommitment;
      seqNum?: bigint;
    },
  ): Promise<void>;

  getAuction(auctionId: AuctionId): Promise<{
    // Add more auction union types as they are created
    auction?: DutchAuctionDescription;
    noteCommitment?: StateCommitment;
    seqNum?: bigint;
  }>;

  addAuctionOutstandingReserves(
    auctionId: AuctionId,
    value: {
      input: Value;
      output: Value;
    },
  ): Promise<void>;

  deleteAuctionOutstandingReserves(auctionId: AuctionId): Promise<void>;

  getAuctionOutstandingReserves(
    auctionId: AuctionId,
  ): Promise<{ input: Value; output: Value } | undefined>;

  hasTokenBalance(addressIndex: number, assetId: AssetId): Promise<boolean>;

  totalNoteBalance(accountIndex: number, assetId: AssetId): Promise<Amount>;

  saveTransactionInfo(
    id: TransactionId,
    txp: TransactionPerspective,
    txv: TransactionView,
    summary: TransactionSummary,
  ): Promise<void>;

  getTransactionInfo(id: TransactionId): Promise<
    | {
        id: TransactionId;
        perspective: TransactionPerspective;
        view: TransactionView;
        summary?: TransactionSummary;
      }
    | undefined
  >;

  getPosition(positionId: PositionId): Promise<Position | undefined>;

  saveLQTHistoricalVote(
    incentivizedAsset: AssetId,
    epoch: bigint,
    transactionId: TransactionId,
    voteValue: Value,
    rewardValue?: Amount,
    id?: string,
    subaccount?: number,
  ): Promise<void>;

  getLQTHistoricalVotes(
    epoch: bigint,
    subaccount?: number,
  ): Promise<
    {
      incentivizedAsset: AssetId;
      epoch: string;
      TransactionId: TransactionId;
      VoteValue: Value;
      RewardValue: Amount | undefined;
      id: string | undefined;
      subaccount?: number;
    }[]
  >;

  iterateLQTVotes(
    epoch: bigint,
    subaccount?: number,
  ): AsyncGenerator<
    {
      incentivizedAsset: AssetId;
      epoch: string;
      TransactionId: TransactionId;
      VoteValue: Value;
      RewardValue: Amount;
      id: string | undefined;
      subaccount?: number;
    },
    void
  >;

  getPositionsByStrategyStream(
    subaccount?: AddressIndex,
    positionMetadata?: PositionMetadata,
    positionState?: PositionState,
    tradingPair?: TradingPair,
  ): AsyncGenerator<
    {
      id: PositionId;
      position: Position;
      subaccount?: AddressIndex;
      positionMetadata?: PositionMetadata;
    },
    void
  >;

  getPositionMetadataById(
    positionId: PositionId,
  ): Promise<{ positionMetadata?: PositionMetadata } | undefined>;
}

export interface PenumbraDb extends DBSchema {
  FULL_SYNC_HEIGHT: {
    key: 'height';
    value: bigint;
  };
  TREE_LAST_POSITION: {
    key: 'last_position';
    value: StoredPosition;
  };
  TREE_LAST_FORGOTTEN: {
    key: 'last_forgotten';
    value: bigint;
  };
  TREE_HASHES: {
    key: number; // autoincrement
    value: StoreHash;
  };
  TREE_COMMITMENTS: {
    key: StoreCommitment['commitment']['inner']; // base64
    value: StoreCommitment;
  };
  APP_PARAMETERS: {
    key: 'params';
    value: Jsonified<AppParameters>;
  };
  FMD_PARAMETERS: {
    key: 'params';
    value: Jsonified<FmdParameters>;
  };
  TRANSACTIONS: {
    key: string; // base64 TransactionInfo['id']['inner'];
    value: Jsonified<TransactionInfo>; // TransactionInfo with undefined view and perspective
    indexes: {
      height: string;
    };
  };
  TRANSACTION_INFO: {
    key: string; // base64 TransactionInfo['id']['inner'];
    value: {
      // transaction perspective and view
      id: Jsonified<TransactionId>;
      perspective: Jsonified<TransactionPerspective>;
      view: Jsonified<TransactionView>;
      summary?: Jsonified<TransactionSummary>;
    };
  };
  REGISTRY_VERSION: {
    key: 'commit';
    value: string;
  };
  // ======= Json serialized values =======
  // Allows wasm crate to directly deserialize
  ASSETS: {
    key: Jsonified<Required<Metadata>['penumbraAssetId']['inner']>; // base64
    value: Jsonified<Metadata>;
  };
  SPENDABLE_NOTES: {
    key: Jsonified<Required<SpendableNoteRecord>['noteCommitment']['inner']>; // base64
    value: Jsonified<SpendableNoteRecord>;
    indexes: {
      nullifier: Jsonified<Required<SpendableNoteRecord>['nullifier']['inner']>; // base64
      assetId: Jsonified<
        Required<Required<Required<SpendableNoteRecord>['note']>['value']>['assetId']['inner']
      >; // base64
    };
  };

  /**
   * Store for advice for future spendable notes
   * Used in wasm crate to process swap and swap claim
   *
   * This emphasizes the difference between Rust view service data storage and extension view service data storage.
   * In the relational model (Rust view service), each 'SPENDABLE_NOTES' must have a corresponding record
   * in the 'NOTES' table ('note_commitment' is used as a foreign key).
   * Therefore, in Rust view service, the 'NOTES' table stores both notes that do not yet have an associated
   * record in the 'SPENDABLE_NOTES' table (we call them advices)
   * and notes that already have an associated record in 'SPENDABLE_NOTES'.
   *
   * In indexed-db (extension view service), we store advices separately in the 'ADVICE_NOTES' table,
   * and store spendable notes along with nested notes in the 'SPENDABLE_NOTES' table.
   *
   * This table is never written or queried by TypeScript.
   */
  ADVICE_NOTES: {
    // key is not part of the stored object
    key: Jsonified<StateCommitment['inner']>; // base64
    value: Jsonified<Note>;
  };
  SWAPS: {
    key: Jsonified<Required<SwapRecord>['swapCommitment']['inner']>; // base64
    value: Jsonified<SwapRecord>;
    indexes: {
      nullifier: Jsonified<Required<SwapRecord>['nullifier']['inner']>; // base64
    };
  };
  GAS_PRICES: {
    key: Jsonified<Required<GasPrices>['assetId']['inner']>; // base64
    value: Jsonified<GasPrices>;
  };
  POSITIONS: {
    key: string; // base64 PositionRecord['id']['inner'];
    value: PositionRecord;
    indexes: {
      strategy: number;
    };
  };
  EPOCHS: {
    key: number; // auto-increment
    value: Jsonified<Epoch>;
  };
  VALIDATOR_INFOS: {
    key: string; // bech32-encoded validator identity key
    value: Jsonified<ValidatorInfo>;
  };
  PRICES: {
    key: [
      Jsonified<Required<EstimatedPrice>['pricedAsset']['inner']>,
      Jsonified<Required<EstimatedPrice>['numeraire']['inner']>,
    ]; // composite key
    value: Jsonified<EstimatedPrice>;
    indexes: {
      pricedAsset: Jsonified<Required<EstimatedPrice>['pricedAsset']['inner']>;
    };
  };
  AUCTIONS: {
    key: string; // base64 AuctionId
    value: {
      noteCommitment?: Jsonified<StateCommitment>;
      // Add more types to `auction` as more auction types are created
      auction?: Jsonified<DutchAuctionDescription>;
      /**
       * For Dutch auctions:
       * `0n`: auction is active
       * `1n`: auction has ended
       * `2n`+: the user has withdrawn funds from the auction
       */
      seqNum?: bigint;
    };
  };
  /**
   * Only populated when BOTH a) the user has ended an auction, and b) the
   * user has not yet withdrawn funds from it.
   */
  AUCTION_OUTSTANDING_RESERVES: {
    key: string; // base64 AuctionId
    value: {
      input: Jsonified<Value>;
      output: Jsonified<Value>;
    };
  };
  LQT_HISTORICAL_VOTES: {
    key: string;
    value: {
      incentivizedAsset: Jsonified<AssetId>;
      id: string;
      epoch: string;
      TransactionId: Jsonified<TransactionId>;
      VoteValue: Jsonified<Value>;
      RewardValue: Jsonified<Amount> | null;
      subaccount?: number;
    };
    indexes: {
      epoch: string;
    };
  };
}

// need to store PositionId and Position in the same table
export interface PositionRecord {
  id: Jsonified<PositionId>; // PositionId (must be JsonValue because ['id']['inner'] is a key )
  position: Jsonified<Position>; // Position
  subaccount?: Jsonified<AddressIndex>; // Position AddressIndex
  positionMetadata?: Jsonified<PositionMetadata>;
}

export type Tables = Record<string, StoreNames<PenumbraDb>>;
export type PenumbraStoreNames = StoreNames<PenumbraDb>;

// Must be kept in sync with: https://github.com/penumbra-zone/penumbra/blob/02462635d6c825019822cbeeb44d422cf900f25d/crates/wasm/src/storage.rs#L15C1-L30
export interface IdbConstants {
  name: string;
  version: number;
  tables: Tables;
}

export const IDB_TABLES: Tables = {
  assets: 'ASSETS',
  auctions: 'AUCTIONS',
  auction_outstanding_reserves: 'AUCTION_OUTSTANDING_RESERVES',
  advice_notes: 'ADVICE_NOTES',
  spendable_notes: 'SPENDABLE_NOTES',
  swaps: 'SWAPS',
  fmd_parameters: 'FMD_PARAMETERS',
  app_parameters: 'APP_PARAMETERS',
  gas_prices: 'GAS_PRICES',
  epochs: 'EPOCHS',
  prices: 'PRICES',
  validator_infos: 'VALIDATOR_INFOS',
  transactions: 'TRANSACTIONS',
  full_sync_height: 'FULL_SYNC_HEIGHT',
  tree_commitments: 'TREE_COMMITMENTS',
  tree_hashes: 'TREE_HASHES',
  tree_last_position: 'TREE_LAST_POSITION',
  tree_last_forgotten: 'TREE_LAST_FORGOTTEN',
  lqt_historical_votes: 'LQT_HISTORICAL_VOTES',
};
