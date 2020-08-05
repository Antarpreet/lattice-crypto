// https://github.com/FuKyuToTo/lattice-based-cryptography

export default class NewHope {}

// -----------------------------------Global variables-----------------------------------
// var ntt_a;
// var ntt_b = new Array(n);
// var ntt_s;
// var ntt_e;

// var ntt_s1;
// var ntt_e1;
// var u = new Array(n);
// var ntt_v = new Array(n);
// var v;
// var r;

// var ntt_v1 = new Array(n);
// var v1;
// var ka;
// var kb;

// var Bmatrix;

// Binomial sampling
// function testBinomialSample (value) {
// 	var sum = 0;
// 	sum = (getBit(value, 0) - getBit(value, 16)) +
// 		(getBit(value, 1) - getBit(value, 17)) +
// 		(getBit(value, 2) - getBit(value, 18)) +
// 		(getBit(value, 3) - getBit(value, 19)) +
// 		(getBit(value, 4) - getBit(value, 20)) +
// 		(getBit(value, 5) - getBit(value, 21)) +
// 		(getBit(value, 6) - getBit(value, 22)) +
// 		(getBit(value, 7) - getBit(value, 23)) +
// 		(getBit(value, 8) - getBit(value, 24)) +
// 		(getBit(value, 9) - getBit(value, 25)) +
// 		(getBit(value, 10) - getBit(value, 26)) +
// 		(getBit(value, 11) - getBit(value, 27)) +
// 		(getBit(value, 12) - getBit(value, 28)) +
// 		(getBit(value, 13) - getBit(value, 29)) +
// 		(getBit(value, 14) - getBit(value, 30)) +
// 		(getBit(value, 15) - getBit(value, 31));
// 	//return sum;
// 	return parseInt(Math.abs(sum));
// }

// Computes norm1
// function norm1(x0, x1, x2, x3){
// 	//var sum = 0;
// 	var sum = Math.abs(x0) + Math.abs(x1) + Math.abs(x2) + Math.abs(x3);
// 	return sum;
// }

// Modulo modulus
// function mod(x, modulus) {
// 	var remainder = 0;
// 	if (modulus == 4) {
// 		remainder = x & 3;
// 	} else if (modulus == 2048) {
// 		remainder = x & 2047;
// 	} else {
// 		remainder %= modulus;
// 		while (remainder < 0) {
// 			remainder += modulus;
// 		}
// 	}
// 	return remainder;
// }

// Computes helpRec()
// function helpRec(v, bit){
// 	var r = new Array(v.length);
// 	for (var i = 0; i < v.length; i++) {
// 		r[i] = (v[i] + bit * 0.5) * 4.0 / q;
// 	}
// 	cvp(r);
// 	return r;
// }

// Computes CVP()
// function cvp(v_coeffs) {
// 	for (var i = 0; i < v_coeffs.length / 4; i++) {
// 		var x_0 = v_coeffs[i];
// 		var x_1 = v_coeffs[i+ v_coeffs.length/4];
// 		var x_2 = v_coeffs[i+ v_coeffs.length/2];
// 		var x_3 = v_coeffs[i+ v_coeffs.length - v_coeffs.length/4];

// 		var v0_0 = Math.round(x_0);
// 		var v0_1 = Math.round(x_1);
// 		var v0_2 = Math.round(x_2);
// 		var v0_3 = Math.round(x_3);

// 		var v1_0 = Math.round(x_0 - 0.5);
// 		var v1_1 = Math.round(x_1 - 0.5);
// 		var v1_2 = Math.round(x_2 - 0.5);
// 		var v1_3 = Math.round(x_3 - 0.5);

// 		var vk_0 = 0, vk_1 = 0, vk_2 = 0, vk_3 = 0, k = 0;
// 		if (norm1(x_0 - v0_0, x_1 - v0_1, x_2 - v0_2, x_3 - v0_3) < 1) {
// 			vk_0 = v0_0;
// 			vk_1 = v0_1;
// 			vk_2 = v0_2;
// 			vk_3 = v0_3;
// 			k = 0;
// 		} else {
// 			vk_0 = v1_0;
// 			vk_1 = v1_1;
// 			vk_2 = v1_2;
// 			vk_3 = v1_3;
// 			k = 1;
// 		}
// 		vk_0 = vk_0 + (-1.0 * vk_3);
// 		vk_1 = vk_1 + (-1.0 * vk_3);
// 		vk_2 = vk_2 + (-1.0 * vk_3);
// 		vk_3 = k + (2.0 * vk_3);

// 		v_coeffs[i] = mod(vk_0, 4);
// 		v_coeffs[i+ v_coeffs.length/4] = mod(vk_1, 4);
// 		v_coeffs[i+ v_coeffs.length/2] = mod(vk_2, 4);
// 		v_coeffs[i+ v_coeffs.length - v_coeffs.length/4] = mod(vk_3, 4);
// 	}
// }

// Computes Rec()
// function rec(v_coeffs, r_coeffs, Bmatrix) {
// 	var k = new Array(r_coeffs.length/4);
// 	for (var i = 0; i < v_coeffs.length/4; i++) {
// 		var v_0 = v_coeffs[i] * 1.0 / q;
// 		var v_1 = v_coeffs[i+ v_coeffs.length/4] * 1.0 / q;
// 		var v_2 = v_coeffs[i+ v_coeffs.length/2] * 1.0 / q;
// 		var v_3 = v_coeffs[i+ v_coeffs.length - v_coeffs.length/4] * 1.0 / q;

