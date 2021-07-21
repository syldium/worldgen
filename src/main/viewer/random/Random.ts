// Typescript version of https://github.com/PrismarineJS/prismarine-rng/blob/master/lib/Random.js
const P27 = Math.pow(2, 27);
const P53 = Math.pow(2, 53);

export class Random {
  private seed: bigint;
  private readonly lcg: LCG;

  constructor(seed: bigint, lcg = LCG.JAVA) {
    this.seed = seed ^ LCG.JAVA.multiplier;
    this.lcg = lcg;
  }

  next(bits: number): bigint {
    this.seed = this.lcg.nextSeed(this.seed);
    return this.seed >> (48n - BigInt(bits));
  }

  nextInt(bound: number): number {
    if (!bound) return Number(BigInt.asIntN(32, this.next(32)));

    if (bound <= 0) {
      throw new Error('bound must be positive');
    }

    bound = Math.floor(bound);

    if ((bound & -bound) === bound) {
      return Number(BigInt.asIntN(32, (BigInt(bound) * this.next(31)) >> 31n));
    }

    let bits, value;
    do {
      bits = Number(BigInt.asIntN(32, this.next(31)));
      value = bits % bound;
    } while (bits - value + (bound - 1) < 0);

    return value;
  }

  nextFloat(): number {
    return Number(BigInt.asIntN(32, this.next(24))) / (1 << 24);
  }

  nextLong(): bigint {
    return (this.next(32) << 32n) + this.next(32);
  }

  nextDouble(): number {
    return (Number(this.next(26)) * P27 + Number(this.next(27))) / P53;
  }

  advance(lcg: LCG): void {
    this.seed = lcg.nextSeed(this.seed);
  }

  skip(skip: number): void {
    this.advance(this.lcg.combine(skip));
  }
}

class LCG {
  readonly multiplier: bigint;
  readonly addend: bigint;
  readonly modulus: bigint;
  readonly mod: bigint;

  static JAVA = new LCG(0x5deece66dn, 0xbn, 1n << 48n);

  constructor(multiplier: bigint, addend: bigint, modulus: bigint) {
    this.multiplier = multiplier;
    this.addend = addend;
    this.modulus = modulus;
    if ((modulus & -modulus) !== modulus)
      throw new Error('Modulus is not a power of 2');
    this.mod = modulus - 1n;
  }

  nextSeed(seed: bigint) {
    return (seed * this.multiplier + this.addend) & this.mod;
  }

  combine(steps: number): LCG {
    let multiplier = 1n;
    let addend = 0n;

    let intermediateMultiplier = this.multiplier;
    let intermediateAddend = this.addend;

    const longSteps = BigInt(steps) & this.mod;
    for (let k = longSteps; k !== 0n; k >>= 1n) {
      if ((k & 1n) !== 0n) {
        multiplier = BigInt.asIntN(64, multiplier * intermediateMultiplier);
        addend = BigInt.asIntN(
          64,
          intermediateMultiplier * addend + intermediateAddend
        );
      }

      intermediateAddend = BigInt.asIntN(
        64,
        (intermediateMultiplier + 1n) * intermediateAddend
      );
      intermediateMultiplier = BigInt.asIntN(
        64,
        intermediateMultiplier * intermediateMultiplier
      );
    }

    multiplier = multiplier & this.mod;
    addend = addend & this.mod;

    return new LCG(multiplier, addend, this.modulus);
  }
}
