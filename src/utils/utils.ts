import random from '../utils/prng';

export default class Utils {
    // Returns a copy of the original array, truncated or padded with zeros to obtain the specified length
    copyOf(arr1: number[], length: number): number[] {
        const arr2 = new Array(length);
        for (let i = 0; i < length; i++) {
            if (i >= arr1.length) {
                arr2[i] = 0;
            } else {
                arr2[i] = arr1[i];
            }
        }
        return arr2;
    }

    // Returns a new array containing the specified range from the original array, 
    // truncated or padded with nulls to obtain the required length
    copyOfRange(arr1: number[], from: number, to: number): number[] {
        const length = to - from;
        // var arr2 = new Array(length);
        const arr2 = [];
        for (let i = 0; i < length; i++) {
            if (i >= arr1.length || from >= arr1.length) {
                arr2[i] = 0;
            } else {
                arr2[i] = arr1[from];
            }
            from++;
        }
        return arr2;
    }

    // Returns the next pseudorandom, uniformly distributed integer between 0(inclusive) and q-1(inclusive)
    nextInt(q: number): number {
        return Math.floor(random.randomGenerator() * q);
    }

    // Returns the pseudorandom integer value between low(inclusive) and high(inclusive)
    rangeValue(low: number, high: number): number {
        return Math.floor(random.randomGenerator() * (high - low + 1) + low);
    }

    // Shuffles the input array
    shuffle(arr: number[]): number[] {
        const arr2 = arr.slice();
        for (
            let j, x, i = arr2.length;
            i;
            j = random.randomGenerator() * i, x = arr2[--i], arr2[i] = arr2[j], arr2[j] = x
        );
        return arr2;
    }
	

    // Returns the bit of integer decimal_a at the index
    getBit (decimal: number, index: number): number {
        return (decimal >> index) & 1;
    }

    // Kyber
    // utils.INTT('kyber', A, n, bitRev_psiInv_7681_256, q, INVN);

    // NewHope
    // utils.INTT('newHope', A, n, bitRev_psiInv_12289_1024, q, INVN);

    // Gentleman-Sande (GS) inverse number theoretic transform
    INTT(algorithm: string, A: number[], n: number, bitRevPsiInv: number[], q: number, INVN: number): number[] {
        const NTT_A_COEFF: number[] = this.copyOf(A.slice(), n);
        let t = 1;
        for (let m = n; m > 1; m >>= 1)	{
            let j1 = 0;
            const h = (m >> 1);
            for (let i = 0; i < h; i++) {
                const j2 = j1 + t - 1;
                const S = bitRevPsiInv[h+i];
                for (let j = j1; j <= j2; j++) {
                    const U = NTT_A_COEFF[j];
                    const V = NTT_A_COEFF[j+t];
                    NTT_A_COEFF[j] = (U + V) % q;
                    let temp = U - V;

                    switch (algorithm) {
                        case 'kyber':
                            while (NTT_A_COEFF[j] < 0) {
                                NTT_A_COEFF[j] = NTT_A_COEFF[j] + q;
                            }
                            
                            while (temp < 0) {
                                temp += q;
                            }
                            break;
                        case 'newHope':
                            if (temp < 0) {
                                temp += q;
                            }
                            break;
                        default: break;
                    }
                    NTT_A_COEFF[j+t] = (temp * S) % q;
                }
                j1 = j1 + (t << 1);
            }
            t <<= 1;
        }
        for (let j = 0; j < n; j++) {
            NTT_A_COEFF[j] = (NTT_A_COEFF[j] * INVN) % q;
        }
        return NTT_A_COEFF;
    }

    // Kyber
    // utils.NTT('kyber', A, n, bitRev_psi_7681_256, q);

    // NewHope
    // utils.NTT('newHope', A, n, bitRev_psi_12289_1024, q);


