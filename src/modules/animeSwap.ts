import { WalletManager } from "../services/wallet-manager.js";
import { DEX } from "./dex.js";

export class AnimeSwap extends DEX {
	static contractAddress =
		"0x16fe2df00ea7dde4a63409201f7f4e536bde7bb7335526a35d05111e68aa322c";

	constructor() {
		super();
	}
	async swap() {
		this.logStart("animeswap");
		const amount = this.setupAmount();

		const moveFunction = `${AnimeSwap.contractAddress}::AnimeSwapPoolV1::swap_exact_coins_for_coins_2_pair_entry`;

		const type_arguments = [
			this.fromTokenAddress,
			"0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T",
			this.toTokenAddress,
		];

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
