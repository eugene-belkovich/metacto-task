import { injectable, inject } from 'inversify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TYPES } from '../types/di.types';
import { IAuthService } from '../services/auth.service';
import { RegisterBody, LoginBody } from '../schemas/auth.schema';

export interface IAuthController {
  register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
  ): Promise<void>;
  login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ): Promise<void>;
}

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService
  ) {}

  async register(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email, password, name } = request.body;

    const result = await this.authService.register(email, password, name);

    reply.status(201).send({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      token: result.token,
    });
  }

  async login(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ): Promise<void> {
    const { email, password } = request.body;

    const result = await this.authService.login(email, password);

    reply.status(200).send({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      token: result.token,
    });
  }
}
