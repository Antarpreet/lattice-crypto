import { Algorithm } from '../models/LatticeCrypto';
import MatrixUtils from './matrix-utils';
const matrixUtils = new MatrixUtils();
export default class LatticeUtils {
  // Kyber
  // utils.INTT('kyber', A, n, bitRev_psiInv_7681_256, q, INVN);

  // NewHope
  // utils.INTT('newHope', A, n, bitRev_psiInv_12289_1024, q, INVN);

  // Gentleman-Sande (GS) inverse number theoretic transform
  /**
   * Inverse NTT
   * @param algorithm the name of algorithm used in the switch statement.
   * @param A the known uniformly random
   * @param n
   * @param bitRevPsiInv
   * @param modulus (q)
   * @param INVN
   */
  INTT(algorithm: Algorithm, A: number[], n: number, bitRevPsiInv: number[], modulus: number, INVN: number): number[] {
    // console.log('algorithm');
    // console.log(algorithm);
    // console.log('A');
    // console.log(A);
    // console.log('n');
    // console.log(n);
    // console.log('bitREVPSI');
    // console.log(bitRevPsiInv);
    // console.log('q')
    // console.log(modulus);
    // console.log('INVN');
    // console.log(INVN);
    const NTT_A_COEFF: number[] = matrixUtils.copyOf(A.slice(), n); // create a copy of the array at the
    // console.log('NTT_A_COEFF')
    // console.log(NTT_A_COEFF);
    let t = 1;
    for (let m = n; m > 1; m >>= 1) {
      let j1 = 0;
      const h = m >> 1;
      for (let i = 0; i < h; i++) {
        const j2 = j1 + t - 1;
        const S = bitRevPsiInv[h + i];
        for (let j = j1; j <= j2; j++) {
          const U = NTT_A_COEFF[j];
          const V = NTT_A_COEFF[j + t];
          NTT_A_COEFF[j] = (U + V) % modulus;
          let temp = U - V;

          switch (algorithm) {
            case Algorithm.KYBER:
              while (NTT_A_COEFF[j] < 0) {
                NTT_A_COEFF[j] = NTT_A_COEFF[j] + modulus;
              }

              while (temp < 0) {
                temp += modulus;
              }
              break;
            case Algorithm.NEW_HOPE:
              if (temp < 0) {
                temp += modulus;
              }
              break;
            default:
              break;
          }
          NTT_A_COEFF[j + t] = (temp * S) % modulus;
        }
        j1 = j1 + (t << 1);
      }
      t <<= 1;
    }
    for (let j = 0; j < n; j++) {
      NTT_A_COEFF[j] = (NTT_A_COEFF[j] * INVN) % modulus;
    }
    return NTT_A_COEFF;
  }

  // Kyber
  // utils.NTT('kyber', A, n, bitRev_psi_7681_256, q);

  // NewHope
  // utils.NTT('newHope', A, n, bitRev_psi_12289_1024, q);

  // Cooley-Tukey(CT) forward number theoretic transform
  NTT(algorithm: Algorithm, A: number[], n: number, bitRevPsi: number[], q: number): number[] {
    const NTT_A_COEFF: number[] = matrixUtils.copyOf(A.slice(), n);
    let t = n;
    for (let m = 1; m < n; m <<= 1) {
      t >>= 1;
      for (let i = 0; i < m; i++) {
        const j1 = (i << 1) * t;
        const j2 = j1 + t - 1;
        const S = bitRevPsi[m + i];
        for (let j = j1; j <= j2; j++) {
          const U = NTT_A_COEFF[j];
          const V = NTT_A_COEFF[j + t] * S;
          NTT_A_COEFF[j] = (U + V) % q;
          switch (algorithm) {
            case Algorithm.KYBER:
              while (NTT_A_COEFF[j] < 0) {
                NTT_A_COEFF[j] = NTT_A_COEFF[j] + q;
              }
              NTT_A_COEFF[j + t] = (U - V) % q;
              while (NTT_A_COEFF[j + t] < 0) {
                NTT_A_COEFF[j + t] = NTT_A_COEFF[j + t] + q;
              }
              break;
            case Algorithm.NEW_HOPE:
              NTT_A_COEFF[j + t] = (U - V) % q;
              if (NTT_A_COEFF[j + t] < 0) {
                NTT_A_COEFF[j + t] = NTT_A_COEFF[j + t] + q;
              }
              break;
            default:
              break;
          }
        }
      }
    }
    return NTT_A_COEFF;
  }
}

// const utils = new Utils();
// const value = utils.getBit(1.232312312, 3);
// console.log(value);
