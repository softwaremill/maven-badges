export interface ConfigOptions {
  redisPort?: string;
  redisUrl?: string;
  redirect?: string;
  redirectUrl?: string;
}

export class Config {
  public redisPort: string;
  public redisUrl: string;
  public redirect: string;
  public redirectUrl: string;

  constructor(options: ConfigOptions = {}) {
    this.redisPort = options.redisPort || process.env.PORT || '8080';
    this.redisUrl = options.redirectUrl || process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    this.redirect = options.redirect || process.env.REDIRECT || 'false';
    this.redirectUrl = options.redirectUrl || process.env.REDIRECT_URL || 'https://maven-badges.sml.io/';
  }

  isRedirect(): boolean {
    return this.redirect === 'true' && this.redirectUrl !== '';
  }
}

export const config = new Config();
