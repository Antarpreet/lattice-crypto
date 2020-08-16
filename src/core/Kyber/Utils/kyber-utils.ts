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
      
    keyGeneration(
        sharedRandomness: number[][][],
        privateKeyA: number[][][],
        errorDistribution: number[][][],
        q: number,
        n: number
      ): number[][][] {
        const publicKeyB: number[][][] = [
            [Array(n), Array(n), Array(n)]
        ];

        let x1 = 0;
        let x2 = 0;
        let x3 = 0;
        for (let i = 0; i < n; i++) {
            x1 = privateKeyA[0][0][i] * sharedRandomness[0][0][i];
            x2 = privateKeyA[0][1][i] * sharedRandomness[0][1][i];
            x3 = privateKeyA[0][2][i] * sharedRandomness[0][2][i];
            publicKeyB[0][0][i] = (x1 + x2 + x3 + errorDistribution[0][0][i]) % q;
        
            x1 = privateKeyA[0][0][i] * sharedRandomness[1][0][i];
            x2 = privateKeyA[0][1][i] * sharedRandomness[1][1][i];
            x3 = privateKeyA[0][2][i] * sharedRandomness[1][2][i];
            publicKeyB[0][1][i] = (x1 + x2 + x3 + errorDistribution[0][1][i]) % q;
        
            x1 = privateKeyA[0][0][i] * sharedRandomness[2][0][i];
            x2 = privateKeyA[0][1][i] * sharedRandomness[2][1][i];
            x3 = privateKeyA[0][2][i] * sharedRandomness[2][2][i];
            publicKeyB[0][2][i] = (x1 + x2 + x3 + errorDistribution[0][2][i]) % q;
        }

        const temp: number[][][] = [
            new Array(3)
        ];

        for (let row = 0; row < temp.length; row++) {
            for (let column = 0; column < temp[row].length; column++) {
                temp[row][column] =
                    utils.INTT(Algorithm.KYBER, publicKeyB[row][column], publicKeyB[row][column].length,
                        KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
            }
        }

        const publicKeyA: number[][][] = [
            new Array(3)
        ];
        for (let row = 0; row < temp.length; row++) {
            for (let column = 0; column < temp[row].length; column++) {
                publicKeyA[row][column] =
                    this.compress2d(2048, q, temp[row][column], n);
            }
        }

        return publicKeyA;
        // const s00 = new Array(n);
        // const s01 = new Array(n);
        // const s02 = new Array(n);
        // const e00 = new Array(n);
        // const e01 = new Array(n);
        // const e02 = new Array(n);
        // const nttB00 = new Array(n);
        // const nttB01 = new Array(n);
        // const nttB02 = new Array(n);
      
        // for (let i = 0; i < n; i++) {
        //   s00[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   s01[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   s02[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   e00[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   e01[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   e02[i] = this.testBinomialSample(numberUtils.nextInt(n));
        // }
        // const nttS00 = utils.NTT(Algorithm.KYBER, s00, s00.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttS01 = utils.NTT(Algorithm.KYBER, s01, s01.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttS02 = utils.NTT(Algorithm.KYBER, s02, s02.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttE00 = utils.NTT(Algorithm.KYBER, e00, e00.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttE01 = utils.NTT(Algorithm.KYBER, e01, e01.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttE02 = utils.NTT(Algorithm.KYBER, e02, e02.length, KyberConfig.bitRev_psi_7681_256, q);
      
        // for (let i = 0; i < n; i++) {
        //   // Component multiply; point-wise multiplication
        //   let x1 = nttS00[i] * publicKeyA[0][0][i];
        //   let x2 = nttS01[i] * publicKeyA[0][1][i];
        //   let x3 = nttS02[i] * publicKeyA[0][2][i];
        //   nttB00[i] = (x1 + x2 + x3 + nttE00[i]) % q;
      
        //   x1 = nttS00[i] * publicKeyA[1][0][i];
        //   x2 = nttS01[i] * publicKeyA[1][1][i];
        //   x3 = nttS02[i] * publicKeyA[1][2][i];
        //   nttB01[i] = (x1 + x2 + x3 + nttE01[i]) % q;
      
        //   x1 = nttS00[i] * publicKeyA[2][0][i];
        //   x2 = nttS01[i] * publicKeyA[2][1][i];
        //   x3 = nttS02[i] * publicKeyA[2][2][i];
        //   nttB02[i] = (x1 + x2 + x3 + nttE02[i]) % q;
        // }
        // const tempB00 = utils.INTT(Algorithm.KYBER, nttB00, nttB00.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
        // const tempB01 = utils.INTT(Algorithm.KYBER, nttB01, nttB01.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
        // const tempB02 = utils.INTT(Algorithm.KYBER, nttB02, nttB02.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
        // const b00 = this.compress2d(2048, q, tempB00, n);
        // const b01 = this.compress2d(2048, q, tempB01, n);
        // const b02 = this.compress2d(2048, q, tempB02, n);
      
        // return {
        //   b00,
        //   b01,
        //   b02,
        //   nttS00,
        //   nttS01,
        //   nttS02,
        // };
      }
      
    encrypt(
        publicKeyA: number[][][],
        sharedRandomness: number[][][],
        nttM3841: number[],
        q: number,
        n: number
      ): number[][][] {
        const temp: number[][][] = [
            new Array(3)
        ];

        for (let row = 0; row < temp.length; row++) {
            for (let column = 0; column < temp[row].length; column++) {
                temp[row][column] =
                    this.decompress2d(2048, q, publicKeyA[row][column], n);
            }
        }

        const vectorInit: number[][][] = [
            [Array(n), Array(n), Array(n)]
        ];

        const errorDistributionInit: number[][][] = [
            [Array(n), Array(n), Array(n)],
            [Array(n)]
        ];

        const vector: number[][][] = [
            new Array(3)
        ];

        const errorDistribution: number[][][] = [
            new Array(3),
            new Array(1)
        ];

        const sharedSecret: number[][][] = [
            [Array(n), Array(n), Array(n)],
            [Array(n)]
        ];

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
                vector[row][column] =
                    utils.NTT(Algorithm.KYBER, vectorInit[row][column], vectorInit[row][column].length,
                        KyberConfig.bitRev_psi_7681_256, q);
            }
        }

        for (let row = 0; row < errorDistribution.length; row++) {
            for (let column = 0; column < errorDistribution[row].length; column++) {
                errorDistribution[row][column] =
                    utils.NTT(Algorithm.KYBER, errorDistributionInit[row][column], errorDistributionInit[row][column].length,
                        KyberConfig.bitRev_psi_7681_256, q);
            }
        }

        const someKeyB: number[][][] = [
            new Array(3)
        ];

        for (let row = 0; row < someKeyB.length; row++) {
            for (let column = 0; column < someKeyB[row].length; column++) {
                someKeyB[row][column] =
                    utils.NTT(Algorithm.KYBER, temp[row][column], temp[row][column].length, KyberConfig.bitRev_psi_7681_256, q);
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

        const tempC: number[][][] = [
            new Array(3),
            new Array(1)
        ];

        for (let row = 0; row < tempC.length; row++) {
            for (let column = 0; column < tempC[row].length; column++) {
                tempC[row][column] =
                    utils.INTT(Algorithm.KYBER, sharedSecret[row][column], sharedSecret[row][column].length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
            }
        }

        const cipherText: number[][][] = [
            new Array(3),
            new Array(1)
        ];

        for (let row = 0; row < cipherText.length; row++) {
            for (let column = 0; column < cipherText[row].length; column++) {
                if (row === 0) {
                    cipherText[row][column] =
                        this.compress2d(2048, q, tempC[row][column], n);
                } else {
                    cipherText[row][column] =
                        this.compress2d(8, q, tempC[row][column], n);
                }
            }
        }

        return cipherText;

        // const tempB00 = this.decompress2d(2048, q, b00, n);
        // const tempB01 = this.decompress2d(2048, q, b01, n);
        // const tempB02 = this.decompress2d(2048, q, b02, n);
      
        // const r00 = new Array(n);
        // const r01 = new Array(n);
        // const r02 = new Array(n);
        // const e100 = new Array(n);
        // const e101 = new Array(n);
        // const e102 = new Array(n);
        // const e200 = new Array(n);
        // const nttC100 = new Array(n);
        // const nttC101 = new Array(n);
        // const nttC102 = new Array(n);
        // const nttC200 = new Array(n);
      
        // for (let i = 0; i < n; i++) {
        //   r00[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   r01[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   r02[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   e100[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   e101[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   e102[i] = this.testBinomialSample(numberUtils.nextInt(n));
        //   e200[i] = this.testBinomialSample(numberUtils.nextInt(n));
        // }
        // const nttR00 = utils.NTT(Algorithm.KYBER, r00, r00.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttR01 = utils.NTT(Algorithm.KYBER, r01, r01.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttR02 = utils.NTT(Algorithm.KYBER, r02, r02.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttE100 = utils.NTT(Algorithm.KYBER, e100, e100.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttE101 = utils.NTT(Algorithm.KYBER, e101, e101.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttE102 = utils.NTT(Algorithm.KYBER, e102, e102.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttE200 = utils.NTT(Algorithm.KYBER, e200, e200.length, KyberConfig.bitRev_psi_7681_256, q);
      
        // const nttB00 = utils.NTT(Algorithm.KYBER, tempB00, tempB00.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttB01 = utils.NTT(Algorithm.KYBER, tempB01, tempB01.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttB02 = utils.NTT(Algorithm.KYBER, tempB02, tempB02.length, KyberConfig.bitRev_psi_7681_256, q);
      
        // for (let i = 0; i < n; i++) {
        //   // Component multiply; point-wise multiplication
        //   let x1 = nttR00[i] * nttA00[i];
        //   let x2 = nttR01[i] * nttA10[i];
        //   let x3 = nttR02[i] * nttA20[i];
        //   nttC100[i] = (x1 + x2 + x3 + nttE100[i]) % q;
      
        //   x1 = nttR00[i] * nttA01[i];
        //   x2 = nttR01[i] * nttA11[i];
        //   x3 = nttR02[i] * nttA21[i];
        //   nttC101[i] = (x1 + x2 + x3 + nttE101[i]) % q;
      
        //   x1 = nttR00[i] * nttA02[i];
        //   x2 = nttR01[i] * nttA12[i];
        //   x3 = nttR02[i] * nttA22[i];
        //   nttC102[i] = (x1 + x2 + x3 + nttE102[i]) % q;
      
        //   x1 = nttR00[i] * nttB00[i];
        //   x2 = nttR01[i] * nttB01[i];
        //   x3 = nttR02[i] * nttB02[i];
        //   nttC200[i] = (x1 + x2 + x3 + nttE200[i] + nttM3841[i]) % q;
        // }
      
        // const tempC100 = utils.INTT(Algorithm.KYBER, nttC100, nttC100.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
        // const tempC101 = utils.INTT(Algorithm.KYBER, nttC101, nttC101.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
        // const tempC102 = utils.INTT(Algorithm.KYBER, nttC102, nttC102.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
        // const tempC200 = utils.INTT(Algorithm.KYBER, nttC200, nttC200.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
      
        // const c100 = this.compress2d(2048, q, tempC100, n);
        // const c101 = this.compress2d(2048, q, tempC101, n);
        // const c102 = this.compress2d(2048, q, tempC102, n);
        // const c200 = this.compress2d(8, q, tempC200, n);
      
        // return {
        //   c100,
        //   c101,
        //   c102,
        //   c200,
        // };
      }
      
    decrypt(
        cipherText: number[][][],
        privateKeyA: number[][][],
        q: number,
        n: number,
      ): number[] {
        const tempC: number[][][] = [
            new Array(3),
            new Array(1)
        ];

        for (let row = 0; row < tempC.length; row++) {
            for (let column = 0; column < tempC[row].length; column++) {
                if (row === 0) {
                    tempC[row][column] =
                        this.decompress2d(2048, q, cipherText[row][column], n);
                } else {
                    tempC[row][column] =
                        this.decompress2d(8, q, cipherText[row][column], n);
                }
            }
        }

        const someKeyC: number[][][] = [
            new Array(3),
            new Array(1)
        ];

        for (let row = 0; row < someKeyC.length; row++) {
            for (let column = 0; column < someKeyC[row].length; column++) {
                someKeyC[row][column] = 
                    utils.NTT(Algorithm.KYBER, tempC[row][column], tempC[row][column].length, KyberConfig.bitRev_psi_7681_256, q);
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

        // const tempC100 = this.decompress2d(2048, q, c100, n);
        // const tempC101 = this.decompress2d(2048, q, c101, n);
        // const tempC102 = this.decompress2d(2048, q, c102, n);
        // const tempC200 = this.decompress2d(8, q, c200, n);
      
        // const nttC100 = utils.NTT(Algorithm.KYBER, tempC100, tempC100.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttC101 = utils.NTT(Algorithm.KYBER, tempC101, tempC101.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttC102 = utils.NTT(Algorithm.KYBER, tempC102, tempC102.length, KyberConfig.bitRev_psi_7681_256, q);
        // const nttC200 = utils.NTT(Algorithm.KYBER, tempC200, tempC200.length, KyberConfig.bitRev_psi_7681_256, q);
      
        // for (let i = 0; i < n; i++) {
        //   const x1 = nttS00[i] * nttC100[i];
        //   const x2 = nttS01[i] * nttC101[i];
        //   const x3 = nttS02[i] * nttC102[i];
        //   // v = c2 - f
        //   nttV00[i] = (nttC200[i] - (x1 + x2 + x3)) % q;
        //   while (nttV00[i] < 0) {
        //     nttV00[i] += q;
        //   }
        // }
        const tempV00 = utils.INTT(Algorithm.KYBER, nttV00, nttV00.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
        const v00 = this.compress2d(2, q, tempV00, n);
      
        return v00;
      }
}
