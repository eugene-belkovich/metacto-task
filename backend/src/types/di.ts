export const TYPES = {
  Logger: Symbol.for('Logger'),
  Cache: Symbol.for('Cache'),
  Mongo: Symbol.for('Mongo'),
  UserRepository: Symbol.for('UserRepository'),
  FeatureRepository: Symbol.for('FeatureRepository'),
  VoteRepository: Symbol.for('VoteRepository'),
  UserService: Symbol.for('UserService'),
  FeatureService: Symbol.for('FeatureService'),
  VoteService: Symbol.for('VoteService')
} as const;
