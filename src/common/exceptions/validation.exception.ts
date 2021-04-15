import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(response) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message: response,
        error: 'Data validation error',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
