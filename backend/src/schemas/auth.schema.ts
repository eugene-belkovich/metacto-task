import { Type, Static } from '@sinclair/typebox';

// Task 53: Register request/response schema
export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8, maxLength: 128 }),
  name: Type.String({ minLength: 1, maxLength: 100 }),
});

export type RegisterBody = Static<typeof RegisterBodySchema>;

export const AuthResponseSchema = Type.Object({
  id: Type.String(),
  email: Type.String(),
  name: Type.String(),
  token: Type.String(),
});

export type AuthResponse = Static<typeof AuthResponseSchema>;

// Task 54: Login request/response schema
export const LoginBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 1 }),
});

export type LoginBody = Static<typeof LoginBodySchema>;

// Fastify schema definitions
export const registerSchema = {
  body: RegisterBodySchema,
  response: {
    201: AuthResponseSchema,
  },
};

export const loginSchema = {
  body: LoginBodySchema,
  response: {
    200: AuthResponseSchema,
  },
};
