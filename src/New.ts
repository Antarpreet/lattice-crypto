import { Library } from "ffi-napi";
import { alloc, Pointer, refType, types } from "ref-napi";

// Define the types for FFI
const voidPtr = refType(types.void);
const ucharPtr = refType(types.uchar);
const intPtr = refType(types.int);

// Load the liboqs library from the local path
const liboqs = new Library('liboqs.so', {
    'OQS_SIG_CRYSTALS_DILITHIUM_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_SIG_CRYSTALS_DILITHIUM_sign': ['int', [ucharPtr, intPtr, voidPtr, intPtr]],
    'OQS_SIG_CRYSTALS_DILITHIUM_verify': ['int', [voidPtr, ucharPtr, intPtr, voidPtr]],

    'OQS_SIG_FALCON_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_SIG_FALCON_sign': ['int', [ucharPtr, intPtr, voidPtr, intPtr]],
    'OQS_SIG_FALCON_verify': ['int', [voidPtr, ucharPtr, intPtr, voidPtr]],

    'OQS_SIG_SPINCS_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_SIG_SPINCS_sign': ['int', [ucharPtr, intPtr, voidPtr, intPtr]],
    'OQS_SIG_SPINCS_verify': ['int', [voidPtr, ucharPtr, intPtr, voidPtr]],

    'OQS_KEM_CRYSTALS_KYBER_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_KEM_CRYSTALS_KYBER_enc': ['int', [ucharPtr, voidPtr, voidPtr]],
    'OQS_KEM_CRYSTALS_KYBER_dec': ['int', [voidPtr, ucharPtr, voidPtr]],
});

// CRYSTALS-Dilithium
export class Dilithium {
    private static readonly PUBLIC_KEY_SIZE = 1312;
    private static readonly SECRET_KEY_SIZE = 2656;
    private static readonly SIGNATURE_SIZE = 2416;

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Dilithium.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Dilithium.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): void {
        const result = liboqs.OQS_SIG_CRYSTALS_DILITHIUM_keypair(
            this.publicKey as Pointer<void>,
            this.secretKey as Pointer<void>
        );
        if (result !== 0) {
            throw new Error('Failed to generate key pair');
        }
    }

    public sign(message: Buffer): Buffer {
        const signature = Buffer.alloc(Dilithium.SIGNATURE_SIZE);
        const messageLength = alloc('int', message.length);
        const signatureLength = alloc('int', Dilithium.SIGNATURE_SIZE);
        const result = liboqs.OQS_SIG_CRYSTALS_DILITHIUM_sign(
            signature as Pointer<number>,
            messageLength,
            message as Pointer<void>,
            this.secretKey as Pointer<number>
        );
        if (result !== 0) {
            throw new Error('Signing failed');
        }
        return signature;
    }

    public verify(message: Buffer, signature: Buffer): boolean {
        const messageLength = alloc('int', message.length);
        const signatureLength = alloc('int', Dilithium.SIGNATURE_SIZE);
        const result = liboqs.OQS_SIG_CRYSTALS_DILITHIUM_verify(
            signature as Pointer<void>,
            message as Pointer<number>,
            messageLength,
            this.publicKey as Pointer<void>
        );
        return result === 0;
    }
}

// FALCON
export class Falcon {
    private static readonly PUBLIC_KEY_SIZE = 928;
    private static readonly SECRET_KEY_SIZE = 1952;
    private static readonly SIGNATURE_SIZE = 1072;

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Falcon.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Falcon.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): void {
        const result = liboqs.OQS_SIG_FALCON_keypair(
            this.publicKey as Pointer<void>,
            this.secretKey as Pointer<void>
        );
        if (result !== 0) {
            throw new Error('Failed to generate key pair');
        }
    }

    public sign(message: Buffer): Buffer {
        const signature = Buffer.alloc(Falcon.SIGNATURE_SIZE);
        const messageLength = alloc('int', message.length);
        const signatureLength = alloc('int', Falcon.SIGNATURE_SIZE);
        const result = liboqs.OQS_SIG_FALCON_sign(
            signature as Pointer<number>,
            messageLength,
            message as Pointer<void>,
            this.secretKey as Pointer<number>
        );
        if (result !== 0) {
            throw new Error('Signing failed');
        }
        return signature;
    }

    public verify(message: Buffer, signature: Buffer): boolean {
        const messageLength = alloc('int', message.length);
        const signatureLength = alloc('int', Falcon.SIGNATURE_SIZE);
        const result = liboqs.OQS_SIG_FALCON_verify(
            signature as Pointer<void>,
            message as Pointer<number>,
            messageLength,
            this.publicKey as Pointer<void>
        );
        return result === 0;
    }
}

