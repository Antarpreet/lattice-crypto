import { Library } from "ffi-napi";
import { alloc, Pointer, refType, types } from "ref-napi";

// Define the types for FFI
const voidPtr = refType(types.void);
const ucharPtr = refType(types.uchar);
const intPtr = refType(types.int);

// Load the liboqs library from the local path
const liboqs = new Library('./liboqs.dylib', {
    'OQS_SIG_dilithium_2_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_SIG_dilithium_2_sign': ['int', [ucharPtr, intPtr, voidPtr, intPtr]],
    'OQS_SIG_dilithium_2_verify': ['int', [voidPtr, ucharPtr, intPtr, voidPtr]],

    'OQS_SIG_falcon_512_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_SIG_falcon_512_sign': ['int', [ucharPtr, intPtr, voidPtr, intPtr]],
    'OQS_SIG_falcon_512_verify': ['int', [voidPtr, ucharPtr, intPtr, voidPtr]],

    'OQS_SIG_sphincs_sha2_128f_simple_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_SIG_sphincs_sha2_128f_simple_sign': ['int', [ucharPtr, intPtr, voidPtr, intPtr]],
    'OQS_SIG_sphincs_sha2_128f_simple_verify': ['int', [voidPtr, ucharPtr, intPtr, voidPtr]],

    'OQS_KEM_kyber_512_keypair': ['int', [voidPtr, voidPtr]],
    'OQS_KEM_kyber_512_encaps': ['int', [ucharPtr, voidPtr, voidPtr]],
    'OQS_KEM_kyber_512_decaps': ['int', [voidPtr, ucharPtr, voidPtr]],
});

// CRYSTALS-Dilithium
export class Dilithium {
    private static readonly PUBLIC_KEY_SIZE = 1312;
    private static readonly SECRET_KEY_SIZE = 2528;
    private static readonly SIGNATURE_SIZE = 2420;

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Dilithium.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Dilithium.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): void {
        const result = liboqs.OQS_SIG_dilithium_2_keypair(
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
        const result = liboqs.OQS_SIG_dilithium_2_sign(
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
        const result = liboqs.OQS_SIG_dilithium_2_verify(
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
    private static readonly PUBLIC_KEY_SIZE = 897;
    private static readonly SECRET_KEY_SIZE = 1281;
    private static readonly SIGNATURE_SIZE = 752;

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Falcon.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Falcon.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): void {
        const result = liboqs.OQS_SIG_falcon_512_keypair(
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
        const result = liboqs.OQS_SIG_falcon_512_sign(
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
        const result = liboqs.OQS_SIG_falcon_512_verify(
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
    private static readonly PUBLIC_KEY_SIZE = 32;
    private static readonly SECRET_KEY_SIZE = 64;
    private static readonly SIGNATURE_SIZE = 17088;

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Sphincs.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Sphincs.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): void {
        const result = liboqs.OQS_SIG_sphincs_sha2_128f_simple_keypair(
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
        const result = liboqs.OQS_SIG_sphincs_sha2_128f_simple_sign(
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
        const result = liboqs.OQS_SIG_sphincs_sha2_128f_simple_verify(
            signature as Pointer<void>,
            message as Pointer<number>,
            messageLength,
            this.publicKey as Pointer<void>
        );
        return result === 0;
    }
}

export class Kyber {
    private static readonly PUBLIC_KEY_SIZE = 800; // Size of public key in bytes
    private static readonly SECRET_KEY_SIZE = 1632; // Size of secret key in bytes
    private static readonly CIPHERTEXT_SIZE = 768; // Size of ciphertext in bytes

    private publicKey: Buffer;
    private secretKey: Buffer;

    constructor() {
        this.publicKey = Buffer.alloc(Kyber.PUBLIC_KEY_SIZE);
        this.secretKey = Buffer.alloc(Kyber.SECRET_KEY_SIZE);
    }

    public generateKeyPair(): number {
        const result = liboqs.OQS_KEM_kyber_512_keypair(
            this.publicKey as Pointer<void>,
            this.secretKey as Pointer<void>
        );
        if (result !== 0) {
            throw new Error('Failed to generate key pair');
        }
        return result;
    }

    public encrypt(message: Buffer): Buffer {
        const ciphertext = Buffer.alloc(Kyber.CIPHERTEXT_SIZE);
        const result = liboqs.OQS_KEM_kyber_512_encaps(
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
        const result = liboqs.OQS_KEM_kyber_512_decaps(
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
    const keys = kyber.generateKeyPair() as any;
    console.log('Keys:', keys);

    const message = Buffer.from('Hello, World!');
    console.log('Original message:', message.toString());

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
