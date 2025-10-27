import { Keypair, PublicKey, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";

// Constants
const DERIVATION_PATH = "m/44'/501'/0'/0'"; // Standard Solana derivation path

// ✅ 1. Get Keypair from Seed Phrase (Mnemonic)
export async function getKeypairFromSeed(seedPhrase: string): Promise<Keypair> {
	const seed = await bip39.mnemonicToSeed(seedPhrase); // Get 32-byte seed

	// Derive private key using BIP-44 derivation path
	const derivedSeed = derivePath(DERIVATION_PATH, seed.toString("hex")).key;
	
	return Keypair.fromSeed(derivedSeed);
}

// ✅ 2. Get Keypair from Private Key
export function getKeypairFromPrivateKey(privateKeyInput: string | number[]): Keypair {
	try {
		// Case 1: Private Key is a JSON Array (e.g., [233, 10, ...])
		if (Array.isArray(privateKeyInput)) {
			return Keypair.fromSecretKey(Uint8Array.from(privateKeyInput));
		}

		// Case 2: Private Key is a Base58-encoded string
		if (typeof privateKeyInput === "string") {
			const privateKeyUint8Array = bs58.decode(privateKeyInput);
			return Keypair.fromSecretKey(privateKeyUint8Array);
		}

		throw new Error("Invalid private key format");
	} catch (error: any) {
		throw new Error("Failed to parse private key: " + error.message);
	}
}

// DON"T USE THIS
// export function getKeypairFromPrivateKey(privateKeyString: string): Keypair {
// 	// Decode Base64 private key string into a Uint8Array
// 	const privateKeyUint8Array = new Uint8Array(Buffer.from(privateKeyString, "base64"));

// 	// Generate Keypair from the private key
// 	return Keypair.fromSecretKey(privateKeyUint8Array);
// }

// ✅ 3. Generate a New Keypair and Export Seed & Private Key
// ✅ Function to Generate or Accept an Existing Keypair and Return Full Details
export function generateNewKeypair(existingKeypair?: Keypair): {
	seedPhrase?: string;
	privateKey: string;
	secretKey: Uint8Array;
	publicKey: string;
} {
	let keypair: Keypair;
	let seedPhrase: string | undefined = undefined;

	if (existingKeypair) {
		// Use the provided keypair
		keypair = existingKeypair;
	} else {
		// Generate a new seed phrase and derive the keypair
		seedPhrase = bip39.generateMnemonic();
		const seed = bip39.mnemonicToSeedSync(seedPhrase);
		const derivedSeed = derivePath(DERIVATION_PATH, seed.toString("hex")).key;
		keypair = Keypair.fromSeed(derivedSeed);
	}

	return {
		seedPhrase, // Only available if a new keypair was generated
		privateKey: bs58.encode(keypair.secretKey), // Convert to Base58
		secretKey: keypair.secretKey, // Raw Uint8Array
		publicKey: keypair.publicKey.toBase58(), // Public key in base58 format
	};
}

// ✅ 4. Export Seed Phrase + Private Key from an Existing Keypair
export function exportKeypair(keypair: Keypair, seedPhrase?: string): { seedPhrase?: string; privateKey: string } {
	return {
		seedPhrase, // If available, include the mnemonic
		privateKey: bs58.encode(keypair.secretKey), // Convert to Base58
	};
}

// ✅ 5. Generate a New Keypair and Export Seed Phrase
export function generateKeypairWithSeed(): { keypair: Keypair; seedPhrase: string; privateKey: string } {
	const seedPhrase = bip39.generateMnemonic(); // Generate a random mnemonic
	const seed = bip39.mnemonicToSeedSync(seedPhrase);
	const derivedSeed = derivePath(DERIVATION_PATH, seed.toString("hex")).key;
	const keypair = Keypair.fromSeed(derivedSeed);

	return {
		keypair,
		seedPhrase, // Export mnemonic
		privateKey: bs58.encode(keypair.secretKey), // Convert to Base58
	};
}

export async function getBalance(publicKey: string): Promise < number > {
	const connection = new Connection(clusterApiUrl("mainnet-beta"));
	return (await connection.getBalance(new PublicKey(publicKey))) / LAMPORTS_PER_SOL;
}
