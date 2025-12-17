import { Container } from 'inversify';
import { TYPES } from './types/di.types';

// Repositories
import { UserRepository } from './repositories/user.repository';
import { IUserRepository } from './interfaces/user.interface';
import { FeatureRepository } from './repositories/feature.repository';
import { IFeatureRepository } from './interfaces/feature.interface';
import { VoteRepository } from './repositories/vote.repository';
import { IVoteRepository } from './interfaces/vote.interface';

// Services
import { AuthService, IAuthService } from './services/auth.service';
import { UserService, IUserService } from './services/user.service';
import { FeatureService, IFeatureService } from './services/feature.service';
import { VoteService, IVoteService } from './services/vote.service';

// Controllers
import { AuthController, IAuthController } from './controllers/auth.controller';
import { UserController, IUserController } from './controllers/user.controller';
import { FeatureController, IFeatureController } from './controllers/feature.controller';
import { VoteController, IVoteController } from './controllers/vote.controller';

import { ICache } from './interfaces/cache.interface';
import { createCache } from './utils/cache';

const container = new Container();

export function configureContainer(): Container {
  container.bind<ICache>(TYPES.Cache).toConstantValue(createCache('node-cache'));

  // Repository bindings
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
  container.bind<IFeatureRepository>(TYPES.FeatureRepository).to(FeatureRepository).inSingletonScope();
  container.bind<IVoteRepository>(TYPES.VoteRepository).to(VoteRepository).inSingletonScope();

  // Service bindings
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
  container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
  container.bind<IFeatureService>(TYPES.FeatureService).to(FeatureService).inSingletonScope();
  container.bind<IVoteService>(TYPES.VoteService).to(VoteService).inSingletonScope();

  // Controller bindings
  container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
  container.bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
  container.bind<IFeatureController>(TYPES.FeatureController).to(FeatureController).inSingletonScope();
  container.bind<IVoteController>(TYPES.VoteController).to(VoteController).inSingletonScope();

  return container;
}

// Initialize container
configureContainer();

export { container };
