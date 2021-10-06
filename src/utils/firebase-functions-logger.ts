import { Logger } from "./logger";
import { logger as fbLogger } from "firebase-functions";

export class FirebaseFunctionsLogger extends Logger {
  v(...value: any): void {
    fbLogger.debug(value);
  }

  d(...value: any): void {
    fbLogger.debug(value);
  }

  w(...value: any): void {
    fbLogger.warn(value);
  }

  e(...value: any): void {
    fbLogger.error(value);
  }
}
