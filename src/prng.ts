// https://gist.github.com/kirbysayshi/1342599

class Mash {
    private n: number;
    public version = 'Mash 0.9';

    constructor() {
        this.n = 0xefc8249d;
    }

    generateNumber(data: any) {
        data = data.toString();
		for (let i = 0; i < data.length; i++) {
			this.n += data.charCodeAt(i);
			let h = 0.02519603282416938 * this.n;
			this.n = h >>> 0;
			h -= this.n;
			h *= this.n;
			this.n = h >>> 0;
			h -= this.n;
			this.n += h * 0x100000000; // 2^32
		}
		return (this.n >>> 0) * 2.3283064365386963e-10; // 2^-32
    }
}

// tslint:disable-next-line: max-classes-per-file
class Alea {
    private s0: number;
    private s1: number;
    private s2: number;
    private c: number;
    version = 'Alea 0.9';
    args: any[];

    constructor(args: any[]) {
        this.args = args;
        this.s0 = this.s1 = this.s2 = 0;
        this.c = 1;

        if (args.length === 0) {
            args = [+new Date];
        }
        
        const mash = new Mash();

        this.s0 = mash.generateNumber(' ');
		this.s1 = mash.generateNumber(' ');
        this.s2 = mash.generateNumber(' ');
        
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < args.length; i++) {
			this.s0 -= mash.generateNumber(args[i]);
			if (this.s0 < 0) {
				this.s0 += 1;
			}
			this.s1 -= mash.generateNumber(args[i]);
			if (this.s1 < 0) {
				this.s1 += 1;
			}
			this.s2 -= mash.generateNumber(args[i]);
			if (this.s2 < 0) {
				this.s2 += 1;
			}
		}
    }

    randomGenerator() { 
        const t = 2091639 * this.s0 + this.c * 2.3283064365386963e-10; // 2^-32
        this.s0 = this.s1;
        this.s1 = this.s2;
        return this.s2 = t - (this.c = t | 0);
    }

    randomUInt32Generator() {
        return this.randomGenerator() * 0x100000000; // 2^32
    }

    randomFract53Generator() {
        return this.randomGenerator() + (this.randomGenerator() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    }
}

// Pseudo Random Number Generator (PRNG)
let random = new Alea([]);
const seed = random.args;
random = new Alea(seed);
