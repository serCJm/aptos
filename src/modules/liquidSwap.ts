import { TokenManager } from "../services/token-manager.js";
import { WalletManager } from "../services/wallet-manager.js";
import { DEX } from "./dex.js";

export class LiquidSwap extends DEX {
	static contractAddress =
		"0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12";

	constructor() {
		super();
	}

	async swap() {
		const amount = this.setupAmount();

		const moveFunction = `${LiquidSwap.contractAddress}::scripts_v2::swap`;

		const type_arguments = [
			TokenManager.getAddress(this.fromToken),
			TokenManager.getAddress(this.toToken),
			`${LiquidSwap.contractAddress}::curves::Uncorrelated`,
		];
		const txArgs = [amount.toString(), ""];

		const txPayload = {
			function: moveFunction,
			type_arguments: type_arguments,
			arguments: txArgs,
		};

		const message = this.createSwapMessage(amount);

		await WalletManager.sendTransaction(txPayload, message);
	}
}
