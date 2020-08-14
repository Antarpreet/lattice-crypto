import random from './prng';
import { Algorithm, Action } from '../models/LatticeCrypto';
import NumberUtils from './number-utils';
const numberUtils = new NumberUtils();

export default class MatrixUtils {
  /**
   * Returns a copy of the original array, truncated or padded with zeros to obtain the specified length
   * input ([ 1, 2, 3, 4 ], 10)
   * returns [ 1, 2, 3, 4, 0, 0, 0, 0, 0, 0 ]
   *
   * @param array1 the original array
   * @param length the new length of the array to add
   */
  copyOf(array1: number[], length: number): number[] {
    const array2 = new Array(length);
    for (let i = 0; i < length; i++) {
      if (i >= array1.length) {
        array2[i] = 0;
      } else {
        array2[i] = array1[i];
      }
    }
    return array2;
  }

  /**
   * Returns a new array containing the specified range from the original array,
   * truncated or padded with nulls to obtain the required length
   * input ( [1,2,3,4], 2, 10 ) ;
   * returns [ 3, 4, 0, 0, 0, 0, 0, 0 ]
   *
   * @param array1 the incoming 2 dimensional array
   * @param from the index number to start at (0 based index)
   * @param to the max value, will pad trailing zeros if longer.
   */
  copyOfRange(array1: number[], from: number, to: number): number[] {
    const length = to - from;
    // var arr2 = new Array(length);
    const arr2 = [];
    for (let i = 0; i < length; i++) {
      if (i >= array1.length || from >= array1.length) {
        arr2[i] = 0;
      } else {
        arr2[i] = array1[from];
      }
      from++;
    }
    return arr2;
  }
  /**
   * This randomly suffles the input array and creates a new array with the items randomly 
   * TODO: this function doesn't provide the array as expected. 
   * TODO: Accually sorts 
   * input [3, 4, 6, 7]
   * it reverses the array in theincoming format with the probabilty of it. 
   *
   * [ undefined,
   * undefined,
   * undefined,
   * undefined,
   * '3.2743575274944305': 7,
   * '0.8558525342959911': 6,
   * '1.7293115369975567': 4,
   * '0.4764410527423024': 3 ]
   * @param array1 the array to change the order of
   */
  shuffle(array1: number[]): number[] {
    const array2 = array1.slice();
    console.log(array2);
    for (let j, x, i = array2.length; i; j = random.randomGenerator() * i, x = array2[--i], array2[i] = array2[j], array2[j] = x);
    return array2;
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
        matrix[i][j] = numberUtils.nextInt(q);
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
    if (!sizeMatch) {
      return [];
    }

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
    if (!sizeMatch) {
      return [];
    }

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
  multiply(algorithm: Algorithm, A: number[][], B: number[][]): number[][] {
    const Ax = A.length;
    const Ay = A[0].length;
    const Bx = B.length;
    const By = B[0].length;

    if (Bx !== Ay) {
      alert('Matrix inner dimensions must agree');
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
          case Algorithm.FRODO:
            for (let k = 0; k < Ay; k++) {
              s += Arowi[k] * Bcolj[k];
            }
            break;
          case Algorithm.LIZARD:
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
          default:
            break;
        }
        C[i][j] = s;
      }
    }
    return C;
  }

  // Matrix multiplication, C = A * B, each element of C modulo q
  multiplyMod(algorithm: Algorithm, A: number[][], B: number[][], q: number): number[][] {
    const Ax = A.length;
    const Ay = A[0].length;
    const Bx = B.length;
    const By = B[0].length;

    if (Bx !== Ay) {
      alert('Matrix inner dimensions must agree');
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
            case Algorithm.FRODO:
              s += Arowi[k] * Bcolj[k];
              break;
            case Algorithm.LIZARD:
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
            default:
              break;
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
  vectorMultiplyMatrix(algorithm: Algorithm, a: number[], B: number[][], action?: Action): number[] {
    // var A_x = 1;
    const Ay = a.length;
    const Bx = B.length;
    const By = B[0].length;

    if (Bx !== Ay) {
      alert('Matrix inner dimensions must agree');
      return [];
    }

    const v = new Array(By);
    for (let j = 0; j < By; j++) {
      v[j] = 0;
    }

    for (let i = 0; i < Ay; i++) {
      const Browi = B[i];
      for (let j = 0; j < By; j++) {
        if ((algorithm === Algorithm.LIZARD && action === Action.DECRYPT) || algorithm === Algorithm.FRODO) {
          v[j] += a[i] * Browi[j];
        } else if (algorithm === Algorithm.LIZARD && action === Action.ENCRYPT) {
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
      alert('Vector length must agree');
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
      alert('modulus not positive');
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

  // Multiply a matrix B by a vector a, c = a * B
  vector_multiply_matrix(a: number[], B: number[][], BColumnSize: number): number[] {
    // Matrix inner dimensions must agree
    const c = new Array(BColumnSize);
    for (let j = 0; j < BColumnSize; j++) {
      c[j] = 0;
    }

    for (let i = 0; i < a.length; i++) {
      const BRowI = B[i];
      for (let j = 0; j < BColumnSize; j++) {
        c[j] += BRowI[j] * a[i];
      }
    }
    return c;
  }
}
