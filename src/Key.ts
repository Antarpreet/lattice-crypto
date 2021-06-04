import { Algorithm } from './models/lattice-types';
import { KeyOptions } from './models/Key';

/**
 * This class represents Pair of Public and Private Keys generated using provided algorithm
 */
export default class KeyPair {
  algorithm: Algorithm;
  private!: KeyPair;
  public!: KeyPair;

  /**
   * @param algorithm Algorithm to use for the key pair actions
   * @param options additional options for generating key pair from existing keys
   */
  constructor(algorithm: Algorithm, options?: KeyOptions) {
    this.algorithm = algorithm;

    if (options && options.private) {
      this._importPrivate(options.private, options.enc);
    }
    if (options && options.public) {
      this._importPublic(options.public, options.enc);
    }
  }

  /**
   * This function returns the public key
   */
  getPublic() {}

  
  /**
   * This function returns the private key
   */
  getPrivate() {}

  
  /**
   * This function returns the derived data
   */
  derive() {}

  
  /**
   * This function signs the data provided
   */
  sign() {}

  /**
   * This function verifies the signature
   */
  verify() {}

  
  /**
   * This function returns the KeyPair from existing public key.
   *
   * @param algorithm Algorithm to use for the key pair actions
   * @param publicKey public key
   * @param enc data
   */
  static fromPublic(algorithm: Algorithm, publicKey: KeyPair, enc: string) {
    if (publicKey instanceof KeyPair) {
      return publicKey;
    }

    return new KeyPair(algorithm, {
      public: publicKey,
      enc,
    });
  }

  /**
   * This function returns the KeyPair from existing private key.
   *
   * @param algorithm Algorithm to use for the key pair actions
   * @param privateKey private key
   * @param enc data
   */
  static fromPrivate(algorithm: Algorithm, privateKey: KeyPair, enc: string) {
    if (privateKey instanceof KeyPair) {
      return privateKey;
    }

    return new KeyPair(algorithm, {
      private: privateKey,
      enc,
    });
  }

  validate() {}

  /**
   * This function generates key pair from provided public key.
   *
   * @param key public key
   * @param enc data
   */
  private _importPublic(key: KeyPair, enc: string) {}

  /**
   * This function generates key pair from provided private key.
   *
   * @param key private key
   * @param enc data
   */
  private _importPrivate(key: KeyPair, enc: string) {}
}