// SPHINCS+
export class Sphincs {
    private static readonly PUBLIC_KEY_SIZE = 12480;
    private static readonly SECRET_KEY_SIZE = 32768;
    private static readonly SIGNATURE_SIZE = 4096;

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Sphincs.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Sphincs.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): void {
        const result = liboqs.OQS_SIG_SPINCS_keypair(
            this.publicKey as Pointer<void>,
            this.secretKey as Pointer<void>
        );
        if (result !== 0) {
            throw new Error('Failed to generate key pair');
        }
    }

    public sign(message: Buffer): Buffer {
        const signature = Buffer.alloc(Sphincs.SIGNATURE_SIZE);
        const messageLength = alloc('int', message.length);
        const signatureLength = alloc('int', Sphincs.SIGNATURE_SIZE);
        const result = liboqs.OQS_SIG_SPINCS_sign(
            signature as Pointer<number>,
            messageLength,
            message as Pointer<void>,
            this.secretKey as Pointer<number>
        );
        if (result !== 0) {
            throw new Error('Signing failed');
        }
        return signature;
    }

    public verify(message: Buffer, signature: Buffer): boolean {
        const messageLength = alloc('int', message.length);
        const signatureLength = alloc('int', Sphincs.SIGNATURE_SIZE);
        const result = liboqs.OQS_SIG_SPINCS_verify(
            signature as Pointer<void>,
            message as Pointer<number>,
            messageLength,
            this.publicKey as Pointer<void>
        );
        return result === 0;
    }
}

export class Kyber {
    private static readonly PUBLIC_KEY_SIZE = 1184; // Size of public key in bytes
    private static readonly SECRET_KEY_SIZE = 2400; // Size of secret key in bytes
    private static readonly CIPHERTEXT_SIZE = 736; // Size of ciphertext in bytes

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Kyber.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Kyber.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): void {
        const result = liboqs.OQS_KEM_CRYSTALS_KYBER_keypair(
            this.publicKey as Pointer<void>,
            this.secretKey as Pointer<void>
        );
        if (result !== 0) {
            throw new Error('Failed to generate key pair');
        }
    }

    public encrypt(message: Buffer): Buffer {
        const ciphertext = Buffer.alloc(Kyber.CIPHERTEXT_SIZE);
        const result = liboqs.OQS_KEM_CRYSTALS_KYBER_enc(
            ciphertext as Pointer<number>,
            message as Pointer<void>,
            this.publicKey as Pointer<void>
        );
        if (result !== 0) {
            throw new Error('Encryption failed');
        }
        return ciphertext;
    }

    public decrypt(ciphertext: Buffer): Buffer {
        const message = Buffer.alloc(Kyber.PUBLIC_KEY_SIZE);
        const result = liboqs.OQS_KEM_CRYSTALS_KYBER_dec(
            message as Pointer<void>,
            ciphertext as Pointer<number>,
            this.secretKey as Pointer<void>
        );
        if (result !== 0) {
            throw new Error('Decryption failed');
        }
        return message;
    }
}

async function main() {
    const kyber = new Kyber();
    kyber.generateKeyPair();

    const message = Buffer.from('Hello, World!');

    // CRYSTALS-Kyber
    const ciphertext = kyber.encrypt(message);
    console.log('Encrypted message:', ciphertext.toString('hex'));

    const decryptedMessage = kyber.decrypt(ciphertext);
    console.log('Decrypted message:', decryptedMessage.toString());

    // CRYSTALS-Dilithium
    const dilithium = new Dilithium();
    dilithium.generateKeyPair();
    const signatureDilithium = dilithium.sign(message);
    console.log('Dilithium Signature:', signatureDilithium.toString('hex'));
    console.log('Dilithium Verification:', dilithium.verify(message, signatureDilithium));

    // FALCON
    const falcon = new Falcon();
    falcon.generateKeyPair();
    const signatureFalcon = falcon.sign(message);
    console.log('Falcon Signature:', signatureFalcon.toString('hex'));
    console.log('Falcon Verification:', falcon.verify(message, signatureFalcon));

    // SPHINCS+
    const sphincs = new Sphincs();
    sphincs.generateKeyPair();
    const signatureSphincs = sphincs.sign(message);
    console.log('Sphincs+ Signature:', signatureSphincs.toString('hex'));
    console.log('Sphincs+ Verification:', sphincs.verify(message, signatureSphincs));
}

main().catch(console.error);
