import { Container } from 'inversify';

const container = new Container();

// Note: Bindings will be added as we implement services and repositories
// This is the base container setup

export function configureContainer(): Container {
  // Repository bindings will be added here
  // container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  // container.bind<IFeatureRepository>(TYPES.FeatureRepository).to(FeatureRepository);
  // container.bind<IVoteRepository>(TYPES.VoteRepository).to(VoteRepository);

  // Service bindings will be added here
  // container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
  // container.bind<IUserService>(TYPES.UserService).to(UserService);
  // container.bind<IFeatureService>(TYPES.FeatureService).to(FeatureService);
  // container.bind<IVoteService>(TYPES.VoteService).to(VoteService);

  // Controller bindings will be added here
  // container.bind<AuthController>(TYPES.AuthController).to(AuthController);
  // container.bind<UserController>(TYPES.UserController).to(UserController);
  // container.bind<FeatureController>(TYPES.FeatureController).to(FeatureController);
  // container.bind<VoteController>(TYPES.VoteController).to(VoteController);
  // container.bind<HealthController>(TYPES.HealthController).to(HealthController);

  return container;
}

export { container };
