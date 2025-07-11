import type { Impl } from './index.js';
import {
  TournamentVotesResponse,
  TournamentVotesResponse_Vote,
} from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { servicesCtx } from '../ctx/prax.js';
import { Amount } from '@penumbra-zone/protobuf/penumbra/core/num/v1/num_pb';
import { Value } from '@penumbra-zone/protobuf/penumbra/core/asset/v1/asset_pb';

export const tournamentVotes: Impl['tournamentVotes'] = async function* (req, ctx) {
  const services = await ctx.values.get(servicesCtx)();
  const { indexedDb } = await services.getWalletServices();

  // When an `epochIndex` is supplied, only votes from that epoch are fetched.
  if (req.epochIndex) {
    const tournamentVote = new TournamentVotesResponse();

    const votes = await indexedDb.getLQTHistoricalVotes(req.epochIndex, req.accountFilter?.account);

    if (votes.length > 0) {
      tournamentVote.votes = votes.map(
        vote =>
          new TournamentVotesResponse_Vote({
            transaction: vote.TransactionId,
            incentivizedAsset: vote.incentivizedAsset,
            votePower: vote.VoteValue.amount,
            reward: vote.RewardValue
              ? new Value({
                  amount: new Amount({ lo: vote.RewardValue.lo, hi: vote.RewardValue.hi }),
                  assetId: vote.VoteValue.assetId,
                })
              : undefined,
            epochIndex: BigInt(vote.epoch),
          }),
      );
    }

    yield tournamentVote;
  }

  // When `blockHeight` is suppllied, retrieve votes cast in the liquidity tournament up to
  // specified block height's starting epoch.
  if (req.blockHeight) {
    let currentEpoch: string | undefined;
    let bucket: TournamentVotesResponse_Vote[] = [];

    const epoch = await indexedDb.getEpochByHeight(req.blockHeight);

    if (epoch?.index !== undefined) {
      // IDB yields individual vote notes, which we transform into logical groupings by epoch index.
      for await (const vote of indexedDb.iterateLQTVotes(epoch.index, req.accountFilter?.account)) {
        const epochKey = vote.epoch;

        if (currentEpoch === undefined) {
          currentEpoch = epochKey;
        } else if (epochKey !== currentEpoch) {
          // Once we've collected all votes for a given epoch, determined by detecting a change in the
          // next vote's epoch index, we flush the bucket and yield the grouped votes for that epoch.
          yield new TournamentVotesResponse({
            votes: bucket,
          });
          bucket = [];
          currentEpoch = epochKey;
        }

        // Accumulate the vote in the current epoch's bucket (logical grouping of votes)
        // only if a reward exists for the associated vote.
        bucket.push(
          new TournamentVotesResponse_Vote({
            transaction: vote.TransactionId,
            incentivizedAsset: vote.incentivizedAsset,
            votePower: vote.VoteValue.amount,
            reward: new Value({
              amount: new Amount({
                lo: vote.RewardValue.lo,
                hi: vote.RewardValue.hi,
              }),
              assetId: vote.VoteValue.assetId,
            }),
            epochIndex: BigInt(vote.epoch),
          }),
        );
      }

      // Yield the final bucket of votes.
      if (bucket.length) {
        yield new TournamentVotesResponse({
          votes: bucket,
        });
      }
    }
  }
};
