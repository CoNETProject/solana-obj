import {createKeyPairFromPrivateKeyBytes,  getUtf8Encoder, signBytes, getBase58Decoder, verifySignature, getAddressFromPublicKey, } from "@solana/web3.js"
import * as Bip39 from "bip39"
import {ethers} from "ethers"
import { logger } from "./logger"
import {inspect} from 'node:util'
import Colors from 'colors/safe'
import Bs58 from 'bs58'

const start = async () => {
	// const acc = await ethers.Wallet.createRandom()
	// if (!acc?.mnemonic) {
	// 	return logger(`Error!`)
	// }

	//	check the mnemonic from ethers!
	//const mnemonic = acc.mnemonic.phrase

	const mnemonic = 'black connect engine evoke under silly outer slush fabric trumpet silent lemon'

	logger(Colors.blue(mnemonic))
	const vsc = Bip39.validateMnemonic(mnemonic)

	if (!vsc) {
		return logger(`Error!`)
	}
	const seed = Bip39.mnemonicToSeedSync(mnemonic, '')

	//		createKeyPairFromPrivateKeyBytes set extractable = true can export privatekey for security!

	const keys = await createKeyPairFromPrivateKeyBytes(seed.slice(0, 32), true)

	const publicKey = await getAddressFromPublicKey(keys.publicKey)
	logger(inspect(publicKey, false, 3, true))


	const privateKeyBytes = (await crypto.subtle.exportKey(
		"pkcs8",
		keys.privateKey
	  )).slice(-32)

	const publicKeyBytes =  await crypto.subtle.exportKey('raw', keys.publicKey)
	
	const secretKeyBytes = new Uint8Array([
		...new Uint8Array(privateKeyBytes),
		...new Uint8Array(publicKeyBytes),
	])

	const encodedSecretKey =  getBase58Decoder().decode(secretKeyBytes)
	logger(inspect(encodedSecretKey, false, 3, true))

	//	use key
	// const message = getUtf8Encoder().encode("Hello, World!")
	// const signedBytes = await signBytes(keys.privateKey, message)
	// const decoded = await getBase58Decoder().decode(signedBytes)

	
	// const verified = await verifySignature(keys.publicKey, signedBytes, message)
	// // logger(inspect(verified, false, 3, true))

}

start()