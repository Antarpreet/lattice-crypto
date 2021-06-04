import { Algorithm, Action } from '../../../models/lattice-types';
import { Lizard as LizardConfig } from '../config';
import MatrixUtils from '../../../utils/matrix-utils';

const matrixUtils = new MatrixUtils();

export default class LizardUtils {
  encrypt(
    l: number,
    n: number,
    p: number,
    q: number,
    sharedRandomness: number[][],
    publicKeyA: number[][],
    mTranspose: number[],
  ): { av: number[]; bv: number[] } {
    const rVectorTranspose = LizardConfig.rr; // Z^1*m
    const c1PrimeTranspose = matrixUtils.vectorMultiplyMatrix(Algorithm.LIZARD, rVectorTranspose, sharedRandomness, Action.ENCRYPT);
    const c2PrimeTranspose = matrixUtils.vectorMultiplyMatrix(Algorithm.LIZARD, rVectorTranspose, publicKeyA, Action.ENCRYPT);

    const c1Transpose: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      c1PrimeTranspose[i] = c1PrimeTranspose[i] % q;
      c1Transpose[i] = Math.round(0.25 * c1PrimeTranspose[i]) % p;
      if (c1Transpose[i] < 0) {
        c1Transpose[i] += p;
      }
    }

    const c2Transpose: number[] = new Array(l);
    for (let i = 0; i < l; i++) {
      c2PrimeTranspose[i] = c2PrimeTranspose[i] % q;
      c2Transpose[i] = Math.round(mTranspose[i] + 0.25 * c2PrimeTranspose[i]) % p;
      if (c2Transpose[i] < 0) {
        c2Transpose[i] += p;
      }
    }

    const av = c1Transpose;
    const bv = c2Transpose;

    return {
      av,
      bv,
    };
  }

  decrypt(l: number, t: number, privateKeyA: number[][], av: number[], bv: number[]): number[] {
    const c1vectorTranspose = av;
    const c2vectorTranspose = bv;

    const c1TS = matrixUtils.vectorMultiplyMatrix(Algorithm.LIZARD, c1vectorTranspose, privateKeyA, Action.DECRYPT);
    const resultVectorTranspose = matrixUtils.vectorSubtract(c2vectorTranspose, c1TS);
    // resultVector = scalarMultiply(0.0078125, resultVectorTranspose);	// t/p = 1/128
    const resultVector = new Array(l);
    for (let i = 0; i < l; i++) {
      resultVector[i] = Math.round(0.0078125 * resultVectorTranspose[i]) % t;
      if (resultVector[i] < 0) {
        resultVector[i] += t;
      }
    }

    return resultVector;
  }
}
