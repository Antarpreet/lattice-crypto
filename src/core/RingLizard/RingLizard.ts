// https://github.com/FuKyuToTo/lattice-based-cryptography

import Utils from '../../utils/utils';
import random from '../../utils/prng';

const utils = new Utils();

export default class RingLizard {}

// ------------------------------------------- start ringLizard -------------------------------------------
function testRingLizard() {
	const n = 1024;
	const q = 1024;
	const a1 = 154;	// a^{-1}
	const sigma = 6.649 / 2.5066;	// a*q/sqrt(2*PI)

	console.log("Test ring-lizard:");
	console.log("Input:");
	console.log("n = " + n);
	console.log("q = " + q);
	console.log("a^{-1} = " + a1);

	const m = [];
	for (let i = 0; i < n; i++) {
		m[i] = utils.nextInt(2);
	}

	const _m = utils.copyOf(m, m.length);
	// encode
	multiplyInt(_m, 128);

	const {pka, pkb, sks} = keyGeneration(n, q, sigma);
	const {cpc1, cpc2} = encrypt(n, _m, pka, pkb);
	const result = decrypt(cpc1, cpc2, sks);

	const ms = m.toString();
	const rs = result.toString();

	console.log("Output:");
	console.log("plaintext =  " + ms);
	console.log("result = " + rs);

	if(rs === ms) {
		console.log("Success!");
	} else {
		console.log("Failed");
	}
}

testRingLizard();


// Rejection sampling
function testRejectionSampling(c: number, sigma: number): number {
	// Input: a center c, a gaussian parameter sigma, and a tail-cut parameter tau
	// Output: x, with distribution statistically close to D_z,c,tau
	// 1: h = - PI/(sigma^2); x_max = ceil(c + tau * sigma); x_min = floor(c - tau * sigma)
	// 2: x = RandInt[x_min, x_max]; p = exp(h * (x - c)^2)
	// 3: r = RandFloat[0, 1), if r < p then return x
	// 4: Goto Step 2
	const tau = 13;
	const h = - Math.PI / Math.sqrt(sigma);
	const xMax = Math.ceil(c + tau * sigma);
	const xMin = Math.floor(c - tau * sigma);
	while (true) {
		const x = utils.rangeValue(xMin, xMax);
		const p = Math.exp(
				(h * Math.sqrt(x - c))
			);
        const r = random.randomGenerator();
		if (r < p) {
			return x;
		}
	}
}

// Karatsuba multiplication
function karatsuba(a: number[], b: number[]): number[] {
	const n = b.length;
	if (n <= 32) {
		const cn = (n << 1) - 1;
		// var c = new Array(cn).fill(0);
		const c = new Array(cn);
		for (let k = 0; k < cn; k++) {
			c[k] = 0;
		}
		for (let k = 0; k < cn; k++) {
			for (let i = Math.max(0, k - n + 1); i <= Math.min(k, n - 1); i++) {
				c[k] += b[i] * a[k - i];
			}
		}
		return c;
	} else {
		const n1 = (n >> 1);
		const a1 = utils.copyOf(a.slice(), n1);
		const a2 = utils.copyOfRange(a.slice(), n1, n);
		const b1 = utils.copyOf(b.slice(), n1);
		const b2 = utils.copyOfRange(b.slice(), n1, n);

		// make a copy of a1 that is the same length as a2
		const A = utils.copyOf(a1.slice(), a2.length);
		addIntPoly(A, a2);
		// make a copy of b1 that is the same length as b2
		const B = utils.copyOf(b1.slice(), b2.length);
		addIntPoly(B, b2);

		const c1 = karatsuba(a1, b1);
		const c2 = karatsuba(a2, b2);
		const c3 = karatsuba(A, B);
		subIntPoly(c3, c1);
		subIntPoly(c3, c2);

		// var c = new Array((n << 1) - 1).fill(0);
		const c = new Array((n << 1) - 1);
		for (let k = 0; k < c.length; k++) {
			c[k] = 0;
		}
		for (let i = 0; i < c1.length; i++) {
			c[i] = c1[i];
		}
		for (let i = 0; i < c3.length; i++) {
			c[n1 + i] += c3[i];
		}
		for (let i = 0; i < c2.length; i++) {
			c[(n1 << 1) + i] += c2[i];
		}
		return c;
	}
}

// Polynomial addition
function addIntPoly(a: number[], b: number[]): void {
	for (let i = 0; i < b.length; i++) {
		a[i] += b[i];
	}
}

// Polynomial subtraction
function subIntPoly(a: number[], b: number[]): void {
	for (let i = 0; i < b.length; i++) {
		a[i] -= b[i];
	}
}

// Multiplies each coefficient by a int. Does not return a new polynomial but modifies this polynomial
function multiplyInt(a: number[], factor: number): void {
	for (let i = 0; i < a.length; i++) {
		a[i] *= factor;
	}
}

