import { WalletManager } from "../services/wallet-manager.js";
import { DEX } from "./dex.js";

export class AnimeSwap extends DEX {
	static contractAddress =
		"0x3ff12c840442b037a97770807084b7bab31b4b02c06cccbaf9350b1edb2fb450";

	constructor() {
		super();
	}
	async swap() {
		this.logStart("mint");
		const amount = this.setupAmount();

		const moveFunction = `${AnimeSwap.contractAddress}::apt_map::mint_aptmap`;

		const block = await this.#getBlock();

		const type_arguments: any = [];

		const txArgs = [block];

		const txPayload = {
			function: moveFunction,
			type_arguments,
			arguments: txArgs,
		};

		const message = this.createSwapMessage(amount);

		await WalletManager.sendTransaction(txPayload, message);
	}

	async #getBlock() {}
}
