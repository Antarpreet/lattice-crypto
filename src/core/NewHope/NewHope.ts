// https://github.com/FuKyuToTo/lattice-based-cryptography
import Utils from '../../utils/utils';
import { Algorithm } from '../../models/LatticeCrypto';
import { NewHope as NewHopeConfig } from './config';

const utils = new Utils();

export default class NewHope {}

// ------------------------------------------- start newHope -------------------------------------------
const n = 1024;
const q = 12289;
const k = 16;
const MO = 4294967296;	// 2^32

const u: number[] = new Array(n);
const BMATRIX = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0.5,0.5,0.5,0.5]];

function generatePublicKeyA(): number[] {
    const arrA = new Array(n);
	for (let j = 0; j < n; j++) {
		arrA[j] = utils.nextInt(q);
    }
    return arrA; 
}

function generatePublicKeyB(nttA: number[], nttS: number[], nttE: number[]): number[] {
    const arrB = new Array(n);
	for (let i = 0; i < n; i++) {
		arrB[i] = (nttA[i] * nttS[i] + nttE[i]) % q;  // Component multiply
    }
    return arrB;
}

function testNewHope() {
	console.log("Test NewHope:");
	console.log("Input:");
	console.log("n = " + n);
	console.log("q = " + q);
	console.log("k = " + k);

	const arrA = generatePublicKeyA();
	const nttA = utils.NTT(Algorithm.NEW_HOPE, arrA, arrA.length, NewHopeConfig.bitRev_psi_12289_1024, q);

	const { nttB, nttS } = alice0(nttA);
	const { kb, r } = bob(nttA, nttB);
    const ka = alice1(nttS, r);

	console.log("Output:");
	console.log("ka: " + ka.toString());
	console.log("kb: " + kb.toString());

	if(ka.toString() === kb.toString()) {
		console.log("Success!");
	} else {
		console.log("Failed");
	}
}

testNewHope();

// ------------------------------------- alice0 -------------------------------------
function alice0(nttA: number[]): { nttB: number[], nttS: number[] } {
	const arrS = new Array(n);		// secret key s
	const arrE = new Array(n);

	for (let i = 0; i < n; i++) {
		arrS[i] = testBinomialSample(utils.nextInt(MO));
		arrE[i] = testBinomialSample(utils.nextInt(MO));
	}

	const nttS = utils.NTT(Algorithm.NEW_HOPE, arrS, arrS.length, NewHopeConfig.bitRev_psi_12289_1024, q);
    const nttE = utils.NTT(Algorithm.NEW_HOPE, arrE, arrE.length, NewHopeConfig.bitRev_psi_12289_1024, q);
    
    return {
        nttB: generatePublicKeyB(nttA, nttS, nttE),
        nttS
    };
}
// ------------------------------------- bob -------------------------------------
function bob(nttA: number[], nttB: number[]): { kb: number[], r: number[] } {
	const arrS1 = new Array(n);
	const arrE1 = new Array(n);
    const arrE2 = new Array(n);
    const nttV = new Array(n);

	for (let i = 0; i < n; i++) {
		arrS1[i] = testBinomialSample(utils.nextInt(MO));
		arrE1[i] = testBinomialSample(utils.nextInt(MO));
		arrE2[i] = testBinomialSample(utils.nextInt(MO));
	}

	const nttS1 = utils.NTT(Algorithm.NEW_HOPE, arrS1, arrS1.length, NewHopeConfig.bitRev_psi_12289_1024, q);
	const nttE1 = utils.NTT(Algorithm.NEW_HOPE, arrE1, arrE1.length, NewHopeConfig.bitRev_psi_12289_1024, q);

	for (let i = 0; i < n; i++) {
		u[i] = (nttA[i] * nttS1[i] + nttE1[i]) % q;  	// Component multiply
		nttV[i] = (nttB[i] * nttS1[i]);
	}

	const v = utils.INTT(Algorithm.NEW_HOPE, nttV, nttV.length, NewHopeConfig.bitRev_psiInv_12289_1024, q, NewHopeConfig.INVN);

	for (let i = 0; i < n; i++) {
		v[i] = (v[i] + arrE2[i]) % q;
		if(v[i] < 0) {
			v[i] += q;
		}
	}

	const bit = utils.nextInt(2);
	// -------- HelpRec --------
	const r = helpRec(v, bit);
	// -------- Rec --------
	return { kb: rec(v, r, BMATRIX), r };
}
// ------------------------------------- alice1 -------------------------------------
function alice1(nttS: number[], r: number[]): number[] {
    const nttV1: number[] = new Array(n);
	for (let i = 0; i < n; i++) {
		nttV1[i] = (u[i] * nttS[i]) % q;  // Component multiply
	}
	const v1 = utils.INTT(Algorithm.NEW_HOPE, nttV1, nttV1.length, NewHopeConfig.bitRev_psiInv_12289_1024, q, NewHopeConfig.INVN);
	// -------- Rec --------
	return rec(v1, r, BMATRIX);
}