    // Cooley-Tukey(CT) forward number theoretic transform
    NTT(algorithm: string, A: number[], n: number, bitRevPsi: number[], q: number): number[] {
        const NTT_A_COEFF: number[] = this.copyOf(A.slice(), n);
        let t = n;
        for (let m = 1; m < n; m <<= 1) {
            t >>= 1;
            for (let i = 0; i < m; i++) {
                const j1 = (i << 1) * t;
                const j2 = j1 + t - 1;
                const S = bitRevPsi[m+i];
                for (let j = j1; j <= j2; j++) {
                    const U = NTT_A_COEFF[j];
                    const V = NTT_A_COEFF[j+t] * S;
                    NTT_A_COEFF[j] = (U + V) % q;
                    switch (algorithm) {
                        case 'kyber':
                            while (NTT_A_COEFF[j] < 0) {
                                NTT_A_COEFF[j] = NTT_A_COEFF[j] + q;
                            }
                            NTT_A_COEFF[j+t] = (U - V) % q;
                            while (NTT_A_COEFF[j+t] < 0) {
                                NTT_A_COEFF[j+t] = NTT_A_COEFF[j+t] + q;
                            }
                            break;
                        case 'newHope':
                            NTT_A_COEFF[j+t] = (U - V) % q;
                            if(NTT_A_COEFF[j+t] < 0) {
                                NTT_A_COEFF[j+t] = NTT_A_COEFF[j+t] + q;
                            }
                            break;
                        default: break;
                    }
                }
            }
        }
        return NTT_A_COEFF;
    }

    initMatrixDefault(x: number, y: number): number[][] {
        const matrix = new Array(x);
        for (let i = 0; i < x; i++) {
               matrix[i] = new Array(y);
        }
        return matrix;
    }

    initMatrixRandom(x: number, y: number, q: number): number[][] {
        const matrix = new Array(x);
        for (let i = 0; i < x; i++) {
               matrix[i] = new Array(y);
            for (let j = 0; j < y; j++) {
                matrix[i][j] = this.nextInt(q);
            }
        }
        return matrix;
    }

    // Returns A', the transpose of a matrix A
    transpose(A: number[][]): number[][] {
        const Ax = A.length;
        const Ay = A[0].length;
        
        const C = this.initMatrixDefault(Ay, Ax);
        for (let i = 0; i < Ax; i++) {
            for (let j = 0; j < Ay; j++) {
                C[j][i] = A[i][j];
            }
        }
        return C;
    }

    // Matrix addition, C = A + B, each element of C modulo q
    addMod(A: number[][], B: number[][], q: number): number[][] {
        const sizeMatch = this.checkDimensions(A, B);
        if (!sizeMatch) { return []; }

        const Ax = A.length;
        const Ay = A[0].length;
        
        const C = this.initMatrixDefault(Ax, Ay);
        for (let i = 0; i < Ax; i++) {
            for (let j = 0; j < Ay; j++) {
                C[i][j] = (A[i][j] + B[i][j]) % q;
                if (C[i][j] < 0) {
                    C[i][j] += q;
                }
            }
        }
        return C;
    }

    // Matrix subtraction, C = A - B, each element of C modulo q
    subtractMod(A: number[][], B: number[][], q: number): number[][] {
        const sizeMatch = this.checkDimensions(A, B);
        if (!sizeMatch) { return []; }

        const Ax = A.length;
        const Ay = A[0].length;
        
        const C = this.initMatrixDefault(Ax, Ay);
        for (let i = 0; i < Ax; i++) {
            for (let j = 0; j < Ay; j++) {
                C[i][j] = (A[i][j] - B[i][j]) % q;
                if (C[i][j] < 0) {
                    C[i][j] += q;
                }
            }
        }
        return C;
    }

    // Multiplies a matrix by a scalar, C = s*A
    scalarMultiplyMod(s: number, A: number[][], q: number): number[][] {
        const Ax = A.length;
        const Ay = A[0].length;
        
        const C = this.initMatrixDefault(Ax, Ay);
        for (let i = 0; i < Ax; i++) {
            for (let j = 0; j < Ay; j++) {
                C[i][j] = (s * A[i][j]) % q;
                if (C[i][j] < 0) {
                    C[i][j] += q;
                }
            }
        }
        return C;
    }

    // Multiplies a vector by a scalar, c = s*v
    scalarMultiplyVector(s: number, v: number[]): number[] {
        const c = new Array(v.length);
        for (let i = 0; i < v.length; i++) {
            c[i] = s * v[i];
        }
        return c;
    }

