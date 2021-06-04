import { AlgorithmSettings, Algorithm, AlgorithmVariants, NewHopeVariant, KyberVariant, FrodoVariant,
    LizardVariant, RingLizardVariant } from "../models/lattice-types";

/**
 * This class validates the algorithm settings on initialization to only support supported settings for all algorithms
 */
export class LatticeTypeValidation {
    public static validateLatticeSettings(algorithmSettings: AlgorithmSettings): { valid: boolean, errorMessage?: string } {
        const response = {
            valid: false,
            errorMessage: 'Unsupported variant provided for mentioned algorithm'
        };
        switch(algorithmSettings.algorithm) {
            case Algorithm.NEW_HOPE:
                response.valid = this.checkNewHope(algorithmSettings.algorithmVariant);
            case Algorithm.KYBER:
                response.valid = this.checkKyber(algorithmSettings.algorithmVariant);
            case Algorithm.FRODO:
                response.valid = this.checkFrodo(algorithmSettings.algorithmVariant);
            case Algorithm.LIZARD:
                response.valid = this.checkLizard(algorithmSettings.algorithmVariant);
            case Algorithm.RING_LIZARD:
                response.valid = this.checkRingLizard(algorithmSettings.algorithmVariant);
            default:
                response.valid = false;
                response.errorMessage = 'Unsupported algorithm provided';
        }
        return response;
    }

    /**
     * Checks to ensure that the variant provided is a NewHope Variant
     *
     * @param algorithmVariant 
     */
    private static checkNewHope(algorithmVariant: AlgorithmVariants) {
        return Object.values(NewHopeVariant).includes(algorithmVariant as NewHopeVariant);
    }

    /**
     * Checks to ensure that the variant provided is a Kyber Variant
     *
     * @param algorithmVariant 
     */
    private static checkKyber(algorithmVariant: AlgorithmVariants) {
        return Object.values(KyberVariant).includes(algorithmVariant as KyberVariant);
    }

    /**
     * Checks to ensure that the variant provided is a Frodo Variant
     *
     * @param algorithmVariant 
     */
    private static checkFrodo(algorithmVariant: AlgorithmVariants) {
        return Object.values(FrodoVariant).includes(algorithmVariant as FrodoVariant);
    }

    /**
     * Checks to ensure that the variant provided is a Lizard Variant
     *
     * @param algorithmVariant 
     */
    private static checkLizard(algorithmVariant: AlgorithmVariants) {
        return Object.values(LizardVariant).includes(algorithmVariant as LizardVariant);
    }

    /**
     * Checks to ensure that the variant provided is a Ring Lizard Variant
     *
     * @param algorithmVariant 
     */
    private static checkRingLizard(algorithmVariant: AlgorithmVariants) {
        return Object.values(RingLizardVariant).includes(algorithmVariant as RingLizardVariant);
    }
}