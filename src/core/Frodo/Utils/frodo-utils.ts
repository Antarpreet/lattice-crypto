
export default class FrodoUtils {
    // Computes Rec()
    rec(sharedSecretA: number[][], m: number, l: number, a: number, cipherText: number[][]): void {
        const whole = 1 << a;
        const mask = whole - 1;
        const negMask = ~mask;
        const half = 1 << (a - 1);
        const quarter = 1 << (a - 2);

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < l; j++) {
                const remainder = sharedSecretA[i][j] & mask;
                const useHint = ((remainder + quarter) >> (a - 1)) & 1;
                // h: the hint cMatrix
                const shift = useHint * (2 * cipherText[i][j] - 1) * quarter;
                // if use_hint = 1 and h = 0, adding -quarter forces rounding down
                //                     h = 1, adding quarter forces rounding up
                sharedSecretA[i][j] = (sharedSecretA[i][j] + half + shift) & negMask;

                sharedSecretA[i][j] >>= 11;
                sharedSecretA[i][j] %= 16;
            }
        }
    }
}
