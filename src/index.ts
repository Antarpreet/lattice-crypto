import Frodo from './core/Frodo/Frodo';
import Kyber from './core/Kyber/Kyber';
import Lizard from './core/Lizard/Lizard';
import NewHope from './core/NewHope/NewHope';
import RingLizard from './core/RingLizard/RingLizard';
import KeyPair from './Key';
import { LatticeCryptoOptions, Algorithm } from './models/LatticeCrypto';

export default class LatticeCrypto {
  algorithm: Algorithm;
  keyPair: KeyPair;

  constructor(options?: LatticeCryptoOptions) {
    // set default algorithm to use to be Kyber
    this.algorithm = Algorithm.KYBER;
    // if algorithm is provided, use that one
    if (options && options.algorithm) {
      this.algorithm = options.algorithm;
    }

    this.keyPair = new KeyPair(this.algorithm);
  }
}