// ------------------------------------------- keyGeneration -------------------------------------------
function keyGeneration(n: number, q: number, sigma: number): {pka: number[], pkb: number[], sks: number[]} {
	const a = new Array(n);	// public key a
	let b;	// public key b
	let s;	// secret key a
	const e = new Array(n);
    const arrS = new Array(n);
    let pka;
    let pkb;
    let sks;

	for (let i = 0; i < n; i++) {
		e[i] = testRejectionSampling(0.0, sigma);
	}
	for (let i = 0; i < 64; i++) {
		arrS[i] = 1;
		arrS[i+ 64] = -1;
	}
	for (let i = 128; i < n; i++) {
		arrS[i] = 0;
	}

	for (let i = 0; i < n; i++) {
		a[i] = utils.nextInt(q);
	}

	pka = a;
	s = utils.shuffle(arrS);
	sks = s;
	b = multiplySubModPoly(a, s, e, q);
    pkb = b;
    
    return {
        pka,
        pkb,
        sks
    };
}

function multiplySubModPoly(a: number[], s: number[], e: number[], modulus: number): number[] {
	const N = a.length;
	if (s.length !== N) {
		alert("Number of coefficients must be the same");
		return [];
	}
	const c = karatsuba(a, s);

	let b = new Array(N);
	if (c.length > N) {
		for (let k = N; k < c.length; k++) {
			c[k - N] += c[k];
			// alert("c[k-N]:" + c[k-N]);
		}
		b = utils.copyOf(c, N);
	}

	for (let i = 0; i < b.length; i++) {
		b[i] = e[i] - b[i];
		if (modulus === 2048) {
			b[i] = b[i] & 2047;
		} else if (modulus === 1024) {
			b[i] = b[i] & 1023;
		} else {
			b[i] %= modulus;
		}
		if(b[i] < 0) {
			b[i] += modulus;
		}
	}
	return b;
}
// ------------------------------------------- encrypt -------------------------------------------
function encrypt(n: number, _m: number[], pka: number[], pkb: number[]): {cpc1: number[], cpc2: number[]} {
    let cpc1: number[];
    let cpc2: number[];
	const a = pka;
	const b = pkb;
	const arrR = new Array(n);

	for (let i = 0; i < 64; i++) {
		arrR[i] = 1;
		arrR[i+ 64] = -1;
	}
	for (let i = 128; i < n; i++) {
		arrR[i] = 0;
	}

	const r = utils.shuffle(arrR);
	const c1 = multiplyModPolyC1(a, r, 0.25, 256);
	const c2 = multiplyAddModPolyC2(b, r, _m, 0.25, 256);

	cpc1 = c1;
    cpc2 = c2;
    
    return {
        cpc1,
        cpc2
    };
}
// ***************************************************************
function multiplyModPolyC1(a: number[], r: number[], f: number, modulus: number): number[] {
	const N = a.length;
	if (r.length !== N) {
		alert("Number of coefficients must be the same");
		return [];
	}
	const c = karatsuba(a, r);

	let c1 = new Array(N);
	if (c.length > N) {
		for (let k = N; k < c.length; k++) {
			c[k - N] += c[k];
			// alert("c[k-N]:" + c[k-N]);
		}
		c1 = utils.copyOf(c, N);
	}

	for (let i = 0; i < c1.length; i++) {
		c1[i] = Math.round(c1[i] * f);
		if (modulus === 2048) {
			c1[i] = c1[i] & 2047;
		} else if (modulus === 256) {
			c1[i] = c1[i] & 255;
		} else {
			c1[i] %= modulus;
		}
		if(c1[i] < 0) {
			c1[i] += modulus;
		}
	}
	return c1;
}

function multiplyAddModPolyC2(b: number[], r: number[], _m: number[], f: number, modulus: number): number[] {
	const N = b.length;
	if (r.length !== N) {
		alert("Number of coefficients must be the same");
		return [];
	}
	const c = karatsuba(b, r);

	let c2 = new Array(N);
	if (c.length > N) {
		for (let k = N; k < c.length; k++) {
			c[k - N] += c[k];
			// alert("c[k-N]:" + c[k-N]);
		}
		c2 = utils.copyOf(c, N);
	}

	for (let i = 0; i < c2.length; i++) {
		c2[i] = Math.round((c2[i] * f) + _m[i]);
		if (modulus === 2048) {
			c2[i] = c2[i] & 2047;
		} else if (modulus === 256) {
			c2[i] = c2[i] & 255;
		} else {
			c2[i] %= modulus;
		}
		if(c2[i] < 0) {
			c2[i] += modulus;
		}
	}
	return c2;
}

// ------------------------------------------- decrypt -------------------------------------------
function decrypt(cpc1: number[], cpc2: number[], sks: number[]): number[] {
	const c1 = cpc1;
	const c2 = cpc2;
	const s = sks;

	return multiplyAddModPolyResult(c1, s, c2, 0.0078125, 2);
}
// ***************************************************************
function multiplyAddModPolyResult(c1: number[], s: number[], c2: number[], f: number, modulus: number): number[] {
	const N = c1.length;
	if (s.length !== N) {
		alert("Number of coefficients must be the same");
		return [];
	}

	const c = karatsuba(c1, s);

	let res = new Array(N);
	if (c.length > N) {
		for (let k = N; k < c.length; k++) {
			c[k - N] += c[k];
			// alert("c[k-N]:" + c[k-N]);
		}
		res = utils.copyOf(c, N);
	}

	for (let i = 0; i < res.length; i++) {
		res[i] = Math.round((c2[i] + res[i]) * f);
		if (modulus === 2048) {
			res[i] = res[i] & 2047;
		} else if (modulus === 2) {
			res[i] = res[i] & 1;
		} else {
			res[i] %= modulus;
		}
		if(res[i] < 0) {
			res[i] += modulus;
		}
	}
	return res;
}
