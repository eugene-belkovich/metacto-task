import { AppError, ErrorDetails } from './app.error';

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: ErrorDetails) {
    super(message, 403, 'Forbidden', details);
  }
}