    // Matrix multiplication, C = A * B
    multiply(algorithm: string, A: number[][], B: number[][]): number[][] {
        const Ax = A.length;
        const Ay = A[0].length;
        const Bx = B.length;
        const By = B[0].length;
        
        if (Bx !== Ay) {
            alert("Matrix inner dimensions must agree");
            return [];
        }
        
        const C = this.initMatrixDefault(Ax, By);
        const Bcolj = new Array(Ay);
        for (let j = 0; j < By; j++) {
            for (let k = 0; k < Ay; k++) {
                Bcolj[k] = B[k][j];
            }
            for (let i = 0; i < Ax; i++) {
                const Arowi = A[i];
                let s = 0;
                switch (algorithm) {
                    case 'frodo':
                        for (let k = 0; k < Ay; k++) {
                            s += Arowi[k] * Bcolj[k];
                        }
                        break;
                    case 'lizard':
                        for (let k = 0; k < Ay; k++) {
                            if (Bcolj[k] === 0) {
                                // s += 0;
                            } else if (Bcolj[k] === 1) {
                                s += Arowi[k];
                            } else if (Bcolj[k] === -1) {
                                s -= Arowi[k];
                            } else {
                                s += Arowi[k] * Bcolj[k];
                            }
                        }
                        break;
                    default: break;
                }
                C[i][j] = s;
            }
        }
        return C;
    }

    // Matrix multiplication, C = A * B, each element of C modulo q
    multiplyMod(algorithm: string, A: number[][], B: number[][], q: number): number[][] {
        const Ax = A.length;
        const Ay = A[0].length;
        const Bx = B.length;
        const By = B[0].length;
        
        if (Bx !== Ay) {
            alert("Matrix inner dimensions must agree");
            return [];
        }
        
        const C = this.initMatrixDefault(Ax, By);
        const Bcolj = new Array(Ay);
        for (let j = 0; j < By; j++) {
            for (let k = 0; k < Ay; k++) {
                Bcolj[k] = B[k][j];
            }
            for (let i = 0; i < Ax; i++) {
                const Arowi = A[i];
                let s = 0;
                for (let k = 0; k < Ay; k++) {
                    switch (algorithm) {
                        case 'frodo':
                            s += Arowi[k] * Bcolj[k];
                            break;
                        case 'lizard':
                            if (Bcolj[k] === 0) {
                                // s += 0;
                            } else if (Bcolj[k] === 1) {
                                s += Arowi[k];
                            } else if (Bcolj[k] === -1) {
                                s -= Arowi[k];
                            } else {
                                s += Arowi[k] * Bcolj[k];
                            }
                            break;
                        default: break;
                    }
                    
                }
                C[i][j] = s % q;
                if (C[i][j] < 0) {
                    C[i][j] += q;
                }
            }
        }
        return C;
    }

    // Multiplies a matrix B by a vector a, c = a * B
    vectorMultiplyMatrix(algorithm: string, a: number[], B: number[][]): number[][] {
        // var A_x = 1;
        const Ay = a.length;
        const Bx = B.length;
        const By = B[0].length;
        
        if (Bx !== Ay) {
            alert("Matrix inner dimensions must agree");
            return [];
        }
            
        const v = new Array(By);
        for (let j = 0; j < By; j++) {
            v[j] = 0;
        }
            
        for (let i = 0; i < Ay; i++) {
            const Browi = B[i];
            for (let j = 0; j < By; j++) {
                switch (algorithm) {
                    case 'frodo':
                    case 'lizard-decrypt':
                        v[j] += a[i] * Browi[j];
                        break;
                    case 'lizard-encrypt':
                        if (a[i] === 0) {
                            // v[j] += 0;
                        } else if (a[i] === 1) {
                            v[j] += Browi[j];	
                        } else if (a[i] === -1) {
                            v[j] -= Browi[j];
                        } else {
                            v[j] += a[i] * Browi[j];
                        } 
                }
               
            }
        }
        return v;
    }	

    // Vector subtraction, c = a - b
    vectorSubtract(a: number[], b: number[]): number[] {
        if (b.length !== a.length) {
            alert("Vector length must agree");
            return [];
        }
        
        const c = new Array(a.length);
        for (let i = 0; i < a.length; i++) {
            c[i] = a[i] - b[i];
        }
        return c;
    }

    // Modulo q
    mod(A: number[][], q: number): void {
        const Ax = A.length;
        const Ay = A[0].length;
        if (q <= 0) {
            alert("modulus not positive");
            return;
        }
        for (let i = 0; i < Ax; i++) {
            for (let j = 0; j < Ay; j++) {
                A[i][j] %= q;
                if (A[i][j] < 0) {
                    A[i][j] += q;
                }
            }
        }
    }

    // Checks if size(A) == size(B)
    checkDimensions(A: number[][], B: number[][]) {
        const Ax = A.length;
        const Ay = A[0].length;
        const Bx = B.length;
        const By = B[0].length;
        
        if (Bx !== Ax || By !== Ay) {
            return false;
        } else {
            return true;
        }
    }
}
