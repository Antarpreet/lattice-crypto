import NumberUtils from '../../../utils/number-utils';
import MatrixUtils from '../../../utils/matrix-utils';
import BitUtils from '../../../utils/bit-utils';
import { Algorithm } from '../../../models/LatticeCrypto';
import { Kyber as KyberConfig } from '../config';
import LatticeUtils from '../../../utils/lattice-utils';

const numberUtils = new NumberUtils();
const matrixUtils = new MatrixUtils();
const bitUtils = new BitUtils();
const utils = new LatticeUtils();

export default class KyberUtils {
  compress2d(modulus: number, qq: number, v: number[], n: number): number[] {
    if (modulus <= 0) {
      alert('modulus not positive');
      return [];
    }

    const vector: number[] = matrixUtils.copyOf(v.slice(), v.length);
    for (let j = 0; j < n; j++) {
      vector[j] = Math.round((vector[j] * 1.0 * modulus) / qq);
      if (modulus === 2048) {
        vector[j] = vector[j] & 2047;
      } else if (modulus === 8) {
        vector[j] = vector[j] & 7;
      } else {
        vector[j] %= modulus;
        if (vector[j] < 0) {
          vector[j] += modulus;
        }
      }
    }
    return vector;
  }

  decompress2d(pow2d: number, qq: number, v: number[], n: number): number[] {
    const vector: number[] = matrixUtils.copyOf(v.slice(), v.length);
    for (let j = 0; j < n; j++) {
      vector[j] = Math.round((vector[j] * 1.0 * qq) / pow2d);
    }
    return vector;
  }

  // Binomial sampling
  testBinomialSample(value: number): number {
    let sum = 0;
    sum =
      bitUtils.getBit(value, 0) -
      bitUtils.getBit(value, 4) +
      (bitUtils.getBit(value, 1) - bitUtils.getBit(value, 5)) +
      (bitUtils.getBit(value, 2) - bitUtils.getBit(value, 6)) +
      (bitUtils.getBit(value, 3) - bitUtils.getBit(value, 7));
    return sum;
  }

