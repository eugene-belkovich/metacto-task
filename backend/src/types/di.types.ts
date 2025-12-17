export const TYPES = {
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  FeatureRepository: Symbol.for('FeatureRepository'),
  VoteRepository: Symbol.for('VoteRepository'),

  // Services
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  FeatureService: Symbol.for('FeatureService'),
  VoteService: Symbol.for('VoteService'),

  // Controllers
  AuthController: Symbol.for('AuthController'),
  UserController: Symbol.for('UserController'),
  FeatureController: Symbol.for('FeatureController'),
  VoteController: Symbol.for('VoteController'),
  HealthController: Symbol.for('HealthController'),

  // Utils
  Cache: Symbol.for('Cache'),
  Logger: Symbol.for('Logger'),
} as const;
