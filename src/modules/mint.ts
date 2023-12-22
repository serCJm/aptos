import { APT_MINTED } from "../../resources/aptMapMinted.js";
import { WalletManager } from "../services/wallet-manager.js";
import { BaseModule } from "./baseModule.js";

export class Mint extends BaseModule {
	static contractAddress =
		"0x3ff12c840442b037a97770807084b7bab31b4b02c06cccbaf9350b1edb2fb450";

	constructor() {
		super();
	}
	async #mint() {
		this.logStart("mint");

		const moveFunction = `${Mint.contractAddress}::apt_map::mint_aptmap`;

		const block = this.#getBlock();

		const type_arguments: any = [];

		const txArgs = [[block]];

		const txPayload = {
			function: moveFunction,
			type_arguments,
			arguments: txArgs,
		};

		const message = "Mint Apt Map";

		await WalletManager.sendTransaction(txPayload, message);
	}

	#getBlock() {
		const minted = APT_MINTED;
		for (let i = 1; i <= 100000; i++) {
			if (minted.includes(i.toString())) continue;
			return i.toString();
		}
	}

	async run() {
		await this.#mint();
	}
}
