import KeyPair from './Key';
import { AlgorithmSettings } from './models/lattice-types';
import { LatticeTypeValidation } from './utils/lattice-type-validation';

/**
 * Lattice Crypto uses lattice based cryptography algorithms
 * and support different variants for supported algorithms and their supported actions.
 * For info about supported algorithms and their variants/actions, please refer: https://github.com/Antarpreet/lattice-crypto
 */
export default class LatticeCrypto {
  algorithmSettings: AlgorithmSettings;
  keyPair: KeyPair;

  /**
   * @param algorithmSettings Settings containing selected algorithm, variant and/or public or private key for generating key pair from existing keys.
   */
  constructor(algorithmSettings: AlgorithmSettings) {
    // check to ensure the incoming settings are correct.
    const settingsValidation = LatticeTypeValidation.validateLatticeSettings(algorithmSettings);
    if (!settingsValidation.valid) {
      throw Error(settingsValidation.errorMessage);
    }

    this.algorithmSettings = algorithmSettings;

     // check if public and private keys are valid if both provided
    if (this.algorithmSettings.keyPairOptions
      && this.algorithmSettings.keyPairOptions.public
      && this.algorithmSettings.keyPairOptions.private) {
      
    }

    this.keyPair = new KeyPair(this.algorithmSettings.algorithm, this.algorithmSettings.keyPairOptions);
  }
}
