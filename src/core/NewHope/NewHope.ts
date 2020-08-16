// https://github.com/FuKyuToTo/lattice-based-cryptography
import LatticeUtils from '../../utils/lattice-utils';
import { Algorithm } from '../../models/LatticeCrypto';
import { NewHope as NewHopeConfig } from './config';
import NumberUtils from '../../utils/number-utils';
import NewHopeUtils from './Utils/new-hope-utils';

const numberUtils = new NumberUtils();
const newHopeUtils = new NewHopeUtils();

const utils = new LatticeUtils();
const n = 1024; // the size of the 2 dimensional array
const q = 12289; // the modules
const k = 16;
const MO = 4294967296; // 2^32

const BMATRIX = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0.5, 0.5, 0.5, 0.5],
];

export default class NewHope {
  private _privateKey!: number[];
  private _publicKey!: number[];
  private _sharedRandomness!: number[];
  private _vector!: number[];
  private _errorDistribution!: number[];
  private _bit!: number;

  /**
   *  key size = (arrayLength * arrayMemberLength) + delimiterCount
   *  min key size = 1024 * 1 + 1023 = 2047 Bytes
   *  max key size = 1024 * 5 + 1023 = 6143 Bytes
   */
  generateKeyPair(): void {
    if (!this._sharedRandomness) {
      this.generateSharedRandomness();
    }
    const arrS = new Array(n); // secret key s
    for (let i = 0; i < n; i++) {
      arrS[i] = newHopeUtils.testBinomialSample(numberUtils.nextInt(MO));
    }

    const nttS = utils.NTT(Algorithm.NEW_HOPE, arrS, arrS.length, NewHopeConfig.bitRev_psi_12289_1024, q);
    this._privateKey = nttS;
    this._publicKey = this.generatePublicKey();
  }

  generatePublicKey(): number[] {
    const arrE = new Array(n);

    for (let i = 0; i < n; i++) {
      arrE[i] = newHopeUtils.testBinomialSample(numberUtils.nextInt(MO));
    }

    const nttE = utils.NTT(Algorithm.NEW_HOPE, arrE, arrE.length, NewHopeConfig.bitRev_psi_12289_1024, q);

    const publicKey = new Array(n);
    for (let i = 0; i < n; i++) {
      publicKey[i] = (this._sharedRandomness[i] * this._privateKey[i] + nttE[i]) % q; // Component multiply
    }

    return publicKey;
  }

  generateSharedRandomness(): number[] {
    const arrA = new Array(n);
    for (let j = 0; j < n; j++) {
      arrA[j] = numberUtils.nextInt(q);
    }

    this._sharedRandomness = utils.NTT(Algorithm.NEW_HOPE, arrA, arrA.length, NewHopeConfig.bitRev_psi_12289_1024, q);

    return this._sharedRandomness;
  }

  generateErrorDistribution(): number[] {
    const arrE2 = new Array(n);

    for (let i = 0; i < n; i++) {
      arrE2[i] = newHopeUtils.testBinomialSample(numberUtils.nextInt(MO));
    }
    this._errorDistribution = arrE2;
    return this._errorDistribution;
  }

  generateSharedSecret(otherPublicKey: number[]) {
    if (!this._vector) {
      this.generateVector(otherPublicKey);
    }

    const nttV1: number[] = new Array(n);
    for (let i = 0; i < n; i++) {
      nttV1[i] = (otherPublicKey[i] * this._privateKey[i]) % q; // Component multiply
    }
    const v1 = utils.INTT(Algorithm.NEW_HOPE, nttV1, nttV1.length, NewHopeConfig.bitRev_psiInv_12289_1024, q, NewHopeConfig.INVN);
    // -------- Rec --------
    return newHopeUtils.rec(v1, this._vector, BMATRIX, q);
  }

  generateVector(otherPublicKey: number[]) {
    if (!this._errorDistribution) {
      this.generateErrorDistribution();
    }

    const nttV = new Array(n);

    for (let i = 0; i < n; i++) {
      nttV[i] = otherPublicKey[i] * this._privateKey[i];
    }

    const v = utils.INTT(Algorithm.NEW_HOPE, nttV, nttV.length, NewHopeConfig.bitRev_psiInv_12289_1024, q, NewHopeConfig.INVN);

    for (let i = 0; i < n; i++) {
      v[i] = (v[i] + this._errorDistribution[i]) % q;
      if (v[i] < 0) {
        v[i] += q;
      }
    }

    if (!this._bit) {
      this._bit = numberUtils.nextInt(2);
    }

    // -------- HelpRec --------
    const r = newHopeUtils.helpRec(v, this._bit, q);
    // -------- Rec --------
    this._vector = r;
    // return { kb: newHopeUtils.rec(v, r, BMATRIX, q), r };
  }

  get vector() {
    return this._vector;
  }
  set vector(vector: number[]) {
    this._vector = vector;
  }
  get publicKey() {
    return this._publicKey;
  }
  set publicKey(publicKey: number[]) {
    this._publicKey = publicKey;
  }
  get privateKey() {
    return this._privateKey;
  }
  set privateKey(privateKey: number[]) {
    this._privateKey = privateKey;
  }
  get sharedRandomness() {
    return this._sharedRandomness;
  }
  set sharedRandomness(sharedRandomness: number[]) {
    this._sharedRandomness = sharedRandomness;
  }
}

// ------------------------------------------- start newHope -------------------------------------------

function testNewHope() {
  console.log('Test NewHope:');
  console.log('Input:');
  console.log('n = ' + n);
  console.log('q = ' + q);
  console.log('k = ' + k);

  const newHopeAlice = new NewHope();
  newHopeAlice.generateKeyPair();
  const sharedRandomness = newHopeAlice.sharedRandomness;

  const newHopeBob = new NewHope();
  newHopeBob.sharedRandomness = sharedRandomness;
  newHopeBob.generateKeyPair();
  // newHopeBob.vector = errorDistribution;
  const aliceShared = newHopeAlice.generateSharedSecret(newHopeBob.publicKey);
  newHopeBob.vector = newHopeAlice.vector;

  const bobShared = newHopeBob.generateSharedSecret(newHopeAlice.publicKey);

  console.log('Alice');
  console.log(aliceShared.toString());
  console.log('Bob');
  console.log(bobShared.toString());
  if (aliceShared.toString() === bobShared.toString()) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
}

testNewHope();
