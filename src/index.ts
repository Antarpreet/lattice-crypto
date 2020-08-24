import Frodo from './core/Frodo/Frodo';
import Kyber from './core/Kyber/Kyber';
import Lizard from './core/Lizard/Lizard';
import NewHope from './core/NewHope/NewHope';
import RingLizard from './core/RingLizard/RingLizard';
import KeyPair from './Key';
import { LatticeCryptoOptions, Algorithm } from './models/LatticeCrypto';
import { AlgorithmSettings } from './models/lattice-types';
import { LatticeTypeValidation } from './utils/lattice-type-validation';

export default class LatticeCrypto {
  algorithmSettings: AlgorithmSettings;
  keyPair: KeyPair;

  constructor(algorithmSettings: AlgorithmSettings) {
    // check to ensure the incoming data is correct.
    if (!LatticeTypeValidation.validateLatticeSettings(algorithmSettings)) {
      throw Error('Algorithm and Variant are not valid together.');
    }

    this.algorithmSettings = algorithmSettings;
  


    this.keyPair = new KeyPair(this.algorithm);
  }
}
