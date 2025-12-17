import { AppError, ErrorDetails } from './app.error';

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: ErrorDetails) {
    super(message, 404, 'Not Found', details);
  }
}
