export type TransactionClassification =
  /** We don't know what kind of transaction this is, or it's undefined. */
  | 'unknown'
  /** We know that it's internal (e.g, a swap), but nothing more. */
  | 'unknownInternal'
  /** The transaction is an internal transfer between the user's accounts. */
  | 'internalTransfer'
  /** The transaction is a send to an external account. */
  | 'send'
  /** The transaction is a receive from an external account. */
  | 'receive'
  /** The transactions below are one that contain the respective action. */
  | 'swap'
  | 'swapClaim'
  | 'delegate'
  | 'undelegate'
  | 'undelegateClaim'
  | 'ics20Withdrawal'
  | 'dutchAuctionSchedule'
  | 'dutchAuctionEnd'
  | 'dutchAuctionWithdraw'
  | 'delegatorVote'
  | 'validatorVote'
  | 'validatorDefinition'
  | 'ibcRelayAction'
  | 'proposalSubmit'
  | 'proposalWithdraw'
  | 'proposalDepositClaim'
  | 'positionOpen'
  | 'positionOpenView'
  | 'positionClose'
  | 'positionWithdraw'
  | 'positionRewardClaim'
  | 'communityPoolSpend'
  | 'communityPoolOutput'
  | 'communityPoolDeposit'
  | 'liquidityTournamentVote';
