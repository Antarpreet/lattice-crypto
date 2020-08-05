export default class Lizard {

};

// ***********************************************************
// var am;
// var bm;
// var sm;
// var vvector;
// var av;
// var bv;
// var resultvector;
// var m_transpose;
// ***********************************************************
// function randomPlaintext () {
// 	var plaintext = new Array(l);
// 	for (var i = 0; i < l; i++) {
//        		plaintext[i] = nextInt(2);
// 	}
// 	vvector = plaintext;
// 	m_transpose = scalarMultiplyVector(128, vvector);
// }
// ***********************************************************
// function keyGeneration(l, m, n, q) {
// 	//A, m*n
// 	var amatrix = initMatrixRandom(m, n, q);
// 	//var amatrix = aa;	// Does not apply in WSH
// 	//S, n*l
// 	var smatrix = ss;
// 	//E, m*l
// 	var ematrix = ee;
// 	//B = AS + E mod q, m*l
// 	var bmatrix = multiply(amatrix, smatrix);
// 	bmatrix = addMod(bmatrix, ematrix, q);
	
// 	am = amatrix;
// 	bm = bmatrix;
// 	sm = smatrix;
// }

// function encrypt(l, n, p, q) {
// 	var amatrix = am;
// 	var bmatrix = bm;
	
// 	var rvector_transpose = rr;	// Z^1*m
// 	var c1_prime_transpose = encVectorMultiplyMatrix(rvector_transpose, amatrix);
// 	var c2_prime_transpose = encVectorMultiplyMatrix(rvector_transpose, bmatrix);
	
// 	var c1_transpose = new Array(n);
// 	for (var i = 0; i < n; i++) {
// 		c1_prime_transpose[i] = c1_prime_transpose[i] % q;
// 		c1_transpose[i] = Math.round(0.25 * c1_prime_transpose[i]) % p;
// 		if (c1_transpose[i] < 0) {
// 			c1_transpose[i] += p;
// 		}
// 	}
	
// 	var c2_transpose = new Array(l);
// 	for (var i = 0; i < l; i++) {
// 		c2_prime_transpose[i] = c2_prime_transpose[i] % q;
// 		c2_transpose[i] = Math.round(m_transpose[i] + (0.25 * c2_prime_transpose[i])) % p;
// 		if (c2_transpose[i] < 0) {
// 			c2_transpose[i] += p;
// 		}
// 	}
	
// 	av = c1_transpose;
// 	bv = c2_transpose;
// }

// function decrypt(l, q, t) {
// 	var c1vector_transpose = av;
// 	var c2vector_transpose = bv;
// 	var smatrix = sm;

// 	var c1TS = decVectorMultiplyMatrix(c1vector_transpose, smatrix);
// 	var resultvector_transpose = vectorSubstract(c2vector_transpose, c1TS);
// 	//resultvector = scalarMultiply(0.0078125, resultvector_transpose);	// t/p = 1/128
// 	resultvector = new Array(l);
// 	for (var i = 0; i < l; i++) {
// 		resultvector[i] = Math.round(0.0078125 * resultvector_transpose[i]) % t;
// 		if (resultvector[i] < 0) {
// 			resultvector[i] += t;
// 		}
// 	}
// }
// ===============================================================================
// ------------------------------------------- start lizard -------------------------------------------
// var m = 960,
// 	n = 608,
// 	l = 256,
//    	t = 2,
// 	p = 256,
// 	q = 1024,
// 	h = 128,
// 	r = 1,
// 	alpha = 0.000363;

// function testlizard() {
// 	print("Test Lizard:");
// 	print("Input:");
// 	print("m = " + m);
// 	print("n = " + n);
// 	print("l = " + l);
// 	print("t = " + t);
// 	print("p = " + p);
// 	print("q = " + q);
// 	print("h = " + h);
// 	print("α = " + alpha);
	
// 	randomPlaintext();
// 	keyGeneration(l, m, n, q);
// 	encrypt(l, n, p, q);
// 	decrypt(l, q, t);
	
// 	print("Output:");
// 	var ms = vvector.toString();
// 	print("plaintext =  " + ms);
// 	var ts = resultvector.toString();
// 	print("result = " + ts);
	
// 	if(ts == ms) {
// 		print("Success!");
// 	} else {
// 		print("Failed");
// 	}
// }
// ***********************************************************
// function print(message) {
// 	//WScript.Echo(message);
// 	console.log(message);
// }
// testlizard();
