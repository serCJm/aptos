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

		const block = await this.#getBlock();

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

	async #getBlock() {
		const moveFunction = `${Mint.contractAddress}::apt_map::get_all_block_minted`;

		const type_arguments: any = [];

		const txArgs: any = [];

		const txPayload = {
			function: moveFunction,
			type_arguments,
			arguments: txArgs,
		};

		const minted: any = await WalletManager.client.view(txPayload);
		for (let i = 1; i <= 100000; i++) {
			if (minted[0].includes(i.toString())) continue;
			return i.toString();
		}
	}

	async run() {
		await this.#mint();
	}
}
