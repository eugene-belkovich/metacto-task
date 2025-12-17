import { AppError, ErrorDetails } from './app.error';

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: ErrorDetails) {
    super(message, 401, 'Unauthorized', details);
  }
}
