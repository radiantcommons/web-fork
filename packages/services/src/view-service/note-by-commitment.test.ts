import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  NoteByCommitmentRequest,
  NoteByCommitmentResponse,
  SpendableNoteRecord,
} from '@penumbra-zone/protobuf/penumbra/view/v1/view_pb';
import { createContextValues, createHandlerContext, HandlerContext } from '@connectrpc/connect';
import { ViewService } from '@penumbra-zone/protobuf';
import { servicesCtx } from '../ctx/prax.js';
import { mockIndexedDb, MockServices, createUpdates } from '../test-utils.js';
import { StateCommitment } from '@penumbra-zone/protobuf/penumbra/crypto/tct/v1/tct_pb';
import { noteByCommitment } from './note-by-commitment.js';
import type { ServicesInterface } from '@penumbra-zone/types/services';

describe('NoteByCommitment request handler', () => {
  let mockServices: MockServices;

  let mockCtx: HandlerContext;
  let request: NoteByCommitmentRequest;

  beforeEach(() => {
    vi.resetAllMocks();

    mockServices = {
      getWalletServices: vi.fn(() =>
        Promise.resolve({ indexedDb: mockIndexedDb }),
      ) as MockServices['getWalletServices'],
    };
    mockCtx = createHandlerContext({
      service: ViewService,
      method: ViewService.methods.noteByCommitment,
      protocolName: 'mock',
      requestMethod: 'MOCK',
      url: '/mock',
      contextValues: createContextValues().set(servicesCtx, () =>
        Promise.resolve(mockServices as unknown as ServicesInterface),
      ),
    });

    request = new NoteByCommitmentRequest({ noteCommitment: testCommitment });
  });

  test('should successfully get note by commitment when idb has them', async () => {
    mockIndexedDb.getSpendableNoteByCommitment.mockResolvedValue(testNote);
    const noteByCommitmentResponse = new NoteByCommitmentResponse(
      await noteByCommitment(request, mockCtx),
    );
    expect(noteByCommitmentResponse.spendableNote?.equals(testNote)).toBeTruthy();
  });

  test('should throw error if commitment is missing in request', async () => {
    await expect(noteByCommitment(new NoteByCommitmentRequest(), mockCtx)).rejects.toThrow(
      'Missing note commitment in request',
    );
  });

  test('should throw an error if note  no found in idb and awaitDetection is false', async () => {
    mockIndexedDb.getSpendableNoteByCommitment.mockResolvedValue(undefined);
    request.awaitDetection = false;
    await expect(noteByCommitment(request, mockCtx)).rejects.toThrow('Note not found');
  });

  test('should get note if note is not found in idb, but awaitDetection is true, and then it is detected', async () => {
    mockIndexedDb.getSpendableNoteByCommitment.mockResolvedValue(undefined);
    request.awaitDetection = true;

    mockIndexedDb.subscribe.mockImplementationOnce(async function* (table) {
      switch (table) {
        case 'SPENDABLE_NOTES':
          yield* createUpdates(table, [noteWithAnotherCommitment.toJson(), testNote.toJson()]);
          break;
        default:
          expect.unreachable(`Test should not subscribe to ${table}`);
      }
    });

    const noteByCommitmentResponse = new NoteByCommitmentResponse(
      await noteByCommitment(request, mockCtx),
    );
    expect(noteByCommitmentResponse.spendableNote?.equals(testNote)).toBeTruthy();
  });
});

const testCommitment = StateCommitment.fromJson({
  inner: 'pXS1k2kvlph+vuk9uhqeoP1mZRc+f526a06/bg3EBwQ=',
});

const testNote = SpendableNoteRecord.fromJson({
  noteCommitment: {
    inner: 'pXS1k2kvlph+vuk9uhqeoP1mZRc+f526a06/bg3EBwQ=',
  },
  note: {
    value: {
      amount: {
        lo: '12000000',
      },
      assetId: {
        inner: 'KeqcLzNx9qSH5+lcJHBB9KNW+YPrBk5dKzvPMiypahA=',
      },
    },
    rseed: 'h04XyitXpY1Q77M+vSzPauf4ZPx9NNRBAuUcVqP6pWo=',
    address: {
      inner:
        '874bHlYDfy3mT57v2bXQWm3SJ7g8LI3cZFKob8J8CfrP2aqVGo6ESrpGScI4t/B2/KgkjhzmAasx8GM1ejNz0J153vD8MBVM9FUZFACzSCg=',
    },
  },
  addressIndex: {
    account: 12,
    randomizer: 'AAAAAAAAAAAAAAAA',
  },
  nullifier: {
    inner: 'fv/wPZDA5L96Woc+Ry2s7u9IrwNxTFjSDYInZj3lRA8=',
  },
  heightCreated: '7197',
  position: '42986962944',
  source: {
    transaction: {
      id: '3CBS08dM9eLHH45Z9loZciZ9RaG9x1fc26Qnv0lQlto=',
    },
  },
});

const noteWithAnotherCommitment = SpendableNoteRecord.fromJson({
  noteCommitment: {
    inner: '2x5KAgUMdC2Gg2aZmj0bZFa5eQv2z9pQlSFfGXcgHQk=',
  },
});