// 		var r_0 = r_coeffs[i];
// 		var r_1 = r_coeffs[i+ r_coeffs.length/4];
// 		var r_2 = r_coeffs[i+ r_coeffs.length/2];
// 		var r_3 = r_coeffs[i+ r_coeffs.length - r_coeffs.length/4];

// 		var rvector = [r_0, r_1, r_2, r_3];
// 		var rTBT = vector_multiply_matrix(rvector, Bmatrix, Bmatrix[0].length);

// 		k[i] = decode(v_0 - rTBT[0]/4.0, v_1 - rTBT[1]/4.0, v_2 - rTBT[2]/4.0, v_3 - rTBT[3]/4.0);
// 	}
// 	return k;
// }

// Decoding function
// function decode(x_0, x_1, x_2, x_3) {
// 	var v_0 = x_0 - Math.round(x_0);
// 	var v_1 = x_1 - Math.round(x_1);
// 	var v_2 = x_2 - Math.round(x_2);
// 	var v_3 = x_3 - Math.round(x_3);

// 	var k = 0;
// 	if (norm1(v_0, v_1, v_2, v_3) <= 1) {
// 		k = 0;
// 	} else {
// 		k = 1;
// 	}
// 	return k;
// }

// Multiply a matrix B by a vevtor a, c = a * B
// function vector_multiply_matrix(a, B, Bcol) {
// // Matrix inner dimensions must agree
// 	var c = new Array(Bcol);
// 	for (var j = 0; j < Bcol; j++) {
// 		c[j] = 0;
// 	}

// 	for (var i = 0; i < a.length; i++) {
// 		var Browi = B[i];
// 		for (var j = 0; j < Bcol; j++) {
// 			c[j] += Browi[j]*a[i];
// 		}
// 	}
// 	return c;
// }
// ------------------------------------- alice0 -------------------------------------
// function alice0() {
// 	var arr_s = new Array(n);		// secret key s
// 	var arr_e = new Array(n);

// 	for (var i = 0; i < n; i++) {
// 		arr_s[i] = testBinomialSample(nextInt(MO));
// 		arr_e[i] = testBinomialSample(nextInt(MO));
// 	}

// 	ntt_s = NTT(arr_s, arr_s.length);
// 	ntt_e = NTT(arr_e, arr_e.length);

// 	//public key b
// 	for (var i = 0; i < n; i++) {
// 		ntt_b[i] = (ntt_a[i] * ntt_s[i] + ntt_e[i]) % q;  // Component multiply
// 	}
// }
// ------------------------------------- bob -------------------------------------
// function bob() {
// 	var arr_s1 = new Array(n);
// 	var arr_e1 = new Array(n);
// 	var arr_e2 = new Array(n);

// 	for (var i = 0; i < n; i++) {
// 		arr_s1[i] = testBinomialSample(nextInt(MO));
// 		arr_e1[i] = testBinomialSample(nextInt(MO));
// 		arr_e2[i] = testBinomialSample(nextInt(MO));
// 	}

// 	ntt_s1 = NTT(arr_s1, arr_s1.length);
// 	ntt_e1 = NTT(arr_e1, arr_e1.length);

// 	for (var i = 0; i < n; i++) {
// 		u[i] = (ntt_a[i] * ntt_s1[i] + ntt_e1[i]) % q;  	// Component multiply
// 		ntt_v[i] = (ntt_b[i] * ntt_s1[i]);
// 	}

// 	v = INTT(ntt_v, ntt_v.length);

// 	for (var i = 0; i < n; i++) {
// 		v[i] = (v[i] + arr_e2[i]) % q;
// 		if(v[i] < 0) {
// 			v[i] += q;
// 		}
// 	}

// 	var bit = nextInt(2);
// 	// g = (0.5, 0.5, 0.5, 0.5)
// 	//-------- HelpRec --------
// 	r = helpRec(v, bit);
// 	//-------- Rec --------
// 	kb = rec(v, r, Bmatrix);
// }
// ------------------------------------- alice1 -------------------------------------
// function alice1() {
// 	for (var i = 0; i < n; i++) {
// 		ntt_v1[i] = (u[i] * ntt_s[i]) % q;  // Component multiply
// 	}
// 	v1 = INTT(ntt_v1, ntt_v1.length);
// 	//-------- Rec --------
// 	ka = rec(v1, r, Bmatrix);
// }
// ------------------------------------------- start newhope -------------------------------------------
// var n = 1024;
// var q = 12289;
// var k = 16;
// var MO = 4294967296;	//var MO = Math.pow(2,32);

// function testnewhope() {
// 	print("Test NewHope:");
// 	print("Input:");
// 	print("n = " + n);
// 	print("q = " + q);
// 	print("k = " + k);

// 	var arr_a = new Array(n);	// public key a
// 	for (var j = 0; j < n; j++) {
// 		arr_a[j] = nextInt(q);
// 	}
// 	ntt_a = NTT(arr_a, arr_a.length);

// 	// g = (0.5, 0.5, 0.5, 0.5)
// 	//var b_arr = [[1,0,0,0.5],[0,1,0,0.5],[0,0,1,0.5],[0,0,0,0.5]];
// 	Bmatrix = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0.5,0.5,0.5,0.5]];

// 	alice0();
// 	bob();
// 	alice1();

// 	print("Output:");
// 	print("ka: " + ka.toString());
// 	print("kb: " + kb.toString());

// 	if(ka.toString() == kb.toString()) {
// 		print("Success!");
// 	} else {
// 		print("Failed");
// 	}
// }
// //***********************************************************
// function print(message) {
// 	//WScript.Echo(message);	//for WSH
// 	console.log(message);
// }
// testnewhope();
