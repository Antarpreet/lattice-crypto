// https://github.com/FuKyuToTo/lattice-based-cryptography
import { Algorithm } from '../../models/LatticeCrypto';
import { Kyber as KyberConfig } from './config';
import LatticeUtils from '../../utils/lattice-utils';
import NumberUtils from '../../utils/number-utils';
import KyberUtils from './Utils/kyber-utils';

const numberUtils = new NumberUtils();
const utils = new LatticeUtils();
const kyberUtils = new KyberUtils();

const n = 256;
const k = 3;
const q = 7681;
const eta = 4; // η = 4
const db = 11;
const dc1 = 11;
const dc2 = 3;

export default class Kyber {
  private _privateKey!: number[];
  private _publicKey!: number[];
  private _sharedRandomness!: number[];
  private _vector!: number[];
  private _errorDistribution!: number[];

  /**
   *  key size = (arrayLength * arrayMemberLength) + delimiterCount
   *  min key size = 1024 * 1 + 1023 = 2047 Bytes
   *  max key size = 1024 * 5 + 1023 = 6143 Bytes
   */
  generateKeyPair(): void {
    
  }

  generatePublicKey() {
    
  }

  generateSharedRandomness() {
    
  }

  generateErrorDistribution() {
    
  }

  generateSharedSecret(otherPublicKey: number[]) {
    
  }

  generateVector(otherPublicKey: number[]) {
    
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


function testKyber() {
  console.log('Test Kyber:');
  console.log('Input:');
  console.log('n = ' + n);
  console.log('k = ' + k);
  console.log('q = ' + q);
  console.log('η = ' + eta);
  console.log('db = ' + db);
  console.log('dc1 = ' + dc1);
  console.log('dc2 = ' + dc2);
  console.log('Output:');

  const sharedRandomnessInit: number[][][] = [
    [Array(n), Array(n), Array(n)],
    [Array(n), Array(n), Array(n)],
    [Array(n), Array(n), Array(n)]
  ];
  // message
  const plainText = new Array(n);
  // message * 3841
  const plainText3841 = new Array(n);

  for (let i = 0; i < n; i++) {
    for (const row of sharedRandomnessInit) {
      for (const column of row) {
        column[i] = numberUtils.nextInt(q);
      }
    }
    plainText[i] = numberUtils.nextInt(2);
    plainText3841[i] = plainText[i] * 3841;
  }

  const sharedRandomness: number[][][] = [
    new Array(3),
    new Array(3),
    new Array(3)
  ];

  for (let row = 0; row < sharedRandomness.length; row++) {
    for (let column = 0; column < sharedRandomness[row].length; column++) {
      sharedRandomness[row][column] =
        utils.NTT(Algorithm.KYBER, sharedRandomnessInit[row][column], sharedRandomnessInit[row][column].length,
          KyberConfig.bitRev_psi_7681_256, q);
    }
  }

  // ntt message * 3841
  const nttM3841 = utils.NTT(Algorithm.KYBER, plainText3841, plainText3841.length, KyberConfig.bitRev_psi_7681_256, q);

  const privateKeyInitA: number[][][] = [
    [Array(n), Array(n), Array(n)]
  ];
  const privateKeyA: number[][][] = [
    new Array(3)
  ];
  const errorDistributionInit: number[][][] = [
    [Array(n), Array(n), Array(n)]
  ];
  const errorDistribution: number[][][] = [
    new Array(3)
  ];

  for (let i = 0; i < n; i++) {
      for (let row = 0; row < privateKeyInitA.length; row++) {
          for (let column = 0; column < privateKeyInitA[row].length; column++) {
              privateKeyInitA[row][column][i] = kyberUtils.testBinomialSample(numberUtils.nextInt(n));
              errorDistributionInit[row][column][i] = kyberUtils.testBinomialSample(numberUtils.nextInt(n));
          }
      }
  }
  for (let i = 0; i < n; i++) {
      for (let row = 0; row < privateKeyA.length; row++) {
          for (let column = 0; column < privateKeyA[row].length; column++) {
              privateKeyA[row][column] =
                  utils.NTT(Algorithm.KYBER, privateKeyInitA[row][column], privateKeyInitA[row][column].length,
                      KyberConfig.bitRev_psi_7681_256, q);
              errorDistribution[row][column] =
                  utils.NTT(Algorithm.KYBER, errorDistributionInit[row][column], errorDistributionInit[row][column].length,
                      KyberConfig.bitRev_psi_7681_256, q);
          }
      }
  }

  const publicKeyA = kyberUtils.keyGeneration(sharedRandomness, privateKeyA, errorDistribution, q, n);
  const cipherText = kyberUtils.encrypt(publicKeyA, sharedRandomness, nttM3841, q, n);
  const v00 = kyberUtils.decrypt(cipherText, privateKeyA, q, n);

  const km = plainText.toString();
  const kv = v00.toString();

  console.log('plaintext: ' + km);
  console.log('result: ' + kv);

  if (km === kv) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
  // public key A
  // const a00 = new Array(n);
  // const a01 = new Array(n);
  // const a02 = new Array(n);
  // const a10 = new Array(n);
  // const a11 = new Array(n);
  // const a12 = new Array(n);
  // const a20 = new Array(n);
  // const a21 = new Array(n);
  // const a22 = new Array(n);

  // for (let i = 0; i < n; i++) {
  //   a00[i] = numberUtils.nextInt(q);
  //   a01[i] = numberUtils.nextInt(q);
  //   a02[i] = numberUtils.nextInt(q);
  //   a10[i] = numberUtils.nextInt(q);
  //   a11[i] = numberUtils.nextInt(q);
  //   a12[i] = numberUtils.nextInt(q);
  //   a20[i] = numberUtils.nextInt(q);
  //   a21[i] = numberUtils.nextInt(q);
  //   a22[i] = numberUtils.nextInt(q);
  //   plainText[i] = numberUtils.nextInt(2);
  //   plainText3841[i] = plainText[i] * 3841;
  // }
  // const nttA00 = utils.NTT(Algorithm.KYBER, a00, a00.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA01 = utils.NTT(Algorithm.KYBER, a01, a01.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA02 = utils.NTT(Algorithm.KYBER, a02, a02.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA10 = utils.NTT(Algorithm.KYBER, a10, a10.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA11 = utils.NTT(Algorithm.KYBER, a11, a11.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA12 = utils.NTT(Algorithm.KYBER, a12, a12.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA20 = utils.NTT(Algorithm.KYBER, a20, a20.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA21 = utils.NTT(Algorithm.KYBER, a21, a21.length, KyberConfig.bitRev_psi_7681_256, q);
  // const nttA22 = utils.NTT(Algorithm.KYBER, a22, a22.length, KyberConfig.bitRev_psi_7681_256, q);

  // const { b00, b01, b02, nttS00, nttS01, nttS02 } = kyberUtils.keyGeneration(nttA00, nttA01, nttA02, nttA10, nttA11, nttA12, nttA20, nttA21, nttA22, q, n);
}

testKyber();
