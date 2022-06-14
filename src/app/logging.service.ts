import { Injectable } from '@angular/core';

// this is needed to check how providers work
@Injectable()
export class LoggingService {
  lastLog: string;

  printLog(message: string) {
    console.log(message);
    console.log(this.lastLog);
    this.lastLog = message;
  }
}
