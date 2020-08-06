import { Algorithm } from './models/LatticeCrypto';
import { KeyOptions } from './models/Key';

/**
 * This class represents Pair of Public and Private Keys generated using provided algorithm
 */
export default class KeyPair {
    algorithm: Algorithm;
    private!: KeyPair;
    public!: KeyPair;

    constructor(algorithm: Algorithm, options?: KeyOptions) {
        this.algorithm = algorithm;

        if (options && options.private) {
            this._importPrivate(options.private, options.enc);
        }
        if (options && options.public) {
            this._importPublic(options.public, options.enc);
        }
    }

    getPublic() {

    }

    getPrivate() {

    }

    derive() {

    }

    sign() {

    }

    verify() {

    }

    static fromPublic(algorithm: Algorithm, publicKey: KeyPair, enc: string) {
        if (publicKey instanceof KeyPair) {
            return publicKey;
        }

        return new KeyPair(algorithm, {
            public: publicKey,
            enc
        });
    }

    static fromPrivate(algorithm: Algorithm, privateKey: KeyPair, enc: string) {
        if (privateKey instanceof KeyPair) {
            return privateKey;
        }

        return new KeyPair(algorithm, {
            private: privateKey,
            enc
        });
    }

    validate() {

    }
    
    private _importPublic(key: KeyPair, enc: string) {
        
    }

    private _importPrivate(key: KeyPair, enc: string) {

    }
};
