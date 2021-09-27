export class Logger {
  static instance: Logger;

  private level: 0 | 1 | 2 | 3 | 4;

  static initialize(level?: "v" | "d" | "w" | "e") {
    Logger.instance = new Logger(level);
  }

  constructor(level?: "v" | "d" | "w" | "e") {
    this.level = !level
      ? 0
      : level === "v"
      ? 1
      : level === "d"
      ? 2
      : level === "w"
      ? 3
      : 4;
  }

  v(...value: any) {
    if (this.level > 0) console.log(value);
  }

  d(...value: any) {
    if (this.level > 1) console.debug(value);
  }

  w(...value: any) {
    if (this.level > 2) console.warn(value);
  }

  e(...value: any) {
    if (this.level > 3) console.error(value);
  }
}
