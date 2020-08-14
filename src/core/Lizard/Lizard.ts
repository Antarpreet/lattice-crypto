import { Algorithm, Action } from '../../models/LatticeCrypto';
import { Lizard as LizardConfig } from './config';
import NumberUtils from '../../utils/number-utils';
import MatrixUtils from '../../utils/matrix-utils';

const matrixUtils = new MatrixUtils();
const numberUtils = new NumberUtils();

export default class Lizard {}

// ------------------------------------------- start lizard -------------------------------------------
const m = 960;
const n = 608;
const l = 256;
const t = 2;
const p = 256;
const q = 1024;
const h = 128;
const r = 1;
const alpha = 0.000363;

function testLizard() {
  console.log('Test Lizard:');
  console.log('Input:');
  console.log('m = ' + m);
  console.log('n = ' + n);
  console.log('l = ' + l);
  console.log('t = ' + t);
  console.log('p = ' + p);
  console.log('q = ' + q);
  console.log('h = ' + h);
  console.log('α = ' + alpha);

  const { vVector, mTranspose } = randomPlaintext();
  const { am, bm, sm } = keyGeneration(m, n, q);
  const { av, bv } = encrypt(l, n, p, q, am, bm, mTranspose);
  const resultVector = decrypt(l, t, sm, av, bv);

  console.log('Output:');
  const ms = vVector.toString();
  console.log('plaintext =  ' + ms);
  const ts = resultVector.toString();
  console.log('result = ' + ts);

  if (ts === ms) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
}

testLizard();

function randomPlaintext(): { vVector: number[]; mTranspose: number[] } {
  const plaintext: number[] = new Array(l);
  for (let i = 0; i < l; i++) {
    plaintext[i] = numberUtils.nextInt(2);
  }
  const vVector = plaintext;
  const mTranspose = matrixUtils.scalarMultiplyVector(128, vVector);

  return {
    vVector,
    mTranspose,
  };
}

function keyGeneration(mm: number, nn: number, qq: number): { am: number[][]; bm: number[][]; sm: number[][] } {
  // A, m*n
  const aMatrix = matrixUtils.initMatrixRandom(mm, nn, qq);
  // var aMatrix = aa;	// Does not apply in WSH
  // S, n*l
  const sMatrix = LizardConfig.ss;
  // E, m*l
  const eMatrix = LizardConfig.ee;
  // B = AS + E mod q, m*l
  let bMatrix = matrixUtils.multiply(Algorithm.LIZARD, aMatrix, sMatrix);
  bMatrix = matrixUtils.addMod(bMatrix, eMatrix, qq);

  const am = aMatrix;
  const bm = bMatrix;
  const sm = sMatrix;

  return {
    am,
    bm,
    sm,
  };
}

function encrypt(
  ll: number,
  nn: number,
  pp: number,
  qq: number,
  am: number[][],
  bm: number[][],
  mTranspose: number[],
): { av: number[]; bv: number[] } {
  const aMatrix = am;
  const bMatrix = bm;

  const rVectorTranspose = LizardConfig.rr; // Z^1*m
  const c1PrimeTranspose = matrixUtils.vectorMultiplyMatrix(Algorithm.LIZARD, rVectorTranspose, aMatrix, Action.ENCRYPT);
  const c2PrimeTranspose = matrixUtils.vectorMultiplyMatrix(Algorithm.LIZARD, rVectorTranspose, bMatrix, Action.ENCRYPT);

  const c1Transpose: number[] = new Array(nn);
  for (let i = 0; i < nn; i++) {
    c1PrimeTranspose[i] = c1PrimeTranspose[i] % qq;
    c1Transpose[i] = Math.round(0.25 * c1PrimeTranspose[i]) % pp;
    if (c1Transpose[i] < 0) {
      c1Transpose[i] += pp;
    }
  }

  const c2Transpose: number[] = new Array(ll);
  for (let i = 0; i < ll; i++) {
    c2PrimeTranspose[i] = c2PrimeTranspose[i] % qq;
    c2Transpose[i] = Math.round(mTranspose[i] + 0.25 * c2PrimeTranspose[i]) % pp;
    if (c2Transpose[i] < 0) {
      c2Transpose[i] += pp;
    }
  }

  const av = c1Transpose;
  const bv = c2Transpose;

  return {
    av,
    bv,
  };
}

function decrypt(ll: number, tt: number, sm: number[][], av: number[], bv: number[]): number[] {
  const c1vectorTranspose = av;
  const c2vectorTranspose = bv;
  const sMatrix = sm;

  const c1TS = matrixUtils.vectorMultiplyMatrix(Algorithm.LIZARD, c1vectorTranspose, sMatrix, Action.DECRYPT);
  const resultVectorTranspose = matrixUtils.vectorSubtract(c2vectorTranspose, c1TS);
  // resultVector = scalarMultiply(0.0078125, resultVectorTranspose);	// t/p = 1/128
  const resultVector = new Array(ll);
  for (let i = 0; i < ll; i++) {
    resultVector[i] = Math.round(0.0078125 * resultVectorTranspose[i]) % tt;
    if (resultVector[i] < 0) {
      resultVector[i] += tt;
    }
  }

  return resultVector;
}
