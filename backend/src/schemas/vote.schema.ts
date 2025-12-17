import { Type, Static } from '@sinclair/typebox';

export const VoteBodySchema = Type.Object({
  type: Type.Union([Type.Literal('up'), Type.Literal('down')]),
});

export type VoteBody = Static<typeof VoteBodySchema>;

// Params schema (featureId)
export const VoteParamsSchema = Type.Object({
  id: Type.String(),
});

export type VoteParams = Static<typeof VoteParamsSchema>;

// Response schemas
export const VoteResponseSchema = Type.Object({
  id: Type.String(),
  featureId: Type.String(),
  userId: Type.String(),
  type: Type.Union([Type.Literal('up'), Type.Literal('down')]),
  createdAt: Type.String({ format: 'date-time' }),
});

export const VoteStatsResponseSchema = Type.Object({
  featureId: Type.String(),
  upvotes: Type.Number(),
  downvotes: Type.Number(),
  total: Type.Number(),
});

export const DeleteVoteResponseSchema = Type.Object({
  success: Type.Boolean(),
});

// Fastify schema definitions
export const voteSchema = {
  params: VoteParamsSchema,
  body: VoteBodySchema,
  response: {
    200: VoteResponseSchema,
    201: VoteResponseSchema,
  },
};

export const removeVoteSchema = {
  params: VoteParamsSchema,
  response: {
    200: DeleteVoteResponseSchema,
  },
};

export const getVoteStatsSchema = {
  params: VoteParamsSchema,
  response: {
    200: VoteStatsResponseSchema,
  },
};
