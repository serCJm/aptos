import { TOKENS, TokenManager } from "../services/token-manager.js";
import { DexConfig, TokensType } from "../types.js";
import { countdownTimer } from "../utils/countdownTimer.js";
import { randomNumber } from "../utils/utils.js";
import { BaseModule } from "./baseModule.js";

export abstract class DEX extends BaseModule {
	protected fromToken!: TokensType;
	protected toToken!: TokensType;
	protected balances!: Record<TokensType, number>;

	protected excludedTokens = new Set([]) as Set<TokensType>;

	protected abstract swap(): Promise<void>;
	protected addLiquidity?(): Promise<void>;

	get fromTokenAddress(): string {
		return TokenManager.getAddress(this.fromToken);
	}

	get toTokenAddress(): string {
		return TokenManager.getAddress(this.toToken);
	}

	constructor() {
		super();
		this.excludedTokens = new Set(
			(this.config as DexConfig).EXCLUDED_TOKENS,
		);
	}

	async #setup(): Promise<void> {
		[this.fromToken, this.toToken, this.balances] =
			await TokenManager.getRandomTokenPair(this.excludedTokens);
		console.log(this.fromToken, this.toToken, this.balances);
		if (!this.balances[this.toToken])
			await TokenManager.registerToken(this.toToken);
	}

	protected setupAmount() {
		const fromBalance = this.balances[this.fromToken];
		const [minPercent = 100, maxPercent = 100] =
			TokenManager.getMinMaxConfig(this.fromToken);

		const [min, max] = [
			(fromBalance * minPercent) / 100,
			(fromBalance * maxPercent) / 100,
		];
		const randAmount = randomNumber(min, max);

		return randAmount;
	}

	protected createSwapMessage(amount: number) {
		const message = `swap on ${this.constructor.name} ${amount} ${this.fromToken} ==> ${this.toToken}`;
		return message;
	}

	protected createAddLiquidityMessage(amount: number) {
		const message = `add liquidity on ${this.constructor.name} ${amount} ${this.fromToken} === ${this.toToken}`;
		return message;
	}

	#normalizeTokens() {
		if (this.fromToken === TOKENS.APT || this.toToken === TOKENS.APT) {
			this.toToken =
				this.fromToken === TOKENS.APT ? this.toToken : this.fromToken;
		}
		this.fromToken = TOKENS.APT;
	}

	async #updateToToken(onlyWithBalance: boolean): Promise<TokensType> {
		const tokens = await TokenManager.getRandomTokenPair(
			this.excludedTokens,
			onlyWithBalance,
		);
		return tokens[1];
	}

	protected async getLiquidityPair() {
		this.logStart("getLiquidityPair");

		this.#normalizeTokens();

		const balance = await TokenManager.getBalance(this.toToken);

		if (!balance) {
			this.toToken = await this.#updateToToken(true);
		}

		if (!this.toToken) {
			this.toToken = await this.#updateToToken(false);
			await this.swap();
		}
	}

	protected isTokenToToken() {
		return this.fromToken !== TOKENS.APT && this.toToken !== TOKENS.APT;
	}

	protected isStable() {
		const stables: TokensType[] = [TOKENS.lzUSDC, TOKENS.lzUSDT];
		return (
			stables.includes(this.fromToken) && stables.includes(this.toToken)
		);
	}

	public async run() {
		await this.#setup();

		await this.swap();

		if ((this.config as DexConfig).ADD_LIQUIDITY && this.addLiquidity) {
			await countdownTimer(60, 120);

			await this.addLiquidity();
		}
	}
}