  encrypt(publicKeyA: number[][][], sharedRandomness: number[][][], nttM3841: number[], q: number, n: number): number[][][] {
    const temp: number[][][] = [new Array(3)];

    for (let row = 0; row < temp.length; row++) {
      for (let column = 0; column < temp[row].length; column++) {
        temp[row][column] = this.decompress2d(2048, q, publicKeyA[row][column], n);
      }
    }

    const vectorInit: number[][][] = [[Array(n), Array(n), Array(n)]];

    const errorDistributionInit: number[][][] = [[Array(n), Array(n), Array(n)], [Array(n)]];

    const vector: number[][][] = [new Array(3)];

    const errorDistribution: number[][][] = [new Array(3), new Array(1)];

    const sharedSecret: number[][][] = [[Array(n), Array(n), Array(n)], [Array(n)]];

    for (let i = 0; i < n; i++) {
      for (let row = 0; row < vectorInit.length; row++) {
        for (let column = 0; column < vectorInit[row].length; column++) {
          vectorInit[row][column][i] = this.testBinomialSample(numberUtils.nextInt(n));
        }
      }
    }

    for (let i = 0; i < n; i++) {
      for (let row = 0; row < errorDistributionInit.length; row++) {
        for (let column = 0; column < errorDistributionInit[row].length; column++) {
          errorDistributionInit[row][column][i] = this.testBinomialSample(numberUtils.nextInt(n));
        }
      }
    }

    for (let row = 0; row < vector.length; row++) {
      for (let column = 0; column < vector[row].length; column++) {
        vector[row][column] = utils.NTT(
          Algorithm.KYBER,
          vectorInit[row][column],
          vectorInit[row][column].length,
          KyberConfig.bitRev_psi_7681_256,
          q,
        );
      }
    }

    for (let row = 0; row < errorDistribution.length; row++) {
      for (let column = 0; column < errorDistribution[row].length; column++) {
        errorDistribution[row][column] = utils.NTT(
          Algorithm.KYBER,
          errorDistributionInit[row][column],
          errorDistributionInit[row][column].length,
          KyberConfig.bitRev_psi_7681_256,
          q,
        );
      }
    }

    const someKeyB: number[][][] = [new Array(3)];

    for (let row = 0; row < someKeyB.length; row++) {
      for (let column = 0; column < someKeyB[row].length; column++) {
        someKeyB[row][column] = utils.NTT(Algorithm.KYBER, temp[row][column], temp[row][column].length, KyberConfig.bitRev_psi_7681_256, q);
      }
    }

    for (let i = 0; i < n; i++) {
      // Component multiply; point-wise multiplication
      let x1 = vector[0][0][i] * sharedRandomness[0][0][i];
      let x2 = vector[0][1][i] * sharedRandomness[1][0][i];
      let x3 = vector[0][2][i] * sharedRandomness[2][0][i];
      sharedSecret[0][0][i] = (x1 + x2 + x3 + errorDistribution[0][0][i]) % q;

      x1 = vector[0][0][i] * sharedRandomness[0][1][i];
      x2 = vector[0][1][i] * sharedRandomness[1][1][i];
      x3 = vector[0][2][i] * sharedRandomness[2][1][i];
      sharedSecret[0][1][i] = (x1 + x2 + x3 + errorDistribution[0][1][i]) % q;

      x1 = vector[0][0][i] * sharedRandomness[0][2][i];
      x2 = vector[0][1][i] * sharedRandomness[1][2][i];
      x3 = vector[0][2][i] * sharedRandomness[2][2][i];
      sharedSecret[0][2][i] = (x1 + x2 + x3 + errorDistribution[0][2][i]) % q;

      x1 = vector[0][0][i] * someKeyB[0][0][i];
      x2 = vector[0][1][i] * someKeyB[0][1][i];
      x3 = vector[0][2][i] * someKeyB[0][2][i];
      sharedSecret[1][0][i] = (x1 + x2 + x3 + errorDistribution[1][0][i] + nttM3841[i]) % q;
    }

    const tempC: number[][][] = [new Array(3), new Array(1)];

    for (let row = 0; row < tempC.length; row++) {
      for (let column = 0; column < tempC[row].length; column++) {
        tempC[row][column] = utils.INTT(
          Algorithm.KYBER,
          sharedSecret[row][column],
          sharedSecret[row][column].length,
          KyberConfig.bitRev_psiInv_7681_256,
          q,
          KyberConfig.INVN,
        );
      }
    }
    console.log(Buffer.from(tempC.toString()).toString('utf8').length);

    const cipherText: number[][][] = [new Array(3), new Array(1)];

    for (let row = 0; row < cipherText.length; row++) {
      for (let column = 0; column < cipherText[row].length; column++) {
        if (row === 0) {
          cipherText[row][column] = this.compress2d(2048, q, tempC[row][column], n);
        } else {
          cipherText[row][column] = this.compress2d(8, q, tempC[row][column], n);
        }
      }
    }

    return cipherText;
  }

  decrypt(cipherText: number[][][], privateKeyA: number[][][], q: number, n: number): number[] {
    const tempC: number[][][] = [new Array(3), new Array(1)];

    for (let row = 0; row < tempC.length; row++) {
      for (let column = 0; column < tempC[row].length; column++) {
        if (row === 0) {
          tempC[row][column] = this.decompress2d(2048, q, cipherText[row][column], n);
        } else {
          tempC[row][column] = this.decompress2d(8, q, cipherText[row][column], n);
        }
      }
    }

    const someKeyC: number[][][] = [new Array(3), new Array(1)];

    for (let row = 0; row < someKeyC.length; row++) {
      for (let column = 0; column < someKeyC[row].length; column++) {
        someKeyC[row][column] = utils.NTT(
          Algorithm.KYBER,
          tempC[row][column],
          tempC[row][column].length,
          KyberConfig.bitRev_psi_7681_256,
          q,
        );
      }
    }

    const nttV00 = new Array(n);

    for (let i = 0; i < n; i++) {
      const x1 = privateKeyA[0][0][i] * someKeyC[0][0][i];
      const x2 = privateKeyA[0][1][i] * someKeyC[0][1][i];
      const x3 = privateKeyA[0][2][i] * someKeyC[0][2][i];
      // v = c2 - f
      nttV00[i] = (someKeyC[1][0][i] - (x1 + x2 + x3)) % q;
      while (nttV00[i] < 0) {
        nttV00[i] += q;
      }
    }

    const tempV00 = utils.INTT(Algorithm.KYBER, nttV00, nttV00.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
    const v00 = this.compress2d(2, q, tempV00, n);

    return v00;
  }
}
