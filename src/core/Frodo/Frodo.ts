import { Algorithm } from '../../models/LatticeCrypto';
import { Frodo as FrodoConfig } from './config';
import MatrixUtils from '../../utils/matrix-utils';
import FrodoUtils from './Utils/frodo-utils';

const matrixUtils = new MatrixUtils();
const frodoUtils = new FrodoUtils();

export default class Frodo {
  private _privateKey!: number[][];
  private _publicKey!: number[][];
  private _sharedRandomness!: number[][];
  private _vector!: number[][];
  private _errorDistribution!: number[][];

  generateKeyPair(): void {
    if (!this._sharedRandomness) {
      this.generateSharedRandomness();
    }
    // this._privateKey = [];
    this._publicKey = this.generatePublicKey();
  }

  generatePublicKey(): number[][] {
    let publicKey = matrixUtils.multiply(Algorithm.FRODO, this._sharedRandomness, this._privateKey);
    publicKey = matrixUtils.addMod(publicKey, this._errorDistribution, q);
    return publicKey;
  }

  generateSharedRandomness(): number[][] {
    this._sharedRandomness = matrixUtils.initMatrixRandom(n, n, q);
    return this._sharedRandomness;
  }

  generateErrorDistribution() {}

  generateSharedSecret(otherPublicKey: number[]) {}

  generateVector(otherPublicKey: number[]) {}

  get vector() {
    return this._vector;
  }
  set vector(vector: number[][]) {
    this._vector = vector;
  }
  get publicKey() {
    return this._publicKey;
  }
  set publicKey(publicKey: number[][]) {
    this._publicKey = publicKey;
  }
  get privateKey() {
    return this._privateKey;
  }
  set privateKey(privateKey: number[][]) {
    this._privateKey = privateKey;
  }
  get sharedRandomness() {
    return this._sharedRandomness;
  }
  set sharedRandomness(sharedRandomness: number[][]) {
    this._sharedRandomness = sharedRandomness;
  }
}

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
  console.log('a = ' + a);
  console.log('b = ' + b);
  console.log('q = ' + q);
  console.log('logQ = ' + logQ);
  console.log('sigma = ' + sigma);
  console.log('Output:');

  const frodo = new Frodo();
  // frodo.generateKeyPair();

  const privateKeyA = FrodoConfig.ss; // n*l
  const errorDistributionA = FrodoConfig.ee; // n*l// A, n*n
  const sharedRandomness = frodo.generateSharedRandomness();
  let publicKeyA = matrixUtils.multiply(Algorithm.FRODO, sharedRandomness, privateKeyA);
  publicKeyA = matrixUtils.addMod(publicKeyA, errorDistributionA, q);

  const privateKeyB = FrodoConfig.ss1; // Z^m*n
  const errorDistributionB = FrodoConfig.ee1; // Z^m*n
  let publicKeyB = matrixUtils.multiply(Algorithm.FRODO, privateKeyB, sharedRandomness);
  publicKeyB = matrixUtils.addMod(publicKeyB, errorDistributionB, q); // Z^m*n

  const { cipherText, sharedSecretB } = bob(l, m, q, publicKeyA, privateKeyB);
  const sharedSecretA = matrixUtils.multiplyMod(Algorithm.FRODO, publicKeyB, privateKeyA, q); // Z^m*l
  frodoUtils.rec(sharedSecretA, m, l, 11, cipherText);

  const ka = sharedSecretA.toString();
  console.log('k_a = ' + ka);
  const kb = sharedSecretB.toString();
  console.log('k_b = ' + kb);

  if (ka === kb) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
}

testFrodo();

function bob(
  l: number,
  m: number,
  q: number,
  publicKeyA: number[][],
  privateKeyB: number[][],
): { cipherText: number[][]; sharedSecretB: number[][] } {
  const sharedSecretB: number[][] = new Array(m); // V, Z^m*l

  const errorDistributionC = FrodoConfig.ee2; // Z^m*l

  let vector = matrixUtils.multiply(Algorithm.FRODO, privateKeyB, publicKeyA);
  vector = matrixUtils.addMod(vector, errorDistributionC, q); // Z^m*l
  const cipherText: number[][] = new Array(m); // Z^m*l

  for (let i = 0; i < l; i++) {
    cipherText[i] = vector[i].slice();
    sharedSecretB[i] = vector[i].slice();
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < l; j++) {
      cipherText[i][j] = (cipherText[i][j] >> 10) & 1; // >> logQ - b - 1
      // cipherText[i][j] = Math.floor(cipherText[i][j] * 0.0009765625) % 2;

      sharedSecretB[i][j] = (sharedSecretB[i][j] + 1024) % q;
      sharedSecretB[i][j] >>= 11; // >>= logQ - b
      // k1Matrix[i][j] = Math.round(k1Matrix[i][j] * 0.00048828125) % 16;
    }
  }

  return {
    cipherText,
    sharedSecretB,
  };
}
