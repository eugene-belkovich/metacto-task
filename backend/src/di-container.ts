import { Container } from 'inversify';
import { TYPES } from './types/di.types';

// Repositories
import { UserRepository } from './repositories/user.repository';
import { IUserRepository } from './interfaces/user.interface';

// Services
import { AuthService, IAuthService } from './services/auth.service';

// Controllers
import { AuthController, IAuthController } from './controllers/auth.controller';

const container = new Container();

export function configureContainer(): Container {
  // Repository bindings
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

  // Service bindings
  container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

  // Controller bindings
  container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();

  return container;
}

// Initialize container
configureContainer();

export { container };
