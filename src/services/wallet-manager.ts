import { AptosAccount, AptosClient, HexString } from "aptos";
import { logger } from "../utils/logger.js";
import { getDeadline } from "../utils/utils.js";

export class WalletManager {
	static #rpcUrl = "https://rpc.ankr.com/http/aptos/v1";
	static #explorer = "https://apscan.io";
	static #name: string;
	static #account: AptosAccount | null = null;
	static #client: AptosClient | null = null;
	static #address: HexString | null = null;

	static get walletName() {
		if (!this.#name) throw new Error("Wallet not initialized");
		return this.#name;
	}

	static get account() {
		if (!this.#account) throw new Error("Aptos account not initialized");
		return this.#account;
	}

	static get client() {
		if (!this.#client) throw new Error("Aptos client not initialized");
		return this.#client;
	}

	static get address() {
		if (!this.#address) throw new Error("Aptos wallet not initialized");
		return this.#address;
	}

	public static init(name: string, privateKey: string) {
		try {
			this.#name = name;
			this.#account = new AptosAccount(
				new HexString(privateKey).toUint8Array(),
			);
			this.#client = new AptosClient(this.#rpcUrl);
			this.#address = this.#account.address();
		} catch (error) {
			console.error(error);
			console.log(
				"Wrong private keys are entered or there are no funds on the wallet: ",
			);
		}
	}

	public static async getAccountResource(address: string) {
		const moveStructTag = `0x1::coin::CoinStore<${address}>`;
		const resource = await WalletManager.client.getAccountResource(
			WalletManager.address,
			moveStructTag,
		);
		return resource;
	}

	public static async getAccountResources() {
		const resources = await WalletManager.client.getAccountResources(
			WalletManager.address,
		);
		return resources;
	}

	public static async sendTransaction(txPayload: any) {
		const maxGasAmount = await this.client.estimateMaxGasAmount(
			WalletManager.address,
		);
		const options = {
			max_gas_amount: maxGasAmount.toString(),
			expiration_timestamp_secs: getDeadline(15).toString(),
		};
		const rawTX = await this.client.generateTransaction(
			WalletManager.address,
			txPayload,
			options,
		);
		const txHash = await this.client.signAndSubmitTransaction(
			this.account,
			rawTX,
		);

		await this.client.waitForTransaction(txHash, { checkSuccess: true });

		WalletManager.#printSuccess(txHash);
	}

	static #printSuccess(txHash: string, customMessage?: string) {
		logger.success`Transaction ${customMessage}: ${
			WalletManager.#explorer
		}/tx/${txHash}`;
	}
}
