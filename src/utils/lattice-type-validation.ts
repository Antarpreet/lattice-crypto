import { AlgorithmSettings, Algorithm, AlgorithmVariants, NewHopeVariant, KyberVariant, FrodoVariant, LizardVariant, RingLizardVariant } from "../models/lattice-types";


export class LatticeTypeValidation {
    public static validateLatticeSettings(algorithmSettings: AlgorithmSettings): boolean {
        switch(algorithmSettings.algorithm) {
            case Algorithm.NEW_HOPE:
                return this.checkNewHope(algorithmSettings.algorithmVariant);
            case Algorithm.KYBER:
                return this.checkKyber(algorithmSettings.algorithmVariant);
            case Algorithm.FRODO:
                return this.checkFrodo(algorithmSettings.algorithmVariant);
            case Algorithm.LIZARD:
                return this.checkLizard(algorithmSettings.algorithmVariant);
            case Algorithm.RING_LIZARD:
                return this.checkRingLizard(algorithmSettings.algorithmVariant);
            default:
                return false;
        }
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