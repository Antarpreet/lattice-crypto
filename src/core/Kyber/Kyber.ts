// https://github.com/FuKyuToTo/lattice-based-cryptography

import Utils from '../../utils/utils';

const utils = new Utils();

export default class Kyber {
  private n: number;
  private q: number;

  constructor(n: number, q: number) {
    this.n = n;
    this.q = q;
  }

  compress2d(modulus: number, q: number, v: number[]): number[] {
    if (modulus <= 0) {
      alert('modulus not positive');
      return [];
    }

    const vector: number[] = utils.copyOf(v.slice(), v.length);
    for (let j = 0; j < this.n; j++) {
      vector[j] = Math.round((vector[j] * 1.0 * modulus) / q);
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

  decompress2d(pow2d: number, q: number, v: number[]): number[] {
    const vector: number[] = utils.copyOf(v.slice(), v.length);
    for (let j = 0; j < this.n; j++) {
      vector[j] = Math.round((vector[j] * 1.0 * q) / pow2d);
    }
    return vector;
  }
}

// Binomial sampling
// function testBinomialSample (value) {
// 	var sum = 0;
// 	sum = (getBit(value, 0) - getBit(value, 4)) +
// 		(getBit(value, 1) - getBit(value, 5)) +
// 		(getBit(value, 2) - getBit(value, 6)) +
// 		(getBit(value, 3) - getBit(value, 7));
// 	return sum;
// }

// var ntt_a00;
// var ntt_a01;
// var ntt_a02;
// var ntt_a10;
// var ntt_a11;
// var ntt_a12;
// var ntt_a20;
// var ntt_a21;
// var ntt_a22;

// var plaintext = new Array(n);
// var ntt_m_3841 = new Array(n);

// var ntt_s00;
// var ntt_s01;
// var ntt_s02;
// var ntt_e00;
// var ntt_e01;
// var ntt_e02;
// var ntt_b00 = new Array(n);
// var ntt_b01 = new Array(n);
// var ntt_b02 = new Array(n);
// var b00;
// var b01;
// var b02;

// var ntt_r00;
// var ntt_r01;
// var ntt_r02;
// var ntt_e100;
// var ntt_e101;
// var ntt_e102;
// var ntt_e200;

// var ntt_c100 = new Array(n);
// var ntt_c101 = new Array(n);
// var ntt_c102 = new Array(n);
// var ntt_c200 = new Array(n);
// var c100;
// var c101;
// var c102;
// var c200;

// var ntt_v00 = new Array(n);
// var v00;

// function keyGeneration() {
// 	var s00 = new Array(n);
// 	var s01 = new Array(n);
// 	var s02 = new Array(n);
// 	var e00 = new Array(n);
// 	var e01 = new Array(n);
// 	var e02 = new Array(n);

// 	for (var i = 0; i < n; i++) {
// 		s00[i] = testBinomialSample(nextInt(n));
// 		s01[i] = testBinomialSample(nextInt(n));
// 		s02[i] = testBinomialSample(nextInt(n));
// 		e00[i] = testBinomialSample(nextInt(n));
// 		e01[i] = testBinomialSample(nextInt(n));
// 		e02[i] = testBinomialSample(nextInt(n));
// 	}
// 	ntt_s00 = NTT(s00, s00.length);
// 	ntt_s01 = NTT(s01, s01.length);
// 	ntt_s02 = NTT(s02, s02.length);
// 	ntt_e00 = NTT(e00, e00.length);
// 	ntt_e01 = NTT(e01, e01.length);
// 	ntt_e02 = NTT(e02, e02.length);

// 	for (var i = 0; i < n; i++) {
// 		// Component multiply; point-wise multiplication
// 		var x1 = (ntt_s00[i] * ntt_a00[i]);
// 		var x2 = (ntt_s01[i] * ntt_a01[i]);
// 		var x3 = (ntt_s02[i] * ntt_a02[i]);
// 		ntt_b00[i] = (x1 + x2 + x3 + ntt_e00[i]) % q;

// 		x1 = (ntt_s00[i] * ntt_a10[i]);
// 		x2 = (ntt_s01[i] * ntt_a11[i]);
// 		x3 = (ntt_s02[i] * ntt_a12[i]);
// 		ntt_b01[i] = (x1 + x2 + x3 + ntt_e01[i]) % q;

// 		x1 = (ntt_s00[i] * ntt_a20[i]);
// 		x2 = (ntt_s01[i] * ntt_a21[i]);
// 		x3 = (ntt_s02[i] * ntt_a22[i]);
// 		ntt_b02[i] = (x1 + x2 + x3 + ntt_e02[i]) % q;

// 	}
// 	var temp_b00 = INTT(ntt_b00, ntt_b00.length);
// 	var temp_b01 = INTT(ntt_b01, ntt_b01.length);
// 	var temp_b02 = INTT(ntt_b02, ntt_b02.length);
// 	b00 = compress2d(2048, q, temp_b00);
// 	b01 = compress2d(2048, q, temp_b01);
// 	b02 = compress2d(2048, q, temp_b02);
// }

// function encrypt() {
// 	var temp_b00 = decompress2d(2048, q, b00);
// 	var temp_b01 = decompress2d(2048, q, b01);
// 	var temp_b02 = decompress2d(2048, q, b02);

// 	var r00 = new Array(n);
// 	var r01 = new Array(n);
// 	var r02 = new Array(n);
// 	var e100 = new Array(n);
// 	var e101 = new Array(n);
// 	var e102 = new Array(n);
// 	var e200 = new Array(n);

// 	for (var i = 0; i < n; i++) {
// 		r00[i] = testBinomialSample(nextInt(n));
// 		r01[i] = testBinomialSample(nextInt(n));
// 		r02[i] = testBinomialSample(nextInt(n));
// 		e100[i] = testBinomialSample(nextInt(n));
// 		e101[i] = testBinomialSample(nextInt(n));
// 		e102[i] = testBinomialSample(nextInt(n));
// 		e200[i] = testBinomialSample(nextInt(n));
// 	}
// 	ntt_r00 = NTT(r00, r00.length);
// 	ntt_r01 = NTT(r01, r01.length);
// 	ntt_r02 = NTT(r02, r02.length);
// 	ntt_e100 = NTT(e100, e100.length);
// 	ntt_e101 = NTT(e101, e101.length);
// 	ntt_e102 = NTT(e102, e102.length);
// 	ntt_e200 = NTT(e200, e200.length);

// 	ntt_b00 = NTT(temp_b00, temp_b00.length);
// 	ntt_b01 = NTT(temp_b01, temp_b01.length);
// 	ntt_b02 = NTT(temp_b02, temp_b02.length);

// 	for (var i = 0; i < n; i++) {
// 		// Component multiply; point-wise multiplication
// 		var x1 = (ntt_r00[i] * ntt_a00[i]);
// 		var x2 = (ntt_r01[i] * ntt_a10[i]);
// 		var x3 = (ntt_r02[i] * ntt_a20[i]);
// 		ntt_c100[i] = (x1 + x2 + x3 + ntt_e100[i]) % q;

// 		x1 = (ntt_r00[i] * ntt_a01[i]);
// 		x2 = (ntt_r01[i] * ntt_a11[i]);
// 		x3 = (ntt_r02[i] * ntt_a21[i]);
// 		ntt_c101[i] = (x1 + x2 + x3 + ntt_e101[i]) % q;

// 		x1 = (ntt_r00[i] * ntt_a02[i]);
// 		x2 = (ntt_r01[i] * ntt_a12[i]);
// 		x3 = (ntt_r02[i] * ntt_a22[i]);
// 		ntt_c102[i] = (x1 + x2 + x3 + ntt_e102[i]) % q;

// 		x1 = (ntt_r00[i] * ntt_b00[i]);
// 		x2 = (ntt_r01[i] * ntt_b01[i]);
// 		x3 = (ntt_r02[i] * ntt_b02[i]);
// 		ntt_c200[i] = (x1 + x2 + x3 + ntt_e200[i] + ntt_m_3841[i]) % q;
// 	}

// 	var temp_c100 = INTT(ntt_c100, ntt_c100.length);
// 	var temp_c101 = INTT(ntt_c101, ntt_c101.length);
// 	var temp_c102 = INTT(ntt_c102, ntt_c102.length);
// 	var temp_c200 = INTT(ntt_c200, ntt_c200.length);

// 	c100 = compress2d(2048, q, temp_c100);
// 	c101 = compress2d(2048, q, temp_c101);
// 	c102 = compress2d(2048, q, temp_c102);
// 	c200 = compress2d(8, q, temp_c200);
// }

// function decrypt() {
// 	var temp_c100 = decompress2d(2048, q, c100);
// 	var temp_c101 = decompress2d(2048, q, c101);
// 	var temp_c102 = decompress2d(2048, q, c102);
// 	var temp_c200 = decompress2d(8, q, c200);

// 	ntt_c100 = NTT(temp_c100, temp_c100.length);
// 	ntt_c101 = NTT(temp_c101, temp_c101.length);
// 	ntt_c102 = NTT(temp_c102, temp_c102.length);
// 	ntt_c200 = NTT(temp_c200, temp_c200.length);

// 	for (var i = 0; i < n; i++) {
// 		var x1 = (ntt_s00[i] * ntt_c100[i]);
// 		var x2 = (ntt_s01[i] * ntt_c101[i]);
// 		var x3 = (ntt_s02[i] * ntt_c102[i]);
// 		// v = c2 - f
// 		ntt_v00[i] = (ntt_c200[i] - (x1 + x2 + x3)) % q;
// 		while (ntt_v00[i] < 0) {
// 			ntt_v00[i] += q;
// 		}
// 	}
// 	var temp_v00 = INTT(ntt_v00, ntt_v00.length);
// 	v00 = compress2d(2, q, temp_v00);
// }

// var n = 256;
// var k = 3;
// var q = 7681;
// var eta = 4;	// η = 4
// var db = 11;
// var dc1 = 11;
// var dc2 = 3;

// function testkyber() {
// 	console.log("Test Kyber:");
// 	console.log("Input:");
// 	console.log("n = " + n);
// 	console.log("k = " + k);
// 	console.log("q = " + q);
// 	console.log("η = " + eta);
// 	console.log("db = " + db);
// 	console.log("dc1 = " + dc1);
// 	console.log("dc2 = " + dc2);
// 	console.log("Output:");

// 	// public key A
// 	var a00 = new Array(n);
// 	var a01 = new Array(n);
// 	var a02 = new Array(n);
// 	var a10 = new Array(n);
// 	var a11 = new Array(n);
// 	var a12 = new Array(n);
// 	var a20 = new Array(n);
// 	var a21 = new Array(n);
// 	var a22 = new Array(n);

// 	var plaintext_3841 = new Array(n);
// 	for (var i = 0; i < n; i++) {
// 		a00[i] = nextInt(q);
// 		a01[i] = nextInt(q);
// 		a02[i] = nextInt(q);
// 		a10[i] = nextInt(q);
// 		a11[i] = nextInt(q);
// 		a12[i] = nextInt(q);
// 		a20[i] = nextInt(q);
// 		a21[i] = nextInt(q);
// 		a22[i] = nextInt(q);
// 		plaintext[i] = nextInt(2);
// 		plaintext_3841[i] = plaintext[i] * 3841;
// 	}
// 	ntt_a00 = NTT(a00, a00.length);
// 	ntt_a01 = NTT(a01, a01.length);
// 	ntt_a02 = NTT(a02, a02.length);
// 	ntt_a10 = NTT(a10, a10.length);
// 	ntt_a11 = NTT(a11, a11.length);
// 	ntt_a12 = NTT(a12, a12.length);
// 	ntt_a20 = NTT(a20, a20.length);
// 	ntt_a21 = NTT(a21, a21.length);
// 	ntt_a22 = NTT(a22, a22.length);
// 	ntt_m_3841 = NTT(plaintext_3841, plaintext_3841.length);

// 	keyGeneration();
// 	encrypt();
// 	decrypt();

// 	var km = plaintext.toString();
// 	var kv = v00.toString();

// 	console.log("plaintext: " + km);
// 	console.log("result: " + kv);

// 	if (km === kv) {
// 		console.log("Success!");
// 	} else {
// 		console.log("Failed");
// 	}
// }
