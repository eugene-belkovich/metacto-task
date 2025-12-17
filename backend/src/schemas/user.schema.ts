import { Type, Static } from '@sinclair/typebox';

export const UserResponseSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export type UserResponseType = Static<typeof UserResponseSchema>;

export const UserParamsSchema = Type.Object({
  id: Type.String(),
});

export type UserParams = Static<typeof UserParamsSchema>;

// Fastify schema definitions
export const getMeSchema = {
  response: {
    200: UserResponseSchema,
  },
};

export const getByIdSchema = {
  params: UserParamsSchema,
  response: {
    200: UserResponseSchema,
  },
};
