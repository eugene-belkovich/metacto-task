import { Type, Static } from '@sinclair/typebox';

export const CreateFeatureBodySchema = Type.Object({
  title: Type.String({ minLength: 1, maxLength: 200 }),
  description: Type.String({ minLength: 1, maxLength: 2000 }),
});

export type CreateFeatureBody = Static<typeof CreateFeatureBodySchema>;

export const ListFeaturesQuerySchema = Type.Object({
  sort: Type.Optional(Type.Union([
    Type.Literal('votes'),
    Type.Literal('newest'),
    Type.Literal('oldest'),
  ])),
  status: Type.Optional(Type.Union([
    Type.Literal('pending'),
    Type.Literal('in_progress'),
    Type.Literal('completed'),
    Type.Literal('rejected'),
  ])),
  page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Number({ minimum: 1, maximum: 50, default: 10 })),
});

export type ListFeaturesQuery = Static<typeof ListFeaturesQuerySchema>;

export const UpdateStatusBodySchema = Type.Object({
  status: Type.Union([
    Type.Literal('pending'),
    Type.Literal('in_progress'),
    Type.Literal('completed'),
    Type.Literal('rejected'),
  ]),
});

export type UpdateStatusBody = Static<typeof UpdateStatusBodySchema>;

// Params schema
export const FeatureParamsSchema = Type.Object({
  id: Type.String(),
});

export type FeatureParams = Static<typeof FeatureParamsSchema>;

// Response schemas
const AuthorSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.String(),
});

export const FeatureResponseSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  description: Type.String(),
  status: Type.String(),
  author: AuthorSchema,
  voteCount: Type.Number(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const PaginatedFeaturesResponseSchema = Type.Object({
  data: Type.Array(FeatureResponseSchema),
  total: Type.Number(),
  page: Type.Number(),
  limit: Type.Number(),
  totalPages: Type.Number(),
  hasNextPage: Type.Boolean(),
  hasPrevPage: Type.Boolean(),
});

export const DeleteResponseSchema = Type.Object({
  success: Type.Boolean(),
});

// Fastify schema definitions
export const createFeatureSchema = {
  body: CreateFeatureBodySchema,
  response: {
    201: FeatureResponseSchema,
  },
};

export const listFeaturesSchema = {
  querystring: ListFeaturesQuerySchema,
  response: {
    200: PaginatedFeaturesResponseSchema,
  },
};

export const getFeatureSchema = {
  params: FeatureParamsSchema,
  response: {
    200: FeatureResponseSchema,
  },
};

export const updateStatusSchema = {
  params: FeatureParamsSchema,
  body: UpdateStatusBodySchema,
  response: {
    200: FeatureResponseSchema,
  },
};

export const deleteFeatureSchema = {
  params: FeatureParamsSchema,
  response: {
    200: DeleteResponseSchema,
  },
};
