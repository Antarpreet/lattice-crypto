import { Algorithm, Action } from '../../models/LatticeCrypto';
import { Lizard as LizardConfig } from './config';
import NumberUtils from '../../utils/number-utils';
import MatrixUtils from '../../utils/matrix-utils';
import LizardUtils from './Utils/lizard-utils';

const matrixUtils = new MatrixUtils();
const numberUtils = new NumberUtils();
const lizardUtils = new LizardUtils();

export default class Lizard {
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

  generatePublicKey() {
    let publicKey = matrixUtils.multiply(Algorithm.LIZARD, this._sharedRandomness, this._privateKey);
    publicKey = matrixUtils.addMod(publicKey, this._errorDistribution, q);
    return publicKey;
  }

  generateSharedRandomness() {
    this._sharedRandomness = matrixUtils.initMatrixRandom(m, n, q);
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
  console.log('r = ' + r);
  console.log('α = ' + alpha);

  const lizard = new Lizard();

  // message
  const plaintext: number[] = new Array(l);
  for (let i = 0; i < l; i++) {
    plaintext[i] = numberUtils.nextInt(2);
  }
  // message * 128
  const mTranspose = matrixUtils.scalarMultiplyVector(128, plaintext);

  // S, n*l
  const privateKeyA = LizardConfig.ss;
  // A, m*n
  const sharedRandomness = lizard.generateSharedRandomness();
  // E, m*l
  const errorDistribution = LizardConfig.ee;
  // B = AS + E mod q, m*l
  let publicKeyA = matrixUtils.multiply(Algorithm.LIZARD, sharedRandomness, privateKeyA);
  publicKeyA = matrixUtils.addMod(publicKeyA, errorDistribution, q);

  const { av, bv } = lizardUtils.encrypt(l, n, p, q, sharedRandomness, publicKeyA, mTranspose);
  const resultVector = lizardUtils.decrypt(l, t, privateKeyA, av, bv);

  console.log('Output:');
  const ms = plaintext.toString();
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
