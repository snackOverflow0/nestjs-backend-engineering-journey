import { Injectable } from '@nestjs/common';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';

@Injectable()
export class LoggerService {
  log(message: string) {
    console.log('[LOG]:', message)
  }

  warn(message: string) {
    console.warn('[LOG]:', message)
  }

  error(message: string) {
    console.error('[LOG]:', message)
  }
}
