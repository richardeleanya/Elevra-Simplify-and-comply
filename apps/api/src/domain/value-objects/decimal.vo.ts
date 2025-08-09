/**
 * Value object for precise decimal arithmetic as string
 * (Optionally, integrate with decimal.js for advanced ops)
 */
export class DecimalVO {
  private readonly value: string;

  constructor(value: string) {
    // Validate decimal string
    if (!/^-?\d+(\.\d{1,2})?$/.test(value)) {
      throw new Error('Invalid decimal string');
    }
    this.value = value;
  }

  toNumber(): number {
    return parseFloat(this.value);
  }

  toString(): string {
    return this.value;
  }

  add(other: DecimalVO): DecimalVO {
    return new DecimalVO((this.toNumber() + other.toNumber()).toFixed(2));
  }

  mul(factor: number): DecimalVO {
    return new DecimalVO((this.toNumber() * factor).toFixed(2));
  }
}