import { AppError, ErrorDetails } from './app.error';

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: ErrorDetails) {
    super(message, 400, 'Bad Request', details);
  }
}
