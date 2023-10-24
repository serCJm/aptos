import { WalletManager } from "../services/wallet-manager.js";
import { DEX } from "./dex.js";

export class PancakeSwap extends DEX {
	static contractAddress =
		"0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa";

	constructor() {
		super();
	}

	async swap() {
		this.logStart("pancakeswap");
		const amount = this.setupAmount();

		const moveFunction = `${PancakeSwap.contractAddress}::router::swap_exact_input`;

		const type_arguments = [this.fromTokenAddress, this.toTokenAddress];

		console.log(type_arguments);
		const txArgs = [amount.toString(), ""];

		const txPayload = {
			function: moveFunction,
			type_arguments,
			arguments: txArgs,
		};

		const message = this.createSwapMessage(amount);

		await WalletManager.sendTransaction(txPayload, message);
	}
}
