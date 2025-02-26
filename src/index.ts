import {createKeyPairFromPrivateKeyBytes,  getUtf8Encoder, signBytes, getBase58Decoder, verifySignature, getAddressFromPublicKey, } from "@solana/web3.js"
import * as Bip39 from "bip39"
import {ethers} from "ethers"
import { logger } from "./logger"
import {inspect} from 'node:util'
import Colors from 'colors/safe'
import Bs58 from 'bs58'

interface SolanaWallet {
	publicKey: string
	privateKey: string
}

const initSolana: (mnemonic: string) => Promise<false|SolanaWallet> = (mnemonic: string) => new Promise(async resolve =>{
	const vsc = Bip39.validateMnemonic(mnemonic)

	if (!vsc) {
		return resolve (false)
	}
	const seed = Bip39.mnemonicToSeedSync(mnemonic, '').slice(0, 32)
	const keys = await  createKeyPairFromPrivateKeyBytes(seed, true)
	const privateKeyBytes = (await crypto.subtle.exportKey(
		"pkcs8",
		keys.privateKey
	)).slice(-32)
	const publicKeyBytes =  await crypto.subtle.exportKey('raw', keys.publicKey)
	const publicKey = await getAddressFromPublicKey(keys.publicKey)
	const secretKeyBytes = new Uint8Array([
		...new Uint8Array(privateKeyBytes),
		...new Uint8Array(publicKeyBytes),
	])
	const privateKey = getBase58Decoder().decode(secretKeyBytes)
	return resolve ({privateKey, publicKey})
})

const start = async () => {
	// const acc = await ethers.Wallet.createRandom()
	// if (!acc?.mnemonic) {
	// 	return logger(`Error!`)
	// }

	//	check the mnemonic from ethers!
	//const mnemonic = acc.mnemonic.phrase

	const mnemonic = 'black connect engine evoke under silly outer slush fabric trumpet silent lemon'

	
	//		test used fixed mnemonic
	//		public should be 2UbwygKpWguH6miUbDro8SNYKdA66qXGdqqvD6diuw3q

	const result = await initSolana (mnemonic)

	//		
	//	use key
	// const message = getUtf8Encoder().encode("Hello, World!")
	// const signedBytes = await signBytes(keys.privateKey, message)
	// const decoded = await getBase58Decoder().decode(signedBytes)

	
	// const verified = await verifySignature(keys.publicKey, signedBytes, message)
	logger(inspect(result, false, 3, true))

}

start()