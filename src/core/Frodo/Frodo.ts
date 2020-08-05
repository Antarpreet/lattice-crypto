// import random from '../utils/prng';
// import { Frodo as FrodoConfig } from '../config';

// =======================================================================================
export default class Frodo {}

// Returns the pseudorandom integer value between low(inclusive) and high(inclusive)
// function rangeValue(low, high) {
// 	return Math.floor(Math.random() * (high - low + 1) + low);
// }

// Shuffles the input array
// function shuffle(arr) {
// 	var arr2 = arr.slice();
// 	for(var j, x, i = arr2.length; i; j = parseInt(random() * i), x = arr2[--i], arr2[i] = arr2[j], arr2[j] = x);
// 	return arr2;
// }

// Computes Rec()
// function rec(b1s, m, l, a, h) {
// 	var whole = 1 << a;
// 	var mask = whole - 1;
// 	var negmask = ~mask;
// 	var half = 1 << (a - 1);
// 	var quarter = 1 << (a - 2);

// 	for (var i = 0; i < m; i++) {
//         for (var j = 0; j < l; j++) {
// 			var remainder = b1s[i][j] & mask;
// 			var use_hint = ((remainder + quarter) >> (a - 1)) & 1;
// 			//h: the hint cmatrix
// 			var shift = use_hint * (2 * h[i][j] - 1) * quarter;
// 			// if use_hint = 1 and h = 0, adding -quarter forces rounding down
// 			//                     h = 1, adding quarter forces rounding up
// 			b1s[i][j] = (b1s[i][j] + half + shift) & negmask;

// 			b1s[i][j] >>= 11;
// 			b1s[i][j] %= 16;
// 		}
// 	}
// }
// =======================================================================================
// var am;
// var bm;
// var sm;
// var bb;
// var cc;
// var arr_v;
// var k1matrix = new Array(m);    // V, Z^m*l
// var k2matrix;

// function alice0(l, n, q) {
// 	//A, n*n
// 	var amatrix = initMatrixRandom(n, n, q);
// 	var smatrix = ss;	//n*l
// 	var ematrix = ee;	//n*l
// 	//B = AS + E mod q, n*l
// 	var bmatrix = multiply(amatrix, smatrix);
// 	bmatrix = addMod(bmatrix, ematrix, q);

// 	am = amatrix;
// 	bm = bmatrix;
// 	sm = smatrix;
// }

// function bob(l, m, n, q) {
// 	var amatrix = am;
// 	var bmatrix = bm;

// 	var s1matrix = ss1;	// Z^m*n
// 	var e1matrix = ee1;	// Z^m*n
// 	var e2matrix = ee2;	// Z^m*l

// 	var b1matrix = multiply(s1matrix, amatrix);
// 	var vmatrix = multiply(s1matrix, bmatrix);

// 	b1matrix = addMod(b1matrix, e1matrix, q);  // Z^m*n
// 	vmatrix = addMod(vmatrix, e2matrix, q);    // Z^m*l
// 	var cmatrix = new Array(m);    // Z^m*l

// 	for (var i = 0; i < l; i++) {
// 		cmatrix[i] = vmatrix[i].slice();
// 		k1matrix[i] = vmatrix[i].slice();
// 	}

// 	for (var i = 0; i < m; i++) {
// 		for (var j = 0; j < l; j++) {
// 			cmatrix[i][j] = (cmatrix[i][j] >> 10) & 1;	// >> logq - b - 1
// 			//cmatrix[i][j] = Math.floor(cmatrix[i][j] * 0.0009765625) % 2;

// 			k1matrix[i][j] = (k1matrix[i][j] + 1024) % q;
// 			k1matrix[i][j] >>= 11;  // >>= logq - b
// 			//k1matrix[i][j] = Math.round(k1matrix[i][j] * 0.00048828125) % 16;
// 		}
// 	}

// 	bb = b1matrix;
// 	cc = cmatrix;
// }

// function alice1(l, m, q) {
// 	var b1m = bb;
// 	var cm = cc;
// 	var smatrix = sm;

// 	var b1s = multiplyMod(b1m, smatrix, q);    // Z^m*l
// 	k2matrix = b1s;     // Z^m*l
// 	rec(k2matrix, m, l, 11, cm);
// }
// ------------------------------------------- start frodo -------------------------------------------
// var m = 8,
// 	n = 752,
// 	l = 8,
// 	a = 11,
// 	b = 4;
// 	q = 32768,
// 	logq = 15;
// 	sigma = 1.3229;

// function testfrodo() {
// 	print("Test Frodo:");
// 	print("Input:");
// 	print("m = " + m);
// 	print("n = " + n);
// 	print("l = " + l);
// 	print("b = " + b);
// 	print("q = " + q);
// 	print("sigma = " + sigma);
// 	print("Output:");

// 	alice0(l, n, q);
// 	bob(l, m, n, q);
// 	alice1(l, m, q);

// 	var ka = k2matrix.toString();
// 	print("k_a = " + ka);
// 	var kb = k1matrix.toString();
// 	print("k_b = " + kb);

// 	if(ka == kb) {
// 		print("Success!");
// 	} else {
// 		print("Failed");
// 	}
// }
// // ***********************************************************
// function print(message) {
// //	WScript.Echo(message);	//for WSH
// 	console.log(message);
// }
// testfrodo();
