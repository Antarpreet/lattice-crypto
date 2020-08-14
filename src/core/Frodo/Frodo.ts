import { Algorithm } from '../../models/LatticeCrypto';
import { Frodo as FrodoConfig } from './config';
import MatrixUtils from '../../utils/matrix-utils';

const matrixUtils = new MatrixUtils();

export default class Frodo {}

// ------------------------------------------- start frodo -------------------------------------------
const m = 8;
const n = 752;
const l = 8;
const a = 11;
const b = 4;
const q = 32768;
const logQ = 15;
const sigma = 1.3229;

function testFrodo() {
  console.log('Test Frodo:');
  console.log('Input:');
  console.log('m = ' + m);
  console.log('n = ' + n);
  console.log('l = ' + l);
  console.log('b = ' + b);
  console.log('q = ' + q);
  console.log('sigma = ' + sigma);
  console.log('Output:');

  const { am, bm, sm } = alice0(n, q);
  const { bb, cc, k1Matrix } = bob(l, m, q, am, bm);
  const k2Matrix = alice1(l, m, q, bb, cc, sm);

  const ka = k2Matrix.toString();
  console.log('k_a = ' + ka);
  const kb = k1Matrix.toString();
  console.log('k_b = ' + kb);

  if (ka === kb) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
}

testFrodo();

// Computes Rec()
function rec(b1s: number[][], mm: number, ll: number, aa: number, h: number[][]): void {
  const whole = 1 << aa;
  const mask = whole - 1;
  const negMask = ~mask;
  const half = 1 << (aa - 1);
  const quarter = 1 << (aa - 2);

  for (let i = 0; i < mm; i++) {
    for (let j = 0; j < ll; j++) {
      const remainder = b1s[i][j] & mask;
      const useHint = ((remainder + quarter) >> (aa - 1)) & 1;
      // h: the hint cMatrix
      const shift = useHint * (2 * h[i][j] - 1) * quarter;
      // if use_hint = 1 and h = 0, adding -quarter forces rounding down
      //                     h = 1, adding quarter forces rounding up
      b1s[i][j] = (b1s[i][j] + half + shift) & negMask;

      b1s[i][j] >>= 11;
      b1s[i][j] %= 16;
    }
  }
}

function alice0(nn: number, qq: number): { am: number[][]; bm: number[][]; sm: number[][] } {
  // A, n*n
  const aMatrix = matrixUtils.initMatrixRandom(nn, nn, qq);
  const sMatrix = FrodoConfig.ss; // n*l
  const eMatrix = FrodoConfig.ee; // n*l
  // B = AS + E mod q, n*l
  let bMatrix = matrixUtils.multiply(Algorithm.FRODO, aMatrix, sMatrix);
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

function bob(ll: number, mm: number, qq: number, am: number[][], bm: number[][]): { bb: number[][]; cc: number[][]; k1Matrix: number[][] } {
  const aMatrix = am;
  const bMatrix = bm;
  const k1Matrix: number[][] = new Array(mm); // V, Z^m*l

  const s1Matrix = FrodoConfig.ss1; // Z^m*n
  const e1Matrix = FrodoConfig.ee1; // Z^m*n
  const e2Matrix = FrodoConfig.ee2; // Z^m*l

  let b1Matrix = matrixUtils.multiply(Algorithm.FRODO, s1Matrix, aMatrix);
  let vMatrix = matrixUtils.multiply(Algorithm.FRODO, s1Matrix, bMatrix);

  b1Matrix = matrixUtils.addMod(b1Matrix, e1Matrix, qq); // Z^m*n
  vMatrix = matrixUtils.addMod(vMatrix, e2Matrix, qq); // Z^m*l
  const cMatrix: number[][] = new Array(mm); // Z^m*l

  for (let i = 0; i < ll; i++) {
    cMatrix[i] = vMatrix[i].slice();
    k1Matrix[i] = vMatrix[i].slice();
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < ll; j++) {
      cMatrix[i][j] = (cMatrix[i][j] >> 10) & 1; // >> logQ - b - 1
      // cMatrix[i][j] = Math.floor(cMatrix[i][j] * 0.0009765625) % 2;

      k1Matrix[i][j] = (k1Matrix[i][j] + 1024) % qq;
      k1Matrix[i][j] >>= 11; // >>= logQ - b
      // k1Matrix[i][j] = Math.round(k1Matrix[i][j] * 0.00048828125) % 16;
    }
  }

  const bb = b1Matrix;
  const cc = cMatrix;
  return {
    bb,
    cc,
    k1Matrix,
  };
}

function alice1(ll: number, mm: number, qq: number, bb: number[][], cc: number[][], sm: number[][]): number[][] {
  const b1m = bb;
  const cm = cc;
  const sMatrix = sm;

  const b1s = matrixUtils.multiplyMod(Algorithm.FRODO, b1m, sMatrix, qq); // Z^m*l
  const k2Matrix = b1s; // Z^m*l
  rec(k2Matrix, mm, ll, 11, cm);
  return k2Matrix;
}
