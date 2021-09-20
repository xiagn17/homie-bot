import { Injectable } from '@nestjs/common';

@Injectable()
export class SendpulseStore {
  private authToken: string;

  private tokenType: string;

  private expiresIn: number;

  private creationTime: number;

  constructor() {
    this.resetToken();
  }

  public setToken(authToken: string, tokenType: string, expiresIn: number): string {
    this.authToken = authToken;
    this.tokenType = tokenType;
    this.expiresIn = expiresIn;
    this.creationTime = Date.now();

    return this.getFullToken() as string;
  }

  public getFullToken(): string | null {
    if (this.creationTime === 0 || this.isExpired()) {
      this.resetToken();
      return null;
    }
    return `${this.tokenType} ${this.authToken}`;
  }

  private isExpired(): boolean {
    return this.creationTime + this.expiresIn - 50 <= Date.now();
  }

  private resetToken(): void {
    this.authToken = '';
    this.tokenType = '';
    this.expiresIn = 0;
    this.creationTime = 0;
  }
}
