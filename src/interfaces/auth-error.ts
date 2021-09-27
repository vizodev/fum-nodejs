import { Response } from "express";

export class AuthError {
  constructor(
    public error: any,
    public message: string,
    public details?: string,
    public code?: number
  ) {}

  static fromError(err: any) {
    return new AuthError(
      err,
      err?.message ?? err?.code ?? "failure",
      err?.details ?? err?.message ?? err?.code ?? err,
      500
    );
  }

  toString() {
    let out = "";
    if (this.message) out += `${this.message}`;
    if (this.details)
      out += this.message ? `: ${this.details}` : `${this.details}`;

    return out ?? `${this.error}` ?? "An error occured";
  }

  toResponse(res: Response) {
    return res.status(this.code ? this.code : 400).send(this.toString());
  }
}
