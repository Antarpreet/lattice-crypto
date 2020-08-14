import random from '../utils/prng';
export default class NumberUtils {
  /**
   * Returns the next pseudorandom, uniformly distributed integer between 0(inclusive) and q-1(inclusive)
   * input (12289)
   * returns a number between 0 and 12288
   *
   * @param q the max number to return from greater than zero
   */
  nextInt(q: number): number {
    return Math.floor(random.randomGenerator() * q);
  }

  /**
   * Returns the pseudorandom integer value between low(inclusive) and high(inclusive)
   * input (3, 302848)
   * returns returns a number between 3 and 302848
   *
   * @param low the lowest number in the range to return
   * @param high the highest number in the range to return. (must be greater then the low number)
   */
  rangeValue(low: number, high: number): number {
    return Math.floor(random.randomGenerator() * (high - low + 1) + low);
  }

  // Computes norm1
  norm1(x0: number, x1: number, x2: number, x3: number): number {
    return Math.abs(x0) + Math.abs(x1) + Math.abs(x2) + Math.abs(x3);
  }

  // Modulo modulus
  mod(x: number, modulus: number): number {
    let remainder = 0;
    if (modulus === 4) {
      remainder = x & 3;
    } else if (modulus === 2048) {
      remainder = x & 2047;
    } else {
      remainder %= modulus;
      while (remainder < 0) {
        remainder += modulus;
      }
    }
    return remainder;
  }
}
