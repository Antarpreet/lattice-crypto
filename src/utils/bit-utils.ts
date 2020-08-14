export default class BitUtils {
  /**
   * This shifts the bits in the number to the right by the index and does a logical compare to check if the bit is 1 or zero
   *
   * @param decimal the incoming number to check for bits on
   * @param index the number of bits to shift to the right.
   */
  getBit(decimal: number, index: number): number {
    return (decimal >> index) & 1;
  }
}
