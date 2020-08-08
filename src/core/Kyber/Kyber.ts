// https://github.com/FuKyuToTo/lattice-based-cryptography

import Utils from '../../utils/utils';
import { Algorithm } from '../../models/LatticeCrypto';
import { Kyber as KyberConfig } from './config';

const utils = new Utils();

export default class Kyber {}

const n = 256;
const k = 3;
const q = 7681;
const eta = 4; // η = 4
const db = 11;
const dc1 = 11;
const dc2 = 3;
const plainText = new Array(n);

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

  // public key A
  const a00 = new Array(n);
  const a01 = new Array(n);
  const a02 = new Array(n);
  const a10 = new Array(n);
  const a11 = new Array(n);
  const a12 = new Array(n);
  const a20 = new Array(n);
  const a21 = new Array(n);
  const a22 = new Array(n);

  const plainText3841 = new Array(n);
  for (let i = 0; i < n; i++) {
    a00[i] = utils.nextInt(q);
    a01[i] = utils.nextInt(q);
    a02[i] = utils.nextInt(q);
    a10[i] = utils.nextInt(q);
    a11[i] = utils.nextInt(q);
    a12[i] = utils.nextInt(q);
    a20[i] = utils.nextInt(q);
    a21[i] = utils.nextInt(q);
    a22[i] = utils.nextInt(q);
    plainText[i] = utils.nextInt(2);
    plainText3841[i] = plainText[i] * 3841;
  }
  const nttA00 = utils.NTT(Algorithm.KYBER, a00, a00.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA01 = utils.NTT(Algorithm.KYBER, a01, a01.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA02 = utils.NTT(Algorithm.KYBER, a02, a02.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA10 = utils.NTT(Algorithm.KYBER, a10, a10.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA11 = utils.NTT(Algorithm.KYBER, a11, a11.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA12 = utils.NTT(Algorithm.KYBER, a12, a12.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA20 = utils.NTT(Algorithm.KYBER, a20, a20.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA21 = utils.NTT(Algorithm.KYBER, a21, a21.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttA22 = utils.NTT(Algorithm.KYBER, a22, a22.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttM3841 = utils.NTT(Algorithm.KYBER, plainText3841, plainText3841.length, KyberConfig.bitRev_psi_7681_256, q);

  const { b00, b01, b02, nttS00, nttS01, nttS02 } = keyGeneration(nttA00, nttA01, nttA02, nttA10, nttA11, nttA12, nttA20, nttA21, nttA22);
  const { c100, c101, c102, c200 } = encrypt(
    b00,
    b01,
    b02,
    nttA00,
    nttA01,
    nttA02,
    nttA10,
    nttA11,
    nttA12,
    nttA20,
    nttA21,
    nttA22,
    nttM3841,
  );
  const v00 = decrypt(c100, c101, c102, c200, nttS00, nttS01, nttS02);

  const km = plainText.toString();
  const kv = v00.toString();

  console.log('plaintext: ' + km);
  console.log('result: ' + kv);

  if (km === kv) {
    console.log('Success!');
  } else {
    console.log('Failed');
  }
}

testKyber();

function compress2d(modulus: number, qq: number, v: number[]): number[] {
  if (modulus <= 0) {
    alert('modulus not positive');
    return [];
  }

  const vector: number[] = utils.copyOf(v.slice(), v.length);
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

function decompress2d(pow2d: number, qq: number, v: number[]): number[] {
  const vector: number[] = utils.copyOf(v.slice(), v.length);
  for (let j = 0; j < n; j++) {
    vector[j] = Math.round((vector[j] * 1.0 * qq) / pow2d);
  }
  return vector;
}

// Binomial sampling
function testBinomialSample(value: number): number {
  let sum = 0;
  sum =
    utils.getBit(value, 0) -
    utils.getBit(value, 4) +
    (utils.getBit(value, 1) - utils.getBit(value, 5)) +
    (utils.getBit(value, 2) - utils.getBit(value, 6)) +
    (utils.getBit(value, 3) - utils.getBit(value, 7));
  return sum;
}

function keyGeneration(
  nttA00: number[],
  nttA01: number[],
  nttA02: number[],
  nttA10: number[],
  nttA11: number[],
  nttA12: number[],
  nttA20: number[],
  nttA21: number[],
  nttA22: number[],
): { b00: number[]; b01: number[]; b02: number[]; nttS00: number[]; nttS01: number[]; nttS02: number[] } {
  const s00 = new Array(n);
  const s01 = new Array(n);
  const s02 = new Array(n);
  const e00 = new Array(n);
  const e01 = new Array(n);
  const e02 = new Array(n);
  const nttB00 = new Array(n);
  const nttB01 = new Array(n);
  const nttB02 = new Array(n);

  for (let i = 0; i < n; i++) {
    s00[i] = testBinomialSample(utils.nextInt(n));
    s01[i] = testBinomialSample(utils.nextInt(n));
    s02[i] = testBinomialSample(utils.nextInt(n));
    e00[i] = testBinomialSample(utils.nextInt(n));
    e01[i] = testBinomialSample(utils.nextInt(n));
    e02[i] = testBinomialSample(utils.nextInt(n));
  }
  const nttS00 = utils.NTT(Algorithm.KYBER, s00, s00.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttS01 = utils.NTT(Algorithm.KYBER, s01, s01.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttS02 = utils.NTT(Algorithm.KYBER, s02, s02.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttE00 = utils.NTT(Algorithm.KYBER, e00, e00.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttE01 = utils.NTT(Algorithm.KYBER, e01, e01.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttE02 = utils.NTT(Algorithm.KYBER, e02, e02.length, KyberConfig.bitRev_psi_7681_256, q);

  for (let i = 0; i < n; i++) {
    // Component multiply; point-wise multiplication
    let x1 = nttS00[i] * nttA00[i];
    let x2 = nttS01[i] * nttA01[i];
    let x3 = nttS02[i] * nttA02[i];
    nttB00[i] = (x1 + x2 + x3 + nttE00[i]) % q;

    x1 = nttS00[i] * nttA10[i];
    x2 = nttS01[i] * nttA11[i];
    x3 = nttS02[i] * nttA12[i];
    nttB01[i] = (x1 + x2 + x3 + nttE01[i]) % q;

    x1 = nttS00[i] * nttA20[i];
    x2 = nttS01[i] * nttA21[i];
    x3 = nttS02[i] * nttA22[i];
    nttB02[i] = (x1 + x2 + x3 + nttE02[i]) % q;
  }
  const tempB00 = utils.INTT(Algorithm.KYBER, nttB00, nttB00.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
  const tempB01 = utils.INTT(Algorithm.KYBER, nttB01, nttB01.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
  const tempB02 = utils.INTT(Algorithm.KYBER, nttB02, nttB02.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
  const b00 = compress2d(2048, q, tempB00);
  const b01 = compress2d(2048, q, tempB01);
  const b02 = compress2d(2048, q, tempB02);

  return {
    b00,
    b01,
    b02,
    nttS00,
    nttS01,
    nttS02,
  };
}

function encrypt(
  b00: number[],
  b01: number[],
  b02: number[],
  nttA00: number[],
  nttA01: number[],
  nttA02: number[],
  nttA10: number[],
  nttA11: number[],
  nttA12: number[],
  nttA20: number[],
  nttA21: number[],
  nttA22: number[],
  nttM3841: number[],
): { c100: number[]; c101: number[]; c102: number[]; c200: number[] } {
  const tempB00 = decompress2d(2048, q, b00);
  const tempB01 = decompress2d(2048, q, b01);
  const tempB02 = decompress2d(2048, q, b02);

  const r00 = new Array(n);
  const r01 = new Array(n);
  const r02 = new Array(n);
  const e100 = new Array(n);
  const e101 = new Array(n);
  const e102 = new Array(n);
  const e200 = new Array(n);
  const nttC100 = new Array(n);
  const nttC101 = new Array(n);
  const nttC102 = new Array(n);
  const nttC200 = new Array(n);

  for (let i = 0; i < n; i++) {
    r00[i] = testBinomialSample(utils.nextInt(n));
    r01[i] = testBinomialSample(utils.nextInt(n));
    r02[i] = testBinomialSample(utils.nextInt(n));
    e100[i] = testBinomialSample(utils.nextInt(n));
    e101[i] = testBinomialSample(utils.nextInt(n));
    e102[i] = testBinomialSample(utils.nextInt(n));
    e200[i] = testBinomialSample(utils.nextInt(n));
  }
  const nttR00 = utils.NTT(Algorithm.KYBER, r00, r00.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttR01 = utils.NTT(Algorithm.KYBER, r01, r01.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttR02 = utils.NTT(Algorithm.KYBER, r02, r02.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttE100 = utils.NTT(Algorithm.KYBER, e100, e100.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttE101 = utils.NTT(Algorithm.KYBER, e101, e101.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttE102 = utils.NTT(Algorithm.KYBER, e102, e102.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttE200 = utils.NTT(Algorithm.KYBER, e200, e200.length, KyberConfig.bitRev_psi_7681_256, q);

  const nttB00 = utils.NTT(Algorithm.KYBER, tempB00, tempB00.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttB01 = utils.NTT(Algorithm.KYBER, tempB01, tempB01.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttB02 = utils.NTT(Algorithm.KYBER, tempB02, tempB02.length, KyberConfig.bitRev_psi_7681_256, q);

  for (let i = 0; i < n; i++) {
    // Component multiply; point-wise multiplication
    let x1 = nttR00[i] * nttA00[i];
    let x2 = nttR01[i] * nttA10[i];
    let x3 = nttR02[i] * nttA20[i];
    nttC100[i] = (x1 + x2 + x3 + nttE100[i]) % q;

    x1 = nttR00[i] * nttA01[i];
    x2 = nttR01[i] * nttA11[i];
    x3 = nttR02[i] * nttA21[i];
    nttC101[i] = (x1 + x2 + x3 + nttE101[i]) % q;

    x1 = nttR00[i] * nttA02[i];
    x2 = nttR01[i] * nttA12[i];
    x3 = nttR02[i] * nttA22[i];
    nttC102[i] = (x1 + x2 + x3 + nttE102[i]) % q;

    x1 = nttR00[i] * nttB00[i];
    x2 = nttR01[i] * nttB01[i];
    x3 = nttR02[i] * nttB02[i];
    nttC200[i] = (x1 + x2 + x3 + nttE200[i] + nttM3841[i]) % q;
  }

  const tempC100 = utils.INTT(Algorithm.KYBER, nttC100, nttC100.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
  const tempC101 = utils.INTT(Algorithm.KYBER, nttC101, nttC101.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
  const tempC102 = utils.INTT(Algorithm.KYBER, nttC102, nttC102.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
  const tempC200 = utils.INTT(Algorithm.KYBER, nttC200, nttC200.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);

  const c100 = compress2d(2048, q, tempC100);
  const c101 = compress2d(2048, q, tempC101);
  const c102 = compress2d(2048, q, tempC102);
  const c200 = compress2d(8, q, tempC200);

  return {
    c100,
    c101,
    c102,
    c200,
  };
}

function decrypt(
  c100: number[],
  c101: number[],
  c102: number[],
  c200: number[],
  nttS00: number[],
  nttS01: number[],
  nttS02: number[],
): number[] {
  const tempC100 = decompress2d(2048, q, c100);
  const tempC101 = decompress2d(2048, q, c101);
  const tempC102 = decompress2d(2048, q, c102);
  const tempC200 = decompress2d(8, q, c200);

  const nttC100 = utils.NTT(Algorithm.KYBER, tempC100, tempC100.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttC101 = utils.NTT(Algorithm.KYBER, tempC101, tempC101.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttC102 = utils.NTT(Algorithm.KYBER, tempC102, tempC102.length, KyberConfig.bitRev_psi_7681_256, q);
  const nttC200 = utils.NTT(Algorithm.KYBER, tempC200, tempC200.length, KyberConfig.bitRev_psi_7681_256, q);

  const nttV00 = new Array(n);
  for (let i = 0; i < n; i++) {
    const x1 = nttS00[i] * nttC100[i];
    const x2 = nttS01[i] * nttC101[i];
    const x3 = nttS02[i] * nttC102[i];
    // v = c2 - f
    nttV00[i] = (nttC200[i] - (x1 + x2 + x3)) % q;
    while (nttV00[i] < 0) {
      nttV00[i] += q;
    }
  }
  const tempV00 = utils.INTT(Algorithm.KYBER, nttV00, nttV00.length, KyberConfig.bitRev_psiInv_7681_256, q, KyberConfig.INVN);
  const v00 = compress2d(2, q, tempV00);

  return v00;
}