// Binomial sampling
function testBinomialSample (value: number): number {
	let sum = 0;
	sum = (utils.getBit(value, 0) - utils.getBit(value, 16)) +
		(utils.getBit(value, 1) - utils.getBit(value, 17)) +
		(utils.getBit(value, 2) - utils.getBit(value, 18)) +
		(utils.getBit(value, 3) - utils.getBit(value, 19)) +
		(utils.getBit(value, 4) - utils.getBit(value, 20)) +
		(utils.getBit(value, 5) - utils.getBit(value, 21)) +
		(utils.getBit(value, 6) - utils.getBit(value, 22)) +
		(utils.getBit(value, 7) - utils.getBit(value, 23)) +
		(utils.getBit(value, 8) - utils.getBit(value, 24)) +
		(utils.getBit(value, 9) - utils.getBit(value, 25)) +
		(utils.getBit(value, 10) - utils.getBit(value, 26)) +
		(utils.getBit(value, 11) - utils.getBit(value, 27)) +
		(utils.getBit(value, 12) - utils.getBit(value, 28)) +
		(utils.getBit(value, 13) - utils.getBit(value, 29)) +
		(utils.getBit(value, 14) - utils.getBit(value, 30)) +
		(utils.getBit(value, 15) - utils.getBit(value, 31));
	// return sum;
	return Math.abs(sum);
}

// Computes norm1
function norm1(x0: number, x1: number, x2: number, x3: number): number {
	return Math.abs(x0) + Math.abs(x1) + Math.abs(x2) + Math.abs(x3);
}

// Modulo modulus
function mod(x: number, modulus: number): number {
	let remainder = 0;
	if (modulus === 4) {
		remainder = x & 3;
	} else if (modulus === 2048) {
		remainder = x & 2047;
	} else {
		remainder %= modulus;
		while (remainder < 0) {
			remainder += modulus;
		}
	}
	return remainder;
}

// Computes helpRec()
function helpRec(vv: number[], bit: number): number[] {
	const rr = new Array(vv.length);
	for (let i = 0; i < vv.length; i++) {
		rr[i] = (vv[i] + bit * 0.5) * 4.0 / q;
	}
	cvp(rr);
	return rr;
}

// Computes CVP()
function cvp(vCoefficients: number[]): void {
	for (let i = 0; i < vCoefficients.length / 4; i++) {
		const x0 = vCoefficients[i];
		const x1 = vCoefficients[i+ vCoefficients.length/4];
		const x2 = vCoefficients[i+ vCoefficients.length/2];
		const x3 = vCoefficients[i+ vCoefficients.length - vCoefficients.length/4];

		const v00 = Math.round(x0);
		const v01 = Math.round(x1);
		const v02 = Math.round(x2);
		const v03 = Math.round(x3);

		const v10 = Math.round(x0 - 0.5);
		const v11 = Math.round(x1 - 0.5);
		const v12 = Math.round(x2 - 0.5);
		const v13 = Math.round(x3 - 0.5);

        let vk0 = 0;
        let vk1 = 0;
        let vk2 = 0;
        let vk3 = 0;
        let kk = 0;
		if (norm1(x0 - v00, x1 - v01, x2 - v02, x3 - v03) < 1) {
			vk0 = v00;
			vk1 = v01;
			vk2 = v02;
			vk3 = v03;
			kk = 0;
		} else {
			vk0 = v10;
			vk1 = v11;
			vk2 = v12;
			vk3 = v13;
			kk = 1;
		}
		vk0 = vk0 + (-1.0 * vk3);
		vk1 = vk1 + (-1.0 * vk3);
		vk2 = vk2 + (-1.0 * vk3);
		vk3 = kk + (2.0 * vk3);

		vCoefficients[i] = mod(vk0, 4);
		vCoefficients[i+ vCoefficients.length/4] = mod(vk1, 4);
		vCoefficients[i+ vCoefficients.length/2] = mod(vk2, 4);
		vCoefficients[i+ vCoefficients.length - vCoefficients.length/4] = mod(vk3, 4);
	}
}

// Computes Rec()
function rec(vCoefficients: number[], rCoefficients: number[], BMatrix: number[][]): number[] {
	const kk = new Array(rCoefficients.length/4);
	for (let i = 0; i < vCoefficients.length/4; i++) {
		const v0 = vCoefficients[i] * 1.0 / q;
		const v11 = vCoefficients[i+ vCoefficients.length/4] * 1.0 / q;
		const v2 = vCoefficients[i+ vCoefficients.length/2] * 1.0 / q;
		const v3 = vCoefficients[i+ vCoefficients.length - vCoefficients.length/4] * 1.0 / q;

		const r0 = rCoefficients[i];
		const r1 = rCoefficients[i+ rCoefficients.length/4];
		const r2 = rCoefficients[i+ rCoefficients.length/2];
		const r3 = rCoefficients[i+ rCoefficients.length - rCoefficients.length/4];

		const rVector = [r0, r1, r2, r3];
		const rTBT = vector_multiply_matrix(rVector, BMatrix, BMatrix[0].length);

		kk[i] = decode(v0 - rTBT[0]/4.0, v11 - rTBT[1]/4.0, v2 - rTBT[2]/4.0, v3 - rTBT[3]/4.0);
	}
	return kk;
}

// Decoding function
function decode(x0: number, x1: number, x2: number, x3: number): number {
	const v0 = x0 - Math.round(x0);
	const v11 = x1 - Math.round(x1);
	const v2 = x2 - Math.round(x2);
	const v3 = x3 - Math.round(x3);

	let kk = 0;
	if (norm1(v0, v11, v2, v3) <= 1) {
		kk = 0;
	} else {
		kk = 1;
	}
	return kk;
}

// Multiply a matrix B by a vector a, c = a * B
function vector_multiply_matrix(a: number[], B: number[][], BColumnSize: number): number[] {
// Matrix inner dimensions must agree
	const c = new Array(BColumnSize);
	for (let j = 0; j < BColumnSize; j++) {
		c[j] = 0;
	}

	for (let i = 0; i < a.length; i++) {
		const BRowI = B[i];
		for (let j = 0; j < BColumnSize; j++) {
			c[j] += BRowI[j]*a[i];
		}
	}
	return c;
}
