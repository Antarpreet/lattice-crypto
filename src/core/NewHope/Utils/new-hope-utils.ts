import NumberUtils from '../../../utils/number-utils';
import MatrixUtils from '../../../utils/matrix-utils';
import BitUtils from '../../../utils/bit-utils';

const numberUtils = new NumberUtils();
const matrixUtils = new MatrixUtils();
const bitUtils = new BitUtils();

export default class NewHopeUtils {
  // Computes helpRec()
  helpRec(vv: number[], bit: number, q: number): number[] {
    const rr = new Array(vv.length);
    for (let i = 0; i < vv.length; i++) {
      rr[i] = ((vv[i] + bit * 0.5) * 4.0) / q;
    }
    this.cvp(rr);
    return rr;
  }

  // Computes CVP()
  cvp(vCoefficients: number[]): void {
    for (let i = 0; i < vCoefficients.length / 4; i++) {
      const x0 = vCoefficients[i];
      const x1 = vCoefficients[i + vCoefficients.length / 4];
      const x2 = vCoefficients[i + vCoefficients.length / 2];
      const x3 = vCoefficients[i + vCoefficients.length - vCoefficients.length / 4];

      const v00 = Math.round(x0);
      const v01 = Math.round(x1);
      const v02 = Math.round(x2);
      const v03 = Math.round(x3);

      const v10 = Math.round(x0 - 0.5);
      const v11 = Math.round(x1 - 0.5);
      const v12 = Math.round(x2 - 0.5);
      const v13 = Math.round(x3 - 0.5);

      let vk0 = 0;
      let vk1 = 0;
      let vk2 = 0;
      let vk3 = 0;
      let kk = 0;
      if (numberUtils.norm1(x0 - v00, x1 - v01, x2 - v02, x3 - v03) < 1) {
        vk0 = v00;
        vk1 = v01;
        vk2 = v02;
        vk3 = v03;
        kk = 0;
      } else {
        vk0 = v10;
        vk1 = v11;
        vk2 = v12;
        vk3 = v13;
        kk = 1;
      }
      vk0 = vk0 + -1.0 * vk3;
      vk1 = vk1 + -1.0 * vk3;
      vk2 = vk2 + -1.0 * vk3;
      vk3 = kk + 2.0 * vk3;

      vCoefficients[i] = numberUtils.mod(vk0, 4);
      vCoefficients[i + vCoefficients.length / 4] = numberUtils.mod(vk1, 4);
      vCoefficients[i + vCoefficients.length / 2] = numberUtils.mod(vk2, 4);
      vCoefficients[i + vCoefficients.length - vCoefficients.length / 4] = numberUtils.mod(vk3, 4);
    }
  }

  // Computes Rec()
  rec(vCoefficients: number[], rCoefficients: number[], BMatrix: number[][], q: number): number[] {
    const kk = new Array(rCoefficients.length / 4);
    for (let i = 0; i < vCoefficients.length / 4; i++) {
      const v0 = (vCoefficients[i] * 1.0) / q;
      const v11 = (vCoefficients[i + vCoefficients.length / 4] * 1.0) / q;
      const v2 = (vCoefficients[i + vCoefficients.length / 2] * 1.0) / q;
      const v3 = (vCoefficients[i + vCoefficients.length - vCoefficients.length / 4] * 1.0) / q;

      const r0 = rCoefficients[i];
      const r1 = rCoefficients[i + rCoefficients.length / 4];
      const r2 = rCoefficients[i + rCoefficients.length / 2];
      const r3 = rCoefficients[i + rCoefficients.length - rCoefficients.length / 4];

      const rVector = [r0, r1, r2, r3];
      const rTBT = matrixUtils.vector_multiply_matrix(rVector, BMatrix, BMatrix[0].length);

      kk[i] = this.decode(v0 - rTBT[0] / 4.0, v11 - rTBT[1] / 4.0, v2 - rTBT[2] / 4.0, v3 - rTBT[3] / 4.0);
    }
    return kk;
  }

  // Decoding function
  decode(x0: number, x1: number, x2: number, x3: number): number {
    const v0 = x0 - Math.round(x0);
    const v11 = x1 - Math.round(x1);
    const v2 = x2 - Math.round(x2);
    const v3 = x3 - Math.round(x3);

    let kk = 0;
    if (numberUtils.norm1(v0, v11, v2, v3) <= 1) {
      kk = 0;
    } else {
      kk = 1;
    }
    return kk;
  }
  // Binomial sampling
  testBinomialSample(value: number): number {
    let sum = 0;
    sum =
      bitUtils.getBit(value, 0) -
      bitUtils.getBit(value, 16) +
      (bitUtils.getBit(value, 1) - bitUtils.getBit(value, 17)) +
      (bitUtils.getBit(value, 2) - bitUtils.getBit(value, 18)) +
      (bitUtils.getBit(value, 3) - bitUtils.getBit(value, 19)) +
      (bitUtils.getBit(value, 4) - bitUtils.getBit(value, 20)) +
      (bitUtils.getBit(value, 5) - bitUtils.getBit(value, 21)) +
      (bitUtils.getBit(value, 6) - bitUtils.getBit(value, 22)) +
      (bitUtils.getBit(value, 7) - bitUtils.getBit(value, 23)) +
      (bitUtils.getBit(value, 8) - bitUtils.getBit(value, 24)) +
      (bitUtils.getBit(value, 9) - bitUtils.getBit(value, 25)) +
      (bitUtils.getBit(value, 10) - bitUtils.getBit(value, 26)) +
      (bitUtils.getBit(value, 11) - bitUtils.getBit(value, 27)) +
      (bitUtils.getBit(value, 12) - bitUtils.getBit(value, 28)) +
      (bitUtils.getBit(value, 13) - bitUtils.getBit(value, 29)) +
      (bitUtils.getBit(value, 14) - bitUtils.getBit(value, 30)) +
      (bitUtils.getBit(value, 15) - bitUtils.getBit(value, 31));
    // return sum;
    return Math.abs(sum);
  }
}
