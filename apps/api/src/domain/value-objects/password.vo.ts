import * as bcrypt from 'bcrypt';

export class Password {
  private readonly hashed: string;

  private constructor(hashed: string) {
    this.hashed = hashed;
  }

  static async fromPlain(plain: string): Promise<Password> {
    const hash = await bcrypt.hash(plain, 12);
    return new Password(hash);
  }

  static fromHash(hash: string): Password {
    return new Password(hash);
  }

  async matches(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.hashed);
  }

  toString(): string {
    return this.hashed;
  }
}