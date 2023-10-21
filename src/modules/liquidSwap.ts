import { TokenManager } from "../services/token-manager.js";
import { WalletManager } from "../services/wallet-manager.js";
import { TokensType } from "../types.js";
import { getRandomIndex, randomNumber } from "../utils/utils.js";

const LIQUID_SWAP_CONTRACT_ADDRESS =
	"0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12";

export class LiquidSwap {
	fromToken: TokensType | null = null;
	toToken: TokensType | null = null;
	balances: Partial<Record<TokensType, number>> = {};

	constructor() {}

	async #setupPair() {
		this.balances = await TokenManager.getBalances();
		const balancesArr = Object.entries(this.balances) as [
			TokensType,
			number,
		][];
		let randIndex = getRandomIndex(0, balancesArr.length);
		this.fromToken = balancesArr.splice(randIndex, 1)[0][0];
		randIndex = getRandomIndex(0, balancesArr.length);
		this.toToken = balancesArr[randIndex][0];
	}

	#setupAmount() {
		if (!this.balances || !this.fromToken)
			throw new Error("Pair is not initialized");

		const fromBalance = this.balances[this.fromToken]!;
		const [minPercent = 100, maxPercent = 100] =
			TokenManager.getMinMaxConfig(this.fromToken);

		const [min, max] = [
			(fromBalance * minPercent) / 100,
			fromBalance + maxPercent / 100,
		];
		const randAmount = randomNumber(min, max);

		return randAmount;
	}

	async #makeRandomSwap() {
		await this.#setupPair();
		const amount = this.#setupAmount();

		if (!this.fromToken || !this.toToken) {
			throw new Error("toToken is not initialized");
		}

		if (!this.balances[this.toToken!]) {
			await TokenManager.registerToken(this.toToken);
		}

		const moveFunction = `${LIQUID_SWAP_CONTRACT_ADDRESS}::scripts_v2::swap`;

		const type_arguments = [
			TokenManager.getAddress(this.fromToken),
			TokenManager.getAddress(this.toToken),
			`${LIQUID_SWAP_CONTRACT_ADDRESS}::curves::Uncorrelated`,
		];
		const _arguments = [amount.toString(), ""];

		const txPayload = {
			function: moveFunction,
			type_arguments: type_arguments,
			arguments: _arguments,
		};

		await WalletManager.sendTransaction(txPayload);
	}

	public async run() {
		await this.#makeRandomSwap();
	}
}
