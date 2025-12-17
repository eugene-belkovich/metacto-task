import { injectable, inject } from 'inversify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TYPES } from '../types/di.types';
import { IUserService } from '../services/user.service';
import { UserParams } from '../schemas/user.schema';
import { UnauthorizedError } from '../errors';

export interface IUserController {
  getMe(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getById(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService
  ) {}

  async getMe(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const user = await this.userService.findById(request.user.userId);
    reply.status(200).send(user);
  }

  async getById(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const user = await this.userService.findById(id);
    reply.status(200).send(user);
  }
}
