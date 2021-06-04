// https://github.com/FuKyuToTo/lattice-based-cryptography
import { Algorithm } from '../../models/LatticeCrypto';
import { Kyber as KyberConfig } from './config';
import LatticeUtils from '../../utils/lattice-utils';
import NumberUtils from '../../utils/number-utils';
import KyberUtils from './Utils/kyber-utils';
import ConversionUtils from '../../utils/conversion-utils';

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
  private _privateKey!: number[][][];
  private _publicKey!: number[][][];
  private _sharedRandomness!: number[][][];
  private _vector!: number[][][];
  private _errorDistribution!: number[][][];

  generateKeyPair(): void {
    if (!this._sharedRandomness) {
      this.generateSharedRandomness();
    }
    if (!this._errorDistribution) {
      this.generateErrorDistribution();
    }

    const privateKeyInit: number[][][] = [[Array(n), Array(n), Array(n)]];
    const privateKey: number[][][] = [new Array(3)];

    for (let i = 0; i < n; i++) {
      for (let row = 0; row < privateKeyInit.length; row++) {
        for (let column = 0; column < privateKeyInit[row].length; column++) {
          privateKeyInit[row][column][i] = kyberUtils.testBinomialSample(numberUtils.nextInt(n));
        }
      }
    }
    for (let i = 0; i < n; i++) {
      for (let row = 0; row < privateKey.length; row++) {
        for (let column = 0; column < privateKey[row].length; column++) {
          privateKey[row][column] = utils.NTT(
            Algorithm.KYBER,
            privateKeyInit[row][column],
            privateKeyInit[row][column].length,
            KyberConfig.bitRev_psi_7681_256,
            q,
          );
        }
      }
    }

    this._privateKey = privateKey;
    this._publicKey = this.generatePublicKey();
  }

  generatePublicKey(): number[][][] {
    const someKey: number[][][] = [[Array(n), Array(n), Array(n)]];

    let x1 = 0;
    let x2 = 0;
    let x3 = 0;
    for (let i = 0; i < n; i++) {
      x1 = this.privateKey[0][0][i] * this._sharedRandomness[0][0][i];
      x2 = this.privateKey[0][1][i] * this._sharedRandomness[0][1][i];
      x3 = this.privateKey[0][2][i] * this._sharedRandomness[0][2][i];
      someKey[0][0][i] = (x1 + x2 + x3 + this._errorDistribution[0][0][i]) % q;

      x1 = this.privateKey[0][0][i] * this._sharedRandomness[1][0][i];
      x2 = this.privateKey[0][1][i] * this._sharedRandomness[1][1][i];
      x3 = this.privateKey[0][2][i] * this._sharedRandomness[1][2][i];
      someKey[0][1][i] = (x1 + x2 + x3 + this._errorDistribution[0][1][i]) % q;

      x1 = this.privateKey[0][0][i] * this._sharedRandomness[2][0][i];
      x2 = this.privateKey[0][1][i] * this._sharedRandomness[2][1][i];
      x3 = this.privateKey[0][2][i] * this._sharedRandomness[2][2][i];
      someKey[0][2][i] = (x1 + x2 + x3 + this._errorDistribution[0][2][i]) % q;
    }

    const temp: number[][][] = [new Array(3)];

    for (let row = 0; row < temp.length; row++) {
      for (let column = 0; column < temp[row].length; column++) {
        temp[row][column] = utils.INTT(
          Algorithm.KYBER,
          someKey[row][column],
          someKey[row][column].length,
          KyberConfig.bitRev_psiInv_7681_256,
          q,
          KyberConfig.INVN,
        );
      }
    }

    const publicKey: number[][][] = [new Array(3)];
    for (let row = 0; row < temp.length; row++) {
      for (let column = 0; column < temp[row].length; column++) {
        publicKey[row][column] = kyberUtils.compress2d(2048, q, temp[row][column], n);
      }
    }

    return publicKey;
  }

  generateSharedRandomness(): number[][][] {
    const sharedRandomnessInit: number[][][] = [
      [Array(n), Array(n), Array(n)],
      [Array(n), Array(n), Array(n)],
      [Array(n), Array(n), Array(n)],
    ];
    const sharedRandomness: number[][][] = [new Array(3), new Array(3), new Array(3)];

    for (let i = 0; i < n; i++) {
      for (const row of sharedRandomnessInit) {
        for (const column of row) {
          column[i] = numberUtils.nextInt(q);
        }
      }
    }

    for (let row = 0; row < sharedRandomness.length; row++) {
      for (let column = 0; column < sharedRandomness[row].length; column++) {
        sharedRandomness[row][column] = utils.NTT(
          Algorithm.KYBER,
          sharedRandomnessInit[row][column],
          sharedRandomnessInit[row][column].length,
          KyberConfig.bitRev_psi_7681_256,
          q,
        );
      }
    }

    this._sharedRandomness = sharedRandomness;
    return this._sharedRandomness;
  }

  generateErrorDistribution(): number[][][] {
    const errorDistributionInit: number[][][] = [[Array(n), Array(n), Array(n)]];
    const errorDistribution: number[][][] = [new Array(3)];

    for (let i = 0; i < n; i++) {
      for (let row = 0; row < errorDistributionInit.length; row++) {
        for (let column = 0; column < errorDistributionInit[row].length; column++) {
          errorDistributionInit[row][column][i] = kyberUtils.testBinomialSample(numberUtils.nextInt(n));
        }
      }
    }
    for (let i = 0; i < n; i++) {
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
    }
    this._errorDistribution = errorDistribution;
    return this._errorDistribution;
  }

  generateSharedSecret(otherPublicKey: number[]) {}

  generateVector(otherPublicKey: number[]) {}

  get vector() {
    return this._vector;
  }
  set vector(vector: number[][][]) {
    this._vector = vector;
  }
  get publicKey() {
    return this._publicKey;
  }
  set publicKey(publicKey: number[][][]) {
    this._publicKey = publicKey;
  }
  get privateKey() {
    return this._privateKey;
  }
  set privateKey(privateKey: number[][][]) {
    this._privateKey = privateKey;
  }
  get sharedRandomness() {
    return this._sharedRandomness;
  }
  set sharedRandomness(sharedRandomness: number[][][]) {
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

  const conversionUtils = new ConversionUtils();
  let binArray = conversionUtils.text2Binary('I like apples in the summer time');
  console.log(binArray.length);
  if (binArray.length < 256) {
    while (binArray.length < 256) {
      binArray = '0' + binArray
    }
  }
  const plainTextArray = binArray.split('');
  const plainText = plainTextArray.map(value => Number(value));
  // console.log(binArray.length);
  // console.log(binArray);

  // message
  // const plainText = new Array(n);
  // message * 3841
  const plainText3841 = new Array(n);

  for (let i = 0; i < n; i++) {
    // plainText[i] = numberUtils.nextInt(2);
    plainText3841[i] = plainText[i] * 3841;
  }

  // ntt message * 3841
  const nttM3841 = utils.NTT(Algorithm.KYBER, plainText3841, plainText3841.length, KyberConfig.bitRev_psi_7681_256, q);

  const kyberAlice = new Kyber();
  kyberAlice.generateKeyPair();

  // const kyberBob = new Kyber();
  // kyberBob.generateKeyPair();

  // Kyber Utils should be abstracted into the kyberAlice and kyberBob

  const cipherText = kyberUtils.encrypt(kyberAlice.publicKey, kyberAlice.sharedRandomness, nttM3841, q, n);
  const v00 = kyberUtils.decrypt(cipherText, kyberAlice.privateKey, q, n);

  const km = plainText.toString();
  const kv = v00.toString();

  console.log('plaintext binary: ' + km);
  console.log('result binary: ' + kv);
  console.log('plaintext: ' + conversionUtils.binary2String(plainText));
  console.log('result: ' + conversionUtils.binary2String(v00));


  if (km === kv) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
}

testKyber();
