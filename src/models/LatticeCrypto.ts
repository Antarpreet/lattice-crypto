/**
 * Enum of all the algorithms currently supported
 */
export enum Algorithm {
    FRODO = 'Frodo',
    KYBER = 'Kyber',
    LIZARD = 'Lizard',
    NEW_HOPE = 'NewHope',
    RING_LIZARD = 'RingLizard'
}

/**
 * Additional options for initialization
 */
export interface LatticeCryptoOptions {
    algorithm?: Algorithm
}

/**
 * Actions to perform
 */
export enum Action {
    ENCRYPT = 'encrypt',
    DECRYPT = 'decrypt'
}
